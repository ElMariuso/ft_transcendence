<template>
	<div class="flex justify-center">
		<a 
			:href="url" 
			class="
				mt-28
				text-black-500 font-bold text-2xl
				py-2 px-4 rounded border-2 border-black 
				hover:bg-blue-400
			"
		>
			<span>42 Login</span>
		</a>
	</div>
</template>
  
<script>
	export default {
		data() {
			return {
			url: "http://localhost:3000/auth/42/redirect",
			};
		},
	};
</script>