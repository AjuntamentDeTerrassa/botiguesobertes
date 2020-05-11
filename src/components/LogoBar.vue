<template>
  <div>
    <g-link
      to="/"
      class="flex logo-bar justify-end px-4 border-red-600 border-t-8"
    >
      <div
        class="flex items-center my-2 lg:my-4 text-black text-2xl text-center lg:text-left font-semibold w-2/5 leading-none"
      >
        <span class="pl-4 font-black text-red-600">
          Botigues <br />
          Obertes
        </span>
      </div>
    </g-link>
    <SearchBar />
  </div>
</template>

<script>
import SearchBar from '~/components/SearchBar'

export default {
  components: { SearchBar },
}
</script>

<style scoped>
.logo-bar {
  background: url(../assets/top.jpg);
  background-size: cover;
  background-position: center;
}
</style>
