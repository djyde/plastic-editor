<script lang="ts">
import { getContext } from 'svelte';

  export let title: string;
  import * as router from 'svelte-spa-router'
import type InMemoryAdapter from '../adapter';

  export let adapter: InMemoryAdapter
  const page = adapter.writer.touchPageByTitle(title)

  const { prefix } = getContext('route')

</script>

<span
  ><a
    on:click|stopPropagation
    use:router.link
    class="text-blue-500"
    href={`${prefix}/page/${page.id}`}>#{page.title}</a
  ></span
>
