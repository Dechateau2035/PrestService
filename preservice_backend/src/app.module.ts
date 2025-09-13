import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || "mongodb+srv://nelagency2025_db_user:TIRbjEVm4g8wFQwu@cluster0.qeamgwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
      serverSelectionTimeoutMS: 2000,
      maxPoolSize: 5
    }),
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
