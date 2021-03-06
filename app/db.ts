import lf from "localforage";
import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import { isStale } from "./store";
import dayjs from "dayjs";
import { Note } from "../editor/adapters";
import * as router from "svelte-spa-router";
import Entry from "./Entry.svelte";

export function remountApp() {
  document.querySelector("#app").innerHTML = "";
  new Entry({
    target: document.querySelector("#app"),
  });
}

const db = lf.createInstance({
  name: "plastic",
});

export async function getNote() {
  return (await db.getItem("note")) as Note;
}

export async function saveNote(note: Note) {
  await db.setItem("note", note);
}
