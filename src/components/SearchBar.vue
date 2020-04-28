<template>
  <div class="relative">
    <div class="flex border-gray-200 border-b-2">
      <div class="relative flex flex-1">
        <input
          v-model="searchText"
          class="flex-1 p-4 placeholder-gray-500 text-gray-800"
          placeholder="Estàs buscant un comerç en concret?"
          @input="searchText = $event.target.value"
          @focus="focused = true"
          @blur="focused = false"
        />
        <SearchIcon
          class="text-gray-500 fill-current absolute m-4 right-0 top-0 pointer-events-none"
          :class="{ 'text-gray-800': focused }"
        />
      </div>
    </div>
    <div v-if="showSearch" class="absolute w-full bg-white shadow-md py-4 z-50">
      <ul v-if="searchResults && searchResults.length > 0">
        <li v-for="shop in searchResults" :key="shop.id">
          <a
            href="#"
            class="flex px-4 py-1 items-center hover:bg-gray-100 transition-colors duration-100"
            @click="selectShop(shop)"
          >
            <Oval :shop="shop" />
            <span class="pl-2">{{ shop.name }}</span>
          </a>
        </li>
      </ul>
      <div v-else class="px-4">No s'ha trobat resultats</div>
    </div>
  </div>
</template>

<script>
import Oval from '~/components/Oval'
import SearchIcon from 'material-design-icons/action/svg/production/ic_search_24px.svg'
import { mapState } from 'vuex'

let latLng
if (process.isClient) {
  latLng = require('leaflet').latLng
}

export default {
  components: { SearchIcon, Oval },
  data() {
    return {
      searchText: null,
      searchResults: null,
      focused: false,
    }
  },
  computed: {
    ...mapState(['allShops', 'mapObject']),
    showSearch() {
      return this.searchText
    },
  },
  watch: {
    searchText(_text) {
      this.$nextTick(() => this.search())
    },
  },
  methods: {
    selectShop(shop) {
      this.searchText = null
      this.$store.commit('selectShop', shop)
      this.$nextTick(() => {
        this.mapObject.flyTo(
          latLng(shop.coordinates.lat, shop.coordinates.lng),
          17
        )
      })
    },
    search() {
      let { searchText } = this
      if (!searchText) return (this.searchResults = [])
      let results = this.$search.search(searchText).slice(0, 10)
      let shops = this.allShops.filter((shop) =>
        results.map((result) => result.id).includes(shop.id)
      )
      this.searchResults = shops
    },
  },
}
</script>
