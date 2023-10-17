<script setup lang="ts">
import Cookies from 'js-cookie';
import { ref, computed, watch } from 'vue';
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
const guestUUID = ref<string>(Cookies.get('guestUUID') || '');

const buttonText = computed(() => {
    return isSearching.value ? 'Cancel' : (props.isRanked ? 'Ranked' : 'Standard');
});

watch(isSearching, (newValue) => {
    matchmakingStore.setIsSearching(newValue);
});

const handleClick = async () => {
    if (isSearching.value) {
        console.log('Cancelling the match search...');
        matchmakingStore.setIsSearching(false);
        try {
            let response;
            if (props.isRanked) {
                response = await leaveRankedQueue(profileStore.userId.value);
            } else {
                response = await leaveQueue(guestUUID.value);
            }
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log(`Joining a ${props.isRanked ? 'ranked' : 'standard'} match...`);
        matchmakingStore.setIsSearching(true);
        try {
            let response;
            if (props.isRanked) {
                const playerData = { id: profileStore.userId.value, isGuest: false, points: 0 };
                response = await joinRankedQueue(playerData);
            } else {
                const playerData = { id: guestUUID.value, isGuest: true };
                response = await joinQueue(playerData);
            }
            console.log(response);
        } catch (error) {
            matchmakingStore.setIsSearching(false);
            console.error(error);
        }
    }
};
</script>

<template>
    <button @click="handleClick">{{ buttonText }}</button>
</template>