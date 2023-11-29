<script setup lang="ts">
import { ref } from 'vue';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { useAuthenticationStore } from '@/stores/AuthenticationStore';
import { storeToRefs } from 'pinia';
import FirstAuthSettingsModal from '../components/modals/FirstAuthSettingsModal.vue';
import { JwtPayload } from "@/models/jwtPayload.model";
import { useRouter } from 'vue-router';
// import { useProfileStore } from '../stores/ProfileStore'

const router = useRouter();

const authStore = useAuthenticationStore();
const { firstAuth } = storeToRefs(authStore);

// const profileStore = useProfileStore();
// const { userID } = storeToRefs(profileStore)

const token: any = Cookies.get('token');
const decodedToken: JwtPayload = jwt_decode(token);
const firstLogin: any = decodedToken.firstLogin;
const showModal = ref(true);

function closeSettingsModal() {
	showModal.value = false;
	firstAuth.value++;
	router.push('/intro');
}
</script>

<template>
	<div class="text-3xl m-0 leading-none mr-5 mx-auto">
		Welcome to ft_transcendence !
	</div>
	<img src="../../Images/pong.jpeg" alt="avatar" class="mt-14 mx-auto">

	<FirstAuthSettingsModal v-if="firstLogin && firstAuth === 0 && showModal" @closeModal="closeSettingsModal" />

</template>