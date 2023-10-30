<script setup lang='ts'>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { gameLoop } from '@/services/game-helpers';
import { useGameStore } from '@/stores/GameStore';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { askGamesInformations, setReady } from '@/services/matchmaking-helpers';
import { useProfileStore } from '@/stores/ProfileStore';

const gameStore = useGameStore();
const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();

const player1Username = computed(() => gameStore.player1Username);
const player2Username = computed(() => gameStore.player2Username);
const isPlayer1Ready = computed(() => gameStore.gameState.playerReady.first);
const isPlayer2Ready = computed(() => gameStore.gameState.playerReady.second);
const areBothPlayersReady = computed(() => isPlayer1Ready.value && isPlayer2Ready.value);

const movingUp = ref(false);
const movingDown = ref(false);
const isGameStateUpdated = ref(false);

const startMoving = (direction: 'up' | 'down') => {
    if (direction === 'up') movingUp.value = true;
    else movingDown.value = true;
};

const stopMoving = (direction: 'up' | 'down') => {
    if (direction === 'up') movingUp.value = false;
    else movingDown.value = false;
};

const eventDown = (event: KeyboardEvent) => {
    if (!isGameStateUpdated.value) return;
    switch (event.code) {
        case 'ArrowUp':
            startMoving('up');
            break;
        case 'ArrowDown':
            startMoving('down');
            break;
        case 'Space':
            if (!areBothPlayersReady.value) {
                const roomId = matchmakingStore.roomID;
                gameStore.isFirstPlayer ? setReady(roomId, 'player1'): setReady(roomId, 'player2');
            }
            break;
    }
};

const eventUp = (event: KeyboardEvent) => {
    if (!isGameStateUpdated.value) return;
    switch (event.code) {
        case 'ArrowUp':
            stopMoving('up');
            break;
        case 'ArrowDown':
            stopMoving('down');
            break;
    }
};

onMounted(async () => {
    window.addEventListener('keydown', eventDown);
    window.addEventListener('keyup', eventUp);
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (context) {
        const roomID = matchmakingStore.roomID;

        try {
            const gameInfo = await askGamesInformations(roomID);
            gameStore.updateGameState(gameInfo);
            isGameStateUpdated.value = true;

            if (gameStore.gameState.player1ID === matchmakingStore.guestUUID)
                gameStore.setIsFirstPlayer(true);
            else if (gameStore.gameState.player2ID === matchmakingStore.guestUUID)
                gameStore.setIsFirstPlayer(false);
            else if (gameStore.gameState.player1ID === profileStore.userID)
                gameStore.setIsFirstPlayer(true);
            else
                gameStore.setIsFirstPlayer(false);
            gameLoop(context, canvas, gameStore, roomID, movingUp, movingDown);
        } catch (error) {
            console.error("There was an error getting the game information: ", error);
        }
    }
});

onUnmounted(() => {
    window.removeEventListener('keydown', eventDown);
    window.removeEventListener('keyup', eventUp);
});
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <!-- Players' Usernames -->
        <div class="flex justify-between w-full mb-5">
            <!-- Player 1-->
            <div class="flex items-center border-2 border-white p-4 rounded-xl text-2xl">
                <span>{{ player1Username }}</span>
                <span v-if="isPlayer1Ready && !areBothPlayersReady" class="ml-3 text-green-400">🟢</span>
            </div>

            <!-- Player 2 -->
            <div class="flex items-center border-2 border-white p-4 rounded-xl text-2xl">
                <span>{{ player2Username }}</span>
                <span v-if="isPlayer2Ready && !areBothPlayersReady" class="ml-3 text-green-400">🟢</span>
            </div>
        </div>

        <!-- Game Canvas -->
        <canvas id="gameCanvas" width="858" height="525" class="border-4 border-white"></canvas>
    </div>
</template>
  
<style>
#gameCanvas {
    top: 50%;
    left: 50%;
}
</style>
  