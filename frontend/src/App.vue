<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './components/Navbar.vue';

const guestUUID = ref<string>('');

onMounted(() => {
    let storedUUID = localStorage.getItem('guestUUID');
    if (!storedUUID) {
        storedUUID = uuidv4();
        localStorage.setItem('guestUUID', storedUUID);
    }
    guestUUID.value = storedUUID;
});
</script>

<template>
  <div class=" bg-no-repeat min-h-screen">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
      <div class="text-center mt-96">UUID: {{ guestUUID }}</div> 
    </div>
  </div>
</template>
