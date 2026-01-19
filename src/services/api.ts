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
    const response = await fetch(
      `${this.baseUrl}/api/Downloads/download?confName=${encodeURIComponent(data.configName)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '"' + data.videoUrl + '"',
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Download failed: ${response.statusText}`);
    }
  }

  // GET alle Konfigurationsnamen
  async getConfigs(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/Configs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch configs: ${response.statusText}`);
    }
    return response.json();
  }

  // GET spezifische Konfiguration (als reiner Text)
  async getConfig(configName: string): Promise<string> {
    const encodedName = encodeURIComponent(configName);
    const response = await fetch(`${this.baseUrl}/api/Configs/${encodedName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch config '${configName}': ${response.statusText}`);
    }
    return response.text();
  }

  // POST Konfiguration erstellen (reiner Text)
  async createConfig(configName: string, content: string): Promise<void> {
    const encodedName = encodeURIComponent(configName);
    const response = await fetch(`${this.baseUrl}/api/Configs/${encodedName}`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: content,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Failed to create config '${configName}': ${response.statusText}`
      );
    }
  }

  // POST Konfiguration aktualisieren (reiner Text)
  async updateConfig(configName: string, content: string): Promise<void> {
    const encodedName = encodeURIComponent(configName);
    const response = await fetch(`${this.baseUrl}/api/Configs/${encodedName}`, {
      method: "PUT",
      headers: { "Content-Type": "text/plain" },
      body: content,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Failed to update config '${configName}': ${response.statusText}`
      );
    }
  }

  // DELETE Konfiguration löschen
  async deleteConfig(configName: string): Promise<void> {
    const encodedName = encodeURIComponent(configName);
    const response = await fetch(`${this.baseUrl}/api/Configs/${encodedName}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete config '${configName}': ${response.statusText}`);
    }
  }
}

export const apiService = new ApiService(API_BASE_URL);
export type { DownloadRequest, Config };
