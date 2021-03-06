<script lang="ts">
  import { anchorOffset } from './store'
  import { tokenizer } from "./parser";
  import type { Rule, Token } from './parser'
  import { getContext } from 'svelte';
  import type { ShallowBlock } from '@plastic-editor/protocol/lib/protocol';
import type InMemoryAdapter from '../app/adapter';

  export let updateContent
  export let content = ""
  export let shallowBlock: ShallowBlock

  let toMatch = `${content}`;

  const { rules, adapter } = getContext('plastic') as {
    adapter: InMemoryAdapter,
    rules: Rule[]
  }

  const tokens = tokenizer(toMatch, rules);

  function replaceRange(s: string, start: number, end: number, substitute: string) {
    return s.substring(0, start) + substitute + s.substring(end);
  }

  const replace = (item: Token) => (newValue: string) => {
    const range = [item.position, item.position + item.matched[0].length];
    updateContent(replaceRange(content, range[0], range[1], newValue))
  };

  const focusTextHelper = (item: Token) => (offset = 0) => e => {
    const selection = window.getSelection();
    $anchorOffset = selection.anchorOffset + item.position + offset
  }

  // collect block reference pages
  adapter.writer.setBlockPageReferences(shallowBlock.id, tokens.filter(_ => _.type === 'LINK' || _.type === 'TAG').map(_ => _.meta.pageId))

</script>

<div>
  {#each tokens as item}
    {#if item.type === 'TEXT'}
      <span on:click|capture={focusTextHelper(item)()}>{item.value}</span>
    {:else}
      <svelte:component adapter={adapter} focusTextHelper={focusTextHelper(item)} this={item.meta?.component} {...item.meta?.props} replace={replace(item)} item={item} />
    {/if}
  {/each}
  <!-- <span>block</span> {content} -->
</div>
