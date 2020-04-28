<template>
  <button
    class="outline-none px-4 text-sm transition-colors duration-100 hover:bg-gray-100"
    :style="`color: ${color}`"
    @click="toggle()"
  >
    <span
      class="flex items-center transition-opacity duration-100"
      :class="{ 'opacity-25': !enabled }"
    >
      <CheckIcon class="mr-2 transform scale-75 fill-current" />
      <slot />
    </span>
  </button>
</template>

<script>
import CheckIcon from 'material-design-icons/action/svg/production/ic_check_circle_24px.svg'
import { mapState } from 'vuex'
import { openStateStrokeColor } from '~/utils/colors'

export default {
  components: {
    CheckIcon,
  },
  props: {
    filter: {
      type: String,
      required: true,
    },
  },
  computed: {
    enabled() {
      return this.openStateFilters.includes(this.filter)
    },
    color() {
      return openStateStrokeColor(this.filter)
    },
    ...mapState(['openStateFilters']),
  },
  methods: {
    toggle() {
      this.$store.commit('toggleOpenStateFilter', this.filter)
    },
  },
}
</script>
