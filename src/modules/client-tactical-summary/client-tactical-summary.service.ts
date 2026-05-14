import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type ClientCommercialSignalRow = {
  id: string;
  code: string | null;
  email: string | null;
  personId: string | null;
  firstName: string | null;
  lastName: string | null;
  upstreamSyncStatus: string | null;
  upstreamSyncedAt: string | null;
  creditLimit: number;
  clientTypeId: string | null;
  clientTypeCode: string | null;
  clientTypeName: string | null;
  clientSegmentId: string | null;
  clientSegmentCode: string | null;
  clientSegmentName: string | null;
  clientLoyaltyTierId: string | null;
  clientLoyaltyTierCode: string | null;
  clientLoyaltyTierName: string | null;
  clientLoyaltyTierMinPoints: number;
  modificationDate: string | null;
};

@Injectable()
export class ClientTacticalSummaryService {
  constructor(@Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined) {}

  async getSummary(limit: number = 6): Promise<Record<string, unknown>> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return this.emptyResponse();
    }

    const safeLimit = Math.max(1, Math.min(limit, 12));
    const [totals] = await dataSource.query(
      `SELECT
         COUNT(client.id)::int AS "totalClients",
         COUNT(client.id) FILTER (WHERE COALESCE(client."isActive", true) = true)::int AS "activeClients",
         COUNT(client.id) FILTER (WHERE client."clientLoyaltyTierId" IS NOT NULL)::int AS "clientsWithLoyaltyTier",
         COUNT(client.id) FILTER (WHERE client."clientSegmentId" IS NOT NULL)::int AS "clientsWithSegment",
         COUNT(client.id) FILTER (WHERE COALESCE(client."creditLimit", 0) > 0)::int AS "clientsWithCreditLimit",
         COUNT(client.id) FILTER (WHERE UPPER(COALESCE(client."upstreamSyncStatus", 'LOCAL_ONLY')) IN ('SYNCED', 'UP_TO_DATE', 'OK'))::int AS "syncedClients",
         COUNT(client.id) FILTER (WHERE COALESCE(NULLIF(client.email, ''), '') <> '')::int AS "clientsWithCommercialEmail",
         COUNT(client.id) FILTER (
           WHERE client."clientLoyaltyTierId" IS NOT NULL
             AND client."clientSegmentId" IS NOT NULL
             AND UPPER(COALESCE(client."upstreamSyncStatus", 'LOCAL_ONLY')) IN ('SYNCED', 'UP_TO_DATE', 'OK')
         )::int AS "ownershipResolvedClients",
         COUNT(client.id) FILTER (
           WHERE client."clientLoyaltyTierId" IS NULL
              OR client."clientSegmentId" IS NULL
              OR UPPER(COALESCE(client."upstreamSyncStatus", 'LOCAL_ONLY')) NOT IN ('SYNCED', 'UP_TO_DATE', 'OK')
         )::int AS "clientsPendingOwnership",
         COUNT(client.id) FILTER (
           WHERE client."clientSegmentId" IS NOT NULL
             AND UPPER(COALESCE(client."upstreamSyncStatus", 'LOCAL_ONLY')) IN ('SYNCED', 'UP_TO_DATE', 'OK')
         )::int AS "clientsReadyForCommercialSync"
       FROM client_base_entity client
       WHERE client.type = 'client' AND COALESCE(client."isActive", true) = true`,
    );

    const latest = await dataSource.query(
      `SELECT client.id, client.code, client.email, client."personId", client."firstName", client."lastName",
              client."upstreamSyncStatus", client."upstreamSyncedAt",
              COALESCE(client."creditLimit", 0)::float AS "creditLimit",
              client."clientTypeId", client_type.code AS "clientTypeCode", client_type."displayName" AS "clientTypeName",
              client."clientSegmentId", client_segment.code AS "clientSegmentCode", client_segment."displayName" AS "clientSegmentName",
              client."clientLoyaltyTierId", loyalty.code AS "clientLoyaltyTierCode", loyalty."displayName" AS "clientLoyaltyTierName",
              COALESCE(loyalty."minPoints", 0)::int AS "clientLoyaltyTierMinPoints",
              client."modificationDate"
       FROM client_base_entity client
       LEFT JOIN client_type_base_entity client_type
         ON client_type.id = client."clientTypeId"
        AND client_type.type = 'clienttype'
        AND COALESCE(client_type."isActive", true) = true
       LEFT JOIN client_segment_base_entity client_segment
         ON client_segment.id = client."clientSegmentId"
        AND client_segment.type = 'clientsegment'
        AND COALESCE(client_segment."isActive", true) = true
       LEFT JOIN client_loyalty_tier_base_entity loyalty
         ON loyalty.id = client."clientLoyaltyTierId"
        AND loyalty.type = 'clientloyaltytier'
        AND COALESCE(loyalty."isActive", true) = true
       WHERE client.type = 'client' AND COALESCE(client."isActive", true) = true
       ORDER BY COALESCE(client."modificationDate", client."creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    return {
      ok: true,
      message: 'Resumen táctico Client obtenido con éxito.',
      data: {
        totals: {
          totalClients: Number(totals?.totalClients ?? 0),
          activeClients: Number(totals?.activeClients ?? 0),
          clientsWithLoyaltyTier: Number(totals?.clientsWithLoyaltyTier ?? 0),
          clientsWithSegment: Number(totals?.clientsWithSegment ?? 0),
          clientsWithCreditLimit: Number(totals?.clientsWithCreditLimit ?? 0),
          syncedClients: Number(totals?.syncedClients ?? 0),
          clientsWithCommercialEmail: Number(totals?.clientsWithCommercialEmail ?? 0),
          ownershipResolvedClients: Number(totals?.ownershipResolvedClients ?? 0),
          clientsPendingOwnership: Number(totals?.clientsPendingOwnership ?? 0),
          clientsReadyForCommercialSync: Number(totals?.clientsReadyForCommercialSync ?? 0),
        },
        latest: latest as ClientCommercialSignalRow[],
      },
      count: Array.isArray(latest) ? latest.length : 0,
    };
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }

  private emptyResponse(): Record<string, unknown> {
    return {
      ok: true,
      message: 'Resumen táctico Client obtenido con éxito.',
      data: {
        totals: {
          totalClients: 0,
          activeClients: 0,
          clientsWithLoyaltyTier: 0,
          clientsWithSegment: 0,
          clientsWithCreditLimit: 0,
          syncedClients: 0,
          clientsWithCommercialEmail: 0,
          ownershipResolvedClients: 0,
          clientsPendingOwnership: 0,
          clientsReadyForCommercialSync: 0,
        },
        latest: [],
      },
      count: 0,
    };
  }
}