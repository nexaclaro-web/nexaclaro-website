import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { PlatformPage } from './pages/PlatformPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { OfferPage } from './pages/OfferPage'
import { ContactPage } from './pages/ContactPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="uslugi" element={<ServicesPage />} />
        <Route path="platform" element={<PlatformPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="recenzii" element={<ReviewsPage />} />
        <Route path="ponuda" element={<OfferPage />} />
        <Route path="kontakt" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}

export default App
