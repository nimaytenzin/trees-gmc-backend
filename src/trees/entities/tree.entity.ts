import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Species } from '../../species/entities/species.entity';
import { GrowthMetric } from '../../growth-metrics/entities/growth-metric.entity';
import { SurveyArea } from '../../survey-areas/entities/survey-area.entity';

@Entity('trees')
export class Tree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  treeId: string;

  // --- Species relationship ---
  @ManyToOne(() => Species, (species) => species.trees, { eager: true })
  @JoinColumn({ name: 'speciesId' })
  species: Species;

  @Column()
  speciesId: string;

  // --- Survey Area relationship (optional) ---
  @ManyToOne(() => SurveyArea, (area) => area.trees, { nullable: true, eager: false })
  @JoinColumn({ name: 'surveyAreaId' })
  surveyArea?: SurveyArea | null;

  @Column({ nullable: true })
  surveyAreaId?: string | null;

  // --- Location ---
  @Column('decimal')
  xCoordinate: number;

  @Column('decimal',)
  yCoordinate: number;

  @Column('decimal', { nullable: true })
  zCoordinate: number;

  @Column('int', { nullable: true })
  yearOfPlantation: number | null;


  // --- Relations ---
  @OneToMany(() => GrowthMetric, (metric) => metric.tree, { cascade: true })
  growthMetrics: GrowthMetric[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
