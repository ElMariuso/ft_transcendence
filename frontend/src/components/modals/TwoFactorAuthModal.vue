<template>
	<Backdrop>
		<transition name="opacity" mode="out-in" appear>
			<div class="flex flex-col fixed z-50 bg-white p-4 rounded-lg shadow-lg">
				<p class="text-lg font-medium">1. Install the 'Google Authenticator' app</p>
				<p class="text-lg font-medium">2. Scan the QR Code</p>
				<p class="text-lg font-medium">3. Test the two factor authentification</p>
				<img :src="qrCodeDataUrl" alt="QR Code"  />
				<div>
					<input v-model="twoFactorAuthenticationCode" type="text" placeholder="Enter 2FA Code" class="w-32 mt-1 p-2 text-sm border rounded-lg"/>
					<button 
						@click="twoFactorAuthTest"
						:disabled="test2faDisabled" 
						:class="test2faClass"
						class="ml-5 text-lg px-4 py-2 rounded-lg"
					>
						Test
					</button>
					
					<button @click="" class="ml-5 text-lg text-white bg-red-500 px-4 py-2 rounded-lg">Cancel</button>
				</div>
			</div>
		</transition>
	</Backdrop>
</template>
  
<script setup>
	import { ref, onMounted, watch, computed } from 'vue';
	import axios from 'axios';
	import jwt_decode from 'jwt-decode';
	import Backdrop from './Backdrop.vue';

	const qrCodeDataUrl = ref('');
	const twoFactorAuthenticationCode = ref('');
	const token = localStorage.getItem('token');
	const id = jwt_decode(token).sub;
	// const resolve = defineProps().resolve;
	const test2faDisabled = ref(true);
	

	const test2faClass = computed(() => {
      if (test2faDisabled.value)
        return {'bg-gray-300 text-gray-700 cursor-not-allowed': true};
      else
        return {'bg-blue-500 text-white': true};
    });

	watch(twoFactorAuthenticationCode, (newVal) => {
      newVal = newVal.trim();
    //   oldVal = oldVal.trim();
      if (newVal !== '')
	  	test2faDisabled.value = false;
	else 
		test2faDisabled.value = true;
		
    //   else if (oldVal === '' && newVal !== '')
    //     checkButtonDisabled.value = false;
    //   else if (newVal !== '' && oldVal !== '' && newVal !== oldVal) {
    //     checkButtonDisabled.value = false;
    //     usernameCheckPerformed.value = false;
    //   }
    });

  	const twoFactorAuthTest = () => {
		axios
		.post('/auth/2fa/authenticate', {
			twoFactorAuthenticationCode: twoFactorAuthenticationCode.value,
			userID: id,
		})
		.then(response => {
			// if (response.data)
			// 	resolve(true);
		})
    	.catch(error => {
      		console.error('Error authenticating:', error);
    	});
	};
  
	onMounted(async () => {
		try {
			const res = await axios.get('/auth/2fa/QRcode/' + id, {});
			qrCodeDataUrl.value = res.data;
		} catch (error) {
			console.error('Error fetching QR code:', error);
		}
	});
</script>