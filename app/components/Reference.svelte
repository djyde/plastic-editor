<script lang="ts">
import type { Block, ShallowBlock, Page } from "@plastic-editor/protocol/lib/protocol";
import Editor from '../../editor/Editor.svelte'
import adapter from "../adapter";
import rules from "../rules";
import RouteLink from "./RouteLink.svelte";

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
    <RouteLink to={`/page/${page.id}`}>{page.title}</RouteLink>
  </h1>

  {#each blocks as block}
    <div class="bg-gray-50">
      <Editor editable={false} adapter={adapter} pageId={block.pageId} rules={rules} initialBlockId={block.id} />
    </div>
  {/each}
</div>
{/if}