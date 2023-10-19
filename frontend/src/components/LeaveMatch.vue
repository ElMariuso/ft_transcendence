<script setup lang='ts'>
import { quitRankedMatch, quitStandardMatch } from '@/services/matchmaking-helpers';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';

const matchmakingStore = useMatchmakingStore();

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
    <button @click="quitMatch">Leave</button>
</template>