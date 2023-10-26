<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Cookies from 'js-cookie';
import { useProfileStore } from './stores/ProfileStore'

const profileStore = useProfileStore();

async function setupStore() {
	let uri = window.location.href.split('id=');
	if (uri[1])
		await profileStore.setupProfile(uri[1]);
	else
		await profileStore.setupProfile(0);
}

const token = Cookies.get('token');
if (token) {
	setupStore();
}
</script>

<template>
  <div class=" bg-no-repeat min-h-screen">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
</style>