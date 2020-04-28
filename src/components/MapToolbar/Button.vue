<template>
  <button
    :disabled="disabled"
    class="outline-none p-2 px-3 cursor-pointer transition-all hover:bg-gray-100 duration-100 active:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
