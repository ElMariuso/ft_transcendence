<script setup lang='ts'>
import { onMounted, ref } from 'vue';

const paddleWidth = 6;
const paddleHeight = 42;

const leftPaddle = ref({ x: 0, y: 0 });
const rightPaddle = ref({ x: 0, y: 0 });

function drawPaddle(ctx, x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawNet(ctx, canvas) {
    const netWidth = 3;
    const netHeight = 16;
    const spaceBetween = 16;

    ctx.fillStyle = 'white';

    for (let y = netHeight; y < canvas.height; y += (netHeight + spaceBetween)) {
        ctx.fillRect(canvas.width / 2 - netWidth / 2, y, netWidth, netHeight);
    }
}

onMounted(() => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        ctx.fillStyle = 'black'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        leftPaddle.value = { x: 30, y: canvas.height / 2 - paddleHeight / 2 };
        rightPaddle.value = { x: canvas.width - paddleWidth - 30, y: canvas.height / 2 - paddleHeight / 2 };

        drawNet(ctx, canvas);

        drawPaddle(ctx, leftPaddle.value.x, leftPaddle.value.y);
        drawPaddle(ctx, rightPaddle.value.x, rightPaddle.value.y);

        const player1Score = 0;
        const player2Score = 0;

        ctx.fillStyle = 'white';
        ctx.font = '35px Arial';

        const player1ScoreX = canvas.width / 4;
        const player2ScoreX = (canvas.width / 4) * 3;
        const scoreY = 50;

        ctx.fillText(String(player1Score), player1ScoreX, scoreY);
        ctx.fillText(String(player2Score), player2ScoreX, scoreY);
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
  