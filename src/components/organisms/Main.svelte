<script lang="ts">
  import Form from '@molecules/Form.svelte';
  import Words from '@molecules/Words.svelte';
  import Files from '@molecules/Files.svelte';
  import Tooltip from '@atoms/Tooltip.svelte';
  import WordsHeader from '@molecules/WordsHeader.svelte';
  import ArrowBarRight from '@icons/ArrowBarRight.svelte';
  import { isFilesOpen, isOpen, isDisplayNumber, layout, isPreview } from 'src/states';

  const handleKeydown = (event: KeyboardEvent) => {
    // 用語名の欄にフォーカスする
    if (event.metaKey && event.key === 'i') {
      event.preventDefault();
      document.getElementById('name')?.focus();
    }
    // リロード
    if (event.metaKey && event.key === 'r') {
      event.preventDefault();
      window.location.reload();
    }
    // 左のサイドバーの開閉
    if (event.metaKey && event.key === 'b') {
      event.preventDefault();
      isFilesOpen.set(!$isFilesOpen);
    }
    // アコーディオンの開閉
    if (event.metaKey && event.key === 'f') {
      event.preventDefault();
      isOpen.set(!$isOpen);
    }
    // マークダウンで書かれた用語説明のプレビュー
    if (event.metaKey && event.key === 'd') {
      event.preventDefault();
      isPreview.set(!$isPreview);
    }
    // グループの要素数を表示・非表示
    if (event.metaKey && event.key === 'n') {
      event.preventDefault();
      isDisplayNumber.set(!$isDisplayNumber);
    }
    // レイアウト 1
    if (event.metaKey && event.key === '1') {
      event.preventDefault();
      layout.set('');
    }
    // レイアウト 2
    if (event.metaKey && event.key === '2') {
      event.preventDefault();
      layout.set('grid grid-cols-2 gap-2');
    }
    // レイアウト 3
    if (event.metaKey && event.key === '3') {
      event.preventDefault();
      layout.set('grid grid-cols-3 gap-2');
    }
  };
</script>

<!-- ショートカットキー用 -->
<svelte:window on:keydown={handleKeydown} />

<div class="flex">
  <div class="border-r {$isFilesOpen ? 'w-1/3' : ''}">
    {#if $isFilesOpen}
      <Files />
    {:else}
      <!-- サイドバーの開閉 -->
      <button
        class="p-2"
        on:click={() => {
          isFilesOpen.set(true);
        }}
        data-tooltip-target="files-close"
        data-tooltip-placement="right"
      >
        <ArrowBarRight />
      </button>
      <Tooltip id="files-close" message="⌘ + B" />
    {/if}
  </div>
  <div class="flex gap-6 px-6 w-full">
    <!-- 用語の入力 -->
    <div class="w-1/3 border-r border-gray-300 pr-6 pt-10 min-h-screen">
      <Form />
    </div>
    <!-- 用語の表示 -->
    <div class="w-2/3 mb-10">
      <WordsHeader />
      <Words />
    </div>
  </div>
</div>
