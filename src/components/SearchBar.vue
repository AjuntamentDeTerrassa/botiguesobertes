<template>
  <div class="relative">
    <div class="flex border-gray-200 border-b-2 items-center">
      <div class="relative flex flex-1">
        <form
          ref="searchForm"
          class="flex flex-1"
          @submit.prevent="performSearch"
        >
          <input
            v-model="searchText"
            class="flex-1 p-4 placeholder-gray-500 text-gray-800"
            placeholder="Busques un comerç en concret?"
            @input="searchText = $event.target.value"
          />
          <ClearIcon
            v-if="searchResults"
            class="text-gray-500 fill-current absolute m-4 right-0 top-0 cursor-pointer"
            :class="{ 'text-gray-800': focused }"
            @click="clearSearchResults()"
          />
          <SearchIcon
            v-else
            class="text-gray-500 fill-current absolute m-4 right-0 top-0 pointer-events-none"
            :class="{ 'text-gray-800': focused }"
          />
        </form>
      </div>
      <button class="flex-grow-0 p-4 h-full" @click="toggleFilters()">
        <FilterIcon
          class="fill-current"
          :class="{ 'text-red-600': filters.types.length > 0 }"
        />
      </button>
    </div>

    <transition name="slidedown">
      <div
        v-if="showSearch"
        class="absolute w-full bg-white shadow-md z-50 divide-y divide-gray-100"
      >
        <ul v-if="searchTypes.length > 0" class="py-4">
          <li v-for="type in searchTypes" :key="type.id">
            <a
              href="#"
              class="flex px-4 py-1 items-center hover:bg-gray-100 transition-colors duration-100"
              @click="selectType(type)"
            >
              <span class="pl-2">{{ type.id }}</span>
            </a>
          </li>
        </ul>
        <ul v-if="shops.length > 0" class="py-4">
          <li v-for="shop in shops" :key="shop.id">
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
        <div v-else class="p-4">No s'ha trobat resultats</div>
      </div>
    </transition>
    <transition name="slidedown">
      <div
        v-if="showFilters"
        class="absolute w-full bg-white shadow-md z-50 divide-y divide-gray-100 p-4"
        style="max-height: 70vh;"
      >
        <div class="flex flex-col h-full">
          <ul class="overflow-auto h-64">
            <li v-for="type in allTypes" :key="type.id">
              <label class="flex items-center">
                <input v-model="tempTypes" type="checkbox" :value="type.id" />
                <span class="pl-2">{{ type.name }}</span>
              </label>
            </li>
          </ul>
          <div class="flex-1 pt-4 flex justify-between">
            <button @click="clearFilters()">Esborrar filtres</button>
            <button
              class="py-2 px-4 bg-gray-100 shadow-md rounded-md transition-all duration-100 hover:bg-gray-200"
              @click="filter()"
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Oval from '~/components/Oval'
import ClearIcon from 'material-design-icons/content/svg/production/ic_clear_24px.svg'
import SearchIcon from 'material-design-icons/action/svg/production/ic_search_24px.svg'
import FilterIcon from 'material-design-icons/content/svg/production/ic_filter_list_24px.svg'
import { mapState } from 'vuex'

let latLng
if (process.isClient) {
  latLng = require('leaflet').latLng
}

export default {
  components: { SearchIcon, Oval, FilterIcon, ClearIcon },
  data() {
    return {
      searchText: null,
      shops: [],
      types: [],
      searchTypes: [],
      tempTypes: [],
      showFilters: false,
      focused: false,
    }
  },
  computed: {
    ...mapState(['allShops', 'mapObject', 'filters', 'searchResults']),
    ...mapState({ allTypes: 'types' }),
    showSearch() {
      return !!this.searchText
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
      this.clearFilters()
      this.$nextTick(() => {
        this.mapObject.flyTo(
          latLng(shop.coordinates.lat, shop.coordinates.lng),
          17
        )
      })
    },
    selectType(type) {
      this.searchText = null
      this.$store.commit('filterByTypes', [type.id])
    },
    search() {
      let { searchText } = this
      if (!searchText) return (this.shops = [])

      let types = this.$typeSearch.search(searchText).slice(0, 3)
      let shopResults = this.$shopSearch.search(searchText).slice(0, 5)

      let shops = this.allShops.filter((shop) =>
        shopResults.map((result) => result.id).includes(shop.id)
      )

      this.searchTypes = types
      this.shops = shops
    },
    toggleFilters() {
      this.showFilters = !this.showFilters

      if (this.showFilters) {
        this.tempTypes = this.filters.types
      }
    },
    filter() {
      this.$store.commit('filterByTypes', this.tempTypes)
      this.showFilters = false
    },
    clearFilters() {
      this.showFilters = false
      this.$store.commit('filterByTypes', [])
    },
    performSearch() {
      this.clearFilters()
      this.$store.dispatch('search', this.searchText)
      this.searchText = null
    },
    clearSearchResults() {
      this.$store.commit('clearSearchResults')
    },
  },
}
</script>
