<script lang="ts">
  import NotePage from "./pages/NotePage.svelte";
  import { onDestroy } from "svelte";
  import * as db from "./db";
  import PageSearchInput from "./components/PageSearchInput.svelte";
  import Router from 'svelte-spa-router'
  import routes from './routes'

  onDestroy(() => {

  });

  async function save() {
    await db.persist();
  }
</script>

<div class="flex h-screen">
  <aside class="w-64 bg-gray-100">
    <button on:click={save}>Save</button>
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
