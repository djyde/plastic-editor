// @ts-expect-error
import Editor from "../src/Editor.svelte";
import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import { InMemoryAdapter } from "../src/adapters/InMemory";
// @ts-expect-error
import ExternalLink from "./blocks/ExternalLink.svelte";

import type { Rule } from "../src/parser";
import { pages, blocks } from './data'

const rules = [
  {
    match: /\[([^\]]+)\]\(([^\)]+)\)/,
    processor(matched, position) {
      return {
        type: "ExternalLink",
        meta: {
          component: ExternalLink,
          props: {
            title: matched[1],
            url: matched[2],
          },
        },
        position,
        matched,
      };
    },
  },
] as Rule[];

const adapter = new InMemoryAdapter(pages, blocks);

// @ts-expect-error
window.adapter = adapter;

const editor = new Editor({
  target: document.querySelector("#app"),
  props: {
    pageId: "page",
    adapter,
    rules,
  },
});
