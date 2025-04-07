import React from 'react'
import './App.css'
import CropCategory from './components/CropCategory'
import Sidebar from './components/Sidebar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AddCropName from './components/AddCropName'
import CropList from './components/CropList';
import CropDetail from './components/CropDetail';

function App() {

  return (
   <>
   <Router>
    
    <div className="flex h-screen"> 
      <Sidebar /> 
      <div className="flex-1 p-6 w-[calc(100vw-370px)] bg-gray-100">
      <Routes>
         <Route path="/add-crop-category" element={<CropCategory />} />
         <Route path='/add-crop' element={<AddCropName/>}/>  
         <Route path='/crop-list' element={<CropList/>}/>  
         <Route path='/crop-detail/:id' element={<CropDetail/>}/>     
      </Routes>
      </div>
    </div>
    </Router>
    </>
  )
}

export default App
