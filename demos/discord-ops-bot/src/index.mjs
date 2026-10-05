import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { buildStatus, sanitizeNotification } from "./health.mjs";

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.DISCORD_GUILD_ID || null;
const healthUrl = process.env.HEALTH_URL || null;

if (!token || !applicationId) {
  throw new Error("DISCORD_TOKEN and DISCORD_APPLICATION_ID are required");
}

const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Check bot latency"),
  new SlashCommandBuilder().setName("status").setDescription("Show bot and dependency health"),
  new SlashCommandBuilder()
    .setName("notify")
    .setDescription("Post an operations notification")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
      option.setName("message").setDescription("Message to post").setRequired(true)
    ),
].map((command) => command.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(token);
  const route = guildId
    ? Routes.applicationGuildCommands(applicationId, guildId)
    : Routes.applicationCommands(applicationId);
  await rest.put(route, { body: commands });
}

async function checkDependency() {
  if (!healthUrl) return { ok: true, status: "not configured" };
  try {
    const response = await fetch(healthUrl, { signal: AbortSignal.timeout(5000) });
    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false, status: "network error" };
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Ready as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply(`Pong: ${Math.round(client.ws.ping)} ms`);
    return;
  }

  if (interaction.commandName === "status") {
    await interaction.deferReply({ ephemeral: true });
    const dependency = await checkDependency();
    await interaction.editReply(buildStatus({
      uptimeMs: client.uptime ?? 0,
      guildCount: client.guilds.cache.size,
      websocketPingMs: client.ws.ping,
      dependency,
    }));
    return;
  }

  if (interaction.commandName === "notify") {
    const message = sanitizeNotification(interaction.options.getString("message", true));
    await interaction.reply({ content: message, allowedMentions: { parse: [] } });
  }
});

await registerCommands();
await client.login(token);
