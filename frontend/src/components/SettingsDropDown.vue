<template>
    <div class="relative">
        <div @click="toggleDropdown" class="cursor-pointer p-2">
            <img  
                src="../assets/settings_elipsis.svg" 
                alt="Settings"
            />
        </div>
        <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
            <router-link to="/settings">
                <p class="block px-4 py-2 hover:bg-blue-100">Profile Settings</p>
            </router-link>
            <a @click="logout" class="block px-4 py-2 hover:bg-red-100">Logout</a>
        </div>
    </div>
</template>
  
<script>
import { ref } from 'vue';
  
export default {
    setup() {
        const dropdownOpen = ref(false);

        function toggleDropdown() {
            dropdownOpen.value = !dropdownOpen.value;
        }

        // function logout() {
        //     // Implement the logout logic here
        // }

        return {
            dropdownOpen,
            toggleDropdown,
            // logout,
        };
    },
};
</script>
  
  