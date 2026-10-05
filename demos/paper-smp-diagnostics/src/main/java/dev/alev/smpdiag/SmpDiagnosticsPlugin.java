package dev.alev.smpdiag;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.World;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;

import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

public final class SmpDiagnosticsPlugin extends JavaPlugin implements CommandExecutor, TabCompleter {
    private static final List<String> WATCHED_PLUGINS = List.of(
            "GriefPrevention", "GPFlags", "spark", "Geyser-Spigot", "floodgate", "Vulcan", "GrimAC", "Towny", "Lands"
    );

    @Override
    public void onEnable() {
        var command = getCommand("smpdiag");
        if (command == null) {
            getLogger().severe("Command smpdiag was not registered from plugin.yml");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }

        command.setExecutor(this);
        command.setTabCompleter(this);
        getLogger().info("SMPDiagnostics enabled. Read-only diagnostics only; no automatic optimization or config mutation.");
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!sender.hasPermission("smpdiag.use")) {
            sender.sendMessage(ChatColor.RED + "You do not have permission to use this command.");
            return true;
        }

        String subcommand = args.length == 0 ? "summary" : args[0].toLowerCase(Locale.ROOT);
        return switch (subcommand) {
            case "summary" -> sendSummary(sender);
            case "worlds" -> sendWorlds(sender);
            case "plugins" -> sendPlugins(sender);
            case "help" -> sendHelp(sender);
            default -> {
                sender.sendMessage(ChatColor.RED + "Unknown subcommand. Try /smpdiag help");
                yield true;
            }
        };
    }

    private boolean sendSummary(CommandSender sender) {
        double[] tps = Bukkit.getTPS();
        long usedBytes = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
        long maxBytes = Runtime.getRuntime().maxMemory();
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();

        sender.sendMessage(ChatColor.GOLD + "=== SMP Diagnostics ===");
        sender.sendMessage(ChatColor.YELLOW + "Server: " + ChatColor.WHITE + Bukkit.getName() + " " + Bukkit.getVersion());
        sender.sendMessage(ChatColor.YELLOW + "Players: " + ChatColor.WHITE + Bukkit.getOnlinePlayers().size() + "/" + Bukkit.getMaxPlayers());
        sender.sendMessage(ChatColor.YELLOW + "TPS (1m/5m/15m): " + ChatColor.WHITE +
                formatTps(tps[0]) + " / " + formatTps(tps[1]) + " / " + formatTps(tps[2]));
        sender.sendMessage(ChatColor.YELLOW + "Avg tick time: " + ChatColor.WHITE + String.format(Locale.ROOT, "%.2f ms", Bukkit.getAverageTickTime()));
        sender.sendMessage(ChatColor.YELLOW + "Heap: " + ChatColor.WHITE + formatBytes(usedBytes) + " / " + formatBytes(maxBytes));
        sender.sendMessage(ChatColor.YELLOW + "JVM uptime: " + ChatColor.WHITE + formatDuration(uptimeMs));
        sender.sendMessage(ChatColor.GRAY + "Use /smpdiag worlds for loaded chunks/entities and /smpdiag plugins for dependency presence.");
        return true;
    }

    private boolean sendWorlds(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== World Snapshot ===");
        for (World world : Bukkit.getWorlds()) {
            sender.sendMessage(ChatColor.YELLOW + world.getName() + ChatColor.WHITE
                    + " | players=" + world.getPlayers().size()
                    + " | loadedChunks=" + world.getLoadedChunks().length
                    + " | entities=" + world.getEntityCount());
        }
        return true;
    }

    private boolean sendPlugins(CommandSender sender) {
        Plugin[] plugins = Bukkit.getPluginManager().getPlugins();
        sender.sendMessage(ChatColor.GOLD + "=== Plugin Snapshot ===");
        sender.sendMessage(ChatColor.YELLOW + "Loaded plugins: " + ChatColor.WHITE + plugins.length);

        for (String watched : WATCHED_PLUGINS) {
            Plugin plugin = findPluginLoose(watched, plugins);
            if (plugin == null) {
                sender.sendMessage(ChatColor.GRAY + "- " + watched + ": not detected");
            } else {
                ChatColor status = plugin.isEnabled() ? ChatColor.GREEN : ChatColor.RED;
                sender.sendMessage(status + "- " + plugin.getName() + " " + plugin.getPluginMeta().getVersion()
                        + (plugin.isEnabled() ? " (enabled)" : " (disabled)"));
            }
        }

        List<String> enabled = Arrays.stream(plugins)
                .filter(Plugin::isEnabled)
                .map(Plugin::getName)
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .collect(Collectors.toList());
        sender.sendMessage(ChatColor.YELLOW + "Enabled: " + ChatColor.WHITE + String.join(", ", enabled));
        return true;
    }

    private Plugin findPluginLoose(String expected, Plugin[] plugins) {
        String needle = normalize(expected);
        for (Plugin plugin : plugins) {
            String candidate = normalize(plugin.getName());
            if (candidate.equals(needle) || candidate.contains(needle) || needle.contains(candidate)) {
                return plugin;
            }
        }
        return null;
    }

    private static String normalize(String value) {
        return value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }

    private boolean sendHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "SMPDiagnostics commands:");
        sender.sendMessage(ChatColor.YELLOW + "/smpdiag summary" + ChatColor.WHITE + " - TPS, MSPT, heap, uptime, player count");
        sender.sendMessage(ChatColor.YELLOW + "/smpdiag worlds" + ChatColor.WHITE + " - per-world players, chunks, entities");
        sender.sendMessage(ChatColor.YELLOW + "/smpdiag plugins" + ChatColor.WHITE + " - loaded plugins and common SMP dependencies");
        return true;
    }

    private static String formatTps(double tps) {
        return String.format(Locale.ROOT, "%.2f", Math.min(20.0, tps));
    }

    private static String formatBytes(long bytes) {
        double mib = bytes / 1024.0 / 1024.0;
        if (mib < 1024.0) {
            return String.format(Locale.ROOT, "%.0f MiB", mib);
        }
        return String.format(Locale.ROOT, "%.2f GiB", mib / 1024.0);
    }

    private static String formatDuration(long millis) {
        long seconds = millis / 1000;
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        return hours + "h " + minutes + "m";
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (args.length != 1) {
            return Collections.emptyList();
        }

        String prefix = args[0].toLowerCase(Locale.ROOT);
        List<String> matches = new ArrayList<>();
        for (String option : List.of("summary", "worlds", "plugins", "help")) {
            if (option.startsWith(prefix)) {
                matches.add(option);
            }
        }
        return matches;
    }
}
