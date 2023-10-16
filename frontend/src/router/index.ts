
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { useProfileStore } from '../stores/ProfileStore'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import Login2faView from '../views/Login2faView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import SettingsView from '../views/SettingsView.vue';
import QRcodeView from '../views/QRcodeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/login2fa',
      name: 'login2fa',
      component: Login2faView
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
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/QRcode/:id',
      name: 'QRcode',
      component: QRcodeView
    }
  ]
})

async function checkJWT(authStore, profileStore) {
	
	const token = localStorage.getItem('token')
	if (token) {

		let JWT = jwt_decode(token);
		let userID = JWT['sub'];
		let twoFactorAuthEnabled = JWT['twoFactorAuthEnabled'];
		let twoFactorAuthOTP = JWT['twoFactorAuthOTP'];
		
		await axios.get('/auth/jwt/verify', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			if (res.data)
				authStore.validateJWT();
		});
		
		console.log("auth store JWT: " + authStore.JWTisValid)
		if (!authStore.JWTisValid)
			return ;
		
		if (twoFactorAuthEnabled) {
			if (twoFactorAuthOTP) {
				
			}
		}
		
		await axios.get("/users/user/" + userID, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			profileStore.setUsername(res.data.username);
			profileStore.setAvatar(res.data.avatar);
		})

		authStore.authenticate();
	}
}

router.beforeEach((to, from, next) => {
	const authStore = useAuthenticationStore()
	const profileStore = useProfileStore()

	checkJWT(authStore, profileStore).then(() => {
		// Detects if a token exists and verifies it + checks if 2fa enabled
		if (to.name === 'login' && to.query.code !== undefined) {
			localStorage.setItem('token', to.query.code.toString());
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString();
			
			// let JWT = jwt_decode(to.query.code.toString())
			
			
			if (profileStore.twoFactorAuth) {
				return next({ name: 'login2fa' });
			}
			return next({ name: 'home' });
		}
		
		// Guards all views if not authenticated
		else if (to.name !== 'login' && !authStore.authState)
			return next({ name: 'login'});
		next();
	});
})

export default router

