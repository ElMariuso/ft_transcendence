
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';

import AboutView from '../views/AboutView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/community',
      name: 'community',
      component: CommunityView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
})

router.beforeEach((to, from) => {

	const status = {
		isAuthenticated: false,
	}

	const token = localStorage.getItem('token')
  	status.isAuthenticated = (token !== null)
	if (token) {
		// Handle 2FA
		const TwoFactorAuthEnabled = jwt_decode(token).TwoFactorAuthEnabled;
		if (TwoFactorAuthEnabled) {
			// redirect to auth/2fa
			// get a new jwt token
		}
	
	}

	if (to.name === 'login' && to.query.code !== undefined) {
		localStorage.setItem('token', to.query.code.toString());
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString();
		return { name: 'home' };
	}

	if (to.name !== 'login' && !status.isAuthenticated) {
		return { name: 'login'};
	}
})

export default router
