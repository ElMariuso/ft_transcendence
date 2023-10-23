<script setup lang='ts'>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { quitRankedMatch, quitStandardMatch } from '@/services/matchmaking-helpers';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';

const route = useRoute();
const matchmakingStore = useMatchmakingStore();

const buttonText = computed(() => {
    if (route.path.startsWith('/game/')) {
        return 'Forfeit';
    }
    return 'Leave';
});

const quitMatch = async () => {
    console.log('Leaving the match...');
    try {
        if (matchmakingStore.isRanked) {
            await quitRankedMatch();
        } else {
            await quitStandardMatch();
        }
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <button @click="quitMatch">{{ buttonText }}</button>
</template>