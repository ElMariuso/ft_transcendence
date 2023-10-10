<template>
	<div>
	  <img :src="qrCodeDataUrl" alt="QR Code" />

	</div>
	<p>

	</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

let qrCodeDataUrl = ref('');
const token = localStorage.getItem('token');
const id = jwt_decode(token).sub;
onMounted(() => {

	axios.get('/auth/2fa/QRcode/' + id, {})
		.then(res => {
			qrCodeDataUrl.value = res.data;
			console.log(qrCodeDataUrl)
		})
		.catch((error) => {
			console.error('Error fetching QR code:', error);
		}
	);
});
</script>