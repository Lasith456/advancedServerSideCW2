import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './Component/Navbar';
import ProtectedRoute from './utils/ProtectedRoute';
import Home from './pages/Home';
import BlogDetails from './pages/BlogDetails';
import UserBlogs from './pages/UserBlogs';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog'; 
import Profile from './pages/Profile';
function App() {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/personalblogs" element={<UserBlogs />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/blog/edit/:id" element={<EditBlog />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
