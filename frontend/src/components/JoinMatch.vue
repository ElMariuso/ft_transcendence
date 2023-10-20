<script setup lang="ts">
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const matchmakingStore = useMatchmakingStore();

const rejoinMatch = async () => {
    router.push({ name: 'game', params: { roomId: matchmakingStore.roomID } });
};
</script>

<template>
    <button @click="rejoinMatch">Rejoin match</button>
</template>