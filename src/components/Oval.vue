<template>
  <svg
    height="7"
    viewBox="0 0 7 7"
    width="7"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g
      :style="`
        fill: ${color};
        stroke: ${strokeColor};
        stroke-width: 2;
        fill-rule: evenodd;
        stroke-opacity: 0.24;
      `"
    >
      <circle cx="3.5" cy="3.5" r="3" />
    </g>
  </svg>
</template>

<script>
import { shopColor, shopStrokeColor } from '~/utils/colors.js'

export default {
  props: {
    shop: {
      type: Object,
      required: true,
    },
  },
  computed: {
    color() {
      return shopColor(this.shop)
    },
    strokeColor() {
      return shopStrokeColor(this.shop)
    },
  },
}
</script>
