<script lang="ts">
  import { onMount } from "svelte";
  import { client } from "../cloud";
  import { querystring } from "svelte-spa-router";
  import qs from "qs";
  import InMemoryAdapter, { initialNote } from "../adapter";
  import Main from "../Main.svelte";
  import type { Note } from "../../editor/adapters";
  import { encrypt } from "../utils";
import { getNote, saveNote } from "../db";

  let hasInitialized = false;

  let adapter: InMemoryAdapter;

  async function persist() {
    saveNote(adapter.note)
  }

  onMount(async () => {
    const note = await getNote()
    adapter = new InMemoryAdapter(note);
    adapter.touchTodayDailyNote()
    hasInitialized = true;
  });
</script>

<div>
  {#if hasInitialized && adapter}
    <Main {adapter} prefix={``} {persist} />
  {/if}
</div>
