<script lang="ts">
  import NotePage from "./pages/NotePage.svelte";
  import { onDestroy } from "svelte";
  import * as db from "./db";
  import PageSearchInput from "./components/PageSearchInput.svelte";
  import Router from "svelte-spa-router";
  import routes from "./routes";

  import saveIcon from "./assets/save.svg";
  import downloadIcon from "./assets/download.svg";
  import FileSaver from 'file-saver'

  onDestroy(() => {});

  async function save() {
    await db.persist();
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
  </aside>
  <div class="flex-1 overflow-scroll">
    <nav class="p-4 flex justify-end">
      <div class="w-64">
        <PageSearchInput />
      </div>
    </nav>
    <Router {routes} />
  </div>
</div>
