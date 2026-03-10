import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(dto: CreateSpeciesDto): Promise<Species> {
    const existing = await this.speciesRepository.findOne({
      where: { speciesId: dto.speciesId },
    });
    if (existing) {
      throw new ConflictException(`Species ID ${dto.speciesId} already exists`);
    }
    const species = this.speciesRepository.create(dto);
    return this.speciesRepository.save(species);
  }

  async findAll(): Promise<Species[]> {
    return this.speciesRepository.find({ order: { commonName: 'ASC' } });
  }

  async findOne(id: string): Promise<Species> {
    const species = await this.speciesRepository.findOne({
      where: { id },
      relations: ['trees'],
    });
    if (!species) throw new NotFoundException('Species not found');
    return species;
  }

  async update(id: string, dto: UpdateSpeciesDto): Promise<Species> {
    const species = await this.findOne(id);
    Object.assign(species, dto);
    return this.speciesRepository.save(species);
  }

  async remove(id: string): Promise<void> {
    const species = await this.findOne(id);
    await this.speciesRepository.remove(species);
  }
}
