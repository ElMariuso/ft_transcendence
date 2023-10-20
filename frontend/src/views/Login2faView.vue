<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import api from '../services/api';
import { useProfileStore } from '../stores/ProfileStore'
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const profileStore = useProfileStore();
const router = useRouter();

const twoFactorAuthCode = ref('');
const authButtonDisabled = ref(true);
const authCheckPerformed = ref(false);

const authButtonLabel = computed(() => {
if (authCheckPerformed.value)
	return 'Wrong code';
else
	return 'Authenticate';
});

const authButtonClass = computed(() => {
if (authButtonDisabled.value)
	return {'bg-gray-300 text-gray-700 cursor-not-allowed': true};
else if (authCheckPerformed.value)
	return {'bg-red-500 text-white': true};
else
	return {'bg-blue-500 text-white': true};
});

watch(twoFactorAuthCode, (newVal: string, oldVal: string) => {
	newVal = newVal.trim();
	oldVal = oldVal.trim();
	if (newVal === '') {
		authButtonDisabled.value = true;
		authCheckPerformed.value = false;
	}
	else if (oldVal === '' && newVal !== '')
		authButtonDisabled.value = false;
	else if (newVal !== '' && oldVal !== '' && newVal !== oldVal) {
		authButtonDisabled.value = false;
		authCheckPerformed.value = false;
	}
});

// async function setupStore() {
// 	await profileStore.setupProfile();
// }


async function authenticate() {
	// setupStore();
	try {
		const response = await api.post('/auth/2fa/verify', {
			code: twoFactorAuthCode.value,
			userID: profileStore.userID,
		})

		if (response.data) {
			await api.post('/auth/2fa/authenticate', {
				id: profileStore.userID,
				twoFactorAuth: profileStore.twoFactorAuth
			})
			.then(res => {
				Cookies.set('token', res.data, { expires: 7 });
			})
			router.push('/login');
		}
		else
			authCheckPerformed.value = true;
	} catch (error) {
		console.error('Error authenticating:', error);
	}
};

</script>

<template>
	<div class="flex justify-center mt-28">
		<div class="flex flex-col">
			<input 
				v-model="twoFactorAuthCode" 
				type="text" 
				placeholder=" Enter 2FA Code" 
				class="px-4 py-2 border rounded-lg" 
			
			/>
			<button 
				class="mt-5 px-4 py-2 rounded-lg"
				:disabled="authButtonDisabled" 
				:class="authButtonClass"
				@click="authenticate"
			>
				{{ authButtonLabel }}
			</button>
		</div>
	</div>
</template>
