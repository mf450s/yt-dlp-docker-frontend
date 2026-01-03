import { useEffect, useState } from 'react'
import { apiService, ConfigData } from '@/services/api'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'

const Dashboard = () => {
  const [configs, setConfigs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<string | null>(null)
  const [formData, setFormData] = useState<ConfigData>({
    outputPath: '/app/downloads/{title}.%(ext)s',
    format: 'best',
    audioOnly: false,
  })
  const [configName, setConfigName] = useState('')

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    try {
      setLoading(true)
      const data = await apiService.getConfigs()
      setConfigs(data)
    } catch (error) {
      console.error('Failed to load configs:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingConfig(null)
    setConfigName('')
    setFormData({
      outputPath: '/app/downloads/{title}.%(ext)s',
      format: 'best',
      audioOnly: false,
    })
    setIsModalOpen(true)
  }

  const openEditModal = async (name: string) => {
    try {
      setEditingConfig(name)
      setConfigName(name)
      const data = await apiService.getConfig(name)
      setFormData(data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiService.createOrUpdateConfig(configName, formData)
      await loadConfigs()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Möchtest du die Konfiguration "${name}" wirklich löschen?`)) return
    try {
      await apiService.deleteConfig(name)
      await loadConfigs()
    } catch (error) {
      console.error('Failed to delete config:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Konfigurationen</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Neue Konfiguration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((name) => (
          <Card key={name}>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(name)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(name)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingConfig ? 'Konfiguration bearbeiten' : 'Neue Konfiguration'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Konfigurationsname"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            disabled={!!editingConfig}
            required
          />
          <Input
            label="Output Path"
            value={formData.outputPath}
            onChange={(e) => setFormData({ ...formData, outputPath: e.target.value })}
            required
          />
          <Input
            label="Format"
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.audioOnly}
              onChange={(e) => setFormData({ ...formData, audioOnly: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">Nur Audio</span>
          </label>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit">
              {editingConfig ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Dashboard