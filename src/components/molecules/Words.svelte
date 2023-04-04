<script lang="ts">
  import Badge from '@atoms/Badge.svelte';
  import Check from '@icons/Check.svelte';
  import Caret from '@icons/Caret.svelte';
  import Clipboard from '@icons/Clipboard.svelte';
  import { sanitizer } from '@utils/sanitizer';
  import { convertToHtml } from '@utils/convertToHtml';
  import { words, now, wordsMemorized, isOpen, layout, isDisplayNumber } from 'src/states';

  $: groupedData = $words.reduce((acc: any, cur: any) => {
    const groupName = cur.groupName;
    if (groupName in acc) {
      acc[groupName].push(cur);
    } else {
      acc[groupName] = [cur];
    }
    return acc;
  }, {});

  const onChange = (event: any, id: string) => {
    if (event.target.checked) {
      wordsMemorized.set($wordsMemorized.concat([id]));
    } else {
      wordsMemorized.set($wordsMemorized.filter((item) => item !== id));
    }
    localStorage.setItem('wordsMemorized', JSON.stringify($wordsMemorized));
  };
</script>

{#each Object.keys(groupedData).sort() as groupName}
  <details class="mt-10" open={$isOpen}>
    <!-- グループ名の表示、要素数の表示 -->
    <summary class="cursor-pointer mb-2">
      <span class="font-bold text-xl relative"
        >{groupName ? groupName : '...'}
        {#if $isDisplayNumber}
          <div
            class="inline-flex absolute -top-2 -right-6 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white"
          >
            {groupedData[groupName].length}
          </div>
        {/if}
      </span>
    </summary>

    <!-- グループに属する用語の表示 -->
    <div id="accordion-collapse" class={$layout} data-accordion="collapse">
      {#each groupedData[groupName] as word}
        {@const nameForElement = sanitizer(word.name)}
        {@const id = `accordion-collapse-heading-${groupName}-${nameForElement}`}
        <div class="h-full">
          <!-- 用語名の表示 -->
          <h3 {id} class:h-full={$now !== id}>
            <!-- フォーカス用 -->
            <span id={nameForElement} />
            <button
              type="button"
              on:click={() => {
                if ($now === id) {
                  now.set('');
                  return;
                }
                now.set(id);
              }}
              class="{$now !== id
                ? 'h-full'
                : 'h-fit'} flex items-center justify-between w-full p-5 font-medium text-left border border-gray-300 focus:ring-4 focus:ring-gray-300 hover:border-gray-800"
              style:color={$now !== id ? '#1f2937' : '#ffffff'}
              aria-expanded="false"
              aria-controls="accordion-collapse-body-{groupName}-{nameForElement}"
              data-accordion-target="#accordion-collapse-body-{groupName}-{nameForElement}"
              style:background-color={$now !== id ? '#ffffff' : '#1f2937'}
            >
              <!-- 用語名 -->
              <div class="items-center">
                <span class="py-0.5 mr-1"
                  >{word.name}{word.fullName ? `(${word.fullName})` : ''}{word.aliases
                    ? `・${word.aliases.join('・')}`
                    : ''}
                </span>
              </div>
              <!-- 他の要素を左右に配置するための要素 -->
              <span class="h-1 w-1" />

              <!-- バッジ -->
              <div class="flex items-center">
                <!-- 未定義 -->
                {#if word.isUndefined}
                  <Badge label="未定義" />
                {/if}

                <!-- 複数 -->
                {#if word.isMultiple}
                  <Badge label="複数" />
                {/if}

                <!-- 動作 -->
                {#if word.isAct}
                  <Badge label="動作" />
                {/if}

                <!-- 空 -->
                {#if !word.detail}
                  <Badge label="空" />
                {/if}

                <!-- リンク -->
                {#if !word.isLink}
                  <Badge label="リンク" />
                {/if}

                <!-- チェックマーク -->
                {#if $wordsMemorized.includes(id)}
                  <Check />
                {/if}
                <Caret />
              </div>
            </button>
          </h3>

          <!-- 用語の説明 -->
          <div
            id="accordion-collapse-body-{groupName}-{nameForElement}"
            class="hidden p-5 font-light border border-gray-300 markdown-body"
            aria-labelledby="accordion-collapse-heading-{groupName}-{nameForElement}"
          >
            <!-- 説明の表示 -->
            <p class="mb-2 text-gray-500">
              {@html word.detail ? convertToHtml(word.detail) : ''}
            </p>
            <div class="flex items-center mb-4 justify-between">
              <!-- 覚えた用ボタン -->
              <div>
                <input
                  id="default-checkbox"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                  checked={$wordsMemorized.includes(id)}
                  on:change={(event) => onChange(event, id)}
                />
                <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900"
                  >覚えた</label
                >
              </div>
              <!-- コピー用ボタン -->
              <button
                on:click={() => {
                  navigator.clipboard.writeText(word.name);
                }}><Clipboard /></button
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  </details>
{/each}
