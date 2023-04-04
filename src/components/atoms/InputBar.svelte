<script lang="ts">
  export let label: string = '';
  export let value: string = '';
</script>

<div class="flex items-center mt-10">
  <label for="simple-search" class="sr-only">{label}</label>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <slot />
    </div>
    <input
      id="simple-search"
      type="text"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2.5"
      bind:value
      placeholder={label}
    />
  </div>
  <button
    on:click
    type="button"
    class="p-2.5 ml-2 text-sm font-medium text-white bg-gray-800 rounded-lg border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300"
  >
    <slot name="button" />
    <span class="sr-only">{label}</span>
  </button>
</div>
