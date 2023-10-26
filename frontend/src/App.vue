<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import Cookies from 'js-cookie';

import { useProfileStore } from './stores/ProfileStore'

const profileStore = useProfileStore();

async function setupStore() {
	await profileStore.setupProfile();
}

const token = Cookies.get('token');
if (token) {
	setupStore();
}
</script>

<template>
  <div class="bg-no-repeat min-h-screen flex flex-col">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
    </div>
	  <Footer />
  </div>
</template>

<style scoped>
</style>