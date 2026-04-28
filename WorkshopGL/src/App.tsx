import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Cities } from './pages/Cities/Cities'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cities" element={<Cities />} />
        <Route path="*" element={<Navigate to="/cities" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
