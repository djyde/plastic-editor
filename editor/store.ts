import { readable, writable } from "svelte/store";
import { PageEngine } from "@plastic-editor/protocol";
import type { Adapter } from "./adapters";

export const editingBlockId = writable(null);
export const textToAppend = writable(null)
export const anchorOffset = writable(null);