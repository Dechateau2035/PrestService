import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListEventsDto {
    @ApiPropertyOptional() @IsOptional() @IsString() q?: string;

    @ApiPropertyOptional({ enum: ['draft', 'pending', 'confirmed', 'cancelled', 'done'] })
    @IsOptional() @IsEnum(['draft', 'pending', 'confirmed', 'cancelled', 'done'] as const) status?: any;

    @ApiPropertyOptional({ enum: ['mariage', 'buffet', 'bapteme', 'anniversaire', 'corporate', 'autre'] })
    @IsOptional() @IsEnum(['mariage', 'buffet', 'bapteme', 'anniversaire', 'corporate', 'autre'] as const) type?: any;

    @ApiPropertyOptional({ default: '1' }) @IsOptional() @IsNumberString() page?: string;
    @ApiPropertyOptional({ default: '10' }) @IsOptional() @IsNumberString() limit?: string;
    @ApiPropertyOptional({ example: '-startAt,totalAmount' }) @IsOptional() @IsString() sort?: string;
}