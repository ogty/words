<script lang="ts">
  type Labels = '未定義' | '複数' | '動作' | '空' | 'リンク';

  export let label: Labels;

  let style = `whitespace-nowrap text-xs font-semibold mr-2 px-2.5 py-0.5 rounded `;
  switch (label) {
    case '未定義':
      style += `bg-yellow-100 text-yellow-800`;
      break;
    case '動作':
      style += `bg-indigo-100 text-indigo-800`;
      break;
    case '複数':
      style += `bg-purple-100 text-purple-800`;
      break;
    case '空':
      style += `bg-pink-100 text-pink-800`;
      break;
    case 'リンク':
      style += `bg-gray-100 text-gray-800`;
  }
</script>

<span class={style}>{label}</span>
