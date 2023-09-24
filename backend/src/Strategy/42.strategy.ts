import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
// import { AuthService } from '../Service/auth.service';

@Injectable()
export class FT_Strategy extends PassportStrategy(Strategy) {
  constructor() { //private readonly authService: AuthService
    super({
        clientID: process.env.FT_ID,
        clientSecret: process.env.FT_SECRET,
        callbackURL: process.env.AUTH_CALLBACK,
    });
  }

  // validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: FT_User,
  // ): FT_User {
  //   return profile;
  // }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    done(null, profile);
  }
}