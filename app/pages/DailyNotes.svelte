<script lang="ts">
  import type { InMemoryAdapter } from "../adapter";
import NotePage from '../components/Note.svelte'
  export let adapter: InMemoryAdapter;

  const pageId = adapter.touchTodayDailyNote().id
</script>

<div>
  <NotePage pageId={pageId} adapter={adapter} />
</div>
