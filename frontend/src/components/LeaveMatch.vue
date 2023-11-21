<script setup lang='ts'>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { quitMatch  } from '@/services/matchmaking-helpers';
import { useProfileStore } from '@/stores/ProfileStore';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';

const route = useRoute();
const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();

const buttonText = computed(() => {
    if (route.path.startsWith('/game/')) {
        return 'Forfeit';
    }
    return 'Leave';
});

const quitMatchFront = async () => {
    const playerId = profileStore.userID <= 0 ? matchmakingStore.guestUUID : profileStore.userID;
    try {
        console.log('Leaving the match...:', playerId);
        await quitMatch(playerId);
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <button @click="quitMatchFront">{{ buttonText }}</button>
</template>