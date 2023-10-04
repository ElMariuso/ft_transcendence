<!-- WIP: AVATAR + BACKEND API -->
<template>
  <div class="p-4">
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
    </div>
  </div>
</template>


<script>
import { ref, watch, computed } from 'vue';
import { useProfileStore } from '../stores/ProfileStore'
import axios from 'axios';

export default {

  setup() {
  // Store
    const profileStore = useProfileStore();

  // Variables
    const newUsername = ref('');
    const usernameAvailable = ref(false);
    const usernameCheckPerformed = ref(false);
    const checkButtonDisabled = ref(true);
    const twoFactorAuth = ref(profileStore.twoFactorAuth);
    const newAvatar = ref('');

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

    function checkUsernameAvailability() {
      if (!checkButtonDisabled.value) {

		// API ROUTE NEEDS TO BE IMPLEMENTED
        // axios.get(`/checkUsernameAPI/${newUsername.value}`).then(res => {
        //     // Either new api route, or use getAllUsers and perform check here
        //     usernameCheckPerformed.value = true;
        //     // If username found: 
        //     usernameAvailable.value = false;
        //     // else
        //     // usernameAvailable.value = true;
        //   });
          
          // Testing
          usernameCheckPerformed.value = true;
          usernameAvailable.value = true;
      }
    }

	function enableTwoFactorAuth() {
      twoFactorAuth.value = true;
    }

    function disableTwoFactorAuth() {
      twoFactorAuth.value = false;
    }

    // WIP
    function handleAvatarChange() {
      newAvatar.value = "/newAvatarImgPath/";
    }

    async function saveSettings() {
      let bodyInfo = {};

      if (!saveButtonDisabled.value) {
        // username
        if (newUsername.value.trim() !== '' && usernameAvailable.value) {
          bodyInfo['username'] = newUsername.value;
        }
        
        // avatar
        // if () {
			// 1. bodyInfo['avatar'] = newAvatar.value;
			// 2. Post img to upload folder
		// }

        // 2fa
        // if (twoFactorAuth.value !== profileStore.twoFactorAuth)
        //  bodyInfo['isTwoFactorAuth'] = twoFactorAuth.value;
       
        const token = localStorage.getItem('token');

        let jsonToSend = JSON.stringify(bodyInfo);
        await axios.put('/users/update/' + profileStore.userID.value, jsonToSend, {
          headers: {
            Authorization: 'Bearer ' + token
          },

        });

      }
    }

   
    

    return {
      // Variables
      newUsername,
      usernameAvailable,
      usernameCheckPerformed,
      checkButtonDisabled,
      twoFactorAuth,
      newAvatar,
      checkButtonLabel,
      checkButtonClass,
      saveButtonDisabled,
      saveButtonClass,
      
      // Methods
      checkUsernameAvailability,
      saveSettings,
      enableTwoFactorAuth,
      disableTwoFactorAuth,
      handleAvatarChange,
    };
  },
};
</script>