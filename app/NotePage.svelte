<script>
  import { getContext } from "svelte";
  import adapter from "./adapter";
  import Editor from '../editor/Editor.svelte'
  import rules from './rules'

  export let pageId = "";

  const page = adapter.pages.find((_) => _.id === pageId);
  
</script>

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
