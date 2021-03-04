<script>
  export let link = "";

  let embedId = link.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\/?\?v=|\/embed\/|\/)([^\s&]+)/)[1];

</script>

<iframe
  title="youtube"
  width="560"
  height="315"
  src={`https://www.youtube.com/embed/${embedId}`}
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
/>
