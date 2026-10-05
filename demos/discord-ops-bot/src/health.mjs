export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function buildStatus({ uptimeMs, guildCount, websocketPingMs, dependency }) {
  return [
    `Uptime: ${formatDuration(uptimeMs)}`,
    `Guilds: ${guildCount}`,
    `Gateway ping: ${Math.round(websocketPingMs)} ms`,
    `Dependency: ${dependency.ok ? "OK" : `DOWN (${dependency.status ?? "error"})`}`,
  ].join("\n");
}

export function sanitizeNotification(text) {
  const value = String(text ?? "").trim();
  if (!value) throw new Error("Notification message cannot be empty");
  if (value.length > 1800) throw new Error("Notification message is too long");
  return value;
}
