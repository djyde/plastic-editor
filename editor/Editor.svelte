<script lang="ts">
  import "./style.css";
  import Block from "./Block.svelte";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { PageEngine } from "@plastic-editor/protocol";
  import type { Page } from "@plastic-editor/protocol/lib/protocol";
  import type { Adapter } from "./adapters";
  import type { Rule } from "./parser";

  export let adapter: Adapter;
  export let pageId: string;
  export let rules: Rule[] = [];

  export let initialBlockId: string;
  export let editable = true

  function createPageStore() {
    let { subscribe, set } = writable<null | Page>(null);

    let pageEngine: PageEngine = null;

    async function updatePageId(pageId: string) {
      set(null);
      const page = await adapter.reader.getPageById(pageId);
      set(page);
      pageEngine = new PageEngine(page);
    }

    return {
      subscribe,
      updatePageId,
      updatePage() {
        // TODO: update to db
        set(pageEngine.page);
        adapter.writer.updatePage(pageEngine.page.id, pageEngine.page);
        pageEngine = pageEngine.renew();
      },
      getPageEngine() {
        return pageEngine;
      },
    };
  }

  const pageStore = createPageStore();

  setContext("plastic", {
    adapter,
    pageStore,
    rules,
  });

  $: adapter.reader
    .getPageById(pageId)
    .then((p) => {
      pageStore.updatePageId(pageId);
    })
    .catch((e) => {
      console.log(e);
    });
</script>

<div>
  {#if $pageStore}
    {#each $pageStore.children as block, index (block.id)}
      <Block initialBlockId={initialBlockId} editable={editable} {block} path={[index]} />
    {/each}
  {/if}
</div>
