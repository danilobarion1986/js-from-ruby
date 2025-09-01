/* eslint-disable default-case */
import { fromHtml } from "./node_modules/hast-util-from-html/index.js";

const text = (value) => ({ type: "text", value: String(value) });

function normalizeBlocks(input) {
  // Case 1: standard EditorJS
  if (input.blocks && Array.isArray(input.blocks) && input.blocks.length) {
    return input.blocks;
  }
  // Case 2: wysiwyg_content hash { "0": { id, type, data }, ... }
  const wc = input.wysiwyg_content || {};
  return Object.keys(wc)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => wc[k]);
}

function convertBlock(block) {
  const { type, data = {}, id } = block;

  switch (type) {
  case "raw": {
    const html = data.text || "";
    const frag = fromHtml(html, { fragment: true });
    const children = (frag.children && frag.children.length)
      ? frag.children
      : [text(html)];

    // Wrap the children in a div with the block ID
    return {
      type: "element",
      tagName: "div",
      properties: { id },
      children,
    };
  }

  // Ignore other types for now
  }
}

export function editorJsToHast(input) {
  const blocks = normalizeBlocks(input);
  const children = blocks.flatMap(convertBlock).filter(Boolean);
  return { type: "root", children };
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
      const input = inputStr ? JSON.parse(inputStr) : {};
      const result = editorJsToHast(input);
      process.stdout.write(JSON.stringify(result));
    } catch (err) {
      console.error((err && (err.stack || err.message)) || String(err));
      process.exit(1);
    }
  }());
}
