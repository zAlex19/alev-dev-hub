export function escapeMarkdownLabel(value) {
  return String(value ?? "").replace(/([\[\]\\])/g, "\\$1").trim();
}

export function formatMarkdownLink(title, url) {
  const label = escapeMarkdownLabel(title) || url;
  return `[${label}](${url})`;
}
