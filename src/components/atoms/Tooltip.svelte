<script lang="ts">
  export let id: string;
  export let message: string;
</script>

<div
  {id}
  role="tooltip"
  class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium border border-gray-300 bg-white rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip"
>
  {message}
  <div class="tooltip-arrow" data-popper-arrow />
</div>
