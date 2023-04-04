<script lang="ts">
  import { words } from 'src/states';
  import { jsonHighlighter } from '@utils/jsonHighlighter';

  export let indent = 2;
</script>

<code>
  <pre class="text-xs px-6 py-4">
{@html jsonHighlighter(JSON.stringify($words, null, indent))}</pre>
</code>
