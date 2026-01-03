// API Base URL aus Umgebungsvariable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004'

interface DownloadRequest {
  videoUrl: string
  configName: string
}

interface ConfigData {
  outputPath?: string
  format?: string
  audioOnly?: boolean
  [key: string]: any
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Download Video
  async downloadVideo(data: DownloadRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/ytdlp/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`)
    }
  }

  // GET alle Konfigurationen
  async getConfigs(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/ytdlp/config/`)
    if (!response.ok) {
      throw new Error(`Failed to fetch configs: ${response.statusText}`)
    }
    return response.json()
  }

  // GET spezifische Konfiguration
  async getConfig(configName: string): Promise<ConfigData> {
    const response = await fetch(`${this.baseUrl}/api/ytdlp/config/${configName}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`)
    }
    return response.json()
  }

  // POST/PUT Konfiguration erstellen/aktualisieren
  async createOrUpdateConfig(configName: string, data: ConfigData): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/ytdlp/config/${configName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Failed to create/update config: ${response.statusText}`)
    }
  }

  // PATCH Konfiguration bearbeiten
  async patchConfig(configName: string, data: Partial<ConfigData>): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/ytdlp/config/${configName}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Failed to patch config: ${response.statusText}`)
    }
  }

  // DELETE Konfiguration löschen
  async deleteConfig(configName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/ytdlp/config/${configName}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`Failed to delete config: ${response.statusText}`)
    }
  }
}

export const apiService = new ApiService(API_BASE_URL)
export type { DownloadRequest, ConfigData }