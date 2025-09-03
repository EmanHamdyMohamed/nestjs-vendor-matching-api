import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from '../matches/match.entity';

@Entity({ name: 'vendors' })
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  countriesSupported: unknown;

  @Column('json')
  servicesOffered: unknown;

  @Column('decimal', { precision: 10, scale: 2 })
  rating: number;

  @Column('int')
  responseSlaHours: number;

  @OneToMany(() => Match, (match) => match.vendor)
  matches: Match[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
