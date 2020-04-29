<template>
  <div class="h-screen bg-gray-100">
    <div class="flex flex-col lg:flex-row-reverse text-gray-800 w-full h-full">
      <div class="block lg:hidden">
        <LogoBar />
      </div>
      <div
        class="flex-shrink-0 relative flex-1 lg:flex-auto lg:flex-grow lg:h-auto z-20 lg:mb-0 lg:-ml-2"
      >
        <ClientOnly>
          <Map v-if="loaded" />
        </ClientOnly>
      </div>
      <div
        class="flex-shrink flex flex-1 flex-col lg:flex-auto lg:flex-grow-0 lg:w-1/3 xl:w-1/4 overflow-auto shadow-xl-reverse lg:shadow-2xl z-40 lg:rounded-tr-lg bg-white"
      >
        <div class="hidden lg:block">
          <LogoBar />
        </div>
        <ShopList />
      </div>
      <div
        class="lg:hidden relative flex-grow-0 bg-white shadow-md-reverse z-50 overflow-hidden"
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
    let shops = this.$page.allShop.edges.map((edge) => edge.node)
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
