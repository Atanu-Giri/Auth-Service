import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Success from './pages/Success'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
