# YT-DLP Docker Frontend

Modern frontend for the YT-DLP API - Video management tool with React, Vite, and Tailwind CSS.

## ✨ Features

- **Dashboard**: CRUD operations for download configurations
- **Cookie Management**: Management of stored cookies
- **Archive Viewer**: Read-only view of archived videos
- **Video Downloader**: Interface for starting downloads
- **Dark/Light Mode**: Switchable theme system
- **Responsive Design**: Modern, minimalist flat design

## 🚀 Quick Start

### With Docker Compose

```bash
# Clone repository
git clone https://github.com/mf450s/yt-dlp-docker-frontend.git
cd yt-dlp-docker-frontend

# Adjust environment variable
echo "YTDLP_DOWNLOADER_BACKEND_BASE_URL=http://exampleurl.com" > .env

# Start container
docker-compose up -d
```

The frontend will then be accessible at `http://localhost:5173`.

### Local Development

```bash
# Install dependencies
npm install

# Set environment variable
echo "YTDLP_DOWNLOADER_BACKEND_BASE_URL=http://exampleurl.com" > .env.local

# Start dev server
npm run dev
```

## ⚙️ Configuration

### Environment Variables

- `YTDLP_DOWNLOADER_BACKEND_BASE_URL`: URL of the YT-DLP backend API

Example `.env` file:

```env
YTDLP_DOWNLOADER_BACKEND_BASE_URL=http://localhost:5032
```

## 📦 Docker Image from GitHub Packages

```bash
docker pull ghcr.io/mf450s/yt-dlp-docker-frontend:main

docker run -d \
  -p 5173:80 \
  -e YTDLP_DOWNLOADER_BACKEND_BASE_URL=http://localhost:5032 \
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

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/
│   ├── Dashboard.tsx   # Config management
│   ├── CookieManagement.tsx
│   ├── Archive.tsx
│   └── Downloader.tsx
├── services/
│   └── api.ts          # API client
├── store/
│   └── theme.ts        # Theme state
├── lib/
│   └── utils.ts        # Helper functions
├── App.tsx
├── main.tsx
└── index.css
```

## 🔌 API Integration

The frontend communicates with the YT-DLP backend API through the following endpoints:

### Download

- `POST /api/ytdlp/download` - Download video

### Configurations

- `GET /api/ytdlp/config/` - List all configs
- `GET /api/ytdlp/config/{name}` - Retrieve specific config
- `POST /api/ytdlp/config/{name}` - Create/update config
- `PATCH /api/ytdlp/config/{name}` - Edit config
- `DELETE /api/ytdlp/config/{name}` - Delete config
