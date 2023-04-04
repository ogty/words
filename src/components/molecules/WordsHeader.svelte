<script lang="ts">
  import Grid from '@icons/Grid.svelte';
  import List from '@icons/List.svelte';
  import Json from '@icons/Json.svelte';
  import Button from '@atoms/Button.svelte';
  import Folder from '@icons/Folder.svelte';
  import Search from '@icons/Search.svelte';
  import InputBar from '@atoms/InputBar.svelte';
  import FolderOpen from '@icons/FolderOpen.svelte';
  import CheckCircle from '@icons/CheckCircle.svelte';
  import OneTwoThree from '@icons/OneTwoThree.svelte';
  import { uploadJson } from '@utils/uploadJson';
  import GridThreeTimesThree from '@icons/GridThreeTimesThree.svelte';
  import { words, layout, isOpen, isFilesOpen, wordsMemorized, isDisplayNumber } from 'src/states';

  let searchWord = '';

  const search = () => {
    const word = $words.find((word) => word.name === searchWord);
    if (word) {
      const id = word.name;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
</script>

<!-- 用語検索欄 -->
<InputBar bind:value={searchWord} on:click={search} label="検索">
  <Search />
  <Search slot="button" />
</InputBar>

<div class="grid mt-6" class:grid-cols-3={$isFilesOpen} class:grid-cols-4={!$isFilesOpen}>
  <!-- すべてのチェックを外す -->
  <Button
    label="すべてのチェックを外す"
    on:click={() => {
      localStorage.removeItem('wordsMemorized');
      wordsMemorized.set([]);
    }}
  >
    <CheckCircle />
  </Button>

  <!-- すべてのフォルダを開く -->
  <Button
    label="すべてのフォルダを開く"
    tooltip="⌘ + F"
    on:click={() => {
      isOpen.set(true);
    }}
  >
    <FolderOpen />
  </Button>

  <!-- すべてのフォルダを閉じる -->
  <Button
    label="すべてのフォルダを閉じる"
    tooltip="⌘ + F"
    on:click={() => {
      isOpen.set(false);
    }}
  >
    <Folder />
  </Button>

  <!-- レイアウト1 -->
  <Button
    label="レイアウト1"
    tooltip="⌘ + 1"
    on:click={() => {
      layout.set('');
    }}
  >
    <List />
  </Button>

  <!-- レイアウト2 -->
  <Button
    label="レイアウト2"
    tooltip="⌘ + 2"
    on:click={() => {
      layout.set('grid grid-cols-2 gap-2');
    }}
  >
    <Grid />
  </Button>

  <!-- レイアウト3 -->
  <Button
    label="レイアウト3"
    tooltip="⌘ + 3"
    on:click={() => {
      layout.set('grid grid-cols-3 gap-2');
    }}
  >
    <GridThreeTimesThree />
  </Button>

  <!-- 要素数を表示・非表示 -->
  <Button
    label={$isDisplayNumber ? '要素数を非表示' : '要素数を表示'}
    tooltip="⌘ + N"
    on:click={() => {
      isDisplayNumber.set(!$isDisplayNumber);
    }}
  >
    <OneTwoThree />
  </Button>

  <!-- ファイルから読み込む -->
  <button
    class="cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 px-5"
  >
    <label for="file_input" class="flex gap-2 items-center cursor-pointer">
      <Json />
      ファイルから読み込む
    </label>
  </button>
  <input
    id="file_input"
    type="file"
    class=""
    hidden
    accept="application/JSON"
    on:change={uploadJson}
  />
</div>
