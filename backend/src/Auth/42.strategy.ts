import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

export class FT_strategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        // super == Executes constructor of base class
        super({
            clientID: process.env.FT_CLIENT_ID,
            clientSecret: process.env.FT_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/redirect"
            // "http://localhost:8080/test"
            // `${process.env.HOST_BACK}/api/auth/redirect`,
          });
    }

    // async validate(
    //     accessToken: string,
    //     refreshToken: string,
    //     profile: any,
    //     done: any,
    //   ) {
    //     done(null, profile);
    //   }
}
