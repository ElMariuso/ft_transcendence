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
                <p @click="toggleDropdown" class="block px-4 py-2 hover:text-blue-500">Profile Settings</p>
            </router-link>
            <a @click="logout" class="block px-4 py-2 cursor-pointer hover:text-red-500 ">Logout</a>
        </div>
    </div>
</template>
  
<script>
import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { updatePlayerStatus } from '@/services/matchmaking-helpers';
import { useProfileStore } from '@/stores/ProfileStore';

export default {
    setup() {
        const dropdownOpen = ref(false);
		const router = useRouter();
		const authStore = useAuthenticationStore()

        function toggleDropdown() {
            dropdownOpen.value = !dropdownOpen.value;
        }

		watch(dropdownOpen, (isOpen) => {
			if (isOpen) {
				window.addEventListener('click', closeDropdownOnClick);
			} else {
				window.removeEventListener('click', closeDropdownOnClick);
			}
		});

		const closeDropdownOnClick = (event) => {
			if (dropdownOpen.value && !event.target.closest('.relative')) {
				dropdownOpen.value = false;
			}
    	};

        function logout() {
            const profileStore = useProfileStore();
            
            updatePlayerStatus(1);
            Cookies.remove('token');
			authStore.logout();
			router.push('/login');
        }

        return {
            dropdownOpen,
            toggleDropdown,
            logout,
        };
    },
};
</script>
  
  