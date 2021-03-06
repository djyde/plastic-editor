import Welcome from "./pages/Welcome.svelte";
import NotePage from "./components/Note.svelte";
import CloudNote from "./pages/CloudNote.svelte";
import LocalNote from './pages/LocalNote.svelte'

export default {
  // '/note/:noteId/': CloudNote,
  "/note/:noteId/*": CloudNote,
  "/*": LocalNote,
};
