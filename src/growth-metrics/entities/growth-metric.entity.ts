import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tree } from '../../trees/entities/tree.entity';
import { Photo } from '../../photos/entities/photo.entity';
import { Condition, AmenityValue, TransplantSurvival, AssessmentType } from '../../common/enums/condition.enum';

@Entity('growth_metrics')
export class GrowthMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Initial assessment (first metric for tree) or Periodic assessment (subsequent). */
  @Column({ type: 'enum', enum: AssessmentType, default: AssessmentType.INITIAL })
  assessmentType: AssessmentType;

  @Column('decimal', { precision: 8, scale: 2 })
  heightM: number;

  @Column('decimal', { precision: 8, scale: 2 })
  dbhCm: number;

  @Column('decimal', { precision: 8, scale: 2 })
  canopySpreadM: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;

  @ManyToOne(() => Tree, (tree) => tree.growthMetrics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'treeId' })
  tree: Tree;

  @Column()
  treeId: string;

  // --- Assessment (per recording) ---
  @Column({ type: 'enum', enum: Condition, nullable: true })
  existingForm: Condition;

  @Column({ type: 'enum', enum: Condition, nullable: true })
  healthCondition: Condition;

  @Column({ type: 'enum', enum: AmenityValue, nullable: true })
  amenityValue: AmenityValue;

  @Column({ type: 'enum', enum: TransplantSurvival, nullable: true })
  transplantSurvival: TransplantSurvival;

  @OneToMany(() => Photo, (photo) => photo.growthMetric, { cascade: true })
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;
}
