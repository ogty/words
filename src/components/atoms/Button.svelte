<script lang="ts">
  import Tooltip from './Tooltip.svelte';

  export let label = '';
  export let tooltip = '';
  export let sizing: boolean = false;
  export let disabled: boolean = false;
</script>

<button
  type="button"
  class="flex items-center gap-2 cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm py-2.5 mr-2 mb-2 {sizing
    ? 'pl-4 pr-5'
    : 'px-5'}"
  on:click
  {disabled}
  data-tooltip-target={label}
>
  <slot />
  {label}
</button>
{#if tooltip}
  <Tooltip id={label} message={tooltip} />
{/if}
