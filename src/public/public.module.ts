import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { TreesModule } from '../trees/trees.module';
import { SpeciesModule } from '../species/species.module';

@Module({
  imports: [TreesModule, SpeciesModule],
  controllers: [PublicController],
})
export class PublicModule {}
