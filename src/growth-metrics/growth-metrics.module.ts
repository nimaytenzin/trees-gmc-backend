import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthMetric } from './entities/growth-metric.entity';
import { GrowthMetricsService } from './growth-metrics.service';
import { GrowthMetricsController } from './growth-metrics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GrowthMetric])],
  controllers: [GrowthMetricsController],
  providers: [GrowthMetricsService],
  exports: [GrowthMetricsService],
})
export class GrowthMetricsModule {}
