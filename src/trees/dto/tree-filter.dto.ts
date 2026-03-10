import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Condition } from '../../common/enums/condition.enum';

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

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
