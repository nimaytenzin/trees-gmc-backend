import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSurveyAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  geom: Record<string, unknown>;
}

