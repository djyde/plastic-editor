<script lang="ts">
  import { getContext } from "svelte";
  import adapter from "../adapter";
  import Editor from '../../editor/Editor.svelte'
  import rules from '../rules'
  import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
  import Reference from "../components/Reference.svelte";
  import * as router from 'svelte-spa-router'

  export let params: {
    pageId: string
  };

  let references: {[key: string]: Block[]}

  let page: Page

  $: {
    page = adapter.pages.find((_) => _.id === params.pageId);
  }

  // find references
  $: {
    references = adapter.reader.findPageReferenceBlocks(params.pageId)
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

  <div class="mt-12 -ml-3">
    <Editor
      adapter={adapter}
      pageId={params.pageId}
      rules={rules}
    />
  </div>

  <div class="mt-12">
    <h1 class="font-medium text-gray-300">References</h1>

    <div class="">
      {#if references}
        {#each Object.entries(references) as [pageId, blocks]}
          <Reference pageId={pageId} blocks={blocks} />
        {/each}
      {/if}
    </div>
  </div>
</div>
{/if}
