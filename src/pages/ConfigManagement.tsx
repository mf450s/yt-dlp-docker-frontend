import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FileText,
  Copy,
  Check,
} from "lucide-react";

const ConfigManagement = () => {
  const [configs, setConfigs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [configName, setConfigName] = useState("");
  const [configContent, setConfigContent] = useState("");
  const [previewConfig, setPreviewConfig] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getConfigs();
      setConfigs(data);
    } catch (error) {
      console.error("Failed to load configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingConfig(null);
    setConfigName("");
    setConfigContent(
      '# yt-dlp Konfiguration\n# Jede Zeile ist ein yt-dlp Argument\n\n# Beispiele:\n# --format "bestvideo[height<=1080]+bestaudio/best"\n# --output "/downloads/%(title)s.%(ext)s"\n# --merge-output-format mp4\n# --embed-thumbnail\n# --add-metadata\n'
    );
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (name: string) => {
    try {
      setEditingConfig(name);
      setConfigName(name);
      const content = await apiService.getConfig(name);
      setConfigContent(content);
      setSaveError(null);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load config:", error);
      alert("Fehler beim Laden der Konfiguration");
    }
  };

  const openPreview = async (name: string) => {
    try {
      const content = await apiService.getConfig(name);
      setPreviewConfig({ name, content });
    } catch (error) {
      console.error("Failed to load config:", error);
      alert("Fehler beim Laden der Konfiguration");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!configName.trim()) {
      setSaveError("Bitte gib einen Namen ein");
      return;
    }

    if (!configContent.trim()) {
      setSaveError("Bitte gib eine Konfiguration ein");
      return;
    }

    try {
      await apiService.createOrUpdateConfig(configName.trim(), configContent);
      await loadConfigs();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save config:", error);
      setSaveError(
        error instanceof Error ? error.message : "Fehler beim Speichern"
      );
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Möchtest du die Konfiguration "${name}" wirklich löschen?`))
      return;
    try {
      await apiService.deleteConfig(name);
      await loadConfigs();
    } catch (error) {
      console.error("Failed to delete config:", error);
      alert("Fehler beim Löschen der Konfiguration");
    }
  };

  const copyToClipboard = async (content: string, name: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedConfig(name);
      setTimeout(() => setCopiedConfig(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[color:var(--foreground)]">
            Konfigurationen
          </h1>
          <p className="text-muted-foreground">
            Verwalte deine yt-dlp Konfigurationen für verschiedene
            Download-Szenarien
          </p>
        </div>
        <Button onClick={openCreateModal} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Neue Konfiguration
        </Button>
      </div>

      {configs.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2 text-[color:var(--foreground)]">
            Keine Konfigurationen vorhanden
          </h3>
          <p className="text-muted-foreground mb-6">
            Erstelle deine erste yt-dlp Konfiguration, um Downloads zu starten
          </p>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2 text-[color:var(--foreground)" />
            Erste Konfiguration erstellen
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {configs.map((name) => (
            <Card key={name} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{name}</h3>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openPreview(name)}
                  className="flex-1"
                >
                  Ansehen
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(name)}
                  className="px-3"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(name)}
                  className="px-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingConfig
            ? `Konfiguration bearbeiten: ${editingConfig}`
            : "Neue Konfiguration"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Konfigurationsname"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            disabled={!!editingConfig}
            placeholder="z.B. high-quality, audio-only, playlist"
            required
          />

          <div className="space-y-2" style={{ color: "var(--foreground)" }}>
            <label className="block text-sm font-medium">
              Konfiguration (yt-dlp Argumente)
            </label>
            <textarea
              value={configContent}
              onChange={(e) => setConfigContent(e.target.value)}
              className="w-full h-80 px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-sm resize-none"
              placeholder="# Jede Zeile ist ein yt-dlp Argument\n--format bestvideo+bestaudio\n--output /downloads/%(title)s.%(ext)s\n--merge-output-format mp4"
              required
            />
            <p className="text-xs text-muted-foreground">
              Jede Zeile ist ein separates yt-dlp Argument. Zeilen die mit #
              beginnen sind Kommentare.
            </p>
          </div>

          {saveError && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                {saveError}
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit">
              {editingConfig ? "Aktualisieren" : "Erstellen"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewConfig}
        onClose={() => setPreviewConfig(null)}
        title={`Konfiguration: ${previewConfig?.name}`}
      >
        {previewConfig && (
          <div className="space-y-4">
            <div className="relative">
              <pre className="w-full h-96 px-4 py-3 bg-muted border-2 border-border rounded-xl font-mono text-sm overflow-auto">
                {previewConfig.content}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(previewConfig.content, previewConfig.name)
                }
                className="absolute top-3 right-3 p-2 bg-background border-2 border-border rounded-lg hover:bg-muted transition-colors"
              >
                {copiedConfig === previewConfig.name ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => setPreviewConfig(null)}
              >
                Schließen
              </Button>
              <Button
                onClick={() => {
                  setPreviewConfig(null);
                  openEditModal(previewConfig.name);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Bearbeiten
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConfigManagement;
