<script lang="ts">
  import NotePage from "./components/Note.svelte";
  import { onDestroy, onMount, setContext } from "svelte";
  import * as db from "./db";
  import { isStale } from "./store";
  import PageSearchInput from "./components/PageSearchInput.svelte";
  import Router from "svelte-spa-router";
  import * as router from "svelte-spa-router";
  import { location } from 'svelte-spa-router'
  import { wrap } from "svelte-spa-router/wrap";
  import { client } from "./cloud";
  import saveIcon from "./assets/save.svg";
  import downloadIcon from "./assets/download.svg";
  import folderOpenIcon from "./assets/folderOpen.svg";

  import FileSaver from "file-saver";
  import type { InMemoryAdapter } from "./adapter";
import DailyNotes from "./pages/DailyNotes.svelte";
import SinglePage from "./pages/SinglePage.svelte";

  export let adapter: InMemoryAdapter;
  export let prefix: string;
  export let persist;

  setContext("route", {
    prefix,
    adapter,
  });

  const routes = {
    "/": wrap({
      component: DailyNotes,
      props: {
        adapter,
      },
    }),
    "/page/:pageId": wrap({
      component: SinglePage,
      props: {
        adapter,
      },
    }),
  };

  const autoPersist = setInterval(() => {
    // db.persist();
  }, 2000);

  onMount(async () => {
    // console.log(router.)
  });

  onDestroy(() => {
    clearInterval(autoPersist);
  });

  let staredPages = adapter.reader.getStaredPages();

  $: {
    if ($isStale) {
      staredPages = adapter.reader.getStaredPages();
    }
  }

  async function onUploadFile(e) {
    const file = this.files[0] as File;
    const text = await file.text();
    db.reinit(text);
  }

  async function exportAsJson() {
    const notes = adapter.note;
    const jsonString = JSON.stringify(notes);
    const blob = new Blob([jsonString], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "note.json");
  }

  async function createCloudNote() {
    const { data, error } = await client.from("notes").insert({ content: "" });
    console.log(data, error);
  }

  async function sync() {
    persist();
  }
</script>

<div class="flex h-screen">
  <aside class="w-64 bg-gray-100">
    <div class="flex p-4 space-x-2">
      <button class="bg-white shadow rounded p-1" on:click={exportAsJson}>
        <img class="max-w-full block" src={saveIcon} alt="save button" />
      </button>

      <button class="bg-white shadow rounded p-1" on:click={createCloudNote}>
        <img class="max-w-full block" src={saveIcon} alt="save button" />
      </button>

      <button on:click={sync}> Sync </button>

      <input on:change={onUploadFile} type="file" class="hidden" id="import" />
      <label for="import" class="cursor-pointer	">
        <img
          class="bg-white shadow rounded p-1 max-w-full block"
          src={folderOpenIcon}
          alt="open file"
        />
      </label>
    </div>

    <div class="font-medium mt-4">
      <a class="block px-4 py-1 hover:bg-gray-200" use:router.link href={`${prefix}/`}>
        Daily Notes
      </a>
    </div>

    <div class="mt-8 font-medium">
      <h1 class="px-4 text-gray-500 mb-2">Stared pages</h1>

      <div>
        {#each staredPages as page}
          <a
            class="block hover:bg-gray-200 px-4 py-1"
            use:router.link
            href={`${prefix}/page/${page.id}`}>{page.title}</a
          >
        {/each}
      </div>
    </div>
  </aside>
  <div class="flex-1 overflow-scroll">
    <nav class="p-4 flex justify-end">
      <div class="flex-1">
        {#if $isStale}
          <span class="bg-yellow-500 w-2 h-2 block rounded-full" />
        {:else}
          <span class="bg-green-500 w-2 h-2 block rounded-full" />
        {/if}
      </div>
      <div class="w-64">
        <PageSearchInput {adapter} />
      </div>
    </nav>
    <Router {routes} {prefix} />
  </div>
</div>
