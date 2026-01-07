# YT-DLP Docker Frontend

Modernes Frontend für die YT-DLP API - Video-Management-Tool mit React, Vite und Tailwind CSS.

## ✨ Features

- **Dashboard**: CRUD-Operationen für Download-Konfigurationen
- **Cookie-Management**: Verwaltung von gespeicherten Cookies
- **Archive Viewer**: Read-only Ansicht archivierter Videos
- **Video Downloader**: Interface zum Starten von Downloads
- **Dark/Light Mode**: Umschaltbares Theme-System
- **Responsive Design**: Modernes, minimalistisches Flat Design

## 🚀 Quick Start

### Mit Docker Compose

```bash
# Repository klonen
git clone https://github.com/mf450s/yt-dlp-docker-frontend.git
cd yt-dlp-docker-frontend

# Umgebungsvariable anpassen
echo "YTDLP_DOWNLOADER_BACKEND_BASE_URL=http://exampleurl.com" > .env

# Container starten
docker-compose up -d
```

Das Frontend ist dann unter `http://localhost:5173` erreichbar.

### Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Umgebungsvariable setzen
echo "YTDLP_DOWNLOADER_BACKEND_BASE_URL=http://exampleurl.com" > .env.local

# Dev-Server starten
npm run dev
```

## ⚙️ Konfiguration

### Umgebungsvariablen

- `YTDLP_DOWNLOADER_BACKEND_BASE_URL`: URL der YT-DLP Backend-API

Beispiel `.env` Datei:

```env
YTDLP_DOWNLOADER_BACKEND_BASE_URL=http:localhost:5032
```

## 📦 Docker Image von GitHub Packages

```bash
docker pull ghcr.io/mf450s/yt-dlp-docker-frontend:main

docker run -d \
  -p 5173:80 \
  -e YTDLP_DOWNLOADER_BACKEND_BASE_URL=http:localhost:5032 \
  ghcr.io/mf450s/yt-dlp-docker-frontend:main
```

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Router** - Navigation
- **Lucide React** - Icons

## 🏗️ Projektstruktur

```
src/
├── components/
│   ├── ui/              # Wiederverwendbare UI-Komponenten
│   └── Layout.tsx      # Haupt-Layout mit Navigation
├── pages/
│   ├── Dashboard.tsx   # Config-Management
│   ├── CookieManagement.tsx
│   ├── Archive.tsx
│   └── Downloader.tsx
├── services/
│   └── api.ts          # API-Client
├── store/
│   └── theme.ts        # Theme State
├── lib/
│   └── utils.ts        # Helper-Funktionen
├── App.tsx
├── main.tsx
└── index.css
```

## 🔌 API-Integration

Das Frontend kommuniziert mit der YT-DLP Backend-API über folgende Endpoints:

### Download

- `POST /api/ytdlp/download` - Video herunterladen

### Konfigurationen

- `GET /api/ytdlp/config/` - Alle Configs auflisten
- `GET /api/ytdlp/config/{name}` - Spezifische Config abrufen
- `POST /api/ytdlp/config/{name}` - Config erstellen/aktualisieren
- `PATCH /api/ytdlp/config/{name}` - Config bearbeiten
- `DELETE /api/ytdlp/config/{name}` - Config löschen
