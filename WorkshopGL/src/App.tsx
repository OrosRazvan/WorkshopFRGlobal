import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'

import { Cities } from './pages/Cities/Cities'

function App() {
  return (
    <BrowserRouter>
      <header
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e2e2e2',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <Link to="/cities">Cities</Link>
      </header>

      <Routes>
        <Route path="/cities" element={<Cities />} />
        <Route path="*" element={<Navigate to="/cities" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
