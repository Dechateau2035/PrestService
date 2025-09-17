import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { Model, Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema';

const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET
const REFRESH_EXPIRES_IN = process.env.REFRESH_JWT_EXPIRES_IN

if (!REFRESH_SECRET) {
  throw new Error('Missing REFRESH_JWT_SECRET (refresh token secret)');
}

@Injectable()
export class RefreshTokensService {
    constructor(
        private jwt: JwtService,
        @InjectModel(RefreshToken.name) private model: Model<RefreshTokenDocument>,
    ) { }

    private cookieOptions(expiresAt: Date) {
        const secure = String(process.env.COOKIE_SECURE).toLowerCase() === 'true';
        const domain = process.env.COOKIE_DOMAIN || undefined;
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
        const token = this.jwt.sign(payload, { secret: REFRESH_SECRET, expiresIn: REFRESH_EXPIRES_IN });
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
            payload = this.jwt.verify(oldToken, { secret: REFRESH_SECRET });
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
