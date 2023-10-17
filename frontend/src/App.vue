<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar.vue';
import MatchmakingBox from './components/MatchmakingBox.vue';

const guestUUID = ref<string>('');
const isSearchingValue = ref<boolean>(false);

onMounted(() => {
    let storedUUID = Cookies.get('guestUUID');
    if (!storedUUID) {
        storedUUID = uuidv4();
        Cookies.set('guestUUID', storedUUID, { expires: 365 });
    }
    guestUUID.value = storedUUID;

    const storedIsSearching = Cookies.get('isSearching');
    isSearchingValue.value = storedIsSearching === 'true';
    console.log("RET:", isSearchingValue.value);
});
</script>


<template>
  <div class=" bg-no-repeat min-h-screen">
      <Navbar />
    <div class="container mx-auto mt-8">
      <router-view />
      <div class="text-center mt-96">UUID: {{ guestUUID }}</div> 
      <div class="text-center mt-96">isSearching: {{ isSearchingValue }}</div> 
    </div>
  </div>
  <MatchmakingBox v-if="isSearchingValue" />
</template>
