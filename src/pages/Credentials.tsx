import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Plus, Trash2 } from "lucide-react";
import { apiService } from "@/services/api";

interface Credential {
  name: string;
  value: string;
}

const Credentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCredential: Credential = {
      ...formData,
    };
    setCredentials([...credentials, newCredential]);
    setFormData({ name: "", value: "" });
    setIsModalOpen(false);

    apiService
      .createConfig(newCredential.name, newCredential.value)
      .catch((error: unknown) => {
        console.error("Failed to save credential:", error);
      });
  };

  const handleDelete = (name: string) => {
    apiService.deleteConfig(name).catch((error: unknown) => {
      console.error("Failed to delete credential:", error);
    });
    setCredentials(credentials.filter((cred) => cred.name !== name));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
          Credentials
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Credential hinzufügen
        </Button>
      </div>

      <div className="space-y-4">
        {credentials.map((credential) => (
          <Card key={credential.name}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {credential.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {credential.value.substring(0, 50)}...
                </p>
              </div>
              <button
                onClick={() => handleDelete(credential.name)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Neue Credentials hinzufügen"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Value"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            required
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit">Hinzufügen</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Credentials;
