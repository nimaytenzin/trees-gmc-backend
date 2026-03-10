import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { SurveyAreasService } from './survey-areas.service';
import { CreateSurveyAreaDto } from './dto/create-survey-area.dto';
import { UpdateSurveyAreaDto } from './dto/update-survey-area.dto';

@ApiTags('Survey Areas')
@Controller('api/survey-areas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SurveyAreasController {
  constructor(private readonly surveyAreasService: SurveyAreasService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSurveyAreaDto) {
    return this.surveyAreasService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ENUMERATOR)
  findAll() {
    return this.surveyAreasService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ENUMERATOR)
  findOne(@Param('id') id: string) {
    return this.surveyAreasService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateSurveyAreaDto) {
    return this.surveyAreasService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.surveyAreasService.remove(id);
    return { message: 'Survey area deleted' };
  }
}

