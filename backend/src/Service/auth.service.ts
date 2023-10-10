import { Injectable } from '@nestjs/common';
import { FT_User } from '../Utils/42user'
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

    async login(data: FT_User): Promise<string> {
        
		let user42Id = parseInt(data.id, 10);

        let user = await this.userService
          .findUserById42(user42Id)
          .catch(() => null);

		if (!user) {
			const userDto: CreateUserDTO = {
				username: data.username,
				email: data.email,
				id42: user42Id
			};

			user = await this.userService.createUser(userDto);
        }

		return this.jwtService.sign({ 
			sub: user.idUser,
		});
    }

	async generateTwoFactorAuthenticationSecret(user: UserDTO) {
		const secret = authenticator.generateSecret();
		
		const otpauthUrl = authenticator.keyuri(user.email, 'ft_transcendence', secret);
		
		// updateUser(id: number, userData: UpdateUserDTO)
		let newUser: UpdateUserDTO;

		await this.userService.setTwoFactorAuthenticationSecret(secret, user.userId);
	
		return {
		  secret,
		  otpauthUrl
		}
	}

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFactorAuthenticationSecret,
		});
	}
}