import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/theme'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CookieManagement from './pages/CookieManagement'
import Archive from './pages/Archive'
import Downloader from './pages/Downloader'

function App() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <div className={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cookies" element={<CookieManagement />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/download" element={<Downloader />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  )
}

export default App