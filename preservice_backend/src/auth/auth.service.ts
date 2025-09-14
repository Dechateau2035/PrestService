import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        @InjectModel(User.name) private users: Model<UserDocument>,
    ) { }

    private signToken(user: any) {
        const payload = {
            sub: user.id?.toString() ?? user._id?.toString(),
            email: user.email,
            role: user.role,
            nom: user.nom,
            isActive: user.isActive,
        };
        return {
            access_token: this.jwt.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_EXPIRES_IN,
            }),
            user: payload,
        };
    }

    async validateUser(email: string, mot_passe: string) {
        const doc = await this.users.findOne({ email }).select('+mot_passe').lean(false);

        if (!doc) throw new UnauthorizedException('Email ou mot de passe invalide');

        const ok = await bcrypt.compare(mot_passe, (doc as any).mot_passe);

        if (!ok) throw new UnauthorizedException('Mot de passe invalide');

        if (doc.isActive === false) throw new UnauthorizedException('Compte inactif');

        const user = doc.toJSON();

        return user;
    }

    async login(email: string, mot_passe: string) {
        const user = await this.validateUser(email, mot_passe);
        return this.signToken(user);
    }

    async register(data: {
        nom: string; email: string; numero_tel: string; adresse?: string; mot_passe: string; role?: UserRole;
    }) {
        const exists = await this.users.exists({ email: data.email });
        if (exists) throw new UnauthorizedException('Email déjà utilisé');
        const created = new this.users(data as any);
        await created.save();
        const user = created.toJSON();
        return this.signToken(user);
    }
}