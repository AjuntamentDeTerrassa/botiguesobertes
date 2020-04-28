<template>
  <div class="absolute inset-0">
    <l-map
      ref="map"
      :zoom="12"
      :bounds="bounds.pad(0.1)"
      :max-bounds="bounds.pad(0.3)"
      :max-bounds-viscosity="0.99"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      :options="mapOptions"
      class="relative z-20 w-full h-full"
      @update:zoom="zoom = $event"
      @update:center="updateMapCenter($event)"
      @update:bounds="updateMapBounds($event)"
    >
      <l-tile-layer :url="url" />

      <l-feature-group ref="tooltip">
        <l-popup v-if="currentShop">
          <div class="text-base">
            <ShopCard :expanded="false" :shop="currentShop" />
          </div>
        </l-popup>
      </l-feature-group>

      <l-circle-marker
        v-for="marker in markers"
        :key="marker.id"
        :radius="marker.selected ? 12 : 8"
        :stroke="true"
        :lat-lng="marker.position"
        :fill-opacity="1.0"
        :fill-color="marker.color"
        :color="marker.strokeColor"
        :weight="2"
        @click="toggleShop(marker.shop)"
      />

      <l-circle
        v-if="currentPositionMarker"
        :lat-lng="currentPositionMarker.position"
        :fill-opacity="0.1"
        color="#0092F6"
        fill-color="#00A6F2"
        :weight="1"
        :radius="currentPositionMarker.accuracy"
      />
    </l-map>
    <div class="hidden lg:flex absolute right-0 top-0 z-50 m-4">
      <Filters />
      <ZoomControls :max-zoom="maxZoom" :min-zoom="minZoom" :zoom="zoom" />
    </div>

    <ZoomControls
      :max-zoom="maxZoom"
      :min-zoom="minZoom"
      :zoom="zoom"
      class="absolute z-50 block lg:hidden bottom-0 right-0 m-4"
    />

    <Filters class="absolute z-50 block lg:hidden top-0 right-0 m-4" />

    <div class="hidden lg:block absolute bottom-0 right-0 z-50 m-4">
      <MapToolbarControlGroup :separator="false">
        <FooterLinks />
        <a
          href="https://www.terrassa.cat"
          class="flex items-center bg-gray-300 px-4 hover:bg-gray-200 active:bg-gray-100 transition-all duration-300"
          target="_blank"
        >
          <Logo />
        </a>
      </MapToolbarControlGroup>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ShopCard from './ShopCard'
import { shopColor, shopStrokeColor } from '~/utils/colors.js'

import Logo from '~/assets/logo-full.svg'

import Filters from '~/components/MapToolbar/Filters'
import ZoomControls from '~/components/MapToolbar/ZoomControls'
import MapToolbarControlGroup from '~/components/MapToolbar/ControlGroup'
import FooterLinks from '~/components/FooterLinks'

let VueLeaflet = {}
let latLng, latLngBounds

if (process.isClient) {
  latLng = require('leaflet').latLng
  latLngBounds = require('leaflet').latLngBounds
  VueLeaflet = require('vue2-leaflet')
}

export default {
  name: 'Example',
  components: {
    LMap: VueLeaflet.LMap,
    LTileLayer: VueLeaflet.LTileLayer,
    LPopup: VueLeaflet.LPopup,
    LCircleMarker: VueLeaflet.LCircleMarker,
    LFeatureGroup: VueLeaflet.LFeatureGroup,
    LCircle: VueLeaflet.LCircle,
    ShopCard,
    Filters,
    ZoomControls,
    Logo,
    MapToolbarControlGroup,
    FooterLinks,
  },
  data() {
    return {
      zoom: null,
      bounds: null,
      minZoom: 12,
      maxZoom: 18,
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      mapOptions: {
        zoomSnap: 0.5,
        preferCanvas: true,
        zoomControl: false,
      },
      currentShop: null,
    }
  },

  computed: {
    markers() {
      return this.shops.map((shop) => ({
        id: shop.id,
        position: latLng(shop.coordinates.lat, shop.coordinates.lng),
        color: shopColor(shop),
        strokeColor: shopStrokeColor(shop),
        selected: this.selectedShop && this.selectedShop.id === shop.id,
        shop,
      }))
    },
    currentPositionMarker() {
      let { currentPosition } = this
      if (!currentPosition) return null

      let {
        coords: { accuracy, latitude, longitude },
      } = currentPosition

      return {
        accuracy: accuracy,
        position: latLng(latitude, longitude),
      }
    },
    ...mapState(['selectedShop', 'currentPosition', 'mapObject']),
    ...mapGetters({ shops: 'filteredShops' }),
  },
  watch: {
    selectedShop(shop) {
      this.currentShop = shop

      if (shop) {
        this.openPopUp()
      }
    },
  },
  created() {
    this.bounds = latLngBounds(this.markers.map((marker) => marker.position))
    this.$store.commit('updateMapBounds', this.bounds)

    this.$nextTick(() => {
      let mapObject = this.$refs.map.mapObject
      this.$store.commit('setMap', mapObject)
      this.$store.commit('setMapCenter', mapObject.getCenter())

      this.$refs.tooltip.mapObject.on('popupclose', () =>
        this.$store.commit('selectShop', null)
      )

      setTimeout(() => mapObject.invalidateSize(), 400)
    })
  },
  methods: {
    openPopUp() {
      this.$nextTick(() =>
        this.$refs.tooltip.mapObject.openPopup(
          latLng(
            this.currentShop.coordinates.lat,
            this.currentShop.coordinates.lng
          )
        )
      )
    },
    closePopUp() {
      this.$nextTick(() => this.$refs.tooltip.mapObject.closePopup())
    },
    updateMapCenter(position) {
      this.$store.commit('setMapCenter', position)
    },
    updateMapBounds(bounds) {
      this.$store.commit('updateMapBounds', bounds)
    },
    toggleShop(shop) {
      this.$store.commit('selectShop', shop)
    },
  },
}
</script>
