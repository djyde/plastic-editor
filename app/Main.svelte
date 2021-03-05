<script lang="ts">
  import NotePage from "./pages/NotePage.svelte";
  import { onDestroy } from "svelte";
  import * as db from "./db";
  import { isStale } from './store'
  import PageSearchInput from "./components/PageSearchInput.svelte";
  import Router from "svelte-spa-router";
  import * as router from 'svelte-spa-router'
  import routes from "./routes";

  import saveIcon from "./assets/save.svg";
  import downloadIcon from "./assets/download.svg";

  import FileSaver from 'file-saver'
  import adapter from "./adapter";

  const autoPersist = setInterval(()=> {
    db.persist()
  }, 2000)

  onDestroy(() => {
    clearInterval(autoPersist)
  });

  async function save() {
    await db.persist();
  }

  let staredPages = adapter.reader.getStaredPages()

  $: {
    if ($isStale) {
      staredPages = adapter.reader.getStaredPages()
    }
  }

  async function exportAsJson () {
    const notes = await db.getNote()
    const jsonString = JSON.stringify(notes)
    const blob = new Blob([jsonString], {type: "text/plain;charset=utf-8"})
    FileSaver.saveAs(blob, 'note.json')
  }
</script>

<div class="flex h-screen">
  <aside class="w-64 bg-gray-100">
    <div class="flex p-4 space-x-2">
      <button class="bg-white shadow rounded p-1" on:click={save}>
        <img class="max-w-full block" src={saveIcon} alt="save button" />
      </button>
      <button class="bg-white shadow rounded p-1" on:click={exportAsJson}>
        <img class="max-w-full block" src={downloadIcon} alt="download button" />
      </button>
    </div>

    <div class="font-medium mt-4">
      <a class="block px-4 py-1 hover:bg-gray-200" use:router.link href="/">
        Daily Notes
      </a>
    </div>

    <div class="mt-8 font-medium">
      <h1 class="px-4 text-gray-500 mb-2">Stared pages</h1>

      <div>
        {#each staredPages as page}
          <a class="block hover:bg-gray-200 px-4 py-1" use:router.link href={`/page/${page.id}`}>{page.title}</a>
        {/each}
      </div>
    </div>
  </aside>
  <div class="flex-1 overflow-scroll">
    <nav class="p-4 flex justify-end">
      <div class="flex-1">
        {#if $isStale}
        <span class="bg-yellow-500 w-2 h-2 block rounded-full"></span>
        {:else}
        <span class="bg-green-500 w-2 h-2 block rounded-full"></span>
        {/if}
      </div>
      <div class="w-64">
        <PageSearchInput />
      </div>
    </nav>
    <Router {routes} />
  </div>
</div>
