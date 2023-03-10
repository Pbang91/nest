import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';
import { UserInfo } from 'src/users/UserIfno';

@Injectable()
export class AuthService {
    constructor(
        @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
    ) {}

    login(user: UserInfo) {
        const payload = { ...user };

        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: '1d',
            audience: 'example.com',
            issuer: 'example.com'
        });
    }

    verify(jwtString: string) {
        try {
            const payload = jwt.verify(jwtString, this.config.jwtSecret) as (jwt.JwtPayload | string) & UserInfo;

            const { id, email } = payload;

            return {
                userId: id,
                email
            }  
        } catch (e) {
            throw new UnauthorizedException()
        }
    }

    async validatePassword(password: string, hashedPassword: string){
        const validateResult = await bcrypt.compare(password, hashedPassword)

        return validateResult
    }

    async transformPassword(password: string) {
        const hashedPassword = await bcrypt.hash(password, 10,);

        return hashedPassword
    }
}
