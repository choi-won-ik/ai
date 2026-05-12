import { useState } from 'react'
import Login from './pages/login'
import { Routes, Route } from "react-router-dom";
import LoginInput from './components/login/loginInput';
import FindPassword from './components/login/FindPassword';
import SearchBar from './pages/seach';
import Main from './pages/main';
import FileUpload from './pages/fileUpdate';

function App() {


  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/findPassword' element={<FindPassword />} />
        <Route path='/search' element={<SearchBar />} />
        <Route path='/fileUpdate' element={<FileUpload />} />
      </Routes>
    </div>
  )
}

export default App
