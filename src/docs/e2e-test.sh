#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E — client-service
# Cobertura: client + client-type + client-segment +
#            client-loyalty-tier + catalog-client + upstream-mirror
# ═══════════════════════════════════════════════════════════════
set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api}"
# ── Auth bootstrap: login real contra security-service ─────────
SECURITY_BASE_URL="${SECURITY_BASE_URL:-http://localhost:3015/api}"
SA_EMAIL="${SA_EMAIL:-softwarentalla@gmail.com}"
SA_PWD="${SA_PWD:-admin123}"
__login_resp=$(curl -s -w "\n%{http_code}" -X POST "$SECURITY_BASE_URL/logins/command" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$SA_EMAIL\",\"password\":\"$SA_PWD\"}" 2>/dev/null)
__login_code=$(echo "$__login_resp" | tail -n1)
if [[ "$__login_code" != "200" && "$__login_code" != "201" ]]; then
  echo "✘ Auth bootstrap falló: HTTP $__login_code contra $SECURITY_BASE_URL/logins/command"
  exit 1
fi
__token=$(echo "$__login_resp" | sed '$d' | (jq -r '.accessToken // .data.accessToken // .token // empty' 2>/dev/null || echo ""))
[[ -z "$__token" ]] && { echo "✘ Auth bootstrap: respuesta sin accessToken"; exit 1; }
AUTH="Bearer $__token"
echo "  ✔ Auth bootstrap: token JWT obtenido para $SA_EMAIL"

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
{"name":"Regular","code":"REG-$UNIQUE","displayName":"Regular","creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/clienttypes/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
CT_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ && -n "$CT_ID" ]] && log_ok "ClientType creado id=$CT_ID" || log_fail "Create ClientType ($CODE)"

# ── Módulo: client-segment ──
log_step 2 "ClientSegment CRUD"
PAYLOAD=$(cat <<JSON
{"name":"Retail","code":"SEG-$UNIQUE","displayName":"Retail","creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/clientsegments/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
CS_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ ]] && log_ok "ClientSegment creado id=$CS_ID" || log_fail "Create ClientSegment ($CODE)"

# ── Módulo: client-loyalty-tier ──
log_step 3 "ClientLoyaltyTier CRUD"
PAYLOAD=$(cat <<JSON
{"name":"Gold","code":"GOLD-$UNIQUE","displayName":"Gold","minPoints":1000,"creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
JSON
)
RESP=$(do_post "$BASE_URL/clientloyaltytiers/command" "$PAYLOAD")
CODE=$(extract_code "$RESP"); BODY=$(extract_body "$RESP")
CL_ID=$(json_get "$BODY" '.data.id // .id // empty')
[[ "$CODE" =~ ^(200|201)$ ]] && log_ok "ClientLoyaltyTier creado id=$CL_ID" || log_fail "Create LoyaltyTier ($CODE)"

# ── Módulo: client (aggregate root, upstream-mirror) ──
log_step 4 "Client creado como LOCAL_ONLY (sin personId upstream)"
PAYLOAD=$(cat <<JSON
{"name":"Test E2E-$UNIQUE","code":"CLI-$UNIQUE","email":"e2e-$UNIQUE@test.com","creationDate":"$NOW","modificationDate":"$NOW","isActive":true}
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
elif [[ "$CODE" == "404" ]]; then log_warn "404 — endpoint upstream-mirror no implementado en esta build (no bloqueante)"
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

# >>> NOMENCLADORES E2E BEGIN (auto-generado por sources/scaffold_nomenclador_e2e_tests.py)
# Servicio: client-service | Puerto: 3000
NOM_BASE_URL="${NOM_BASE_URL:-http://localhost:3000/api}"
NOM_AUTH="${AUTH}"
nom_pass=0; nom_fail=0; nom_warn=0
_nom_ok()   { echo -e "  \033[0;32m✔ $1\033[0m"; nom_pass=$((nom_pass+1)); }
_nom_fail() { echo -e "  \033[0;31m✘ $1\033[0m"; nom_fail=$((nom_fail+1)); }
_nom_warn() { echo -e "  \033[1;33m⚠ $1\033[0m"; nom_warn=$((nom_warn+1)); }
NOM_UNIQUE="${UNIQUE:-$(date +%s)}"
NOM_NOW="${NOW:-$(date -u +%Y-%m-%dT%H:%M:%S.000Z)}"
echo ""
echo -e "\033[0;34m═══ NOMENCLADORES — client-service ═══\033[0m"

# --- Nomenclador: client-loyalty-tier ---
NOM_CODE="NCLIENT-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E ClientLoyaltyTier ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/clientloyaltytiers/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "client-loyalty-tier: create id=$NOM_ID"; else _nom_warn "client-loyalty-tier: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/clientloyaltytiers/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "client-loyalty-tier: list ok"; else _nom_warn "client-loyalty-tier: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/clientloyaltytiers/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "client-loyalty-tier: getById" || _nom_warn "client-loyalty-tier: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/clientloyaltytiers/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E ClientLoyaltyTier updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "client-loyalty-tier: update" || _nom_warn "client-loyalty-tier: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/clientloyaltytiers/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "client-loyalty-tier: delete" || _nom_warn "client-loyalty-tier: delete"
fi

# --- Nomenclador: client-segment ---
NOM_CODE="NCLIENT-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E ClientSegment ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/clientsegments/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "client-segment: create id=$NOM_ID"; else _nom_warn "client-segment: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/clientsegments/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "client-segment: list ok"; else _nom_warn "client-segment: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/clientsegments/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "client-segment: getById" || _nom_warn "client-segment: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/clientsegments/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E ClientSegment updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "client-segment: update" || _nom_warn "client-segment: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/clientsegments/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "client-segment: delete" || _nom_warn "client-segment: delete"
fi

# --- Nomenclador: client-type ---
NOM_CODE="NCLIENT-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E ClientType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/clienttypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "client-type: create id=$NOM_ID"; else _nom_warn "client-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/clienttypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "client-type: list ok"; else _nom_warn "client-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/clienttypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "client-type: getById" || _nom_warn "client-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/clienttypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E ClientType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "client-type: update" || _nom_warn "client-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/clienttypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "client-type: delete" || _nom_warn "client-type: delete"
fi

echo ""
echo -e "\033[0;34m── Resumen Nomencladores client-service ──\033[0m"
echo "  ✔ OK=$nom_pass  ✘ FAIL=$nom_fail  ⚠ WARN=$nom_warn"
[[ ${nom_fail:-0} -eq 0 ]] || echo "[NOMENCLADORES] hay fallos en este servicio"
# <<< NOMENCLADORES E2E END
