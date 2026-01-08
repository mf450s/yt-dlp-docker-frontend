import { useState } from "react";
import Card from "@/components/ui/Card";
import { FileVideo, Calendar, HardDrive } from "lucide-react";

interface ArchivedVideo {
  id: string;
  title: string;
  url: string;
  downloadedAt: string;
  size: string;
  config: string;
}

// Mock-Daten für Archiv
const mockArchive: ArchivedVideo[] = [
  {
    id: "1",
    title: "Beispiel Video 1",
    url: "https://youtube.com/watch?v=example1",
    downloadedAt: "2026-01-03T10:30:00",
    size: "45.2 MB",
    config: "standard",
  },
  {
    id: "2",
    title: "Beispiel Video 2",
    url: "https://youtube.com/watch?v=example2",
    downloadedAt: "2026-01-02T15:45:00",
    size: "123.7 MB",
    config: "high-quality",
  },
];

const Archive = () => {
  const [videos] = useState<ArchivedVideo[]>(mockArchive);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Archiv</h1>
        <p className="text-muted-foreground mt-2">
          Übersicht der heruntergeladenen Videos
        </p>
      </div>

      <div className="space-y-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileVideo className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(video.downloadedAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    {video.size}
                  </div>
                  <p className="font-mono text-xs">{video.url}</p>
                  <p>
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {video.config}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FileVideo className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Keine archivierten Videos vorhanden
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Archive;
