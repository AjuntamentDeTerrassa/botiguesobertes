let latLng

if (process.isClient) {
  latLng = require('leaflet').latLng
}

export default {
  state: {
    loaded: false,
    allShops: [],
    mapBounds: null,
    openStateFilters: ['YES', 'NO', 'PARTIALLY'],
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
    toggleOpenStateFilter(state, filter) {
      if (state.openStateFilters.includes(filter)) {
        state.openStateFilters = state.openStateFilters.filter(
          (f) => f != filter
        )
      } else {
        state.openStateFilters = [...state.openStateFilters, filter]
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
  },
  getters: {
    filteredShops: ({ openStateFilters, allShops }) => {
      return allShops.filter((shop) =>
        openStateFilters.includes(shop.openState)
      )
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
        .splice(0, 10)

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
