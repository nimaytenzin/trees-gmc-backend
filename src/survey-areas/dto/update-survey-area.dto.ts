import { PartialType } from '@nestjs/swagger';
import { CreateSurveyAreaDto } from './create-survey-area.dto';

export class UpdateSurveyAreaDto extends PartialType(CreateSurveyAreaDto) {}

