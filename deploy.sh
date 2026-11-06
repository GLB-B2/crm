#!/usr/bin/env bash
# Auf dem VPS im Projektordner ausführen, nachdem Code gepusht wurde.
set -euo pipefail

echo "→ Hole neuesten Code"
git pull

echo "→ Baue und starte Container neu"
docker compose up -d --build

echo "→ Wende Datenbank-Schema an"
docker compose exec app npx prisma db push

echo "Fertig. Status:"
docker compose ps
