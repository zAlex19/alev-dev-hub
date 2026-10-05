import { formatMarkdownLink } from "./logic.mjs";

const output = document.querySelector("#output");
const button = document.querySelector("#copy");

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const markdown = formatMarkdownLink(tab?.title || "", tab?.url || "");
output.value = markdown;

button.addEventListener("click", async () => {
  await navigator.clipboard.writeText(markdown);
  button.textContent = "Copied";
});
