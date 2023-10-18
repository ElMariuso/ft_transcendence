<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const roomId = ref('');

onMounted(() => {
  const routeRoomId = route.params.roomId;

  if (Array.isArray(routeRoomId)) {
    roomId.value = routeRoomId[0];
  } else {
    roomId.value = routeRoomId;
  }
  console.log(`Game room ID is: ${roomId.value}`);
});
</script>

<template>
    <div>
        <h1>This is the game page</h1>
        <p>Room ID: {{ roomId }}</p>
    </div>
</template>