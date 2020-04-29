let latLng

if (process.isClient) {
  latLng = require('leaflet').latLng
}

export default {
  state: {
    loaded: false,
    allShops: [],
    mapBounds: null,
    filters: {
      states: ['YES', 'NO', 'PARTIALLY'],
      types: [],
    },
    allTypes: [],
    selectedShop: null,
    currentPosition: null,
    mapCenter: null,
    mapObject: null,
    welcomeSeen: false,
  },
  mutations: {
    setShops(state, shops) {
      state.allShops = shops
      state.loaded = true
    },
    setSearchIndex(state, index) {
      state.searchIndex = index
    },
    updateMapBounds(state, bounds) {
      state.mapBounds = bounds
    },
    selectShop(state, shop) {
      state.selectedShop = shop
    },
    toggleStateFilter({ filters }, filter) {
      if (filters.states.includes(filter)) {
        filters.states = filters.states.filter((f) => f != filter)
      } else {
        filters.states = [...filters.states, filter]
      }
    },
    setCurrentPosition(state, position) {
      state.currentPosition = position
    },
    setMapCenter(state, position) {
      state.mapCenter = position
    },
    setMap(state, map) {
      state.mapObject = map
    },
    dismissWelcome(state) {
      state.welcomeSeen = true
    },
    setTypes(state, types) {
      state.types = types.sort((a, b) => (a.name > b.name ? 1 : -1))
    },
    filterByTypes(state, types) {
      state.filters.types = types
    },
  },
  getters: {
    filteredShops: ({ filters: { states, types }, allShops }) => {
      let shops = allShops.filter((shop) => states.includes(shop.openState))
      if (types.length > 0) {
        shops = shops.filter((shop) => types.includes(shop.type))
      }
      return shops
    },
    visibleShops: (
      { mapBounds, mapCenter, selectedShop },
      { filteredShops }
    ) => {
      if (!mapBounds || !mapCenter) return []

      let list = [...filteredShops]
        .filter((shop) =>
          mapBounds.contains(latLng(shop.coordinates.lat, shop.coordinates.lng))
        )
        .sort(
          (a, b) =>
            mapCenter.distanceTo(latLng(a.coordinates.lat, a.coordinates.lng)) -
            mapCenter.distanceTo(latLng(b.coordinates.lat, b.coordinates.lng))
        )
        .splice(0, 50)

      if (selectedShop && !list.includes(selectedShop)) {
        return [selectedShop, ...list]
      } else {
        return list
      }
    },
  },
  actions: {
    requestLocation({ commit }) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            commit('setCurrentPosition', position)
            resolve(position)
          },
          (error) => reject(error),
          { enableHighAccuracy: true }
        )
      })
    },
    async loadShops({ commit }, shops) {
      commit('setShops', shops)
    },
  },
}
