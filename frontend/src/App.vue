<script setup lang="ts">
import { onMounted, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import MatchmakingBox from './components/MatchmakingBox.vue';
import { useProfileStore } from './stores/ProfileStore'
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { initializeSocketListeners } from './services/matchmaking-helpers';

const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();

async function setupStore() {
	await profileStore.setupProfile();
}

onMounted(() => {
    matchmakingStore.initializeStore();
    initializeSocketListeners(matchmakingStore);

    const token = localStorage.getItem('token');
    if (token) {
      setupStore();
    }
});

const isSearchingValue = computed(() => matchmakingStore.isSearching);
const guestUUID = computed(() => matchmakingStore.guestUUID);
</script>

<template>
  <div class=" bg-no-repeat min-h-screen">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
      <div class="text-center mt-96">UUID: {{ guestUUID }}</div> 
      <div class="text-center mt-96">isSearching: {{ isSearchingValue }}</div> 
    </div>
  </div>
  <MatchmakingBox v-if="isSearchingValue" />
</template>
