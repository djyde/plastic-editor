<script lang="ts">

  /**
   * 
   * IMPORTANT:
   * 
   * 1. Should always use `updateContent()` to update current block content, instead of using editor.value = xxx
   * 2. Remember using `pageStore.updatePage()` after changing the page structure
   * 
  */

  import { editingBlockId, anchorOffset, textToAppend } from "./store";
  import { getContext, tick } from "svelte";
  import { clickOutside, autoResize } from "./actions";
  import { isInBracket } from "./utils";
  import type {
    ShallowBlock,
    Block,
    Page,
  } from "@plastic-editor/protocol/lib/protocol";
  import type { PageEngine } from "@plastic-editor/protocol";
  import type { Adapter } from "./adapters";
  import RichText from "./RichText.svelte";
  import getCaretCoordinates from "textarea-caret";

  const { adapter, pageStore, onKeyDown } = getContext("plastic") as {
    onKeyDown?: () => void;
    adapter: Adapter;
    pageStore: {
      subscribe: any;
      updatePageId: (pageId: string) => Promise<void>;
      updatePage(): void;
      getPageEngine(): PageEngine;
    };
  };

  export let debugMode = false;
  export let path: number[] = [];
  export let block: ShallowBlock;
  export let editable = true;
  let searchResults: Page[] = [];
  let textareaCaret: null | {
    top: number;
    height: number;
    left: number;
  } = null;

  let editor: HTMLTextAreaElement | null = null;
  let previewWrapper: HTMLDivElement | null = null;

	let currentEditingLinkRange: number[] | null = null

  let focused = false;

  let fullBlock: Block;

  $: adapter.reader
    .getBlockById(block.id)
    .then((b) => {
      if (b === undefined) {
        fullBlock = adapter.writer.createNewBlock($pageStore.id, block.id)
          .block;
      } else {
        fullBlock = b;
      }
    })
    .catch((e) => {});

  $: {
    // would call twice. Please careful about performance
    if ($editingBlockId === block.id) {
      focused = true;
      tick().then(() => {
        handleAnchor(editor)
      });
    } else {
      focused = false;
    }
  }

  function handleAnchor(editor) {
    if (editor) {
      if ($anchorOffset !== null) {
        editor.setSelectionRange($anchorOffset, $anchorOffset);
      } else {
        editor.setSelectionRange(editor.value.length, editor.value.length);
      }
      if ($textToAppend !== null) {
        const pos = editor.value.length
        updateContent(editor.value + $textToAppend)
        $textToAppend = null
        tick().then(() => {
          editor.setSelectionRange(pos, pos);
        })
      }
    }
  }

  $: {
    if (focused && editor) {
      editor.focus();
    }
  }

  const onSelectPageOnSuggestion = (page: Page) => (e) => {
		e.preventDefault()
		if (editor && currentEditingLinkRange) {
			editor.setRangeText(page.title, currentEditingLinkRange[0] , currentEditingLinkRange[1])
			updateContent(editor.value)
			currentEditingLinkRange = null
			textareaCaret = null
		}
	}


  function updateContent(content: string) {
    // TODO: adapter update block
    fullBlock.content = content;
    adapter.writer.updateBlock(fullBlock.id, fullBlock)
  }

  async function onKeyDownListener(e) {
    setTimeout(async () => {
      if (editor) {
        const { selectionStart, selectionEnd } = editor;
        const ranges = isInBracket(editor.value, selectionStart);
        if (ranges) {
          // search page
          const [start, end] = ranges;
          currentEditingLinkRange = ranges
          const keyword = editor.value.slice(start, end);
          const results = await adapter.reader.searchPageByKeyword(keyword);
          const caret = getCaretCoordinates(editor, start);
          if (!textareaCaret) {
            textareaCaret = caret;
          }
          searchResults = results;
          console.log(searchResults);
        } else {
          textareaCaret = null;
        }
      }
    });

    switch (e.key) {
      case "Enter":
        if (!e.shiftKey) {
          e.preventDefault();
          let newBlockId;
          if (!editor.value) {
            // backward
            if (path.length > 1) {
              pageStore.getPageEngine().backward(path);
            } else {
              const newBlock = pageStore
                .getPageEngine()
                .apendBlockAt(
                  path,
                  adapter.writer.createNewBlock($pageStore.id).shallow
                );
              newBlockId = newBlock.block.id;
            }
          } else {
            if (editor.selectionStart === 0) {
              const newBlock = pageStore
                .getPageEngine()
                .prependBlockAt(
                  path,
                  adapter.writer.createNewBlock($pageStore.id).shallow
                );
              newBlockId = newBlock.block.id;
            } else {
              const textAfterCursor = editor.value.slice(editor.selectionStart)
              if (block.children.length) {
                const newBlock = pageStore
                  .getPageEngine()
                  .prependChild(
                    path,
                    adapter.writer.createNewBlock($pageStore.id, null, textAfterCursor).shallow
                  );
                newBlockId = newBlock.id;
                $anchorOffset = 0
              } else {
                const newBlock = pageStore
                  .getPageEngine()
                  .apendBlockAt(
                    path,
                    adapter.writer.createNewBlock($pageStore.id, null, textAfterCursor).shallow
                  );
                newBlockId = newBlock.block.id;
                $anchorOffset = 0
              }
              updateContent(editor.value.slice(0, editor.selectionStart))
            }
          }
          pageStore.updatePage();
          if (newBlockId) {
            $editingBlockId = newBlockId;
          }
        }
        break;
      case "Tab":
        if (path[path.length - 1] !== 0) {
          e.preventDefault();
          pageStore.getPageEngine().forward(path);
          pageStore.updatePage();
        }
        break;
      case "Backspace": {
        if (editor.selectionStart === 0) {
          if (!editor.value && !(block.children.length > 0)) {
            e.preventDefault()
            pageStore.getPageEngine().remove(path);
            const [ closest, closetPos ] = pageStore.getPageEngine().upClosest(path)
            $anchorOffset = null
            $editingBlockId = closest.id
            pageStore.updatePage();
          } else if (editor.value && !(block.children.length > 0)) {
            e.preventDefault()
            const [ closest, closetPos ] = pageStore.getPageEngine().upClosest(path)
            pageStore.getPageEngine().remove(path)
            $textToAppend = editor.value
            $editingBlockId = closest.id
            pageStore.updatePage();
          }
        }

        break;
      }
      case "{":
        {
          const [start, end] = [editor.selectionStart, editor.selectionEnd];
          if (start === end) {
            editor.setRangeText("}", start, end);
          }
        }
        break;
      case "[":
        {
          const [start, end] = [editor.selectionStart, editor.selectionEnd];
          if (start === end) {
            editor.setRangeText("]", start, end);
          } else {
            editor.setSelectionRange(start, start);
            // editor.setRangeText('[', start, start)
            editor.setRangeText("]", end, end);

            setTimeout(() => {
              editor.setSelectionRange(start + 1, end + 1);
            });
          }
        }
        break;
      default:
        break;
    }
  }

  function onClickPreview() {
    if (editable) {
      $editingBlockId = block.id;
    }
  }

  function onClickOutside() {
    $editingBlockId = null;
    $anchorOffset = null;
    textareaCaret = null;
  }

  function onChangeContent(e) {
    updateContent(e.target.value);
  }
</script>

<div class="main flex mb-2">
  <div class="pl-4 pr-2" style="margin-top: 10px;">
    <div class=" bg-gray-900 rounded-full" style="width: 5px; height: 5px;" />
  </div>
  <div class="flex-1">
    {#if fullBlock}
      {#if focused}
        <div class="relative">
          {#if textareaCaret}
            <div
              class="z-10 bg-white absolute w-64 border border-gray-100 overflow-scroll"
              style={`height: 200px; top: ${textareaCaret.top + 24}px; left: ${
                textareaCaret.left
              }px;`}
            >
              {#each searchResults as result (result.id)}
                <a
                  href="/"
                  on:click|stopPropagation={onSelectPageOnSuggestion(result)}
                  class="block hover:bg-gray-100 px-2 py-2 text-sm cursor-pointer"
                  >{result.title}</a
                >
              {/each}
            </div>
          {/if}
          <textarea
            use:clickOutside={onClickOutside}
            on:keydown={onKeyDownListener}
            bind:this={editor}
            class="editor"
            use:autoResize
            on:change={onChangeContent}>{fullBlock.content}</textarea>
        </div>
      {:else}
        <div
          bind:this={previewWrapper}
          class="preview"
          on:click|stopPropagation={onClickPreview}
        >
          <RichText {updateContent} content={fullBlock.content} />
        </div>
      {/if}
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
