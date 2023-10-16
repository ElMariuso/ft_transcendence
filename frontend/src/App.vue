<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar.vue';

const guestUUID = ref<string>('');

onMounted(() => {
    let storedUUID = Cookies.get('guestUUID');
    if (!storedUUID) {
        storedUUID = uuidv4();
        Cookies.set('guestUUID', storedUUID, { expires: 365 }); // Le cookie expire après 1 an
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
