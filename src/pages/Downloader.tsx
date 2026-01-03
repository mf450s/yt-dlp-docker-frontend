import { useState, useEffect, useRef } from 'react'
import { apiService } from '@/services/api'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Download, Loader2, CheckCircle, XCircle, Link2, Settings } from 'lucide-react'

type DownloadStatus = 'idle' | 'loading' | 'success' | 'error'

const Downloader = () => {
  const [configs, setConfigs] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedConfig, setSelectedConfig] = useState('')
  const [status, setStatus] = useState<DownloadStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConfigs()
    // Fokussiere das Input-Feld beim Laden
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const loadConfigs = async () => {
    try {
      const data = await apiService.getConfigs()
      setConfigs(data)
      if (data.length > 0) {
        setSelectedConfig(data[0])
      }
    } catch (error) {
      console.error('Failed to load configs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      await apiService.downloadVideo({
        videoUrl,
        configName: selectedConfig,
      })
      setStatus('success')
      setVideoUrl('')
      // Nach 3 Sekunden Status zurücksetzen
      setTimeout(() => {
        setStatus('idle')
        inputRef.current?.focus()
      }, 3000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Download fehlgeschlagen')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const configOptions = configs.map((config) => ({
    value: config,
    label: config,
  }))

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        {/* Haupttitel */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Download className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Video Download</h1>
          <p className="text-muted-foreground text-lg">
            Füge einen Link ein und starte den Download
          </p>
        </div>

        {/* Hauptformular */}
        <Card className="shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input - Hauptfokus */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Link2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  ref={inputRef}
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  disabled={status === 'loading'}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-sm text-muted-foreground pl-1">
                Unterstützt YouTube, Twitter, Instagram und viele weitere Plattformen
              </p>
            </div>

            {/* Erweiterte Optionen */}
            {configs.length > 0 && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {showAdvanced ? 'Optionen ausblenden' : 'Erweiterte Optionen'}
                </button>

                {showAdvanced && (
                  <div className="pt-2 border-t border-border">
                    <Select
                      label="Download-Konfiguration"
                      value={selectedConfig}
                      onChange={(e) => setSelectedConfig(e.target.value)}
                      options={configOptions}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Keine Configs Warnung */}
            {configs.length === 0 && (
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                  Keine Konfigurationen verfügbar
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Erstelle zuerst eine Konfiguration im Dashboard, um Downloads zu starten.
                </p>
              </div>
            )}

            {/* Download Button */}
            <Button
              type="submit"
              disabled={status === 'loading' || configs.length === 0 || !videoUrl.trim()}
              size="lg"
              className="w-full h-14 text-lg font-semibold transition-all duration-200"
            >
              {status === 'loading' && (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Download läuft...
                </>
              )}
              {status === 'success' && (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Download gestartet!
                </>
              )}
              {status === 'error' && (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Fehler aufgetreten
                </>
              )}
              {status === 'idle' && (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Jetzt herunterladen
                </>
              )}
            </Button>

            {/* Feedback Meldungen */}
            {status === 'success' && (
              <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  ✓ Download wurde erfolgreich gestartet
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Die Datei wird im Hintergrund verarbeitet und ist bald verfügbar.
                </p>
              </div>
            )}

            {status === 'error' && errorMessage && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
                  ✗ Download fehlgeschlagen
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {errorMessage}
                </p>
              </div>
            )}
          </form>
        </Card>

        {/* Hilfetext */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tastaturkürzel: <kbd className="px-2 py-1 text-xs bg-muted rounded">Ctrl + V</kbd> zum Einfügen,{' '}
            <kbd className="px-2 py-1 text-xs bg-muted rounded">Enter</kbd> zum Starten
          </p>
        </div>
      </div>
    </div>
  )
}

export default Downloader