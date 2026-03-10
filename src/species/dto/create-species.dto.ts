import { IsOptional, IsString } from 'class-validator';

export class CreateSpeciesDto {
  @IsString()
  speciesId: string;

  @IsString()
  scientificName: string;

  @IsString()
  commonName: string;

  @IsString()
  @IsOptional()
  family?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
