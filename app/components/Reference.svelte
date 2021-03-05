<script lang="ts">
import type { Block, ShallowBlock, Page } from "@plastic-editor/protocol/lib/protocol";
import Editor from '../../editor/Editor.svelte'
import adapter from "../adapter";
import rules from "../rules";
  import * as router from 'svelte-spa-router'

  export let pageId
  export let blocks: Block[]

  let page: Page

  $: {
    adapter.reader.getPageById(pageId).then((val) => {
      page = val
    })
  }
</script>

{#if page}
<div class="my-2">

  <h1 class=" mb-2 text-blue-500">
    <a use:router.link href={`/page/${page.id}`}>{page.title}</a>
  </h1>

  {#each blocks as block}
    <div class="bg-gray-50">
      <Editor editable={false} adapter={adapter} pageId={block.pageId} rules={rules} initialBlockId={block.id} />
    </div>
  {/each}
</div>
{/if}