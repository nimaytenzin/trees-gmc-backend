import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyArea } from './entities/survey-area.entity';
import { SurveyAreasService } from './survey-areas.service';
import { SurveyAreasController } from './survey-areas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyArea])],
  providers: [SurveyAreasService],
  controllers: [SurveyAreasController],
  exports: [TypeOrmModule, SurveyAreasService],
})
export class SurveyAreasModule {}

