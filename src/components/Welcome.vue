<template>
  <transition name="fade">
    <div
      v-if="!welcomeSeen"
      class="fixed top-0 left-0 h-full w-full flex items-center justify-center z-50 overflow-auto"
      style="background-color: rgba(0, 0, 0, 0.2);"
    >
      <div class="bg-white shadow-lg rounded-lg max-w-2xl m-4 p-16">
        <Logo
          class="w-64 h-24 mx-auto mb-4 px-6 bg-red-600 rounded-lg text-white fill-current"
        />
        <div class="text-lg pt-2">
          A través d'aquest portal posem a la teva disposició la informació
          relativa de totes les botigues i establiments de la nostra ciutat
          perquè sàpigues els serveis que t'ofereixen a data d'avui per
          comprar-hi de forma fàcil i ràpida.
        </div>
        <div class="text-lg py-4">
          Perquè les botigues de Terrassa
          <span class="font-bold">ens agraden</span>.
        </div>

        <button
          class="mx-auto block rounded-lg text-lg bg-gray-200 text-gray-800 hover:bg-gray-100 transition-colors duration-200 active:bg-gray-200 shadow-md px-4 py-2 mt-8 flex"
          @click="dismiss()"
        >
          Explorar les botigues
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import Logo from '~/assets/logo-full.svg'

export default {
  components: { Logo },
  computed: {
    ...mapState(['welcomeSeen']),
  },
  methods: {
    dismiss() {
      this.$store.commit('dismissWelcome')
    },
  },
}
</script>
