import { IsEnum, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { Condition } from '../../common/enums/condition.enum';

const NUMERIC_OPS = ['eq', 'gt', 'gte', 'lt', 'lte'] as const;
export type NumericOp = (typeof NUMERIC_OPS)[number];

export class TreeFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(Condition)
  @IsOptional()
  healthCondition?: Condition;

  @IsString()
  @IsOptional()
  speciesId?: string;

  @IsString()
  @IsOptional()
  surveyAreaId?: string;

  @IsIn(NUMERIC_OPS)
  @IsOptional()
  heightOp?: NumericOp;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  heightValue?: number;

  @IsIn(NUMERIC_OPS)
  @IsOptional()
  dbhOp?: NumericOp;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  dbhValue?: number;

  @IsIn(NUMERIC_OPS)
  @IsOptional()
  canopyOp?: NumericOp;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  canopyValue?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
