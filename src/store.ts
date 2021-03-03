import { readable, writable } from "svelte/store";
import { PageEngine } from "@plastic-editor/protocol";
import type { Adapter } from "./adapters";

export function createPageStore (adapter: Adapter) {
  const { subscribe, set, update }  = writable<null | PageEngine>(null)

  return {
    subscribe,
    getPage: async (pageId: string) => {
      const page = await adapter.reader.getPageById(pageId)
      set(new PageEngine(page))
    }
  }
}