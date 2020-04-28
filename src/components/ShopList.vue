<template>
  <div class="flex-grow overflow-auto bg-gray-200">
    <div v-if="loaded && shops.length > 0">
      <ShopListItem v-for="shop in shops" :key="shop.id" :shop="shop">
        <ShopCard :shop="shop" />
      </ShopListItem>
    </div>
    <div v-else class="text-center p-4">
      <span v-if="loaded">
        No hi ha cap comerç visible en aquesta ubicació.
      </span>
      <span v-else>
        Carregant llista de comerços...
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ShopCard from './ShopCard'
import ShopListItem from './ShopListItem'

export default {
  components: { ShopCard, ShopListItem },
  computed: {
    ...mapState(['loaded', 'selectedShop']),
    ...mapGetters({ shops: 'visibleShops' }),
  },
  watch: {
    shops() {
      if (!this.selectedShop) {
        this.$el.scrollTo(0, 0)
      }
    },
  },
}
</script>
