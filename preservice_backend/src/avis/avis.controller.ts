import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AvisService } from './avis.service';
import { CreateAviDto } from './dto/create-avi.dto';
import { UpdateAviDto } from './dto/update-avi.dto';

@ApiTags('Avis')
@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Post() @ApiCreatedResponse({ description: 'Avis créé' })
  create(@Body() createAviDto: CreateAviDto) {
    return this.avisService.create(createAviDto);
  }

  @Get() @ApiOkResponse({ description: 'Tous les avis' })
  findAll() {
    return this.avisService.findAll();
  }

  @Get(':id') @ApiOkResponse({ description: 'Détail d’un avis' })
  findOne(@Param('id') id: string) {
    return this.avisService.findOne(id);
  }

  @Patch(':id') @ApiOkResponse({ description: 'Avis mis à jour' })
  update(@Param('id') id: string, @Body() updateAviDto: UpdateAviDto) {
    return this.avisService.update(id, updateAviDto);
  }

  @Delete(':id') @ApiOkResponse({ description: 'Avis supprimé' })
  remove(@Param('id') id: string) {
    return this.avisService.remove(id);
  }
}
