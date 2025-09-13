// src/events/dto/create-event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min, MinLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Recommandé: utiliser de "vrais" enums pour IsEnum
export enum EventTypeEnum {
    mariage = 'mariage',
    buffet = 'buffet',
    bapteme = 'bapteme',
    anniversaire = 'anniversaire',
    corporate = 'corporate',
    autre = 'autre',
}
export enum EventStatusEnum {
    draft = 'draft',
    pending = 'pending',
    confirmed = 'confirmed',
    cancelled = 'cancelled',
    done = 'done',
}

// DTO imbriqués
export class ClientDto {
    @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
    @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
}

export class VenueDto {
    @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
}

export class CreateEventDto {
    @ApiProperty() @IsString() @MinLength(2) title: string;

    @ApiPropertyOptional() @IsOptional() @IsString() description?: string;

    @ApiProperty({ enum: EventTypeEnum })
    @IsEnum(EventTypeEnum) type: EventTypeEnum;

    @ApiPropertyOptional({ enum: EventStatusEnum })
    @IsOptional() @IsEnum(EventStatusEnum) status?: EventStatusEnum;

    @ApiProperty() @IsDateString() startAt: string;
    @ApiPropertyOptional() @IsOptional() @IsDateString() endAt?: string;

    // Ajoute @Type(()=>Number) pour convertir "10" -> 10 si ça vient en string depuis Swagger
    @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) totalAmount?: number;

    @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;

    @ApiPropertyOptional({ type: () => ClientDto })
    @IsOptional() @ValidateNested() @Type(() => ClientDto)
    client?: ClientDto;

    @ApiPropertyOptional({ type: () => VenueDto })
    @IsOptional() @ValidateNested() @Type(() => VenueDto)
    venue?: VenueDto;
}
