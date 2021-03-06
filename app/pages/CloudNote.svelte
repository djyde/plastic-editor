<script lang="ts">
import { onMount } from "svelte";
import { client } from '../cloud'
import { querystring } from 'svelte-spa-router'
import qs from 'qs'
import InMemoryAdapter, { initialNote } from "../adapter";
import Main from '../Main.svelte'
import type { Note } from "../../editor/adapters";
import { encrypt } from "../utils";

  export let params: {
    noteId: string
  }

  const querystringPair =  qs.parse($querystring) as {
    key?: string
  }

  if (!querystringPair.key) {
    // TODO: not valid without key
  }

  let hasInitialized = false

  let adapter: InMemoryAdapter

  async function persist() {
      // const encrypted = await encrypt.encrypt(adapter.stringify())

    const { data, error }  = await client.from('notes').update({
      content: adapter.stringify()
    }).eq('id', params.noteId)

    if (error) {
      console.log('persist error', error)
    } else {
      console.log('sync!', JSON.stringify(adapter.note, null, 2))
    }
  }

  onMount(async () => {
    const {data, error  } = await client.from<{
      id: string,
      content: string
    }>('notes').select().eq('id', params.noteId)
    if (error) {
      console.error('error')
    } else {
      const content = data![0].content
      let note: Note
      if (content) {
        note = JSON.parse(content)
      } else {
        note = initialNote
      }

      adapter = new InMemoryAdapter(note)
      hasInitialized = true
    }
  })
</script>

<div>
  {#if hasInitialized && adapter}
    <Main adapter={adapter} prefix={`/note/${params.noteId}`} persist={persist} />
  {/if}
</div>