/* eslint-disable vue/attribute-hyphenation */
<template>
  <MapToolbarControlGroup class="mr-2">
    <MapToolbarFilterButton filter="YES" class="truncate">
      Horari habitual
    </MapToolbarFilterButton>
    <MapToolbarFilterButton filter="PARTIALLY" class="truncate">
      Amb alteracions
    </MapToolbarFilterButton>
    <MapToolbarFilterButton filter="NO" class="truncate">
      Tancat
    </MapToolbarFilterButton>
    <MapToolbarButton
      v-if="locationEnabled"
      :class="{ 'text-blue-600': currentPosition }"
      :disabled="locationErrored"
      @click="requestLocation()"
    >
      <GpsIcon
        v-if="locationSearching"
        class="h-6 fill-current animation-spin transition-transform animation-duration-2s duration-200"
      />
      <GpsFixedIcon v-else-if="currentPosition" class="h-6 fill-current" />
      <GpsOffIcon v-else-if="locationErrored" class="h-6 fill-current" />

      <GpsIcon v-else class="h-6 fill-current" />
    </MapToolbarButton>
  </MapToolbarControlGroup>
</template>

<script>
import GpsFixedIcon from 'material-design-icons/device/svg/production/ic_gps_fixed_24px.svg'
import GpsIcon from 'material-design-icons/device/svg/production/ic_gps_not_fixed_24px.svg'
import GpsOffIcon from 'material-design-icons/device/svg/production/ic_gps_off_24px.svg'
import MapToolbarFilterButton from '~/components/MapToolbar/FilterButton'
import MapToolbarControlGroup from '~/components/MapToolbar/ControlGroup'
import MapToolbarButton from '~/components/MapToolbar/Button'

import { mapState } from 'vuex'

let latLng
if (process.isClient) {
  latLng = require('leaflet').latLng
}

export default {
  components: {
    GpsIcon,
    GpsFixedIcon,
    GpsOffIcon,
    MapToolbarFilterButton,
    MapToolbarControlGroup,
    MapToolbarButton,
  },
  data() {
    return {
      locationEnabled: !!navigator.geolocation,
      locationErrored: false,
      locationSearching: false,
    }
  },
  computed: {
    ...mapState(['currentPosition', 'mapObject']),
  },
  methods: {
    async requestLocation() {
      try {
        this.locationSearching = true
        await this.$store.dispatch('requestLocation')
        this.locationSearching = false
        this.mapObject.flyTo(
          latLng(
            this.currentPosition.coords.latitude,
            this.currentPosition.coords.longitude
          ),
          17
        )
      } catch (error) {
        this.locationSearching = false
        this.locationErrored = true
      }
    },
  },
}
</script>
