<template>
  <div class="h-screen bg-gray-100">
    <div class="flex flex-col w-full h-full text-gray-800 lg:flex-row-reverse">
      <div class="block lg:hidden">
        <LogoBar />
      </div>
      <div
        class="relative z-20 flex-1 flex-shrink-0 lg:flex-auto lg:flex-grow lg:h-auto lg:mb-0 lg:-ml-2"
      >
        <ClientOnly>
          <Map v-if="loaded" />
        </ClientOnly>
      </div>
      <div
        class="z-40 flex flex-col flex-1 flex-shrink overflow-auto bg-white lg:flex-auto lg:flex-grow-0 lg:w-1/3 xl:w-1/4 shadow-xl-reverse lg:shadow-2xl lg:rounded-tr-lg"
      >
        <div class="hidden lg:block">
          <LogoBar />
        </div>
        <ShopList />
      </div>
      <div
        class="relative z-50 flex-grow-0 overflow-hidden bg-white lg:hidden shadow-md-reverse"
      >
        <FooterLinks />
      </div>
    </div>

    <Welcome />
  </div>
</template>

<page-query>
{
  allShop(filter:{display: {eq: true}}) {
    edges {
      node {
        id
        name
        type
        address
        displayAddress
        coordinates { lat lng }
        postalCode
        city
        phone
        email
        display
        openState
        openConditions
        url
        whatsapp
        openingHours
        ships
        shippingConditions
      }
    }
  }
}
</page-query>

<script>
import { mapState } from 'vuex'
import Map from '../components/Map'
import LogoBar from '../components/LogoBar'
import ShopList from '../components/ShopList'
import FooterLinks from '~/components/FooterLinks'
import Welcome from '~/components/Welcome'

export default {
  components: { Map, LogoBar, ShopList, FooterLinks, Welcome },
  data() {
    return {
      client: true,
    }
  },
  computed: {
    ...mapState(['loaded']),
  },
  async mounted() {
    let shops = this.$page.allShop.edges.map((edge) => edge.node).filter(shop => shop.coordinates)
    let types = [...new Set(shops.map((shop) => shop.type))].map((type) => ({
      id: type,
      name: type,
    }))

    await this.$shopSearch.addAllAsync(shops)
    await this.$typeSearch.addAllAsync(types)

    this.$store.dispatch('loadShops', shops)
    this.$store.commit('setTypes', types)
  },
}
</script>
