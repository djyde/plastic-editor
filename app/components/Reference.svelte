<script lang="ts">
import type { Block, ShallowBlock, Page } from "@plastic-editor/protocol/lib/protocol";
import Editor from '../../editor/Editor.svelte'
import makeRules from "../rules";
  import * as router from 'svelte-spa-router'
  import { location } from 'svelte-spa-router'
import type InMemoryAdapter from "../adapter";
import { getContext } from "svelte";

  export let adapter: InMemoryAdapter
  export let pageId
  export let blocks: Block[]

  const rules = makeRules(adapter)

  const { prefix } = getContext('route')

  let page: Page

  $: {
    page = adapter.reader.getPageById(pageId)
  }
</script>

{#if page}
<div class="my-2">

  <h1 class=" mb-2 text-blue-500">
    <a use:router.link href={`${prefix}/page/${page.id}`}>{page.title}</a>
  </h1>

  {#each blocks as block}
    <div class="bg-gray-50">
      <Editor editable={false} adapter={adapter} pageId={block.pageId} rules={rules} initialBlockId={block.id} />
    </div>
  {/each}
</div>
{/if}