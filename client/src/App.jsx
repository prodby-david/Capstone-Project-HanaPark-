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
import UserReservationForm from './components/forms/user/userReservationForm'
import CreateAdminAccount from './components/forms/admin/createAdminAccount'
import AdminSignInForm from './components/forms/admin/adminSignInForm'
import { AdminContextProvider } from './context/adminContext'
import AdminRoute from './routes/adminProtectedRoute'
import PasswordPrompt from './components/modals/passwordPrompt'

function App() {


  return (
    <AuthProvider>
      <AdminContextProvider>
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
       
          <Route 
          path='/admin' 
          element={ <AdminSignInForm /> } 
          />

          <Route 
          path='/admin/student-registration' 
          element={ 
          <AdminRoute>
            <StudentRegistration />
          </AdminRoute> } 
          />

          <Route 
          path='/admin/create-account'
          element={ 
          <AdminRoute>
            <CreateAdminAccount />
          </AdminRoute> } 
          />



      </Routes>

      <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          closeOnClick
          pauseOnHover
          theme='colored'
      />
      
    </Router>
    </AdminContextProvider>
    </AuthProvider>
  )
}

export default App;
