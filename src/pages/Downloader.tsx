import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Download, Loader2, CheckCircle, XCircle } from 'lucide-react'

type DownloadStatus = 'idle' | 'loading' | 'success' | 'error'

const Downloader = () => {
  const [configs, setConfigs] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedConfig, setSelectedConfig] = useState('')
  const [status, setStatus] = useState<DownloadStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadConfigs()
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
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Download fehlgeschlagen')
    }
  }

  const configOptions = configs.map((config) => ({
    value: config,
    label: config,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Video herunterladen</h1>
        <p className="text-muted-foreground mt-2">
          Gib eine Video-URL ein und wähle eine Konfiguration
        </p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Video-URL"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />

          {configs.length > 0 && (
            <Select
              label="Konfiguration"
              value={selectedConfig}
              onChange={(e) => setSelectedConfig(e.target.value)}
              options={configOptions}
            />
          )}

          {configs.length === 0 && (
            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              Keine Konfigurationen verfügbar. Bitte erstelle zuerst eine Konfiguration im Dashboard.
            </div>
          )}

          <Button
            type="submit"
            disabled={status === 'loading' || configs.length === 0}
            className="w-full"
          >
            {status === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-4 h-4 mr-2" />}
            {status === 'error' && <XCircle className="w-4 h-4 mr-2" />}
            {status === 'idle' && <Download className="w-4 h-4 mr-2" />}
            {status === 'loading' && 'Wird heruntergeladen...'}
            {status === 'success' && 'Download gestartet!'}
            {status === 'error' && 'Fehler beim Download'}
            {status === 'idle' && 'Download starten'}
          </Button>

          {status === 'error' && errorMessage && (
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
              Der Download wurde erfolgreich gestartet und wird im Hintergrund verarbeitet.
            </div>
          )}
        </form>
      </Card>
    </div>
  )
}

export default Downloader