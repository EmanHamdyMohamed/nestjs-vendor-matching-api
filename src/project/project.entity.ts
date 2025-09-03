import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Client } from '../client/client.entity';
import { Match } from '../matches/match.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client.projects)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  country: string;

  @Column('json')
  servicesNeeded: unknown;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column()
  status: string;

  @OneToMany(() => Match, (match) => match.project)
  matches: Match[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}


