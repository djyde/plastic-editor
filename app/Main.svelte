<script lang="ts">
  import Editor from "../editor/Editor.svelte";
  import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
  import type { Rule } from "../editor/parser";
  import data from "./data";
  import { InMemoryAdapter } from "../editor/adapters/InMemory";
  import ExternalLink from "./blocks/ExternalLink.svelte";
  import NotePage from "./NotePage.svelte";
  import { onMount, setContext } from "svelte";
  import * as db from "./db";
  import adapter from "./adapter";

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

  let pageId: string;

  onMount(async () => {
    await db.init();
    pageId = adapter.pages[0].id;
  });

  async function save() {
    await db.persist();
  }
</script>

<div class="flex h-screen">
  <aside class="w-64 bg-gray-100">
    <button on:click={save}>Save</button>
  </aside>
  <div class="flex-1 overflow-scroll">
    <nav class="p-4 flex justify-end">
      <div class="w-64">
        <input
          class="w-full outline-none bg-gray-100 p-2 px-4 rounded"
          type="text"
          placeholder="Search or create page"
        />
      </div>
    </nav>
    {#if pageId}
      <NotePage {pageId} />
    {/if}
  </div>
</div>
