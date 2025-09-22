import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenBlacklistService } from './token-blacklist.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly accessSecret: string;
    constructor(
        private configService: ConfigService,
        private blacklist: TokenBlacklistService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('auth.accessToken'),
            ignoreExpiration: false,
            PassportStrategy: true,
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: any) {
        if (!req) throw new UnauthorizedException('Requête introuvable');
        // Récupère le token brut pour vérifier la blacklist
        const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
        const token = extractor(req);
        if (!token) throw new UnauthorizedException('Token manquant');

        const isRevoked = await this.blacklist.has(token);
        if (isRevoked) throw new UnauthorizedException('Token révoqué');

        // payload doit contenir au moins { sub, role, email }
        return payload; // attaché à req.user
    }
}
