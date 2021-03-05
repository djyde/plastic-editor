<script lang="ts">
  import Editor from "../editor/Editor.svelte";
  import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
  import type { Rule } from "../editor/parser";
  import data from "./data";
  import { InMemoryAdapter } from "../editor/adapters/InMemory";
  import ExternalLink from "./blocks/ExternalLink.svelte";
  import NotePage from "./pages/NotePage.svelte";
  import { onDestroy, onMount, setContext } from "svelte";
  import * as db from "./db";
  import adapter from "./adapter";
  import PageSearchInput from "./components/PageSearchInput.svelte";
  import router from './router'
  import Welcome from "./pages/Welcome.svelte";

  let pageNow = {
    component: Welcome,
    props: {},
  };

  onDestroy(() => {
    router.destroy();
  });

  function updateTitle() {
    // document.title = `Plastic - ${DB.get().directory}`;
  }

  router.on("/", () => {
    pageNow = {
      component: Welcome,
      props: {},
    }
    // if (DB.get()) {
    //   updateTitle();
    //   router.navigate("/daily");
    // } else {
    //   router.navigate("/openFile");
    // }
  });

  router.on("/page/:id", ({ data }) => {
    console.log('in page', data)
    pageNow = {
      component: NotePage,
      props: {
        pageId: data.id,
      },
    };
  });

  // router.on("/daily", () => {
  //   updateTitle();
  //   pageNow = {
  //     component: DailyNotes,
  //     props: {},
  //   };
  // });

  router.navigate(router.getCurrentLocation().hashString);

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
    <svelte:component this={pageNow.component} {...pageNow.props} />
  </div>
</div>
