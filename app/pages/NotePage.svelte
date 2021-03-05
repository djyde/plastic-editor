<script lang="ts">
  import { getContext } from "svelte";
  import adapter from "../adapter";
  import Editor from '../../editor/Editor.svelte'
  import rules from '../rules'
  import type { Page } from "@plastic-editor/protocol/lib/protocol";

  export let pageId = "";

  let page: Page

  $: {
    page = adapter.pages.find((_) => _.id === pageId);
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
      pageId={pageId}
      rules={rules}
    />
  </div>
</div>
{/if}
