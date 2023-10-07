<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>


<template>
  <div class=" bg-no-repeat min-h-screen">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
      <div class="text-center mt-96">TEST</div>
    </div>
  </div>
</template>

<style scoped>
</style>