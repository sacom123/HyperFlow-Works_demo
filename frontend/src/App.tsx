import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import HyperAgents from './pages/HyperAgents'
import Library from './pages/Library'
import KnowledgeBase from './pages/KnowledgeBase'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hyper-agents" element={<HyperAgents />} />
        <Route path="/library" element={<Library />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
