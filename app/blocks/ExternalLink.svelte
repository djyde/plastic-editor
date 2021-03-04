<script lang="ts">
  export let url: string
  export let title: string

  function onClickLink(e) {
  }
</script>

<a class="text-blue-500" target="_blank" on:click|stopPropagation href={url}>{title}</a>