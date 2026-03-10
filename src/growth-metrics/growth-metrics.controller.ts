import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GrowthMetricsService } from './growth-metrics.service';
import { CreateGrowthMetricDto } from './dto/create-growth-metric.dto';
import { UpdateGrowthMetricDto } from './dto/update-growth-metric.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Growth Metrics')
@Controller('api/trees/:treeId/growth-metrics')
@UseGuards(JwtAuthGuard)
export class GrowthMetricsController {
  constructor(private readonly metricsService: GrowthMetricsService) {}

  @Post()
  create(
    @Param('treeId') treeId: string,
    @Body() dto: CreateGrowthMetricDto,
  ) {
    return this.metricsService.create(treeId, dto);
  }

  @Get()
  findByTree(@Param('treeId') treeId: string) {
    return this.metricsService.findByTree(treeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metricsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGrowthMetricDto) {
    return this.metricsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metricsService.remove(id);
  }
}
