// src/events/dto/create-event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatusEnum, EventTypeEnum } from '../entities/event.entity';


export class CreateEventDto {
    @ApiProperty() @IsString() @MinLength(2)
    title: string;

    @ApiProperty() @IsString() @MinLength(2)
    description?: string;

    @ApiProperty() @IsString() @MinLength(2)
    location: string;

    @ApiProperty() @IsDateString()
    startdate: string;

    @ApiProperty() @IsDateString()
    enddate: string;

    @ApiProperty({ enum: EventTypeEnum })
    @IsEnum(EventTypeEnum)
    type: EventTypeEnum;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional() @IsArray() @IsMongoId({ each: true })
    serveurs?: string[];

    @ApiPropertyOptional()
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
    guests?: number;

    @ApiPropertyOptional({ enum: EventStatusEnum, default: EventStatusEnum.en_attente })
    @IsOptional() @IsEnum(EventStatusEnum)
    status?: EventStatusEnum;

    @ApiPropertyOptional()
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
    amount?: number;
}