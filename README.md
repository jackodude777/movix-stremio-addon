# Movix Stremio Addon

Addon Stremio pour regarder le contenu de movix.tax

## Installation rapide

### Via Docker (recommande)

```bash
docker-compose up -d
```

Ensuite ouvrir Stremio et installer l'addon via:
`http://localhost:7000/manifest.json`

### TrueNAS SCALE

1. Aller dans Apps > Custom App
2. Utiliser l'image Docker depuis ce repo
3. Configurer le port 7000
4. Installer et acceder via l'IP de TrueNAS

## Configuration

Copier `.env.example` vers `.env` et modifier selon besoin.

## Developpement

```bash
npm install
npm run dev
```
