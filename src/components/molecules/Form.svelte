<script lang="ts">
  import Hr from '@atoms/Hr.svelte';
  import Eye from '@icons/Eye.svelte';
  import Pen from '@icons/Pen.svelte';
  import Plus from '@icons/Plus.svelte';
  import Trash from '@icons/Trash.svelte';
  import Input from '@atoms/Input.svelte';
  import Button from '@atoms/Button.svelte';
  import Toggle from '@atoms/Toggle.svelte';
  import Eraser from '@icons/Eraser.svelte';
  import Upload from '@icons/Upload.svelte';
  import Tooltip from '@atoms/Tooltip.svelte';
  import EyeSlash from '@icons/EyeSlash.svelte';
  import Clipboard from '@icons/Clipboard.svelte';
  import { invoke } from '@tauri-apps/api/tauri';
  import { marked } from 'marked';
  import JsonCodeBlock from '@atoms/JsonCodeBlock.svelte';
  import { copyToClipboard } from '@utils/copyToClipboard';
  import { words, targetDirectory, selectedFile, isPreview } from 'src/states';

  // 一意なグループの配列
  let groups = Array.from(new Set($words.map((word) => word.groupName))).filter((group) => group);

  $: fileName = $selectedFile;

  // 用語用の変数
  let name = '';
  let detail: string | undefined;
  let aliases: string | undefined;
  let fullName: string | undefined;
  let groupName: string;
  let existingGroupName: string;
  let isAct = false;
  let isLink = true;
  let isMultiple = false;
  let isUndefined = false;

  // 用語が入力されていたら、用語を追加できる
  $: isFormValid = name.length > 0;

  // 用語をリセットする関数
  const resetForm = () => {
    name = '';
    detail = undefined;
    aliases = undefined;
    fullName = undefined;
    groupName = '';
    existingGroupName = '';
    isAct = false;
    isLink = true;
    isMultiple = false;
    isUndefined = false;
  };

  // 用途の追加
  const addWord = () => {
    words.set(
      $words.concat({
        name,
        detail,
        aliases: aliases?.split('、').map((alias) => alias.trim()),
        fullName,
        groupName: groupName || existingGroupName,
        isAct,
        isLink,
        isMultiple,
        isUndefined,
      }),
    );

    localStorage.setItem('words', JSON.stringify($words));
    exportJson();
    resetForm();

    groups = Array.from(new Set($words.map((word) => word.groupName))).filter((group) => group);
  };

  // 用語の削除
  const removeWord = () => {
    const index = $words.findIndex((word) => word.name === name);
    words.set($words.slice(0, index).concat($words.slice(index + 1)));

    localStorage.setItem('words', JSON.stringify($words));
    exportJson();
    resetForm();
  };

  // 用語の自動入力
  const autoCompletion = () => {
    const word = $words.find((word) => word.name === name);
    if (word) {
      detail = word.detail;
      aliases = word.aliases?.join('、');
      fullName = word.fullName;
      existingGroupName = word.groupName || '';
      isAct = word.isAct;
      isLink = word.isLink;
      isMultiple = word.isMultiple;
      isUndefined = word.isUndefined || false;
    }
  };

  // 用語の修正
  const modifyWord = () => {
    const index = $words.findIndex((word) => word.name === name);
    words.set(
      $words
        .slice(0, index)
        .concat({
          name,
          detail,
          aliases: aliases?.split('、').map((alias) => alias.trim()),
          fullName,
          groupName: groupName || existingGroupName,
          isAct,
          isLink,
          isMultiple,
          isUndefined,
        })
        .concat($words.slice(index + 1)),
    );

    localStorage.setItem('words', JSON.stringify($words));
    exportJson();
    resetForm();
  };

  // JSON データのコピー用関数
  const copyJson = () => {
    const json = JSON.stringify($words, null, 2);
    copyToClipboard(json);
  };

  // 全ての用語の削除
  const clearWords = () => {
    words.set([]);
    localStorage.removeItem('words');
  };

  // JSON をファイルに書き出し
  const exportJson = () => {
    localStorage.setItem('selectedFile', fileName);
    invoke('write_file', {
      path: `${$targetDirectory}/${fileName}.json`,
      content: JSON.stringify($words, null, 2),
    });
  };

  // ショートカット
  const handleKeydown = (event: KeyboardEvent) => {
    // 用語の追加 or 修正
    if (event.metaKey && event.key === 'Enter' && isFormValid) {
      if ($words.find((word) => word.name === name)) {
        modifyWord();
      } else {
        addWord();
      }
    }
    // JSON 書き出し
    if (event.metaKey && event.key === 's') {
      exportJson();
    }
  };
</script>

<!-- ショートカットキー用 -->
<svelte:window on:keydown={handleKeydown} />

<!-- 用語入力欄 -->
<Input label="名前" bind:value={name} id="name" on:change={autoCompletion} isRequired />
<Input label="正式名称・英名" bind:value={fullName} id="fullName" />
<Input label="別名" bind:value={aliases} id="aliases" placeholder="別名1、別名2、別名3" />
<Input label="グループ名" bind:value={groupName} id="groupName" />

<!-- グループ選択 -->
<div class="mb-6">
  <label for="groups" class="block mb-2 text-sm font-medium text-gray-900">グループを選択</label>
  <select
    bind:value={existingGroupName}
    id="groups"
    class="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
  >
    <option selected />
    {#each groups.sort() as group}
      <option value={group}>{group}</option>
    {/each}
  </select>
</div>

<!-- 詳細入力 -->
<div class="mb-6 relative">
  <label for="detail" class="block mb-2 text-sm font-medium text-gray-900">詳細</label>
  <textarea
    id="detail"
    rows="4"
    class="block p-2.5 w-full h-64 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    bind:value={detail}
  />
  <button
    class="absolute top-7 right-0 cursor-pointer bg-gray-800 py-2 pr-2 pl-[10px] rounded-bl-lg rounded-tr-lg text-white"
    on:click={() => isPreview.set(!$isPreview)}
    data-tooltip-target="preview-detail"
  >
    <svelte:component this={$isPreview ? Eye : EyeSlash} />
  </button>
  <Tooltip id="preview-detail" message="⌘ + D" />
</div>

<!-- 詳細プレビュー -->
{#if $isPreview}
  <div class="markdown-body h-64 border rounded-lg p-4 overflow-auto">
    {@html marked(detail || '')}
  </div>
{/if}

<!-- 用語特性の選択 -->
<div class="flex gap-4 mb-6 mt-6">
  <Toggle label="動作" bind:value={isAct} />
  <Toggle label="複数" bind:value={isMultiple} />
  <Toggle label="未定義" bind:value={isUndefined} />
  <Toggle label="リンク" bind:value={isLink} />
</div>

<!-- 用語操作 -->
<div class="mb-6 flex float-right">
  <!-- 追加 -->
  <Button label="追加" tooltip="⌘ + ⏎" on:click={addWord} disabled={!isFormValid} sizing>
    <Plus />
  </Button>
  <!-- 修正 -->
  <Button label="修正" tooltip="⌘ + ⏎" on:click={modifyWord} disabled={!isFormValid}>
    <Pen />
  </Button>
  <!-- 削除 -->
  <Button label="削除" on:click={removeWord} disabled={!isFormValid}>
    <Trash />
  </Button>
</div>

<Hr />

<!-- JSON データの表示 -->
<div class="mb-6 border border-gray-300 w-full rounded flex overflow-auto max-h-[640px]">
  <JsonCodeBlock />
</div>

<!-- JSON データの操作 -->
<div class="mb-6 flex float-right">
  <!-- コピー -->
  <Button label="コピー" on:click={copyJson}>
    <Clipboard />
  </Button>
  <!-- JSON データの削除 -->
  <Button label="クリア" on:click={clearWords}>
    <Eraser />
  </Button>
</div>

<Hr />

<!-- ファイル名入力 -->
<div class="mb-6">
  <Input label="ファイル名" bind:value={fileName} id="fileName" />
</div>

<!-- ファイル名出力ボタン -->
<div class="mb-6 flex float-right">
  <Button label="ファイル出力" on:click={exportJson}>
    <Upload />
  </Button>
</div>
