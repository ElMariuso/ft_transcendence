<script setup lang="ts">
import { onMounted, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import MatchmakingBox from './components/MatchmakingBox.vue';
import Cookies from 'js-cookie';
import { useProfileStore } from './stores/ProfileStore'
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { initializeSocketListeners } from './services/matchmaking-helpers';

const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();

async function setupStore() {
	await profileStore.setupProfile();
}

onMounted(() => {
    matchmakingStore.initializeStore(profileStore);
    initializeSocketListeners(matchmakingStore);

    const token = Cookies.get('token');
    if (token) {
      setupStore();
    }
});
const isSearchingValue = computed(() => matchmakingStore.isSearching);
</script>

<template>
  <div class=" bg-no-repeat min-h-screen">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
    </div>
  </div>
  <MatchmakingBox v-if="isSearchingValue" />
</template>
