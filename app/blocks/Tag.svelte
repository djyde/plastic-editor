<script lang="ts">
  import adapter from "../adapter";
  export let title: string;
  import * as router from 'svelte-spa-router'


  const page = adapter.writer.touchPageByTitle(title)

  function onClick(e) {
    e.preventDefault();
    router.push(`/page/${page.id}`);
  }
</script>

<span
  ><a
    on:click|stopPropagation={onClick}
    class="text-blue-500"
    href={`/page/${page.id}`}>#{page.title}</a
  ></span
>
