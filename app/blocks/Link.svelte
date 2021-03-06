<script lang="ts">
import { getContext } from 'svelte';

  export let adapter: InMemoryAdapter
  export let title: string;
  import * as router from 'svelte-spa-router'
import type InMemoryAdapter from '../adapter';

  const { prefix } = getContext('route')

  const page = adapter.writer.touchPageByTitle(title)

</script>

<span
  >[<a
    use:router.link
    href={`${prefix}/page/${page.id}`}
    on:click|stopPropagation
    class="text-blue-500"
    >{page.title}</a
  >]</span
>
