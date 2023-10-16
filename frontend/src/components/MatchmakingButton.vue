<script setup lang="ts">
import { ref, computed } from 'vue';
import { joinQueue, leaveQueue, joinRankedQueue, leaveRankedQueue } from '@/services/matchmaking-helpers'

const props = defineProps({
    isRanked: {
        type: Boolean,
        default: false,
    },
});

const isSearching = ref(false);
const guestUUID = ref(localStorage.getItem('guestUUID'));

const buttonText = computed(() => {
    return isSearching.value ? 'Cancel' : (props.isRanked ? 'Ranked' : 'Standard');
});

const handleClick = async () => {
    if (isSearching.value) {
        console.log('Cancelling the match search...');
        isSearching.value = false;
        try {
            let response;
            if (props.isRanked) {
                response = await leaveRankedQueue(0); // TODO: Change that after
            } else {
                response = await leaveQueue(localStorage.getItem('guestUUID'));
            }
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log(`Joining a ${props.isRanked ? 'ranked' : 'standard'} match...`);
        isSearching.value = true;
        try {
            let response;
            if (props.isRanked) {
                const playerData = { id: 0, isGuest: false, points: 0};
                response = await joinRankedQueue(playerData);
            } else {
                const playerData = { id: guestUUID.value, isGuest: true };
                response = await joinQueue(playerData);
            }
            console.log(response);
        } catch (error) {
            isSearching.value = false;
            console.error(error);
        }
    }
};
</script>

<template>
    <button @click="handleClick">{{ buttonText }}</button>
</template>

<style scoped>
</style>