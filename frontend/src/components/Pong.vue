<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue';
import { gameLoop } from '@/services/game-helpers';
import { useGameStore } from '@/stores/GameStore';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { askGamesInformations } from '@/services/matchmaking-helpers';
import { useProfileStore } from '@/stores/ProfileStore';

const gameStore = useGameStore();
const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();

const movingUp = ref(false);
const movingDown = ref(false);

const startMoving = (direction: 'up' | 'down') => {
    if (direction === 'up') movingUp.value = true;
    else movingDown.value = true;
};

const stopMoving = (direction: 'up' | 'down') => {
    if (direction === 'up') movingUp.value = false;
    else movingDown.value = false;
};

const eventDown = (event: KeyboardEvent) => {
    switch (event.code) {
        case 'ArrowUp':
            startMoving('up');
            break;
        case 'ArrowDown':
            startMoving('down');
            break;
    }
};

const eventUp = (event: KeyboardEvent) => {
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
    <div class="flex justify-center items-center">
        <canvas id="gameCanvas" class="absolute transform -translate-x-1/2 -translate-y-1/2" width="858" height="525"></canvas>
    </div>
</template>
  
<style>
#gameCanvas {
    top: 50%;
    left: 50%;
}
</style>
  