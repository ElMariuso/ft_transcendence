<template>
	<Backdrop>
		<transition name="opacity" mode="out-in" appear>
			<div class="flex flex-col fixed z-50 bg-white p-4 rounded-lg shadow-lg  h-1/3">

				<div class="text-xl font-bold border-b text-black"> Setting up your profile</div>

				<div class="flex flex-row items-baseline mt-3">
					<p class="text-lg font-medium">Username:</p>
					<input v-model="newUsername" type="text" class="ml-5 p-2 w-1/3 border rounded-lg mr-5">
					<button
						@click="checkUsernameAvailability"
						:disabled="!newUsername"
						:class="checkButtonClass"
						class="ml-2 p-2 rounded-lg"
					>
						{{ checkButtonLabel }}
					</button>
				</div>

				<div class="flex flex-row items-baseline justify-between mt-3">
					<p class="text-lg font-medium">Avatar image:</p>
					<input  @change="handleAvatarInputChange" type="file" accept="image/*" class="p-2 w-2/3 border rounded-lg mr-5" ref="avatarInput">
				</div>
				
				<div class="mt-10">
					<button 
						@click="saveSettings"
						:disabled="!userInput"
						:class="{ 'bg-blue-500 text-white': userInput, 'bg-gray-200': !userInput }"
						class="ml-5 text-lg px-4 py-2 border rounded-lg"
					>
						Confirm
					</button>

					<button class="ml-10 text-lg px-4 py-2 border rounded-lg bg-red-500 text-white" @click="closeSettingsModal">
						Skip
					</button>
				</div>
			</div>
		</transition>
	</Backdrop>
</template>

<script setup lang="ts">
import Backdrop from './Backdrop.vue';
import { ref, computed, watch } from 'vue';
import api from '../../services/api';
import { useProfileStore } from '../../stores/ProfileStore';
import { storeToRefs } from 'pinia';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const profileStore = useProfileStore();
const { userID } = storeToRefs(profileStore);

const emit = defineEmits(['closeModal']);
const avatarInput = ref<HTMLInputElement | null>(null);
const newUsername = ref('');
const usernameAvailable = ref(false);
const userInput = ref(false);

const checkButtonLabel = computed(() => {
	if (usernameAvailable.value && userInput.value)
		return 'Available';
	else if (userInput.value)
		return 'Not Available';
	else
		return 'Check Availability';
});

const checkButtonClass = computed(() => {
	if (!newUsername.value)
		return {'bg-gray-300 text-gray-700 cursor-not-allowed': true};
	else if (usernameAvailable.value && userInput.value)
		return {'bg-green-500 text-white': true};
	else if (userInput.value)
		return {'bg-red-500 text-white': true};
	else
		return {'bg-blue-500 text-white': true};
});

watch(newUsername, (newVal: string, oldVal: string) => {
	newVal = newVal.trim();
	oldVal = oldVal.trim();
	if (newVal == '')
		userInput.value = false;
	if (newVal !== '' && oldVal !== '' && newVal !== oldVal)
		userInput.value = false;
});

const handleAvatarInputChange = () => {
	const fileInput = avatarInput.value;
	userInput.value = fileInput?.files && fileInput.files.length > 0;
};

async function checkUsernameAvailability() {
	if (newUsername.value) {	
		console.log('test')
		await api.get('/users/usernames')
		.then(res => {
			if (res.data.includes(newUsername.value))
				usernameAvailable.value = false;
			else
				usernameAvailable.value = true;
			userInput.value = true;
			console.log(usernameAvailable.value)
		});
	}
}


function closeSettingsModal() {
	emit('closeModal')
}

async function saveSettings() {
	let bodyInfo = {};

	// Username
	if (newUsername.value.trim() !== '' && usernameAvailable.value)
		bodyInfo['username'] = newUsername.value;
		
	// Avatar
	if (avatarInput.value?.files[0]) {
		const formData = new FormData();
		formData.append('file', avatarInput.value?.files[0] || '');

		try {
			const response = await api.post('/users/uploadAvatar/' + userID.value, formData, {
				headers: { 'Content-Type': 'multipart/form-data', }
			})
			if (response.data.message === 'Upload Successfully')
				bodyInfo['avatar'] = response.data.path;

		} catch (error) {
			console.error('Avatar upload error:', error);
			return;
		}
	}
		
	// Saving changes, checks if any setting is being changed
	if (Object.keys(bodyInfo).length !== 0) {
		const token = Cookies.get('token');
		let jsonToSend = JSON.stringify(bodyInfo);
		const id = jwt_decode(token).sub;
		
		await api.put('/users/update/' + userID.value, jsonToSend, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json; charset=utf-8',
			},
		}).then(() => {
			profileStore.updateProfile(bodyInfo);
		})
		closeSettingsModal();
	}
}

</script>