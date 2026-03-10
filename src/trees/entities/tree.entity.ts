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

  // --- Location ---
  @Column('decimal', { precision: 12, scale: 8 })
  xCoordinate: number;

  @Column('decimal', { precision: 12, scale: 8 })
  yCoordinate: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  zCoordinate: number;


  // --- Relations ---
  @OneToMany(() => GrowthMetric, (metric) => metric.tree, { cascade: true })
  growthMetrics: GrowthMetric[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
