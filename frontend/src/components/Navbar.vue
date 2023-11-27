<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { useProfileStore } from '@/stores/ProfileStore';
import jwt_decode from 'jwt-decode';
import MatchmakingButton from './MatchmakingButton.vue';
import LeaveMatch from './LeaveMatch.vue';
import SettingsDropDown from './SettingsDropDown.vue';
import { useMatchmakingStore } from '@/stores/MatchmakingStore';
import JoinMatch from './JoinMatch.vue';
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie';
import { JwtPayload } from "@/models/jwtPayload.model";

const authStore = useAuthenticationStore();
const profileStore = useProfileStore();
const matchmakingStore = useMatchmakingStore();
const route = useRoute();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const showButtons = computed(() => route.path.startsWith('/game/'));
const isInGame = computed(() => (matchmakingStore.roomID !== null));
const { username, avatarUpdated } = storeToRefs(profileStore)
const avatarImg = ref(getAvatarImg());
const updateAvatarKey = ref(0);



watch(isAuthenticated, async () => {
	if (isAuthenticated) {
		await profileStore.setupProfile(0);
		refreshNavbar();
	}
})

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

function getAvatarImg() {

  const token: any = Cookies.get('token');
  const decodedToken: JwtPayload = jwt_decode(token);
  const id: any = decodedToken.sub;

  if (token) {
    return "http://localhost:3000/users/avatar/" + id;
  }
}

</script>

<template>
   <div class="h-20 flex justify-between border-b border-gray-400 p-4">
        <div class="ml-30px flex items-baseline">
		
			<router-link to="/">
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

			<SettingsDropDown />
		</div>

	</div>
</template>