
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { useProfileStore } from '../stores/ProfileStore'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import SettingsView from '../views/SettingsView.vue';

import { checkJWT } from '@/services/auth-helpers';

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
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
})

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

