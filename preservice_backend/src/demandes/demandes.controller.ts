import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DemandesService } from './demandes.service';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { UpdateDemandeDto } from './dto/update-demande.dto';

@ApiTags('Demandes')
@Controller('demandes')
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) { }

  @Post() @ApiCreatedResponse({ description: 'Demande créée' })
  create(@Body() createDemandeDto: CreateDemandeDto) {
    return this.demandesService.create(createDemandeDto);
  }

  @Get() @ApiOkResponse({ description: 'Toutes les demandes' })
  findAll() {
    return this.demandesService.findAll();
  }

  @Get(':id') @ApiOkResponse({ description: 'Détail demande' })
  findOne(@Param('id') id: string) {
    return this.demandesService.findOne(id);
  }

  @Patch(':id') @ApiOkResponse({ description: 'Demande mise à jour' })
  update(@Param('id') id: string, @Body() updateDemandeDto: UpdateDemandeDto) {
    return this.demandesService.update(id, updateDemandeDto);
  }

  @Delete(':id') @ApiOkResponse({ description: 'Demande supprimée' })
  remove(@Param('id') id: string) {
    return this.demandesService.remove(id);
  }

  @Get('meta/types') @ApiOkResponse({ description: 'Types de demande (clé/valeur)' })
  typesKV() { return this.demandesService.typesKV(); }
}
