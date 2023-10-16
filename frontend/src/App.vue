<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { useProfileStore } from './stores/ProfileStore'

const profileStore = useProfileStore();

async function setupStore() {
	await profileStore.setupProfile();
}

const token = localStorage.getItem('token');
if (token) {
	setupStore();
}
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