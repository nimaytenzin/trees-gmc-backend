import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};

@ApiTags('Photos')
@Controller('api/growth-metrics/:metricId/photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  uploadMultiple(
    @Param('metricId') metricId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.photosService.uploadMultiple(metricId, files);
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  upload(
    @Param('metricId') metricId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.photosService.upload(metricId, file);
  }

  @Get()
  findByMetric(@Param('metricId') metricId: string) {
    return this.photosService.findByMetric(metricId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }
}
