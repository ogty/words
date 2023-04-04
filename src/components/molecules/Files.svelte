<script lang="ts">
  import Folder from '@icons/Folder.svelte';
  import Tooltip from '@atoms/Tooltip.svelte';
  import InputBar from '@atoms/InputBar.svelte';
  import { invoke } from '@tauri-apps/api/tauri';
  import ArrowRepeat from '@icons/ArrowRepeat.svelte';
  import ArrowBarLeft from '@icons/ArrowBarLeft.svelte';
  import { targetDirectory, words, selectedFile, isFilesOpen } from 'src/states';

  // 選択されたディレクトリの内の JSON ファイルを取得
  let dirFiles: string[] = [];
  async function load() {
    dirFiles = await invoke('get_dir_files', { path: $targetDirectory });
    dirFiles = dirFiles
      .map((file) => file.replace(`${$targetDirectory}/`, ''))
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));
  }

  // 選択されたファイル名のデータを読み込み・反映する
  let selectedDir = $targetDirectory;
  async function tmp(file: string) {
    selectedFile.set(file);
    localStorage.setItem('selectedFile', file);

    const data = (await invoke('read_file', {
      path: `${$targetDirectory}/${file}.json`,
    })) as string;
    localStorage.setItem('words', data);
    words.set(JSON.parse(data));
  }

  // 以前に指定していたディレクトリパスの自動補完
  (async () => {
    selectedDir = localStorage.getItem('path') || '/Users';
    targetDirectory.set(selectedDir);
    load();
  })();
</script>

<!-- サイドバーを閉じる -->
<div class="float-right border-b border-gray-300 w-full">
  <button
    class="p-2 float-right"
    on:click={() => {
      isFilesOpen.set(false);
    }}
    data-tooltip-target="files"
  >
    <ArrowBarLeft />
  </button>
  <Tooltip id="files" message="⌘ + B" />
</div>

<!-- 対象のディレクトリの選択 -->
<div class="mb-6 px-6 pt-5">
  <InputBar
    bind:value={selectedDir}
    label="ディレクトリ"
    on:click={() => {
      targetDirectory.set(selectedDir);
      localStorage.setItem('path', selectedDir);
      load();
    }}
  >
    <Folder />
    <ArrowRepeat slot="button" />
  </InputBar>
</div>

<!-- 選択された対象のディレクトリの JSON ファイルの表示 -->
<div class="text-sm font-medium text-gray-900">
  {#if dirFiles.length === 0}
    <span class="mb-6 pl-6"> ファイルがありません </span>
  {/if}
  {#each dirFiles as file}
    <!-- 選択されているファイルの背景色を変更 -->
    {#if $selectedFile === file}
      <button
        class="border-t border-gray-300 block py-2 px-4 w-full text-white bg-gray-800 cursor-pointer"
        on:click={() => tmp(file)}
      >
        {file}
      </button>
    {:else}
      <button
        class="border-t border-gray-300 block py-2 px-4 w-full cursor-pointer hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:text-gray-700"
        on:click={() => tmp(file)}
      >
        {file}
      </button>
    {/if}
  {/each}
</div>

<style>
  button {
    text-align: left;
  }
</style>
