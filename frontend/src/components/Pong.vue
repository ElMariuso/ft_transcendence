<script setup lang='ts'>
import { onMounted } from 'vue';
import { gameLoop } from '@/services/game-helpers';
import { useGameStore } from '@/stores/GameStore';

const gameStore = useGameStore();

onMounted(() => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (context) {
        gameStore.initializeGame(canvas);
        gameLoop(context, canvas, gameStore);
    }
});
</script>

<template>
    <div class="flex justify-center items-center h-screen">
        <canvas id="gameCanvas" class="absolute transform -translate-x-1/2 -translate-y-1/2" width="858" height="525"></canvas>
    </div>
</template>
  
<style>
#gameCanvas {
    top: 50%;
    left: 50%;
}
</style>
  