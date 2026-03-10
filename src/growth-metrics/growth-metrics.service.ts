import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrowthMetric } from './entities/growth-metric.entity';
import { CreateGrowthMetricDto } from './dto/create-growth-metric.dto';
import { UpdateGrowthMetricDto } from './dto/update-growth-metric.dto';
import { AssessmentType } from '../common/enums/condition.enum';

@Injectable()
export class GrowthMetricsService {
  constructor(
    @InjectRepository(GrowthMetric)
    private readonly metricRepository: Repository<GrowthMetric>,
  ) {}

  async create(treeId: string, dto: CreateGrowthMetricDto): Promise<GrowthMetric> {
    const existingCount = await this.metricRepository.count({ where: { treeId } });
    const assessmentType =
      dto.assessmentType ?? (existingCount === 0 ? AssessmentType.INITIAL : AssessmentType.PERIODIC);
    const metric = this.metricRepository.create({
      ...dto,
      treeId,
      assessmentType,
      recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
    });
    return this.metricRepository.save(metric);
  }

  async findByTree(treeId: string): Promise<GrowthMetric[]> {
    return this.metricRepository.find({
      where: { treeId },
      relations: ['photos'],
      order: { recordedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<GrowthMetric> {
    const metric = await this.metricRepository.findOne({
      where: { id },
      relations: ['photos'],
    });
    if (!metric) throw new NotFoundException('Growth metric not found');
    return metric;
  }

  async update(id: string, dto: UpdateGrowthMetricDto): Promise<GrowthMetric> {
    const metric = await this.findOne(id);
    Object.assign(metric, dto);
    return this.metricRepository.save(metric);
  }

  async remove(id: string): Promise<void> {
    const metric = await this.findOne(id);
    await this.metricRepository.remove(metric);
  }
}
