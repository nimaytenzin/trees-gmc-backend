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
import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Species')
@Controller('api/species')
@UseGuards(JwtAuthGuard)
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  create(@Body() dto: CreateSpeciesDto) {
    return this.speciesService.create(dto);
  }

  @Get()
  findAll() {
    return this.speciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.speciesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSpeciesDto) {
    return this.speciesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.speciesService.remove(id);
  }
}
