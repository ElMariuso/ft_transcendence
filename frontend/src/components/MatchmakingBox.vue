<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { useProfileStore } from '@/stores/ProfileStore';
import socket from '@/services/socket-helpers';
import Cookies from 'js-cookie';

import { leaveQueue, leaveRankedQueue } from '@/services/matchmaking-helpers';

const props = defineProps({
    isRanked: {
        type: Boolean,
        default: false,
    },
});

const matchmakingStore = useMatchmakingStore();
const profileStore = useProfileStore();

const rankedOrNot = computed(() => props.isRanked ? 'ranked' : 'standard');
const guestUUID = ref<string>(Cookies.get('guestUUID') || '');

const numberOfPlayers = computed(() => matchmakingStore.numberOfPlayers);

const cancelSearch = async () => {
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
};
</script>

<template>
    <div class="fixed inset-x-0 inset-y-0 h-screen flex justify-center items-center bg-black bg-opacity-50">
        <div class="bg-matchmaking-bg border border-white rounded text-center w-450px space-y-4 text-matchmaking">
            <h2 class="text-2xl mt-3">Finding {{ rankedOrNot }} opponent</h2>
            <div class="spinner-wrapper">
                <div class="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>            
            <p>Player(s) in queue: {{ numberOfPlayers }} </p>
            <button class="bg-button-gradient hover:brightness-125 transition rounded uppercase text-lg py-2 px-3 !text-button !mb-3" @click="cancelSearch">Cancel</button>
        </div>
    </div>
</template>

<style scoped>
.spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.lds-ring {
    display: inline-block;
    position: relative;
    width: 40px;
    height: 40px;
}

.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 4px;
    border: 4px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
}
@keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
}
</style>