<script lang="ts">
  export let adapter: InMemoryAdapter
  export let title: string;
  import * as router from 'svelte-spa-router'
import type InMemoryAdapter from '../adapter';

  const page = adapter.writer.touchPageByTitle(title)

</script>

<span
  >[<a
    use:router.link
    href={`/page/${page.id}`}
    on:click|stopPropagation
    class="text-blue-500"
    >{page.title}</a
  >]</span
>
