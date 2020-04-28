<template>
  <div
    class="bg-white rounded-lg flex shadow overflow-hidden h-10"
    :class="{ 'divide-x divide-gray-200': separator }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    separator: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
