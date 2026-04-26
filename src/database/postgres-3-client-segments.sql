-- ════════════════════════════════════════════════════════════════════
-- Seed: client_segment_base_entity
-- ────────────────────────────────────────────────────────────────────
-- NOMENCLADOR PROPIO DEL MICROSERVICIO client-service.
-- (Ver justificación y regla de gobierno en postgres-2-client-types.sql)
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "client_segment_base_entity"
  ("type", "createdBy", "isActive", "code", "displayName", "name", "description", "metadata")
VALUES
  ('clientsegment', 'system', TRUE, 'VIP',          'VIP',                       'VIP',          'Cliente de altísimo valor, atención premium personalizada',     '{"priorityLevel": 1, "slaHours": 1}'::json),
  ('clientsegment', 'system', TRUE, 'PREMIUM',      'Premium',                   'PREMIUM',      'Cliente de alto valor con beneficios diferenciados',            '{"priorityLevel": 2, "slaHours": 4}'::json),
  ('clientsegment', 'system', TRUE, 'STANDARD',     'Estándar',                  'STANDARD',     'Cliente regular con acceso al catálogo y servicios estándar',   '{"priorityLevel": 3, "slaHours": 24}'::json),
  ('clientsegment', 'system', TRUE, 'BASIC',        'Básico',                    'BASIC',        'Cliente de entrada con acceso limitado',                        '{"priorityLevel": 4, "slaHours": 48}'::json),
  ('clientsegment', 'system', TRUE, 'CORPORATE',    'Corporativo',               'CORPORATE',    'Cuentas corporativas con contrato marco',                       '{"priorityLevel": 2, "slaHours": 4, "accountManager": true}'::json),
  ('clientsegment', 'system', TRUE, 'ENTERPRISE',   'Enterprise',                'ENTERPRISE',   'Grandes corporaciones con SLA dedicado',                        '{"priorityLevel": 1, "slaHours": 1, "accountManager": true}'::json),
  ('clientsegment', 'system', TRUE, 'SMB',          'Pequeña/Mediana Empresa',   'SMB',          'Pequeñas y medianas empresas',                                  '{"priorityLevel": 3, "slaHours": 24}'::json),
  ('clientsegment', 'system', TRUE, 'STARTUP',      'Startup',                   'STARTUP',      'Empresa emergente con pricing diferenciado',                    '{"priorityLevel": 3, "slaHours": 24, "specialPricing": true}'::json),
  ('clientsegment', 'system', TRUE, 'EDUCATIONAL',  'Educativo',                 'EDUCATIONAL',  'Instituciones educativas (universidades, escuelas)',            '{"priorityLevel": 3, "slaHours": 24, "specialPricing": true}'::json),
  ('clientsegment', 'system', TRUE, 'GOVERNMENT',   'Gubernamental',             'GOVERNMENT',   'Cuentas gubernamentales con procesos de contratación pública',  '{"priorityLevel": 2, "slaHours": 8, "publicContractRequired": true}'::json),
  ('clientsegment', 'system', TRUE, 'CHURNED',      'Inactivo / Perdido',        'CHURNED',      'Cliente que dejó de operar; objetivo de campañas de retorno',   '{"priorityLevel": 5, "campaignTarget": "winback"}'::json)
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"         = TRUE,
  "modificationDate" = NOW();
