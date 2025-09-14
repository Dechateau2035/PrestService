import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';

class LoginDto {
    @ApiProperty() @IsEmail()
    email: string;

    @ApiProperty() @IsString() @MinLength(6)
    mot_passe: string;
}

class RegisterDto {
    @ApiProperty() @IsString()
    nom: string;

    @ApiProperty() @IsEmail()
    email: string;

    @ApiProperty() @IsString()
    numero_tel: string;

    @ApiProperty() @IsString() @MinLength(6)
    mot_passe: string;

    @ApiProperty() @IsString()
    adresse?: string;

    @ApiProperty() @IsString()
    role?: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Connexion d'un utilisateur",
        description: "Authentifie l’utilisateur et retourne un jeton JWT.",
        operationId: 'authLogin',
    })
    @ApiBody({
        type: LoginDto,
        examples: {
            default: { value: { email: 'nadia@example.com', mot_passe: 'Passw0rd!' } }
        }
    })
    @ApiOkResponse({ description: 'Authentification réussie (JWT retourné).' })
    @ApiUnauthorizedResponse({ description: 'Identifiants invalides ou compte inactif.' })
    login(@Body() dto: LoginDto) { return this.auth.login(dto.email, dto.mot_passe); }

    @Public()
    @Post('register')
    @ApiOperation({
        summary: "Inscription d'un utilisateur",
        description: "Crée un nouvel utilisateur et renvoie un JWT.",
        operationId: 'authRegister',
    })
    @ApiBody({
        type: RegisterDto,
        examples: {
            default: { value: { nom: 'Nadia Test', email: 'nadia@example.com', numero_tel: '+21620000099', mot_passe: 'Passw0rd!' } }
        }
    })
    @ApiCreatedResponse({ description: 'Utilisateur créé et connecté (JWT retourné).' })
    register(@Body() dto: RegisterDto) { return this.auth.register(dto as any); }

    @ApiBearerAuth()
    @Get('me')
    @ApiOperation({
        summary: 'Profil de l’utilisateur connecté',
        description: 'Retourne le payload du JWT (sub, email, role, etc.).',
        operationId: 'authMe',
    })
    @ApiOkResponse({ description: 'Profil récupéré.' })
    me(@Req() req: any) { return req.user; }
}