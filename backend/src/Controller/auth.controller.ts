import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FT_AuthGuard } from '../Guards/42-auth.guard';
import { AuthService } from '../Service/auth.service';
import { UserService } from '../Service/user.service';
import { toDataURL } from 'qrcode';


@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@UseGuards(FT_AuthGuard)
	@Get('/42/redirect')
	async login(@Req() req, @Res() res) {
		const token = await this.authService.login(req.user);

		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = "8080";
		url.pathname = 'login';
		url.searchParams.set('code', token);

		res.status(302).redirect(url.href);
	}

	@Get('/jwt/verify')
	jwtVerify(@Req() req) {
		if (!req.headers.authorization) 
			return false;
		
		const token = req.headers.authorization.split(' ')[1];
		const payload = this.authService.jwtVerify(token);
		return payload;
	}

	
	@Get('/2fa/QRcode/:id')
	async generateQRcode(@Param('id') id: string) {

		let newId = parseInt(id, 10);

		const user = await this.userService.findUserById(newId)
		const res = await this.authService.generateTwoFactorAuthenticationSecret(user);
		
		// toDataURL(res.otpauthUrl)
		return toDataURL(res.otpauthUrl);
	}

	@Post('/2fa/test')
	async twoFactorAuthLogin(@Req() req, @Body() body) {
		console.log("Body code" + body.code);
		const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(body.code, body.userID)
		
		console.log("Check 2fa: " + isCodeValid)
		return (isCodeValid);
	}
}
