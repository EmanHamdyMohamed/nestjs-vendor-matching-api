import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
