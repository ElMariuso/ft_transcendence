<script setup lang="ts">
import { computed } from 'vue';
import { joinQueue, leaveQueue, joinRankedQueue, leaveRankedQueue } from '@/services/matchmaking-helpers'
import { useProfileStore } from '@/stores/ProfileStore';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';

const props = defineProps({
    isRanked: {
        type: Boolean,
        default: false,
    },
});

const matchmakingStore = useMatchmakingStore();
const profileStore = useProfileStore();

const isSearching = computed(() => matchmakingStore.isSearching);
const guestUUID = computed(() => matchmakingStore.guestUUID);
const buttonText = computed(() => {
    return isSearching.value ? 'Cancel' : (props.isRanked ? 'Ranked' : 'Standard');
});

const handleClick = async () => {
    matchmakingStore.setIsRanked(props.isRanked);

    if (isSearching.value) {
        console.log('Cancelling the match search...');
        try {
            if (props.isRanked) {
                await leaveRankedQueue(profileStore.userId.value);
            } else {
                await leaveQueue(guestUUID.value);
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log(`Joining a ${props.isRanked ? 'ranked' : 'standard'} match...`);
        try {
            if (props.isRanked) {
                const playerData = { id: profileStore.userId.value, isGuest: false, points: 0 };
                await joinRankedQueue(playerData);
            } else {
                const playerData = { id: guestUUID.value, isGuest: true };
                await joinQueue(playerData);
            }
        } catch (error) {
            console.error(error);
        }
    }
};
</script>

<template>
    <button @click="handleClick">{{ buttonText }}</button>
</template>