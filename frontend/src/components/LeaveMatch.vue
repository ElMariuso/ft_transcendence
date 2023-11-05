<script setup lang='ts'>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { quitMatch  } from '@/services/matchmaking-helpers';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';

const route = useRoute();
const matchmakingStore = useMatchmakingStore();

const buttonText = computed(() => {
    if (route.path.startsWith('/game/')) {
        return 'Forfeit';
    }
    return 'Leave';
});

const quitMatchFront = async () => {
    console.log('Leaving the match...');
    try {
        await quitMatch();
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <button @click="quitMatchFront">{{ buttonText }}</button>
</template>