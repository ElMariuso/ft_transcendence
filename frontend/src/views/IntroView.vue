<script setup lang="ts">
import { useProfileStore } from '@/stores/ProfileStore';
import { storeToRefs } from 'pinia'

import { ref, watch} from 'vue';

const profileStore = useProfileStore();
const {avatarUpdated} = storeToRefs(profileStore)

const reloadKey = ref(0);
// watch(avatarUpdated, async () => {

// 		window.location.reload();
// })

// window.location.reload();
// if (reloadKey.value === 0) {
// 	window.location.reload();
// 	reloadKey.value++;
// }
// watch(avatarUpdated, async () => {
// 	if (avatarUpdated.value) {
// 		// window.location.reload();
// 		// avatarUpdated.value = false;
// 	}
// })

</script>

<template>
	<div class="text-3xl m-0 leading-none mr-5 mx-auto">
		Welcome to ft_transcendence !
	</div>
	<img src="../../Images/pong.jpeg" alt="avatar" class="mt-14 mx-auto">
</template>