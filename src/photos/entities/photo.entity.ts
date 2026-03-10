import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { GrowthMetric } from '../../growth-metrics/entities/growth-metric.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => GrowthMetric, (metric) => metric.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'growthMetricId' })
  growthMetric: GrowthMetric;

  @Column()
  growthMetricId: string;
}
