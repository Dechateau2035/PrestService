import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { BlacklistedToken, BlacklistedTokenSchema } from './schemas/blacklisted-token.schema';
import { TokenBlacklistService } from './token-blacklist.service';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { RefreshTokensService } from './refresh-tokens.service';

@Module({
    imports: [
        JwtModule.register({}), // options passées à l'appel .sign()
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
            { name: RefreshToken.name, schema: RefreshTokenSchema },
        ]),
    ],
    providers: [AuthService, JwtStrategy, TokenBlacklistService, RefreshTokensService],
    controllers: [AuthController],
})
export class AuthModule { }
