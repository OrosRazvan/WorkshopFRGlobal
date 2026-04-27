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
