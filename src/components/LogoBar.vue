<template>
  <div>
    <g-link to="/" class="flex bg-black">
      <span class="bg-red-600 px-2 rounded-r-lg"
        ><Shield height="4em" width="4em"
      /></span>
      <div
        class="bg-black px-4 flex-grow flex items-center text-white text-xl font-semibold"
      >
        <span>Botigues Obertes</span>
      </div>
    </g-link>
    <SearchBar />
  </div>
</template>

<script>
import Shield from '../assets/shield.svg'
import SearchBar from '~/components/SearchBar'

export default {
  components: { Shield, SearchBar },
}
</script>
