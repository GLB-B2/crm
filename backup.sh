#!/usr/bin/env bash
# Tägliches Datenbank-Backup. Per Cronjob einrichten, siehe README.
set -euo pipefail

BACKUP_DIR="$(dirname "$0")/backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/crm_$TIMESTAMP.sql.gz"

docker compose exec -T db pg_dump -U crm crm | gzip > "$FILE"

# nur die letzten 14 Backups behalten
ls -1t "$BACKUP_DIR"/crm_*.sql.gz | tail -n +15 | xargs -r rm --

echo "Backup gespeichert: $FILE"
