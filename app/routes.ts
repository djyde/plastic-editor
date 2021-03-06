import Welcome from "./pages/Welcome.svelte";
import NotePage from "./components/Note.svelte";
import CloudNote from "./pages/CloudNote.svelte";


export default {
  '/': Welcome,
  // '/note/:noteId/': CloudNote,
  '/note/:noteId/*': CloudNote,
};
