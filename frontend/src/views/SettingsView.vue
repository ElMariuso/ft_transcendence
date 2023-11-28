<template>
<div class="p-4">

	<!-- Popup -->
	<div v-if="popupVisible" class="fixed right-4 top-20 border p-4 bg-white rounded-lg shadow-lg">
		{{ popupMessage }}
	</div>

    <h2 class="text-lg font-semibold mb-4">Profile Settings</h2>
    <div class="flex flex-col">
    
		<!-- Username Input -->
		<div class="mb-4">
			<label  class="block text-sm font-medium text-gray-700 mr-5">Change username:</label>
			<div class="flex items-baseline">
			<input v-model="newUsername" type="text" class="mt-1 p-2 w-1/3 border rounded-lg mr-5">
			<button
				@click="checkUsernameAvailability" 
				:disabled="checkButtonDisabled"
				:class="checkButtonClass"
				class="ml-2 px-4 py-2 rounded-lg"
			>
				{{ checkButtonLabel }}
			</button>
			</div>
		</div>

		<!-- Avatar Input -->
		<div class="mb-4">
			<label  class="block text-sm font-medium text-gray-700">Upload new avatar image:</label>
			<input @change="handleAvatarChange" type="file" accept="image/*" class="mt-1 p-2 w-1/3 border rounded-lg mr-5" ref="fileInput">
			<button 
				@click="clearAvatarInput"
				class="ml-2 px-4 py-2 rounded-lg bg-red-500 text-white"
			>
				Clear Input
			</button>
		</div>

		<!-- Two-Factor Authentication Toggle -->
		<div class="mb-4">
			<label class="block text-sm font-medium text-gray-700">Two-Factor Authentication:</label>
			
				<div class="flex space-x-4 mt-1">
			<button
				:class="{ 'bg-blue-500 text-white': twoFactorAuth, 'bg-gray-200': !twoFactorAuth }"
				@click="enableTwoFactorAuth"
				class="px-4 py-2 rounded-lg"
			>
				Enabled
			</button>

			<button
				:class="{ 'bg-blue-500 text-white': !twoFactorAuth, 'bg-gray-200': twoFactorAuth }"
				@click="disableTwoFactorAuth"
				class="px-4 py-2 rounded-lg"
			>
				Disabled
			</button>
			</div>
		</div>

		<TwoFactorAuthModal 
			v-if="showTwoFactorAuthModal" 
			@closeModal="closeTwoFactorAuthModal"
			@cancelModal="cancelTwoFactorAuthModal"
			:resolve="twoAuthRes"
		/>


		<!-- Save and Cancel Buttons -->
		<div class="flex mt-6">
			<button 
			@click="saveSettings" 
			:disabled="saveButtonDisabled" 
			:class="saveButtonClass"
			class="px-4 py-2 rounded-lg"
			>
			Save
			</button>
        	<button @click="" class="ml-5 text-gray-600 bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
      	</div>

    </div>
</div>
</template>

<script setup lang="ts">

import { ref, watch, computed } from 'vue';
import { useProfileStore } from '../stores/ProfileStore'
import api from '../services/api';
import jwt_decode, {JwtPayload } from 'jwt-decode';
import TwoFactorAuthModal from '../components/modals/TwoFactorAuthModal.vue';
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie';

// Store ***************************************************************************

const profileStore = useProfileStore();
const { username, avatar, avatarUpdated } = storeToRefs(profileStore)

// Username ***************************************************************************

const newUsername = ref('');
const usernameAvailable = ref(false);
const usernameCheckPerformed = ref(false);
const checkButtonDisabled = ref(true);

const checkButtonLabel = computed(() => {
	if (usernameAvailable.value && usernameCheckPerformed.value)
		return 'Available';
	else if (usernameCheckPerformed.value)
		return 'Not Available';
	else
		return 'Check Availability';
});

const checkButtonClass = computed(() => {
	if (checkButtonDisabled.value)
		return {'bg-gray-300 text-gray-700 cursor-not-allowed': true};
	else if (usernameAvailable.value && usernameCheckPerformed.value)
		return {'bg-green-500 text-white': true};
	else if (usernameCheckPerformed.value)
		return {'bg-red-500 text-white': true};
	else
		return {'bg-blue-500 text-white': true};
});

watch(newUsername, (newVal: string, oldVal: string) => {
	newVal = newVal.trim();
	oldVal = oldVal.trim();
	if (newVal === '')
		checkButtonDisabled.value = true;
	else if (oldVal === '' && newVal !== '')
		checkButtonDisabled.value = false;
	else if (newVal !== '' && oldVal !== '' && newVal !== oldVal) {
		checkButtonDisabled.value = false;
		usernameCheckPerformed.value = false;
	}
});

async function checkUsernameAvailability() {
	if (!checkButtonDisabled.value) {		
		await api.get('/users/usernames')
		.then(res => {
			if (res.data.includes(newUsername.value))
				usernameAvailable.value = false;
			else
				usernameAvailable.value = true;
			usernameCheckPerformed.value = true;
		});
	}
}

// Avatar ***************************************************************************

const fileInput = ref<HTMLInputElement | null>(null);
const avatarImgChanged = ref(false);

function handleAvatarChange() {
	avatarImgChanged.value = true;
}

function clearAvatarInput() {
	if (fileInput.value)
    	fileInput.value.value = '';
	avatarImgChanged.value = false;
}

// Two Factor Auth ***************************************************************************

const twoFactorAuth = ref(profileStore.twoFactorAuth);
const twoAuthRes = ref<((value: boolean | null) => void) | null>(null);
const showTwoFactorAuthModal = ref(false);

function enableTwoFactorAuth() {
	twoFactorAuth.value = true;
}

function disableTwoFactorAuth() {
	twoFactorAuth.value = false;
}

async function openTwoFactorAuthModal() {
	return new Promise<boolean>(async (resolve) => {
		twoAuthRes.value = resolve as (value: boolean | null) => void;;
		showTwoFactorAuthModal.value = true;
	})
}

function cancelTwoFactorAuthModal() {
	twoFactorAuth.value = false;
	showTwoFactorAuthModal.value = false;
}

function closeTwoFactorAuthModal() {
	showTwoFactorAuthModal.value = false;
}

// Save && Popups ***************************************************************************

const saveButtonDisabled = computed(() => {
	return newUsername.value.trim() !== '' && !usernameCheckPerformed.value;
});

const saveButtonClass = computed(() => {
	if (saveButtonDisabled.value)
		return {'bg-gray-300 text-gray-700 cursor-not-allowed': true};
	else
		return {'bg-blue-500 text-white': true};
});

const popupVisible = ref(false);
const popupMessage = ref('');	

function showPopup(msg: string) {
	popupMessage.value = msg;
	popupVisible.value = true;

	// Automatically hide the popup after 3 seconds
	setTimeout(() => {
		popupVisible.value = false;
	}, 3000);
}

async function saveSettings() {
	let bodyInfo: any = {};

	if (!saveButtonDisabled.value) {

		// Username
		if (newUsername.value.trim() !== '' && usernameAvailable.value)
			bodyInfo['username'] = newUsername.value;
		
		// Avatar
		if (avatarImgChanged.value) {
			const formData = new FormData();
			if (fileInput.value && fileInput.value.files && fileInput.value.files.length > 0)
      			formData.append('file', fileInput?.value.files[0] || '');

			try {
				const response = await api.post('/users/uploadAvatar/' + profileStore.userID, formData, {
					headers: { 'Content-Type': 'multipart/form-data', }
				})
				if (response.data.message === 'Upload Successfully')
					bodyInfo['avatar'] = response.data.path;

			} catch (error) {
				console.error('Avatar upload error:', error);
				return;
      		}
		}

		// Two Factor Auth
		if (twoFactorAuth.value !== profileStore.twoFactorAuth) {
			if (twoFactorAuth.value) {
				try {
					const modalResolve = await openTwoFactorAuthModal();
					if (modalResolve)
						bodyInfo['isTwoFactorAuthEnabled'] = true;
					else
						twoFactorAuth.value = false;
				} catch (error) {
					console.error('Two-factor auth modal error:', error);
					return;
				}
			}
			else
				bodyInfo['isTwoFactorAuthEnabled'] = twoFactorAuth.value;
		}
		
		// Saving changes, checks if any setting is being changed
		if (Object.keys(bodyInfo).length !== 0) {
			const token: any = Cookies.get('token');
			const decodedToken: JwtPayload = jwt_decode(token);
			let jsonToSend = JSON.stringify(bodyInfo);
			const id: any = decodedToken.sub;
			
			await api.put('/users/update/' + id, jsonToSend, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json; charset=utf-8',
				},
			}).then(() => {
				profileStore.updateProfile(bodyInfo);
			})
			
			newUsername.value = '';
			clearAvatarInput();

			showPopup('Profile changes saved');
		}
		else
			showPopup('No profile changes found');
	}
}
</script>
