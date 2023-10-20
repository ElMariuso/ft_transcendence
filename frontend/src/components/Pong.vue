<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { gameLoop, paddleHeight, paddleWidth } from '@/services/game-helpers';

const leftPaddle = ref({ x: 0, y: 0 });
const rightPaddle = ref({ x: 0, y: 0 });

onMounted(() => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (context) {
        leftPaddle.value = { x: 30, y: canvas.height / 2 - paddleHeight / 2 };
        rightPaddle.value = { x: canvas.width - paddleWidth - 30, y: canvas.height / 2 - paddleHeight / 2 };

        gameLoop(context, canvas, leftPaddle.value, rightPaddle.value);
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
  