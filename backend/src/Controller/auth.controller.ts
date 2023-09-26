import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import axios from 'axios';
import { FT_AuthGuard } from '../Guards/42-auth.guard';
import { Public } from '@prisma/client/runtime/library';
import { FT_User } from '../Utils/42user'
import { AuthService } from '../Service/auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	  ) {}

	// @Public() Needed ??
	@UseGuards(FT_AuthGuard)
	@Get('/42/redirect')
	async login(@Req() req, @Res() res) {
		const token = await this.authService.login(req.user as FT_User);
		
		console.log("JWT TOKEN: " + token)

		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = "8080";
		url.pathname = 'login';
		url.searchParams.set('code', token);

		res.status(302).redirect(url.href);
	}
}
