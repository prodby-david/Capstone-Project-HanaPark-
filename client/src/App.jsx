import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './pages/hero'
import SignIn from './pages/user/signin'
import ForgotPassword from './pages/user/forgot-password'
import Visitors from './pages/visitors'
import StudentRegistration from './pages/admin/registration/studentRegistration'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/authContext';
import Dashboard from './pages/user/dashboard'
import ProtectedRoute from './routes/protectedRoute';
import ErrorNotFound from './components/error/404error'
import UserReservationForm from './components/forms/userReservationForm'

function App() {


  return (
    <AuthProvider>
    <Router>
      <Routes>

          {/* General Routes */}
          <Route path="*" element={ <ErrorNotFound />} />
          <Route path="/" element={ <Hero />} />
          <Route path="/sign-in" element={ <SignIn />} />
          <Route path="/reset-password" element={ <ForgotPassword />} />
          <Route path="/visitors" element={ <Visitors /> } />

          {/* User Routes */}

          <Route path='/dashboard'
          element={ 
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />

          <Route path='/user/reservation-form'
          element={ 
            <ProtectedRoute>
              <UserReservationForm />
            </ProtectedRoute>
          }
          />

          {/* Admin Routes */}
          <Route path='/admin/student-registration' element={ <StudentRegistration /> } />
      </Routes>

      <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          closeOnClick
          pauseOnHover
          theme='colored'
      />
      
    </Router>
    </AuthProvider>
  )
}

export default App;
