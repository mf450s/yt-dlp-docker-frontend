import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useThemeStore } from "../store/theme";
import { Sun, Moon, Wrench, Cookie, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Download", icon: Download },
    { path: "/configs", label: "Configs", icon: Wrench },
    { path: "/credentials", label: "Credentials", icon: Cookie },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95 shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                YT-DLP Manager
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card shrink-0 w-full">
        <div className="w-full px-2 sm:px-4 lg:px-8">
          <div className="flex gap-0 sm:gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 sm:flex-shrink",
                    isActive
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.substring(0, 1).toUpperCase()}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto shrink-0 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            <p>© 2026 YT-DLP Manager</p>
            <p>Powered by yt-dlp</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
