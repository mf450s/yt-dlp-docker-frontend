import { useState, useEffect, useRef } from 'react'
import { apiService } from '@/services/api'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Download, Loader2, CheckCircle, XCircle, Link2, Settings, RefreshCw } from 'lucide-react'

type DownloadStatus = 'idle' | 'loading' | 'success' | 'error'

const Downloader = () => {
  const [configs, setConfigs] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedConfig, setSelectedConfig] = useState('')
  const [status, setStatus] = useState<DownloadStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  // showAdvanced State wurde entfernt
  const inputRef = useRef<HTMLInputElement>(null)
  const [loadingConfigs, setLoadingConfigs] = useState(false)

  useEffect(() => {
    loadConfigs()
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const loadConfigs = async () => {
    setLoadingConfigs(true)
    try {
      const data = await apiService.getConfigs()
      setConfigs(data)
      if (data.length > 0 && !selectedConfig) {
        setSelectedConfig(data[0])
      }
    } catch (error) {
      console.error('Failed to load configs:', error)
    } finally {
      setLoadingConfigs(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) return

    setStatus('loading')
    setErrorMessage('')

    try {
      await apiService.downloadVideo({
        videoUrl,
        configName: selectedConfig,
      })
      setStatus('success')
      setVideoUrl('')
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
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="w-full text-center space-y-4 mb-10">
        <div className="inline-flex p-4 rounded-full bg-primary/10 mb-2 ring-1 ring-primary/20">
          <Download className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Media Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Lade Videos und Audio von YouTube, Twitter, Instagram und mehr herunter.
          Einfach Link einfügen und starten.
        </p>
      </div>

      <Card className="w-full shadow-2xl border-primary/10 overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="p-1 sm:p-2 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 h-1.5" />
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Link2 className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                ref={inputRef}
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                disabled={status === 'loading'}
                className="w-full pl-14 pr-4 py-5 text-xl bg-background border-2 border-input rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 shadow-sm"
              />
            </div>
          </div>

          {/* Config Selection Section - Jetzt dauerhaft sichtbar */}
          <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
             <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Konfiguration wählen
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={selectedConfig}
                      onChange={(e) => setSelectedConfig(e.target.value)}
                      options={configOptions}
                      disabled={configs.length === 0}
                      className="bg-background w-full"
                    />
                  </div>
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={loadConfigs} 
                    disabled={loadingConfigs}
                    title="Konfigurationen neu laden"
                    className="bg-background shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingConfigs ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
          </div>

          {configs.length === 0 && !loadingConfigs && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm">
              <p className="font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Keine Konfigurationen gefunden
              </p>
              <p className="mt-1 opacity-80 pl-6">
                Bitte erstelle zuerst eine Konfiguration im Dashboard.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === 'loading' || configs.length === 0 || !videoUrl.trim()}
            size="lg"
            className={`w-full h-16 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-primary/25 ${
              status === 'success' ? 'bg-green-600 hover:bg-green-700' : 
              status === 'error' ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {status === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
              {status === 'success' && <CheckCircle className="w-6 h-6" />}
              {status === 'error' && <XCircle className="w-6 h-6" />}
              {status === 'idle' && <Download className="w-6 h-6" />}
              
              <span>
                {status === 'loading' ? 'Download wird gestartet...' :
                 status === 'success' ? 'Erfolgreich gestartet!' :
                 status === 'error' ? 'Fehler aufgetreten' :
                 'Download Starten'}
              </span>
            </div>
          </Button>

          {/* Status Messages */}
          {(status === 'success' || (status === 'error' && errorMessage)) && (
            <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
              status === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' 
                : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'
            }`}>
              <div className="flex items-start gap-3">
                {status === 'success' ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-semibold">
                    {status === 'success' ? 'Download gestartet' : 'Fehler'}
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    {status === 'success' 
                      ? 'Der Download wurde zur Warteschlange hinzugefügt.' 
                      : errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Tipp: Du kannst mehrere Links nacheinander einfügen.</p>
      </div>
    </div>
  )
}

export default Downloader
