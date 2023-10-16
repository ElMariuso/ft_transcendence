<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { getRedirectURL } from '@/services/auth-helpers';

// Initialize the Authentication Store for state management
const authStore = useAuthenticationStore();

// Define a ref to manage and hold the OAuth redirect URL dynamically
const url = ref<string>('');

// Lifecycle hook - onMounted: Triggered after the component is mounted
// onMounted(async () => {
//     try {
//         // Attempt to fetch OAuth redirect URL and assign to local ref state
//         const tmpURL = await getRedirectURL();
//         url.value = tmpURL;
//     } catch (error) {
//         // Log any errors that occur during fetch operation to console
//         console.error("Failed to fetch redirect URL:", error);
//     }
// });

onMounted(async () => {
    try {
        // Attempt to fetch OAuth redirect URL and assign to local ref state
		
        const tmpURL = await getRedirectURL();
        url.value = tmpURL;
    } catch (error) {
        // Log any errors that occur during fetch operation to console
        console.error("Failed to fetch redirect URL:", error);
    }
});

// Define logout function to clear authentication token and update auth state
const logout = () => {
    localStorage.removeItem('token');  // Remove authentication token from localStorage
    authStore.logout();  // Update the authentication state in the store
};
</script>

<template>
    <div class="flex justify-center">
        <!-- Styling applied to center and stylize the authentication option -->
        <div class="mt-28 text-black-500 font-bold text-2xl py-2 px-4 rounded border-2 border-black hover:bg-blue-400">
            <!-- Conditionally render: Display Login link if user is not authenticated -->
            <a v-if="!authStore.isAuthenticated" :href="url">42 Login</a>
            <!-- Conditionally render: Display Logout button if user is authenticated -->
            <!-- <button v-else @click="logout">Logout</button> -->
        </div>
    </div>
</template>
