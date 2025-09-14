import { PartialType } from '@nestjs/swagger';
import { CreateAviDto } from './create-avi.dto';

export class UpdateAviDto extends PartialType(CreateAviDto) {}
