<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  import { clickOutside, autoResize } from "./actions";
  import type {
    ShallowBlock,
    Block,
  } from "@plastic-editor/protocol/lib/protocol";
  import type { PageEngine } from "@plastic-editor/protocol";
  import type { Adapter } from "./adapters";

  const { adapter, pageStore } = getContext("plastic") as {
    adapter: Adapter;
    pageStore: {
      subscribe: any;
      updatePageId: (pageId: string) => Promise<void>;
      updatePage(): void
      getPageEngine(): PageEngine;
    };
  };

  export let debugMode = false;
  export let path: number[] = [];
  export let block: ShallowBlock;

  let editor: HTMLTextAreaElement | null = null;

  let fullBlock: Block;

  $: isTop = path.length === 1;

  $: adapter.reader
    .getBlockById(block.id)
    .then((b) => {
      if (b === undefined) {
        fullBlock = adapter.writer.createNewBlock($pageStore.id, block.id).block
      } else {
        fullBlock = b
      }
    })
    .catch((e) => {
    });

  function onKeyDown(e) {
    switch (e.key) {
      case "Enter":
        if (!e.shiftKey) {
          e.preventDefault();
          if (!editor.value) {
            // backward
            if (path.length > 1) {
              pageStore.getPageEngine().backward(path)
            } else {
              pageStore.getPageEngine().apendBlockAt(path, adapter.writer.createNewBlock($pageStore.id).shallow)
            }
          } else {
            if (editor.selectionStart === 0) {
              pageStore.getPageEngine().prependBlockAt(path, adapter.writer.createNewBlock($pageStore.id).shallow);
            } else {
              if (block.children.length) {
                pageStore.getPageEngine().prependChild(path, adapter.writer.createNewBlock($pageStore.id).shallow)
              } else {
                pageStore.getPageEngine().apendBlockAt(path, adapter.writer.createNewBlock($pageStore.id).shallow);
              }
            }
          }
        }
        pageStore.updatePage()
        break;
      case 'Tab':
        if (path[path.length - 1] !== 0) {
          e.preventDefault()
          pageStore.getPageEngine().forward(path)
          pageStore.updatePage()
        }
        break
      case 'Backspace':
        if (!editor.value && !(block.children.length > 0)) {
          pageStore.getPageEngine().remove(path)
          pageStore.updatePage()
        }
        break
    }
  }

  function onClickOutside() {}

  function onChangeContent() {}
</script>

<div class="main flex mb-2">
  <div class="pl-4 pr-2" style="margin-top: 10px;">
    <div class=" bg-gray-900 rounded-full" style="width: 5px; height: 5px;" />
  </div>
  <div class="flex-1">
    {#if fullBlock}
    <textarea
      use:clickOutside={onClickOutside}
      on:keydown={onKeyDown}
      spellcheck={false}
      bind:this={editor}
      class="editor"
      use:autoResize
      on:change={onChangeContent}>{fullBlock.content}</textarea>
    {/if}
  </div>
</div>
{#if block.children.length > 0}
  <div class="ml-4 children flex">
    <div
      class="self-stretch bg-gray-300"
      style="width: 1px; margin-left: 2px"
    />
    <div class="flex-1">
      {#each block.children as child, index (child.id)}
        <svelte:self block={child} path={path.concat(index)} />
      {/each}
    </div>
  </div>
{/if}
