import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Événement créé' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Liste de tous les événements' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Détail d’un événement' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Événement mis à jour' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Get('analytics/kpi')
  @ApiOkResponse({ description: 'KPI du mois courant vs mois précédent' })
  kpi() { return this.eventsService.kpi(); }

  @Get('analytics/recent')
  @ApiOkResponse({ description: '4 événements ajoutés récemment' })
  recent() { return this.eventsService.recent(); }

  @Get('analytics/types/percent')
  @ApiOkResponse({ description: 'Répartition par type (percent + count)' })
  typesPercent() { return this.eventsService.typesPercent(); }

  @Get('meta/types')
  @ApiOkResponse({ description: 'Énum des types (key/value)' })
  typesKV() { return this.eventsService.typesKV(); }

  @Get('meta/statuses')
  @ApiOkResponse({ description: 'Énum des statuts d’événement (key/value)' })
  statusesKV() { return this.eventsService.statusesKV(); }
}
