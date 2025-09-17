import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenBlacklistService } from './token-blacklist.service';

function getBearer(req: any): string | null {
    const h = req?.headers?.authorization || '';
    const [type, token] = h.split(' ');
    return type?.toLowerCase() === 'bearer' && token ? token : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private blacklist: TokenBlacklistService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            ignoreExpiration: false,
            PassportStrategy: true,
        });
    }

    async validate(req: any, payload: any) {
        const token = getBearer(req);
        if (!token) throw new UnauthorizedException('Token manquant');

        // Refus si black-listé
        const isRevoked = await this.blacklist.has(token);
        if (isRevoked) throw new UnauthorizedException('Token révoqué');
        
        return payload; // sera injecté dans req.user
    }
}
