import './App.css'
import Header from './components/Layout/Header.jsx'
import Footer from './components/Layout/Footer.jsx'
import { BrowserRouter } from 'react-router-dom'
import Layout from './components/Layout/Layout.js'

function App() {

  return (
    <BrowserRouter>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="dashboard" element={<Dashboard/>}/>
      </Route>
    </BrowserRouter>
  )
}

export default App