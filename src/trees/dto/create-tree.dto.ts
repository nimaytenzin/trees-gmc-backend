import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateTreeDto {
  @IsString()
  treeId: string;

  @IsString()
  speciesId: string;

  @IsNumber()
  xCoordinate: number;

  @IsNumber()
  yCoordinate: number;

  @IsNumber()
  @IsOptional()
  zCoordinate: number;

  @IsInt()
  @IsOptional()
  yearOfPlantation: number;

}
