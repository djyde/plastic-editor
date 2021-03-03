<script lang="ts">
  export let focusTextHelper;
  export let content = "";
</script>

<code on:click|capture={focusTextHelper(1)} class="bg-gray-100 box-border px-1 "
  >{content}</code
>
