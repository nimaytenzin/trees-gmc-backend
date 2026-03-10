import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TreesModule } from './trees/trees.module';
import { GrowthMetricsModule } from './growth-metrics/growth-metrics.module';
import { PhotosModule } from './photos/photos.module';
import { SpeciesModule } from './species/species.module';
import { PublicModule } from './public/public.module';
import { SurveyAreasModule } from './survey-areas/survey-areas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    AuthModule,
    UsersModule,
    TreesModule,
    GrowthMetricsModule,
    PhotosModule,
    SpeciesModule,
    SurveyAreasModule,
    PublicModule,
  ],
})
export class AppModule {}
