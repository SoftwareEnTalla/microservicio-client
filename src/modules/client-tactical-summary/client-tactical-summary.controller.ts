import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ClientTacticalSummaryService } from './client-tactical-summary.service';

@ApiTags('client-tactical-summary')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('client-tactical-summary')
export class ClientTacticalSummaryController {
  constructor(private readonly service: ClientTacticalSummaryService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen táctico Client para identidad comercial, segmento y loyalty tier' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen táctico de Client.' })
  async getSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getSummary(Number(limit || 6));
  }
}