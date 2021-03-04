import Editor from "../editor/Editor.svelte";
import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import { InMemoryAdapter } from "../editor/adapters/InMemory";
import ExternalLink from "./blocks/ExternalLink.svelte";

import type { Rule } from "../editor/parser";
import data from './data'

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

// @ts-expect-error
const adapter = new InMemoryAdapter(data.pages, data.blocks);

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
