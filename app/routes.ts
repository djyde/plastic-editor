import Welcome from "./pages/Welcome.svelte";
  import NotePage from "./pages/NotePage.svelte";

export default {
  '/': Welcome,
  '/page/:pageId': NotePage,
};
