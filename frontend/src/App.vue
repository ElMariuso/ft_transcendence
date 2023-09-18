<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="bg-base-bg bg-custom-gradient bg-no-repeat min-h-screen">
    <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
</style>