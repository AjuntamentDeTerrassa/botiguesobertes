<template>
  <MapToolbarControlGroup>
    <MapToolbarButton :disabled="zoom >= maxZoom" @click="mapObject.zoomIn()">
      <AddIcon class="h-6 fill-current" />
    </MapToolbarButton>
    <MapToolbarButton :disabled="zoom <= minZoom" @click="mapObject.zoomOut()">
      <RemoveIcon class="h-6 fill-current transform scale-75 lg:scale-100" />
    </MapToolbarButton>
  </MapToolbarControlGroup>
</template>

<script>
import { mapState } from 'vuex'
import AddIcon from 'material-design-icons/content/svg/production/ic_add_24px.svg'
import RemoveIcon from 'material-design-icons/content/svg/production/ic_remove_24px.svg'
import MapToolbarButton from '~/components/MapToolbar/Button'
import MapToolbarControlGroup from '~/components/MapToolbar/ControlGroup'

export default {
  components: {
    AddIcon,
    RemoveIcon,
    MapToolbarButton,
    MapToolbarControlGroup,
  },
  props: {
    minZoom: {
      type: Number,
      required: false,
      default: null,
    },
    maxZoom: {
      type: Number,
      required: false,
      default: null,
    },
    zoom: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    ...mapState(['mapObject']),
  },
}
</script>
