<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { useProfileStore } from '@/stores/ProfileStore';
import { leaveQueue, leaveRankedQueue } from '@/services/matchmaking-helpers';
import socket from '@/services/socket-helpers';


const matchmakingStore = useMatchmakingStore();
const profileStore = useProfileStore();

const rankedOrNot = computed(() => matchmakingStore.isRanked ? 'ranked' : 'standard');
const guestUUID = computed(() => matchmakingStore.guestUUID);
const numberOfPlayers = computed(() => matchmakingStore.numberOfPlayers);
const matchFound = computed(() => matchmakingStore.matchFound);
const opponentUsername = computed(() => matchmakingStore.opponentUsername);

const cancelSearch = async () => {
    console.log('Cancelling the match search...');
    try {
        if (matchmakingStore.isRanked) {
            await leaveRankedQueue(profileStore.userID);
        } else {

			let id = parseInt(profileStore.userID, 10);

            if (id > 0) {
                await leaveQueue(profileStore.userID);
            }
            else {
                await leaveQueue(guestUUID.value);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

let statusInterval: any;

onMounted(() => {
    statusInterval = setInterval(() => {
        if (matchmakingStore.isRanked) {
            socket.emit('status-ranked');
        } else {
            socket.emit('status-standard');
        }
    }, 1000);
});

onUnmounted(() => {
    clearInterval(statusInterval);
});
</script>

<template>
    <div class="fixed inset-x-0 inset-y-0 h-screen flex justify-center items-center bg-black bg-opacity-50">
        <div class="bg-matchmaking-bg border border-white rounded text-center w-450px space-y-4 text-matchmaking">
            <h2 v-if="!matchFound" class="text-2xl mt-3">Finding {{ rankedOrNot }} opponent</h2>
            <h2 v-else class="text-2xl mt-3">Opponent found</h2>
            <div v-if="matchFound" class="spinner-wrapper">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <div v-else class="spinner-wrapper">
                <div class="spinner"></div>
            </div>
            <p v-if="!matchFound">Player(s) in queue: {{ numberOfPlayers }}</p>
            <p v-else>{{ opponentUsername }}</p>
            <button v-if="!matchFound" class="bg-button-gradient hover:brightness-125 transition rounded uppercase text-lg py-2 px-3 !text-button !mb-3" @click="cancelSearch">Cancel</button>
        </div>
    </div>
</template>

<style scoped>
.spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 7vh;
}
  
.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 2s linear infinite;
}
  
@keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
}

.checkmark {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #7ac142;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    position: relative;
    transform: rotate(-45deg);
}

.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: green;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes scale {
    0%, 100% {
        transform: none;
    }
    50% {
        transform: scale3d(1.1, 1.1, 1);
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px green;
    }
}
</style>