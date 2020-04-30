<template>
  <div
    class="bg-white rounded cursor-pointer px-6 p-4 transition-all duration-500 hover:bg-gray-100"
    :class="{ 'bg-gray-100': selected }"
    style="margin-bottom: 2px;"
    @click="selectShop(shop)"
  >
    <slot />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    shop: {
      type: Object,
      required: true,
    },
  },
  computed: {
    selected() {
      if (!this.selectedShop) return false
      return this.shop.id === this.selectedShop.id
    },
    ...mapState(['selectedShop']),
    ...mapGetters(['visibleShops']),
  },
  watch: {
    selected(selected) {
      if (selected) this.scroll()
    },
    visibleShops() {
      if (this.selected) this.scroll()
    },
  },
  mounted() {
    if (this.selected) {
      this.scroll()
    }
  },
  methods: {
    selectShop(shop) {
      this.$store.commit('selectShop', shop)
    },
    scroll() {
      this.$el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    },
  },
}
</script>
