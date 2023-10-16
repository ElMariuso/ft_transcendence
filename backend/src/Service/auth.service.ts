import { Injectable } from '@nestjs/common';
import { UserService } from './user.service'
import { CreateUserDTO } from '../DTO/user/createUser.dto'
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UserDTO } from 'src/DTO/user/user.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
	) {}

	jwtVerify(token: string): Promise<boolean> {
		try {
			const res =  this.jwtService.verify(token);
			return res
		} 
		catch {
			return null;
		}
	}

    async login(data): Promise<string> {

        let user = await this.userService
          .findUserById42(data._json.id)
          .catch(() => null);

		if (!user) {
			
			const userDto: CreateUserDTO = {
				username: data._json.login,
				email: data._json.email,
				id42: data._json.id
			};

			user = await this.userService.createUser(userDto);
        }

		return this.jwtService.sign({ 
			sub: user.idUser,
			twoFactorAuthEnabled: user.isTwoFactorAuthEnabled,
			twoFactorAuthOTP: false
		});
    }

	async generateTwoFactorAuthenticationSecret(user: UserDTO) {
		const data : any = {};
		
		const secret: string = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(user.email, 'ft_transcendence', secret);
		data.twoFactorAuthSecret = secret;
		
		
		await this.userService.updateUser(user.idUser, data)
		console.log("Create 2fa " + secret)
		return {
		  secret,
		  otpauthUrl
		}
	}

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async isTwoFactorAuthenticationCodeValid(twoFactorAuthCode: string, userID: number) {


		const user = await this.userService.findUserById(userID);

		console.log("Check 2fa: " + user.twoFactorAuthSecret)
		console.log("code: " + twoFactorAuthCode)
		return authenticator.verify({
		  token: twoFactorAuthCode,
		  secret: user.twoFactorAuthSecret,
		});
	}
}