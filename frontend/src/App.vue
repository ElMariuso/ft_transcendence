<script>
import router from './router';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
}
</script>

<template>
  <div class="bg-base-bg bg-custom-gradient bg-no-repeat min-h-[2000px]">
    <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
      <div class="text-center mt-96">TEST</div>
    </div>
  </div>
</template>

<style scoped>
</style>