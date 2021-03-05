<script lang="ts">
  import adapter from "../adapter";
  import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
  import * as router from 'svelte-spa-router'
  let results: Page[] = [];

  let keyword: string = "";

  let showResult = true;

  async function searchPage(e) {
    results = await adapter.reader.searchPageByKeyword(e.target.value);
  }

  // searchPage({ target: { value: "o" } });
</script>

<div class="relative">
  <input
    class="w-full outline-none bg-gray-100 p-2 px-4 rounded"
    type="text"
    bind:value={keyword}
    on:input={searchPage}
    on:focus={(e) => (showResult = true)}
    on:blur={(e) => {
      setTimeout(() => {
        showResult = false;
      }, 100);
    }}
    placeholder="Search or create page"
  />

  {#if showResult && keyword}
    <div class="border border-gray-100 shadow-sm absolute left-0 right-0">
      <a
        href="/"
        class="w-full block hover:bg-gray-100 px-4 py-2 text-sm"
        on:click={(e) => {
          e.preventDefault();
          const page = adapter.writer.createNewPage(keyword)
          router.push(`/page/${page.id}`);
        }}>Create {keyword}</a
      >
      {#each results as result (result.id)}
        <a
          href="/"
          class="w-full block hover:bg-gray-100 px-4 py-2 text-sm"
          on:click={(e) => {
            e.preventDefault();
            router.push(`/page/${result.id}`);
          }}>{result.title}</a
        >
      {/each}
    </div>
  {/if}
</div>
