<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import MatchmakingBox from './components/MatchmakingBox.vue';
import Footer from './components/Footer.vue';
import Cookies from 'js-cookie';

import { useProfileStore } from './stores/ProfileStore'
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { initializeSocketListeners } from './services/matchmaking-helpers';

import { updatePlayerStatus } from './services/matchmaking-helpers';

const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();

async function setupStore() {
	let uri = window.location.href.split('id=');
	if (uri[1])
		await profileStore.setupProfile(uri[1]);
	else
		await profileStore.setupProfile(0);
}

onMounted(() => {
    matchmakingStore.initializeStore(profileStore);

    const token = Cookies.get('token');
    if (token) {
      setupStore();
    }
    initializeSocketListeners(matchmakingStore, profileStore);
    updatePlayerStatus(0);
});
onUnmounted(() => {
  updatePlayerStatus(1);
});
const isSearchingValue = computed(() => matchmakingStore.isSearching);
</script>

<template>
  <div class="bg-base-bg bg-no-repeat min-h-screen text-base-text">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
    </div>
	  <Footer />
  </div>
  <MatchmakingBox v-if="isSearchingValue" />
</template>