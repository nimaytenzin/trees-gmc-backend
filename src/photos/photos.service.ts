import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async upload(
    growthMetricId: string,
    file: Express.Multer.File,
  ): Promise<Photo> {
    const photo = this.photoRepository.create({
      url: `/uploads/${file.filename}`,
      growthMetricId,
    });
    return this.photoRepository.save(photo);
  }

  async uploadMultiple(
    growthMetricId: string,
    files: Express.Multer.File[],
  ): Promise<Photo[]> {
    const photos = files.map((file) =>
      this.photoRepository.create({
        url: `/uploads/${file.filename}`,
        growthMetricId,
      }),
    );
    return this.photoRepository.save(photos);
  }

  async findByMetric(growthMetricId: string): Promise<Photo[]> {
    return this.photoRepository.find({ where: { growthMetricId } });
  }

  async remove(id: string): Promise<void> {
    const photo = await this.photoRepository.findOne({ where: { id } });
    if (!photo) throw new NotFoundException('Photo not found');

    // Remove file from disk
    const filePath = path.join(process.cwd(), photo.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.photoRepository.remove(photo);
  }
}
