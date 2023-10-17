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
        <input @change="handleAvatarChange" type="file" accept="image/*" class="mt-1 p-2 w-1/3 border rounded-lg">
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

      <TwoFactorAuthModal 
	  	v-if="showTwoFactorAuthModal" 
		@closeModal="closeTwoFactorAuthModal"
		@cancelModal="cancelTwoFactorAuthModal"
		:resolve="twoAuthRes"
		/>

    </div>
  </div>

</template>


<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useProfileStore } from '../stores/ProfileStore'
import api from '../services/api';
import jwt_decode from 'jwt-decode';
import TwoFactorAuthModal from '../components/modals/TwoFactorAuthModal.vue';
import { useRouter } from 'vue-router';

const profileStore = useProfileStore();

const router = useRouter();

const newUsername = ref('');
const usernameAvailable = ref(false);
const usernameCheckPerformed = ref(false);
const checkButtonDisabled = ref(true);

console.log("val " + profileStore.twoFactorAuth)
const twoFactorAuth = ref(profileStore.twoFactorAuth);
const showTwoFactorAuthModal = ref(false);
const twoAuthRes = ref(false);

const newAvatar = ref('');

const popupVisible = ref(false);
const popupMessage = ref('');


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

		const saveButtonDisabled = computed(() => {
		return newUsername.value.trim() !== '' && !usernameCheckPerformed.value;
		});

		const saveButtonClass = computed(() => {
		if (saveButtonDisabled.value)
			return {'bg-gray-300 text-gray-700 cursor-not-allowed': true};
		else
			return {'bg-blue-500 text-white': true};
		});

  	// Methods
	  	// async function setupProfile() {
		// 	await profileStore.setupProfile();
		// }

		function showPopup(msg) {
			popupMessage.value = msg;
			popupVisible.value = true;

			// Automatically hide the popup after 3 seconds (adjust the timing as needed)
			setTimeout(() => {
				popupVisible.value = false;
			}, 3000);
		}

		watch(newUsername, (newVal, oldVal) => {
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
				await api.get('/users/usernames').then(res => {
					if (res.data.includes(newUsername.value))
						usernameAvailable.value = false;
					else
						usernameAvailable.value = true;
					usernameCheckPerformed.value = true;
				});

			}
		}

		function enableTwoFactorAuth() {
			twoFactorAuth.value = true;
		}

		function disableTwoFactorAuth() {
			twoFactorAuth.value = false;
		}

		async function openTwoFactorAuthModal() {
			return new Promise(async (resolve) => {
				twoAuthRes.value = resolve;
				showTwoFactorAuthModal.value = true;
			})
		
			// bodyInfo['isTwoFactorAuthEnabled'] = true;
		}

		function cancelTwoFactorAuthModal() {
			twoFactorAuth.value = false;
			showTwoFactorAuthModal.value = false;
		}
	
		function closeTwoFactorAuthModal() {
			showTwoFactorAuthModal.value = false;
		}

    // WIP
    function handleAvatarChange() {
      newAvatar.value = "/newAvatarImgPath/";
    }

		async function saveSettings() {
			let bodyInfo = {};

			if (!saveButtonDisabled.value) {

				if (newUsername.value.trim() !== '' && usernameAvailable.value)
					bodyInfo['username'] = newUsername.value;
				
				// avatar
				// if () {
				// 1. bodyInfo['avatar'] = newAvatar.value;
				// 2. Post img to upload folder
				// }

				if (twoFactorAuth.value !== profileStore.twoFactorAuth) {
					if (twoFactorAuth.value) {
						try {
							const modalResolve = await openTwoFactorAuthModal();
							console.log(modalResolve)
							// showTwoFactorAuthModal.value = false;
							if (modalResolve)
								bodyInfo['isTwoFactorAuthEnabled'] = true;
							else
								twoFactorAuth.value = false;
							// 	else {
							// 	// Handle if the user cancels Two-Factor Authentication setup
							// 	return;
							// }
						} catch (error) {
							console.error('Two-factor auth modal error:', error);
							return;
						}
					}
					else
						bodyInfo['isTwoFactorAuthEnabled'] = twoFactorAuth.value;
				}
				
				// Checks if any setting is being changed
				if (Object.keys(bodyInfo).length !== 0) {

					console.log("Changing user")
					const token = localStorage.getItem('token');
					let jsonToSend = JSON.stringify(bodyInfo);
					const id = jwt_decode(token).sub;
					
					await api.put('/users/update/' + id, jsonToSend, {
						headers: {
							Authorization: 'Bearer ' + token,
							'Content-Type': 'application/json; charset=utf-8',
						},
					});
					profileStore.setupProfile();
					newUsername.value = '';
					showPopup('Profile changes saved');
				}
				else {
					showPopup('No profile changes found');
				}
			}
		}
</script>
