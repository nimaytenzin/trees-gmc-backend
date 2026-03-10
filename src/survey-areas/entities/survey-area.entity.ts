import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tree } from '../../trees/entities/tree.entity';

@Entity('survey_areas')
export class SurveyArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  /**
   * GeoJSON geometry/feature collection for the area boundary.
   * Stored as jsonb for portability (no PostGIS dependency required).
   */
  @Column({ type: 'jsonb' })
  geom: unknown;

  @OneToMany(() => Tree, (tree) => tree.surveyArea)
  trees: Tree[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

