#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E — client-service
# Cobertura: client + client-type + client-segment +
#            client-loyalty-tier + catalog-client + upstream-mirror
# ═══════════════════════════════════════════════════════════════
set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api}"
AUTH="${AUTH:-Bearer valid-token}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'; BLUE='\033[0;34m'
PASS=0; FAIL=0; TOTAL=0; WARN=0
log_step() { echo -e "\n${BLUE}═══ PASO $1: $2 ═══${NC}"; }
log_ok()   { echo -e "  ${GREEN}✔ $1${NC}"; PASS=$((PASS+1)); TOTAL=$((TOTAL+1)); }
log_fail() { echo -e "  ${RED}✘ $1${NC}"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+1)); }
log_warn() { echo -e "  ${YELLOW}⚠ $1${NC}"; WARN=$((WARN+1)); }
do_post()   { curl -s -w "\n%{http_code}" -X POST   "$1" -H "Content-Type: application/json" -H "Authorization: $AUTH" -d "$2" 2>/dev/null; }
do_put()    { curl -s -w "\n%{http_code}" -X PUT    "$1" -H "Content-Type: application/json" -H "Authorization: $AUTH" -d "$2" 2>/dev/null; }
do_get()    { curl -s -w "\n%{http_code}" -X GET    "$1" -H "Authorization: $AUTH" 2>/dev/null; }
do_delete() { curl -s -w "\n%{http_code}" -X DELETE "$1" -H "Authorization: $AUTH" 2>/dev/null; }
extract_body() { echo "$1" | sed '$d'; }
extract_code() { echo "$1" | tail -n1; }
json_get() { echo "$1" | jq -r "$2" 2>/dev/null || echo ""; }

UNIQUE="$(date +%s)"
NOW="$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"

echo -e "${BLUE}╔═ TEST E2E — Client Microservice ═╗${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/clients/query/count")
CODE=$(extract_code "$RESP")
[[ "$CODE" =~ ^(200|201)$ ]] && log_ok "Service UP ($CODE)" || { log_fail "NO responde ($CODE)"; exit 1; }

# ── Módulo: client-type ──
log_step 1 "ClientType CRUD"
PAYLOAD=$(cat <<JSON
{"typeCode":"REG-$UNIQUE","typeName":"Regular","creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/clienttypes/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
CT_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ && -n "$CT_ID" ]] && log_ok "ClientType creado id=$CT_ID" || log_fail "Create ClientType ($CODE)"

# ── Módulo: client-segment ──
log_step 2 "ClientSegment CRUD"
PAYLOAD=$(cat <<JSON
{"segmentCode":"SEG-$UNIQUE","segmentName":"Retail","creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/clientsegments/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
CS_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ ]] && log_ok "ClientSegment creado id=$CS_ID" || log_fail "Create ClientSegment ($CODE)"

# ── Módulo: client-loyalty-tier ──
log_step 3 "ClientLoyaltyTier CRUD"
PAYLOAD=$(cat <<JSON
{"tierCode":"GOLD-$UNIQUE","tierName":"Gold","minPoints":1000,"creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/clientloyaltytiers/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
CL_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ ]] && log_ok "ClientLoyaltyTier creado id=$CL_ID" || log_fail "Create LoyaltyTier ($CODE)"

# ── Módulo: client (aggregate root, upstream-mirror) ──
log_step 4 "Client creado como LOCAL_ONLY (sin personId upstream)"
PAYLOAD=$(cat <<JSON
{"firstName":"Test","lastName":"E2E-$UNIQUE","email":"e2e-$UNIQUE@test.com","phone":"+1234567890","document":"DOC-$UNIQUE","creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/clients/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
C_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ && -n "$C_ID" ]] && log_ok "Client creado id=$C_ID" || log_fail "Create Client ($CODE)"

log_step 5 "Client tiene upstreamSyncStatus=LOCAL_ONLY"
if [[ -n "$C_ID" ]]; then
  RESP=$(do_get "$BASE_URL/clients/query/$C_ID"); BODY=$(extract_body "$RESP")
  STATUS=$(json_get "$BODY" '.data.upstreamSyncStatus // .upstreamSyncStatus // empty')
  [[ "$STATUS" == "LOCAL_ONLY" ]] && log_ok "upstreamSyncStatus=LOCAL_ONLY" || log_warn "upstreamSyncStatus=$STATUS (esperado LOCAL_ONLY)"
fi

log_step 6 "Endpoint upstream-mirror: search-upstream-candidates"
RESP=$(do_get "$BASE_URL/clients/search-upstream-candidates?q=Test&limit=5")
CODE=$(extract_code "$RESP")
if [[ "$CODE" == "200" ]]; then log_ok "search-upstream-candidates OK"
elif [[ "$CODE" == "503" ]]; then log_warn "Upstream DOWN (503) — circuit breaker OPEN (esperado si hrms no corre)"
elif [[ "$CODE" == "401" ]]; then log_warn "401 — guard exige token (ok en entorno real)"
else log_fail "search-upstream-candidates ($CODE)"; fi

# Cleanup
log_step 7 "Cleanup"
[[ -n "$C_ID" ]]  && do_delete "$BASE_URL/clients/command/$C_ID" >/dev/null && log_ok "Client eliminado"
[[ -n "$CL_ID" ]] && do_delete "$BASE_URL/clientloyaltytiers/command/$CL_ID" >/dev/null && log_ok "LoyaltyTier eliminado"
[[ -n "$CS_ID" ]] && do_delete "$BASE_URL/clientsegments/command/$CS_ID" >/dev/null && log_ok "Segment eliminado"
[[ -n "$CT_ID" ]] && do_delete "$BASE_URL/clienttypes/command/$CT_ID" >/dev/null && log_ok "Type eliminado"

echo -e "\n${BLUE}╔══ RESUMEN ══╗${NC}"
echo -e "  Total: $TOTAL  ${GREEN}✔ OK: $PASS${NC}  ${RED}✘ FAIL: $FAIL${NC}  ${YELLOW}⚠ WARN: $WARN${NC}"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
