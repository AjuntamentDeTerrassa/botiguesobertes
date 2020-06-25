<template>
  <div class="text-gray-800">
    <div class="pb-2">
      <div class="text-sm mb-2 uppercase text-gray-500">{{ shop.type }}</div>
      <h2 class="text-xl font-semibold leading-tight">
        <a href="#" class="text-gray-900">
          {{ shop.name }}
        </a>
      </h2>
      <div :class="{ hidden: !expanded }" class="lg:block">
        {{ shop.displayAddress }}
      </div>
      <span v-if="distance" class="italic"
        >a {{ distance }} de la teva ubicació</span
      >
      <div class="flex lg:flex py-2" :class="{ hidden: !expanded }">
        <div class="pt-2">
          <Oval :shop="shop" />
        </div>
        <div class="pl-2">
          {{ openText
          }}<span v-if="shop.openConditions"
            >&nbsp;({{ shop.openConditions }})</span
          >
        </div>
      </div>
      <div v-if="shop.whatsapp" class="pb-2" :class="{ hidden: !expanded }">
        <a
          class="text-green-600 hover:underline align-middle"
          target="_blank"
          :href="`https://wa.me/${shop.whatsapp}?text=Hola, voldria fer una comanda.`"
        >
          <WhatsAppIcon
            class="inline fill-current mr-1"
            style="width: 1.2em;"
          />{{ shop.whatsapp }}
          (comandes)
        </a>
      </div>
      <ul
        v-if="shop.ships === 'Si'"
        class="flex lg:flex pb-2 pt-1"
        :class="{ hidden: !expanded }"
      >
        <li class="bg-yellow-200 px-2 py-1 rounded-full text-sm inline-block">
          Enviament a domicili
        </li>
      </ul>
      <div
        v-if="shop.shippingConditions"
        class="block lg:block pb-2"
        :class="{ hidden: !expanded }"
      >
        {{ shop.shippingConditions }}
      </div>
    </div>

    <div
      v-if="shop.phone || shop.email"
      class="block"
      :class="{ hidden: !expanded }"
    >
      <ul class="leading-relaxed">
        <li v-if="shop.url">
          <a
            class="text-blue-500 hover:underline"
            :href="shop.url"
            target="_blank"
            >{{ shop.url }}</a
          >
        </li>
        <li v-if="shop.phone">
          <a
            class="text-blue-500 hover:underline"
            :href="`tel:${shop.phone}`"
            @click.stop
            >{{ shop.phone }}</a
          >
        </li>
        <li v-if="shop.email">
          <a
            class="text-blue-500 hover:underline"
            :href="`mailto:${shop.email}`"
            @click.stop
          >
            {{ shop.email }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Oval from './Oval'
import WhatsAppIcon from '../assets/whatsapp.svg'
import { mapState } from 'vuex'

let latLng

if (process.isClient) {
  latLng = require('leaflet').latLng
}

export default {
  components: { Oval, WhatsAppIcon },
  props: {
    shop: {
      type: Object,
      required: true,
    },
    expanded: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    openText() {
      return {
        YES: this.shop.openingHours || 'Horari habitual',
        NO: 'Tancat',
        PARTIALLY: 'Amb alteracions',
      }[this.shop.openState]
    },
    distance() {
      if (!this.currentPosition) return null

      let distance = latLng(
        this.currentPosition.coords.latitude,
        this.currentPosition.coords.longitude
      ).distanceTo(latLng(this.shop.coordinates.lat, this.shop.coordinates.lng))

      if (distance > 1000) {
        return `${Math.round(distance / 100) / 10}km`
      } else {
        return `${Math.round(distance)}m`
      }
    },
    ...mapState(['currentPosition', 'mapObject']),
  },
}
</script>
