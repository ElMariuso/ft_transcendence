<template>
	<Backdrop>
		<transition name="opacity" mode="out-in" appear>
			<div class="flex flex-col fixed z-50 bg-white p-4 rounded-lg shadow-lg w-1/2 h-1/2">
				<div class="flex flex-row items-baseline">
					<p class="text-lg font-medium">Username</p>
					<input v-model="newUsername" type="text" class="mt-1 p-2 w-1/3 border rounded-lg mr-5">
				</div>
				<p class="text-lg font-medium">Avatar</p>
				
				<div>
					<!-- <input v-model="twoFactorAuthCode" type="text" placeholder="Enter 2FA Code" class="w-32 mt-1 p-2 text-sm border rounded-lg"/> -->
					<button 
						@click="closeSettingsModal"
						class="ml-5 text-lg px-4 py-2 rounded-lg"
					>
						Check
					</button>
				</div>
			</div>
		</transition>
	</Backdrop>
</template>

<script setup lang="ts">
import Backdrop from './Backdrop.vue';

const emit = defineEmits(['closeModal']);

function closeSettingsModal() {
	console.log('test')
	emit('closeModal')
}
</script>