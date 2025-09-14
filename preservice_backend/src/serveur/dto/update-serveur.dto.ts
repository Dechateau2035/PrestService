import { PartialType } from '@nestjs/swagger';
import { CreateServeurDto } from './create-serveur.dto';

export class UpdateServeurDto extends PartialType(CreateServeurDto) {}