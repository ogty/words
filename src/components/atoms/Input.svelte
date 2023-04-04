<script lang="ts">
  export let id: string;
  export let label: string;
  export let value: string | undefined;
  export let isRequired: boolean = false;
  export let placeholder: string = '';
</script>

<div class="mb-6">
  {#if isRequired}
    <div class="flex items-center gap-2 mb-2">
      <label for="name" class="block text-sm font-medium text-gray-900">名前</label>
      <span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >必須</span
      >
    </div>
  {:else}
    <label for={id} class="block mb-2 text-sm font-medium text-gray-900">{label}</label>
  {/if}
  <input
    {id}
    type="name"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    on:change
    bind:value
    autocomplete="off"
    {placeholder}
  />
</div>
