import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ServeurService } from './serveur.service';
import { CreateServeurDto } from './dto/create-serveur.dto';
import { UpdateServeurDto } from './dto/update-serveur.dto';

@ApiTags('Serveurs')
@Controller('serveur')
export class ServeurController {
  constructor(private readonly serveurService: ServeurService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Ajout d\'un nouveau serveur' })
  create(@Body() createServeurDto: CreateServeurDto) {
    return this.serveurService.create(createServeurDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Liste de tous les serveurs (sans pagination)' })
  findAll() {
    return this.serveurService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Détail d’un serveur' })
  findOne(@Param('id') id: string) {
    return this.serveurService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Serveur mis à jour' })
  update(@Param('id') id: string, @Body() updateServeurDto: UpdateServeurDto) {
    return this.serveurService.update(id, updateServeurDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Serveur supprimé' })
  remove(@Param('id') id: string) {
    return this.serveurService.remove(id);
  }

  @Get('meta/serveur-statuses')
  @ApiOkResponse({ description: 'Énum des statuts de serveur (key/value)' })
  serveurStatusesKV() { return this.serveurService.serveurStatusesKV(); }
}
