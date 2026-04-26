-- ════════════════════════════════════════════════════════════════════
-- Seed: client_type_base_entity
-- ────────────────────────────────────────────────────────────────────
-- NOMENCLADOR PROPIO DEL MICROSERVICIO client-service
-- Justificación: este nomenclador NO es horizontal (sólo lo consume
-- client-service), por lo que NO va en catalog-service. Se carga
-- localmente como bootstrap idempotente para garantizar operatividad
-- desde el primer arranque.
--
-- REGLA DE GOBIERNO (aplica a TODO microservicio):
--   - Si un nomenclador es compartido por ≥ 2 microservicios → catalog-service.
--   - Si es propio (un único consumidor) → seed local en src/database/.
--   - Toda categoría debe sembrarse de forma idempotente (ON CONFLICT DO UPDATE).
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "client_type_base_entity"
  ("type", "createdBy", "isActive", "code", "displayName", "name", "description", "metadata")
VALUES
  ('clienttype', 'system', TRUE, 'INDIVIDUAL',  'Persona Natural',         'INDIVIDUAL',  'Cliente persona natural',                                       '{"requiresTaxId": false}'::json),
  ('clienttype', 'system', TRUE, 'BUSINESS',    'Empresa',                 'BUSINESS',    'Cliente persona jurídica/empresa',                              '{"requiresTaxId": true}'::json),
  ('clienttype', 'system', TRUE, 'GOVERNMENT',  'Entidad Gubernamental',   'GOVERNMENT',  'Organismo público o entidad estatal',                           '{"requiresTaxId": true, "requiresPublicContract": true}'::json),
  ('clienttype', 'system', TRUE, 'NGO',         'ONG / Sin Fines de Lucro','NGO',         'Organización no gubernamental o sin fines de lucro',            '{"requiresTaxId": true, "taxExempt": true}'::json),
  ('clienttype', 'system', TRUE, 'PARTNER',     'Socio Comercial',         'PARTNER',     'Cliente con acuerdo de partnership comercial',                  '{"requiresContract": true}'::json),
  ('clienttype', 'system', TRUE, 'RESELLER',    'Revendedor',              'RESELLER',    'Cliente que adquiere para revender (canal indirecto)',          '{"requiresContract": true, "discountTier": "wholesale"}'::json),
  ('clienttype', 'system', TRUE, 'PROSPECT',    'Prospecto',               'PROSPECT',    'Lead comercial aún no convertido en cliente activo',            '{"isLead": true}'::json)
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"         = TRUE,
  "modificationDate" = NOW();
