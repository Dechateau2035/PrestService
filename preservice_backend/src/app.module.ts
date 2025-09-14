import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { ServeurModule } from './serveur/serveur.module';
import { UsersModule } from './users/users.module';
import { DemandesModule } from './demandes/demandes.module';
import { AvisModule } from './avis/avis.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot((process.env.MONGO_URI)!, {
      serverSelectionTimeoutMS: 2000,
      maxPoolSize: 5
    }),
    AuthModule,
    EventsModule,
    ServeurModule,
    UsersModule,
    DemandesModule,
    AvisModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})

export class AppModule { }
