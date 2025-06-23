import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './pages/hero'
import SignIn from './pages/user/signin'
import ForgotPassword from './pages/user/forgot-password'
import Visitors from './pages/visitors'
import StudentRegistration from './pages/admin/registration/studentRegistration'


function App() {

  return (
    <Router>
      <Routes>

          {/* General Routes */}
          <Route path="/" element={ <Hero />} />
          <Route path="/sign-in" element={ <SignIn />} />
          <Route path="/reset-password" element={ <ForgotPassword />} />
          <Route path="/visitors" element={ <Visitors /> } />

          {/* Admin Routes */}
          <Route path='/admin/student-registration' element={ <StudentRegistration /> } />
      </Routes>
    </Router>
  )
}

export default App;
