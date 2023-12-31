<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useProfileStore } from '../stores/ProfileStore'
import { useRouter } from 'vue-router';
import api from '../services/api';
import Cookies from 'js-cookie';
import jwt_decode, {JwtPayload} from 'jwt-decode';

const profileStore = useProfileStore();
const router = useRouter();

const twoFactorAuthCode = ref('');
const authButtonDisabled = ref(true);
const authCheckPerformed = ref(false);
const updatePage = ref(0);

const nbAttempts = ref(0);
const countdownTimer = ref(60); // Initial countdown time in seconds
let countdownInterval: number | null = null;	

const authButtonLabel = computed(() => {
	if (authCheckPerformed.value)
		return 'Wrong code';
	else
		return 'Authenticate';
});

const authButtonClass = computed(() => {
	if (authButtonDisabled.value || countdownInterval !== null)
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

function startCountdownTimer() {
	if (countdownInterval === null) {
		countdownInterval = setInterval(() => {
			countdownTimer.value--;

			if (countdownTimer.value === 0) {
				// Reset nbAttempts and stop the countdown when it reaches 0
				nbAttempts.value = 0;
				clearInterval(countdownInterval!);
				countdownInterval = null;
				countdownTimer.value = 60;
			}
		}, 1000); // Update every second
	}
}

async function authenticate() {
	try {
		const token: any = Cookies.get('token')
		const decodedToken: JwtPayload = jwt_decode(token);
		const id: any = decodedToken.sub;

		const response = await api.post('/auth/2fa/verify', {
			code: twoFactorAuthCode.value,
			userID: id,
		})

		try {
			if (response.data) {
				const token: any = Cookies.get('token')
				const decodedToken: JwtPayload = jwt_decode(token);
				const id: any = decodedToken.sub;
				
				const res = await api.post('/auth/2fa/authenticate', {
					id: id,
					twoFactorAuth: profileStore.twoFactorAuth
				});

				Cookies.set('token', res.data, { expires: 7 });
				router.push('/login');
			}
			else {
				authCheckPerformed.value = true;
				nbAttempts.value++;
				
				if (nbAttempts.value >= 3) {
					// Start the countdown timer if nbAttempts reaches 3
					startCountdownTimer();
				}
			}

		} catch (error) {
			console.error('Error during 2FA authentication:', error);
			window.location.reload();
		}

	} catch (error) {
		console.error('Error authenticating:', error);
	}
};

</script>

<template>
	<div class="flex justify-center mt-28" :key="updatePage">
		<div class="flex flex-col">
			<input 
				v-model="twoFactorAuthCode" 
				type="text" 
				placeholder=" Enter 2FA Code" 
				class="px-4 py-2 border rounded-lg" 
			
			/>
			<button 
				class="mt-5 px-4 py-2 rounded-lg"
				:disabled="authButtonDisabled || countdownInterval !== null" 
				:class="authButtonClass"
				@click="authenticate"
			>
				{{ authButtonLabel }}
			</button>

			<div v-if="nbAttempts === 3" class="flex mt-2 text-red-500">
				Too many bad attemps, retry in:  
				<div class="mx-2 text-white">{{ countdownTimer }}</div>
				seconds
			</div>
		</div>
	</div>
</template>
