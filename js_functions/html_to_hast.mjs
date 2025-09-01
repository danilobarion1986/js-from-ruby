/* eslint-disable default-case */
import { fromHtml } from "./node_modules/hast-util-from-html/index.js";

const text = (value) => ({ type: "text", value: String(value) });

export function htmlToHast(input) {
  const frag = fromHtml(input, { fragment: true });
  const children = (frag.children && frag.children.length)
    ? frag.children
    : [text(input)];

  return { type: "root", children: { type: "element", tagName: "div", children } };
}

function readStdIn() {
  return new Promise((resolve) => {
    const chunks = [];
    process.stdin.on("data", (c) => chunks.push(c));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  (async function main() {
    try {
      const inputStr = await readStdIn();
      const result = htmlToHast(inputStr);
      process.stdout.write(JSON.stringify(result));
    } catch (err) {
      console.error((err && (err.stack || err.message)) || String(err));
      process.exit(1);
    }
  }());
}
