import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { Model, Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema';
import { ConfigService } from '@nestjs/config';


const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

@Injectable()
export class RefreshTokensService {
    private readonly refreshSecret: string;
    private readonly refreshExpiresIn: string;

    constructor(
        private configService: ConfigService,
        private jwt: JwtService,
        @InjectModel(RefreshToken.name) private model: Model<RefreshTokenDocument>,
    ) {
        this.refreshSecret = this.configService.get('auth.refreshToken')!
        this.refreshExpiresIn = this.configService.get('auth.refreshIn')!
    }

    private cookieOptions(expiresAt: Date) {
        const secure = String(this.configService.get('auth.cookieSecure')).toLowerCase() === 'true';
        const domain = this.configService.get('auth.cookieDomain') || undefined;
        return {
            httpOnly: true,
            secure,
            sameSite: secure ? ('none' as const) : ('lax' as const),
            domain,
            path: '/api/auth',
            expires: expiresAt,
        };
    }

    async generate(userId: string, meta?: { ua?: string; ip?: string }) {
        const payload = { sub: userId, typ: 'refresh' };
        const token = this.jwt.sign(payload, { secret: this.refreshSecret, expiresIn: this.refreshExpiresIn });
        const decoded: any = this.jwt.decode(token);
        const exp = decoded?.exp as number;
        if (!exp) throw new Error('No exp in refresh token');
        const expiresAt = new Date(exp * 1000);
        const tokenHash = sha256(token);

        await this.model.create({
            tokenHash,
            userId: new Types.ObjectId(userId),
            expiresAt,
            userAgent: meta?.ua,
            ip: meta?.ip,
        });

        return { token, expiresAt, cookie: this.cookieOptions(expiresAt) };
    }

    async verifyAndRotate(oldToken: string, userIdHint?: string, meta?: { ua?: string; ip?: string }) {
        let payload: any;
        try {
            payload = this.jwt.verify(oldToken, { secret: this.refreshSecret });
        } catch {
            throw new UnauthorizedException('Refresh token invalide/expiré');
        }

        const hash = sha256(oldToken);
        const doc = await this.model.findOne({ tokenHash: hash });
        if (!doc || doc.revokedAt) throw new UnauthorizedException('Refresh token révoqué');
        if (userIdHint && String(doc.userId) !== String(userIdHint)) throw new UnauthorizedException('Incohérence utilisateur');

        // Révoque l'ancien
        doc.revokedAt = new Date();

        // Émet le nouveau
        const { token: newToken, expiresAt } = await this.generate(String(doc.userId), meta);
        doc.replacedByHash = sha256(newToken);
        await doc.save();

        return { newToken, userId: String(doc.userId), expiresAt, cookie: this.cookieOptions(expiresAt) };
    }

    async revoke(token: string) {
        const hash = sha256(token);
        await this.model.updateOne({ tokenHash: hash }, { $set: { revokedAt: new Date() } });
    }

    async revokeAllForUser(userId: string) {
        await this.model.updateMany({ userId: new Types.ObjectId(userId) }, { $set: { revokedAt: new Date() } });
    }

    cookieOptionsPublic(expiresAt: Date) { return this.cookieOptions(expiresAt); }
}