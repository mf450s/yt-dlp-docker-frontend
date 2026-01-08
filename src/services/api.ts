// API Base URL aus Umgebungsvariable
const API_BASE_URL = "YTDLP_DOWNLOADER_BACKEND_BASE_URL";

interface DownloadRequest {
  videoUrl: string;
  configName: string;
}

interface Config {
  name: string;
  content: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Download Video
  async downloadVideo(data: DownloadRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/ytdlp/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Download failed: ${response.statusText}`);
    }
  }

  // GET alle Konfigurationsnamen
  async getConfigs(): Promise<string[]> {
    // URL ohne Trailing Slash wie angefordert
    const response = await fetch(`${this.baseUrl}/api/ytdlp/config`);
    if (!response.ok) {
      throw new Error(`Failed to fetch configs: ${response.statusText}`);
    }
    return response.json();
  }

  // GET spezifische Konfiguration (als reiner Text)
  async getConfig(configName: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/api/ytdlp/config/${configName}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }
    // Rückgabe als reiner Text
    return response.text();
  }

  // POST Konfiguration erstellen/aktualisieren (reiner Text)
  async createOrUpdateConfig(
    configName: string,
    content: string
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/ytdlp/config/${configName}`,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: content,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Failed to create/update config: ${response.statusText}`
      );
    }
  }

  // DELETE Konfiguration löschen
  async deleteConfig(configName: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/ytdlp/config/${configName}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete config: ${response.statusText}`);
    }
  }
}

export const apiService = new ApiService(API_BASE_URL);
export type { DownloadRequest, Config };
