<script lang="ts">
  export let content = ""
  export let focusTextHelper;
</script>

<strong on:click|capture={focusTextHelper(2)}>{content}</strong>
