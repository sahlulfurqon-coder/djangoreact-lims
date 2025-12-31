import './App.css'
import { Routes, Route } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Home from './components/Home'
import About from './components/About'
import Create from './components/Create'
import Edit from './components/Edit'
import Delete from './components/Delete'
import Navbar from './components/Navbar'
import Analyses from './components/Analyses'

function App() {
  const myWidth = 220

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <Navbar
          drawerWidth={myWidth}
          content={
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/create" element={<Create />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/delete/:id" element={<Delete />} />
              <Route path="/analyses/:id" element={<Analyses />} />
            </Routes>
          }
        />
      </div>
    </LocalizationProvider>
  )
}

export default App
