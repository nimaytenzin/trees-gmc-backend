import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tree } from './entities/tree.entity';
import { GrowthMetric } from '../growth-metrics/entities/growth-metric.entity';
import { SurveyArea } from '../survey-areas/entities/survey-area.entity';
import { TreesService } from './trees.service';
import { TreesController } from './trees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tree, GrowthMetric, SurveyArea])],
  controllers: [TreesController],
  providers: [TreesService],
  exports: [TreesService],
})
export class TreesModule {}
