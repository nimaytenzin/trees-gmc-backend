import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tree } from '../../trees/entities/tree.entity';

@Entity('species')
export class Species {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  speciesId: string;

  @Column()
  scientificName: string;

  @Column()
  commonName: string;

  @Column({ nullable: true })
  family: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Tree, (tree) => tree.species)
  trees: Tree[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
