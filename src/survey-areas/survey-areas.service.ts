import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyArea } from './entities/survey-area.entity';
import { CreateSurveyAreaDto } from './dto/create-survey-area.dto';
import { UpdateSurveyAreaDto } from './dto/update-survey-area.dto';

@Injectable()
export class SurveyAreasService {
  constructor(
    @InjectRepository(SurveyArea)
    private readonly repo: Repository<SurveyArea>,
  ) {}

  async create(dto: CreateSurveyAreaDto): Promise<SurveyArea> {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Survey area name already exists');
    const area = this.repo.create(dto);
    return this.repo.save(area);
  }

  async findAll(): Promise<SurveyArea[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SurveyArea> {
    const area = await this.repo.findOne({ where: { id } });
    if (!area) throw new NotFoundException('Survey area not found');
    return area;
  }

  async update(id: string, dto: UpdateSurveyAreaDto): Promise<SurveyArea> {
    const area = await this.findOne(id);
    if (dto.name && dto.name !== area.name) {
      const exists = await this.repo.findOne({ where: { name: dto.name } });
      if (exists) throw new ConflictException('Survey area name already exists');
    }
    Object.assign(area, dto);
    return this.repo.save(area);
  }

  async remove(id: string): Promise<void> {
    const area = await this.findOne(id);
    await this.repo.remove(area);
  }
}

