import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() @ApiCreatedResponse({ description: 'Utilisateur créé' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() @ApiOkResponse({ description: 'Tous les utilisateurs' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') @ApiOkResponse({ description: 'Détail utilisateur' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id') @ApiOkResponse({ description: 'Utilisateur mis à jour' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') @ApiOkResponse({ description: 'Utilisateur supprimé' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('meta/roles')
  @ApiOkResponse({ description: 'Rôles disponibles (clé/valeur)' })
  rolesKV() { return this.usersService.rolesKV(); }
}
