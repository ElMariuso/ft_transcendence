<template>
	<div>
	  <img :src="qrCodeDataUrl" alt="QR Code" />

	</div>
	<input v-model="twoFactorAuthenticationCode" type="text" placeholder="Enter 2FA Code" />
    <button @click="authenticate">Authenticate</button>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

import jwt_decode from 'jwt-decode';

let qrCodeDataUrl = ref('');
let twoFactorAuthenticationCode = ref('');
const token = localStorage.getItem('token');
const id = jwt_decode(token).sub;

const authenticate = () => {
  api.post('/auth/2fa/authenticate', {
    twoFactorAuthenticationCode: twoFactorAuthenticationCode.value,
    userID: id,
  })
    .then(response => {
      // Handle the response from your NestJS API here, e.g., show a message based on the response.
      if (response.data) {
        console.log('Authentication successful');
		console.log(response.data)
      } else {
        console.log('Authentication failed');
      }
    })
    .catch(error => {
      console.error('Error authenticating:', error);
    });
};

onMounted(() => {

	api.get('/auth/2fa/QRcode/' + id, {})
		.then(res => {
			qrCodeDataUrl.value = res.data;
		})
		.catch((error) => {
			console.error('Error fetching QR code:', error);
		}
	);
});
</script>