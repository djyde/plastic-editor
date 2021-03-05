import lf from 'localforage'
import type { Block, Page } from "@plastic-editor/protocol/lib/protocol";
import adapter from './adapter'
import { isStale } from './store'
import dayjs from 'dayjs'
import { Note } from '../editor/adapters';

const db = lf.createInstance({
  name: 'plastic'
})

export async function getNote() {
  return await db.getItem('note') as Note
}

export function touchTodayDailyNote() {
  const today = dayjs().format("MMMM, DD, YYYY");
  return adapter.writer.touchPageByTitle(today, {
    type: 'daily'
  })
}

export async function init() {
  touchTodayDailyNote();

  const note = await getNote()

  if (!note) {
  } else {
    adapter.note = {
      pages: note.pages,
      blocks: note.blocks,
      stars: note.stars || []
    }
  }
}

export async function persist() {
  const note = adapter.reader.output()
  await save(note)
  isStale.set(false)
}

export async function save(note: Note) {
  await db.setItem('note', note)
}
