import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientTacticalSummaryController } from './client-tactical-summary.controller';
import { ClientTacticalSummaryService } from './client-tactical-summary.service';

@Module({
  imports: [ConfigModule],
  controllers: [ClientTacticalSummaryController],
  providers: [ClientTacticalSummaryService],
  exports: [ClientTacticalSummaryService],
})
export class ClientTacticalSummaryModule {}