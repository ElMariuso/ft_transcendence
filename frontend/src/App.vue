<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue';
import { useProfileStore } from './stores/ProfileStore'
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { initializeSocketListeners } from './services/matchmaking-helpers';
import { updatePlayerStatus } from './services/matchmaking-helpers';
import Navbar from './components/Navbar.vue';
import MatchmakingBox from './components/MatchmakingBox.vue';
import Cookies from 'js-cookie';

const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();
const isSearchingValue = computed(() => matchmakingStore.isSearching);

async function setupStore() {
	let uri = window.location.href.split('id=');

	let id = parseInt(uri[1], 10);
	
	if (uri[1])
		await profileStore.setupProfile(id);
	else
		await profileStore.setupProfile(0);
}

function handleBeforeUnload() {
  updatePlayerStatus(1);
}

onMounted(() => {
    matchmakingStore.initializeStore();
    
    const token = Cookies.get('token');
    if (token) {
      setupStore();
    }
    initializeSocketListeners();
    updatePlayerStatus(0);
    window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <div class="bg-base-bg bg-no-repeat min-h-screen text-base-text">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
    </div>
  </div>
  <MatchmakingBox v-if="isSearchingValue" />
</template>