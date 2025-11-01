import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import Criteria from './pages/Criteria.tsx'
import Criterion from './pages/Criterion.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criteria" element={<Criteria />} />
        <Route path="/criteria/:id" element={<Criterion />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
