<template>
	<Backdrop>
		<transition name="opacity" mode="out-in" appear>
			<div class="flex flex-col fixed z-50 bg-white p-4 rounded-lg shadow-lg">
				<p class="text-lg font-medium">1. Install the 'Google Authenticator' app</p>
				<p class="text-lg font-medium">2. Scan the QR Code</p>
				<p class="text-lg font-medium">3. Test your 2fa code</p>
				<img :src="qrCodeDataUrl" alt="QR Code"  />
				<div>
					<input v-model="twoFactorAuthCode" type="text" placeholder="Enter 2FA Code" class="w-32 mt-1 p-2 text-sm border rounded-lg"/>
					<button 
						@click="() => twoFactorAuthTest(resolve)"
						:disabled="checkTwoFactorAuthDisabled || countdownInterval !== null" 
						:class="test2faClass"
						class="ml-5 text-lg px-4 py-2 rounded-lg"
					>
						Check
					</button>
					
					<button @click="() => cancelModal(resolve)" class="ml-5 text-lg text-white bg-red-500 px-4 py-2 rounded-lg">Cancel</button>
				</div>

				<div v-if="nbAttempts === 3" class="flex mt-2 text-red-500">
					Too many bad attemps, retry in:  
					<div class="mx-2 text-black">{{ countdownTimer }}</div>
					seconds
				</div>

			</div>
		</transition>
	</Backdrop>
</template>
  
<script setup lang="ts">
	import { ref, onMounted, watch, computed, Ref } from 'vue';
	import Cookies from 'js-cookie';
	import api from '../../services/api';
	import jwt_decode, {JwtPayload}  from 'jwt-decode';
	import Backdrop from './Backdrop.vue';

	const emit = defineEmits(['closeModal', 'cancelModal']);
	const { resolve } = defineProps(['resolve']);
	const qrCodeDataUrl = ref('');
	const twoFactorAuthCode: Ref<string> = ref('');

	const nbAttempts = ref(0);
	const countdownTimer = ref(60); // Initial countdown time in seconds
	let countdownInterval: number | null = null;	

	const token: any = Cookies.get('token');
	const decodedToken: JwtPayload = jwt_decode(token);
	const id: any = decodedToken.sub;

	const checkTwoFactorAuthDisabled = ref(true);
	const checkTwoFactorAuthPerformed = ref(false);

	const test2faClass = computed(() => {
		if (checkTwoFactorAuthDisabled.value || countdownInterval !== null)
			return {'bg-gray-300 text-gray-700 cursor-not-allowed': true};
		else if (checkTwoFactorAuthPerformed.value && !checkTwoFactorAuthDisabled.value)
			return {'bg-red-500 text-white': true};
		else
			return {'bg-blue-500 text-white': true};
    });

	watch(twoFactorAuthCode, (newVal, oldVal) => {
		newVal = newVal.trim();
		oldVal = oldVal.trim();
		
		if (newVal === '')
			checkTwoFactorAuthDisabled.value = true;
		else if (oldVal === '' && newVal !== '')
			checkTwoFactorAuthDisabled.value = false;
		else if (newVal !== '' && oldVal !== '' && newVal !== oldVal) {
			checkTwoFactorAuthDisabled.value = false;
			checkTwoFactorAuthPerformed.value = false;
      }
    });

	function cancelModal(resolve: any) {
		resolve(false);
		emit('cancelModal')
	}

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

  	async function twoFactorAuthTest(resolve: (value: boolean) => void) {
		try {
			const response = await api.post('/auth/2fa/verify', {
				code: twoFactorAuthCode.value,
				userID: id,
			})
			if (response.data) {
				resolve(true);
				emit('closeModal')
			}
			checkTwoFactorAuthPerformed.value = true;
			nbAttempts.value++;
			
			if (nbAttempts.value >= 3) {
				// Start the countdown timer if nbAttempts reaches 3
				startCountdownTimer();
			}
		} catch (error) {
			console.error('Error authenticating:', error);
  		}
	};
  
	onMounted(async () => {
		try {
			const res = await api.get('/auth/2fa/QRcode/' + id, {});
			qrCodeDataUrl.value = res.data;
		} catch (error) {
			console.error('Error fetching QR code:', error);
		}
	});
</script>