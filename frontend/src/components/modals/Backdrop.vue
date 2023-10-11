<template>
	<div class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg backdrop-filter backdrop-saturate-150">
	  <slot></slot>
	</div>
  </template>
  
  <script>
  export default {
	name: 'Backdrop',
  };
  </script>