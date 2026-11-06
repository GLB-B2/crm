# b2solutions CRM

Grundgerüst: Next.js + TypeScript + Tailwind, PostgreSQL via Prisma, Login mit Auth.js
(E-Mail/Passwort, Rollen Admin/Mitarbeiter), läuft komplett per Docker auf eurem
eigenen IONOS-VPS hinter Caddy (automatisches HTTPS).

## Einmalige Einrichtung auf dem VPS

Voraussetzung: SSH-Zugriff auf den VPS, eine Subdomain (z. B. `crm.b2solutions.de`),
deren DNS-A-Record bereits auf die VPS-IP zeigt.

```bash
# 1. Auf dem VPS einloggen
ssh user@eure-vps-ip

# 2. Docker installieren (falls noch nicht vorhanden)
curl -fsSL https://get.docker.com | sh

# 3. Projekt auf den Server bringen
git clone <euer-privates-repo-url> b2solutions-crm
cd b2solutions-crm

# 4. Umgebungsvariablen anlegen
cp .env.prod.example .env
nano .env   # DOMAIN, DB_PASSWORD, AUTH_SECRET eintragen
# AUTH_SECRET erzeugen mit:
openssl rand -hex 32

# 5. Container bauen und starten
docker compose up -d --build

# 6. Datenbank-Schema anlegen
docker compose exec app npx prisma db push

# 7. Ersten Admin-Account anlegen
docker compose exec \
  -e SEED_ADMIN_EMAIL=bertolo@b2solutions.de \
  -e SEED_ADMIN_PASSWORD=bitte-sofort-aendern \
  -e SEED_ADMIN_NAME="Gian Luca" \
  app npx tsx prisma/seed.ts
```

Danach ist `https://crm.b2solutions.de/login` erreichbar.

## Laufender Betrieb

**Neue Version ausrollen** (nachdem Claude Code Code-Änderungen gepusht hat):

```bash
cd b2solutions-crm
./deploy.sh
```

**Tägliches Backup einrichten** (einmalig, per Cronjob):

```bash
crontab -e
# diese Zeile einfügen (läuft nachts um 3 Uhr):
0 3 * * * /pfad/zu/b2solutions-crm/backup.sh >> /pfad/zu/b2solutions-crm/backup.log 2>&1
```

Backups landen in `backups/` als `.sql.gz`, die letzten 14 bleiben erhalten.
Zusätzlich empfiehlt es sich, diesen Ordner regelmäßig an einen zweiten Ort zu
kopieren (z. B. mit `rsync` auf einen anderen Server oder in IONOS-Objektspeicher).

## Lokale Entwicklung

```bash
npm install
cp .env.example .env   # lokale DATABASE_URL eintragen, z. B. eine lokale Postgres-Instanz
npx prisma db push
npm run db:seed
npm run dev
```

## Projektstruktur

- `src/app` – Next.js-Seiten (App Router)
- `src/auth.ts` – Login/Rollen (Auth.js)
- `prisma/schema.prisma` – Datenmodell (siehe Plan-Dokument, Abschnitt „Datenmodell")
- `docker-compose.yml` / `Dockerfile` / `Caddyfile` – Hosting-Setup
- `deploy.sh` – Deployment nach Code-Änderungen
- `backup.sh` – tägliches Datenbank-Backup

## Nächste Schritte

Dies ist Prompt 1+2 aus dem Plan (Server-Setup + Datenmodell + Login). Die
weiteren Module (Leads-Kanban, Kontakte, Projekte, Angebote, Hosting-Übersicht,
Dashboard) folgen mit den Prompts 3–9 aus dem Plan-Dokument.
