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
import PasscodeProtectedRoute from './routes/adminpasscodeRoute'
import AdminDashboard from './pages/admin/adminDashboard'
import CreateSlot from './components/forms/admin/createSlot'
import AvailableSlots from './pages/admin/availableSlots'
import Spots from './pages/user/spots'
import UserList from './pages/admin/userlist'

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

          <Route path='/spots'
          element={ 
            <ProtectedRoute>
              <Spots />
            </ProtectedRoute>
          }
          />

          <Route path='/reservation-form/:slotId'
          element={ 
            <ProtectedRoute>
              <UserReservationForm />
            </ProtectedRoute>
          }
          />

          {/* Admin Routes */}

          <Route 
          path='/admin/passcode' 
          element={ <PasswordPrompt /> } 
          />
       
          <Route 
          path='/admin/sign-in' 
          element={ 
            <PasscodeProtectedRoute>
              <AdminSignInForm />
            </PasscodeProtectedRoute>     
          } 
          />

           <Route path='/users-lists'
          element={ 
            <AdminRoute>
              <UserList />
            </AdminRoute>
          }
          />

          <Route 
          path='/admin-dashboard' 
          element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>}
          />

          <Route 
          path='/admin/slots' 
          element={
          <AdminRoute>
            <CreateSlot />
          </AdminRoute>} 
          />

          <Route 
          path='/admin/student-registration' 
          element={ 
          <AdminRoute>
            <StudentRegistration />
          </AdminRoute> 
          } 
          />

          <Route 
          path='/admin-dashboard/available-slots' 
          element={
          <AdminRoute>
            <AvailableSlots/>
          </AdminRoute>
          } 
          />

          <Route 
          path='/admin/create-account'
          element={ 
            <PasscodeProtectedRoute>
              <CreateAdminAccount />
            </PasscodeProtectedRoute>
           } 
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
