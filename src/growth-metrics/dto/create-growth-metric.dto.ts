import { IsNumber, IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { Condition, AmenityValue, TransplantSurvival, AssessmentType } from '../../common/enums/condition.enum';

export class CreateGrowthMetricDto {
  @IsNumber()
  heightM: number;

  @IsNumber()
  dbhCm: number;

  @IsNumber()
  canopySpreadM: number;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsDateString()
  @IsOptional()
  recordedAt?: string;

  @IsEnum(AssessmentType)
  @IsOptional()
  assessmentType?: AssessmentType;

  @IsEnum(Condition)
  @IsOptional()
  existingForm?: Condition;

  @IsEnum(Condition)
  @IsOptional()
  healthCondition?: Condition;

  @IsEnum(AmenityValue)
  @IsOptional()
  amenityValue?: AmenityValue;

  @IsEnum(TransplantSurvival)
  @IsOptional()
  transplantSurvival?: TransplantSurvival;
}
