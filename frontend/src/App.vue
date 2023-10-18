<script setup lang="ts">
import { onMounted, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import MatchmakingBox from './components/MatchmakingBox.vue';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { initializeSocketListeners } from './services/matchmaking-helpers';

const matchmakingStore = useMatchmakingStore();

onMounted(() => {
    matchmakingStore.initializeStore();
    initializeSocketListeners(matchmakingStore)
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
