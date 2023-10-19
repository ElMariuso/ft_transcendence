<script setup lang="ts">
import { computed, watch, ref, onBeforeMount } from 'vue';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { useProfileStore } from '@/stores/ProfileStore';
import MatchmakingButton from './MatchmakingButton.vue';
import SettingsDropDown from './SettingsDropDown.vue';
import jwt_decode from 'jwt-decode';
import { storeToRefs } from 'pinia'

const authStore = useAuthenticationStore();
const profileStore = useProfileStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const { username, avatarUpdated } = storeToRefs(profileStore)
const avatarImg = ref(getAvatarImg());
const updateAvatarKey = ref(0);

const refreshNavbar = () => {
  avatarImg.value = getAvatarImg();
  updateAvatarKey.value++;
}

watch(avatarUpdated, () => {
	if (avatarUpdated.value) {
		refreshNavbar();
		avatarUpdated.value = false;
	}
})

watch(isAuthenticated, () => {
  if (isAuthenticated) {
    refreshNavbar();
  }
});

function getAvatarImg() {
  const token = localStorage.getItem('token');
  if (token) {
    return "http://localhost:3000/users/avatar/" + jwt_decode(token).sub;
  }
}

</script>

<template>
   <div class="w-full h-20 flex justify-between border-b border-gray-400 p-4">
        <div class="ml-30px flex items-baseline">
		
			<router-link to="/">
				<h1 class="text-3xl m-0 leading-none mr-5">ft_transcendence</h1>
			</router-link>
		
			<router-link to="">
					<p class="text-lg mr-5" >Play</p>
			</router-link>

			<!-- <div class="flex space-x-4">
				<matchmaking-button />
				<matchmaking-button v-if="isAuthenticated" :is-ranked="true" />
			</div> -->

			<router-link to="/community">
				<nav class="text-lg mr-5">
					<section>Community</section>
				</nav>
			</router-link>

			<router-link to="/profile">
				<nav class="text-lg mr-5">
					<section>Profile</section>
				</nav>
			</router-link>

		</div>
		
		<div v-if="isAuthenticated" class="flex items-center">
			<div>
				<p>{{ username }}</p>
			</div>
			
			<div class="mr-4 text-lg" :key="updateAvatarKey">
				<img :src="avatarImg" alt="avatar" class="ml-3 h-14 w-auto rounded-full">
			</div>

			<SettingsDropDown />
		</div>

	</div>
</template>