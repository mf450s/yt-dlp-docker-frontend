import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Plus, Trash2 } from "lucide-react";

interface Cookie {
  id: string;
  name: string;
  value: string;
  domain: string;
}

// Mock-Daten für Cookie-Management
// In der echten Implementation würde dies über die API kommen
const mockCookies: Cookie[] = [
  { id: "1", name: "session_id", value: "abc123...", domain: "youtube.com" },
  { id: "2", name: "auth_token", value: "xyz789...", domain: "youtube.com" },
];

const CookieManagement = () => {
  const [cookies, setCookies] = useState<Cookie[]>(mockCookies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    domain: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCookie: Cookie = {
      id: Date.now().toString(),
      ...formData,
    };
    setCookies([...cookies, newCookie]);
    setFormData({ name: "", value: "", domain: "" });
    setIsModalOpen(false);
    // TODO: API-Call zum Speichern des Cookies
  };

  const handleDelete = (id: string) => {
    setCookies(cookies.filter((c) => c.id !== id));
    // TODO: API-Call zum Löschen des Cookies
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cookie-Verwaltung</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Cookie hinzufügen
        </Button>
      </div>

      <div className="space-y-4">
        {cookies.map((cookie) => (
          <Card key={cookie.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{cookie.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Domain: {cookie.domain}
                </p>
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {cookie.value.substring(0, 50)}...
                </p>
              </div>
              <button
                onClick={() => handleDelete(cookie.id)}
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
        title="Neuen Cookie hinzufügen"
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
          <Input
            label="Domain"
            value={formData.domain}
            onChange={(e) =>
              setFormData({ ...formData, domain: e.target.value })
            }
            placeholder="z.B. youtube.com"
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

export default CookieManagement;
