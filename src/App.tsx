import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/theme";
import Layout from "./components/Layout";
import ConfigManagement from "./pages/ConfigManagement";
import CookieManagement from "./pages/CookieManagement";
import Archive from "./pages/Archive";
import Downloader from "./pages/Downloader";

function App() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className={theme}>
      <Router>
        <Layout>
          <Routes>
            {/* Downloader als Startseite */}
            <Route path="/" element={<Downloader />} />
            <Route path="/configs" element={<ConfigManagement />} />
            <Route path="/cookies" element={<CookieManagement />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
