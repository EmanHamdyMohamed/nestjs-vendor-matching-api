import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { Vendor } from '../vendor/vendor.entity';

@Entity({ name: 'matches' })
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.matches)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  vendorId: number;

  @ManyToOne(() => Vendor, (vendor) => vendor.matches)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column('decimal', { precision: 10, scale: 2 })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}


