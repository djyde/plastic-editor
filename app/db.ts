import lf from 'localforage'
import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import adapter from './adapter'

const db = lf.createInstance({
  name: 'plastic'
})

export type Note = {
  pages: Page[],
  blocks: {[key: string]: Block}
}

export async function getNote() {
  return await db.getItem('note') as Note
}

export async function init() {
  const note = await getNote()

  if (!note) {
    adapter.writer.createNewPage('Welcome')
  } else {
    adapter.pages = note.pages
    adapter.blocks = note.blocks
  }
}

export async function persist() {
  const note = adapter.reader.output()
  await save(note)
}

export async function save(note: Note) {
  await db.setItem('note', note)
}
