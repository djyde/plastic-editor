<script>
  import router from '../router'
  export let to = ""
  export let className = ""
</script>

<a class={className} on:click={e => {
  e.preventDefault()
  router.navigate(to)
}} href={to}>
  <slot />
</a>