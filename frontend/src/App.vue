<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import axios from 'axios';
import HelloWorld from './components/HelloWorld.vue'

export default {
  components: {
    HelloWorld
  },
  data() {
    return {
      posts: []
    };
  },
  created() {
    axios.get('https://jsonplaceholder.typicode.com/posts').then(response => {
      this.posts = response.data;
    });
  }
};
</script>

<style>
@import './assets/styles.css';
</style>
