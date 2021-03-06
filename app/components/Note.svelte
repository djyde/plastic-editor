<script lang="ts">
  import { getContext } from "svelte";
  import Editor from "../../editor/Editor.svelte";
  import makeRules from "../rules";
  import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
  import Reference from "./Reference.svelte";
  import type InMemoryAdapter from "../adapter";

  export let pageId: string
  export let adapter: InMemoryAdapter

  let references: { [key: string]: Block[] };

  const rules = makeRules(adapter)

  let page: Page;

  let isStared = adapter.reader.isStared(pageId);

  $: {
    const p = adapter.reader.getPageById(pageId);
    if (!p) {
      // TODO: not found
    } else {
      page = p;
    }
  }

  // find references
  $: {
    references = adapter.reader.findPageReferenceBlocks(pageId);
  }
</script>

{#if page}
  <div class="mt-4 mx-48">
    <div>
      <input
        class="outline-none text-4xl font-bold w-full"
        value={page.title}
        placeholder="Page title"
      />
    </div>

    <div class="mt-4">
      {#if isStared}
        <button
          on:click={(_) => {
            adapter.writer.unstarPage(page.id);
            isStared = false;
          }}
          class="underline text-sm">Unstar</button
        >
      {:else}
        <button
          on:click={(_) => {
            adapter.writer.starPage(page.id);
            isStared = true;
          }}
          class="underline text-sm">Star</button
        >
      {/if}
    </div>

    <div class="mt-12 -ml-3">
      <Editor {adapter} pageId={pageId} {rules} />
    </div>

    <div class="mt-12">
      <h1 class="font-medium text-gray-300">References</h1>

      <div class="">
        {#if references}
          {#each Object.entries(references) as [pageId, blocks]}
            <Reference adapter={adapter} {pageId} {blocks} />
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}
