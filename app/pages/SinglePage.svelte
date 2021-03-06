<script lang="ts">
import type InMemoryAdapter from "../adapter";

import NotePage from "../components/Note.svelte";
  export let adapter: InMemoryAdapter
  export let params: {
    pageId: string
  }
</script>

<NotePage  adapter={adapter} pageId={params.pageId} />