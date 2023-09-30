
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { useProfileStore } from '../stores/ProfileStore'

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import ProfileSetupView from '../views/ProfileSetupView.vue';

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
      path: '/profileSetup',
      name: 'profileSetup',
      component: ProfileSetupView
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
		const userID = jwt_decode(token).sub;
		await axios.get("/users/" + userID, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(res => {
			profileStore.setUsername(res.data.username);
			profileStore.setAvatar(res.data.avatar);
		})

		// Handle 2FA
		const TwoFactorAuthEnabled = jwt_decode(token).TwoFactorAuthEnabled;
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
			
			const jwtDecoded = jwt_decode(to.query.code.toString())
			const TwoFactorAuthEnabled = jwtDecoded['TwoFactorAuthEnabled'];
			
			if (TwoFactorAuthEnabled) {
				// authStore.authState = true;
				return next({ name: '2fa' });
				
			}
			// authStore.authState = true;
			return next({ name: 'home' });
		}
		
		// Guards all views if not authenticated
		else if (to.name !== 'login' && !Status.isAuth) {
			return next({ name: 'login'});
		}

		next();
	});
})

export default router

