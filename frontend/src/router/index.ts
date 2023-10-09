
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { useProfileStore } from '../stores/ProfileStore'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import ChannelView from '../views/ChannelView.vue';

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
    },
    {
      path: '/channel/1',
      name: 'channel',
      component: ChannelView
    }
  ]
})

async function checkJWT(authStore, profileStore) {
	const status = {
		isAuth: false,
		jwtValid: false,
	}

	const token = localStorage.getItem('token')
  	status.isAuth = (token !== null)
	if (token) {
		let userID;
		try {

			userID = jwt_decode(token).sub;
		}
		catch (error){
			console.log("jwt decode failed");
		}
		await axios.get("/users/" + userID, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			profileStore.setUsername(res.data.username);
			profileStore.setAvatar(res.data.avatar);
		})

		// Handle 2FA
		let TwoFactorAuthEnabled
		try {

			TwoFactorAuthEnabled = jwt_decode(token).TwoFactorAuthEnabled;
		}
		catch {
			console.log("jwt decode failed");
		}
		if (TwoFactorAuthEnabled) {
			await axios.get('/auth/jwt/verify', {
				headers: {
					Authorization: 'Bearer ' + token
				}
			}).then(res => {
				status.jwtValid = res.data;
			});
			if (status.jwtValid)
				console.log(status.jwtValid)
			// redirect to auth/2fa
			// get a new jwt token
		}
		authStore.authState = true;
		return status
	}
	return status;
}

router.beforeEach((to, from, next) => {
	const authStore = useAuthenticationStore()
	const profileStore = useProfileStore()

	checkJWT(authStore, profileStore).then(Status => {
		// Detects if a token exists and verifies it + checks if 2fa enabled
		if (to.name === 'login' && to.query.code !== undefined) {
			localStorage.setItem('token', to.query.code.toString());
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString();
			
			let jwtDecoded;
			try {
				jwtDecoded = jwt_decode(to.query.code.toString())
			} catch {
				console.log("jwt decode failed");
			}
				
			const TwoFactorAuthEnabled = jwtDecoded['TwoFactorAuthEnabled'];
			
			if (TwoFactorAuthEnabled) {
				return next({ name: '2fa' });
				
			}
			return next({ name: 'home' });
		}
		
		// Guards all views if not authenticated
		else if (to.name !== 'login' && !Status.isAuth)
			return next({ name: 'login'});

		next();
	});
})

export default router

