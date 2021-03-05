<script lang="ts">
  import type {
    Page,
    ShallowBlock,
  } from "@plastic-editor/protocol/lib/protocol";

  import Block from "../../editor/Block.svelte";
import adapter from "../adapter";
  export let title: string;
  import router from "../router";

  const page = adapter.writer.touchPageByTitle(title)

  function onClick(e) {
    e.preventDefault();
    router.navigate(`/page/${page.id}`);
  }
</script>

<span
  >[<a
    on:click|stopPropagation={onClick}
    class="text-blue-500"
    href={`/page/${page.id}`}>{page.title}</a
  >]</span
>
