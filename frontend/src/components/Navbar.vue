<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { useProfileStore } from '@/stores/ProfileStore';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import { storeToRefs } from 'pinia'
import MatchmakingButton from './MatchmakingButton.vue';
import LeaveMatch from './LeaveMatch.vue';
import SettingsDropDown from './SettingsDropDown.vue';
import JoinMatch from './JoinMatch.vue';
import Cookies from 'js-cookie';

const authStore = useAuthenticationStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const profileStore = useProfileStore();
const { username, avatarUpdated, userID } = storeToRefs(profileStore)

const matchmakingStore = useMatchmakingStore();
const isInGame = computed(() => (matchmakingStore.roomID !== null));
const { isSearching } = storeToRefs(matchmakingStore);

const route = useRoute();
const showButtons = computed(() => route.path.startsWith('/game/'));

const avatarImg = ref(getAvatarImg());
const updateAvatarKey = ref(0);

watch(isAuthenticated, async () => {
	if (isAuthenticated) {
		await profileStore.setupProfile(0);
		await refreshNavbar();
	}
})

watch(userID, async (oldID, newID) => {
	if (oldID != newID) {
		let id = parseInt(userID.value, 10);
		await profileStore.setupProfile(id);
		await refreshNavbar();
	}
})

const refreshNavbar = async () => {
  avatarImg.value = await getAvatarImg();
  updateAvatarKey.value++;
}

watch(avatarUpdated, async () => {
	if (avatarUpdated.value) {
		await refreshNavbar();
		avatarUpdated.value = false;
	}
})

async function getAvatarImg() {
  const token: any = Cookies.get('token');

  if (token) {
    return "http://localhost:3000/users/avatar/" + userID.value;
  }
}

</script>

<template>
   <div class="h-20 flex justify-between border-b border-gray-400 p-4">
        <div class="ml-30px flex items-baseline">
		
			<router-link to="/intro">
				<h1 class="text-3xl m-0 leading-none mr-5">ft_transcendence</h1>
			</router-link>

			<router-link to="/community">
				<nav class="text-lg mr-5">
					<section>Community</section>
				</nav>
			</router-link>

			<router-link to="/profile/id=0">
				<nav class="text-lg mr-5">
					<section>Profile</section>
				</nav>
			</router-link>

			<div class="flex space-x-4">
				<matchmaking-button v-if="!showButtons && !isInGame" />
				<matchmaking-button v-if="!showButtons && isAuthenticated && !isInGame" :is-ranked="true" />
				<LeaveMatch v-if="showButtons && isInGame" />
				<JoinMatch v-if="!showButtons && isInGame" />
			</div>
		</div>
		
		<div v-if="isAuthenticated" class="flex z-10 items-center">
			<div>
				<p>{{ username }}</p>
			</div>
			
			<div class="mr-4 text-lg" :key="updateAvatarKey">
				<img :src="avatarImg" alt="avatar" class="ml-3 h-14 w-auto rounded-full">
			</div>

			<SettingsDropDown v-if="isInGame === false && isSearching === false" />
		</div>

	</div>
</template>