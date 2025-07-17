import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login';
import { EmployeeDashboard } from './employeedashboard';
import { AddEmployee } from './addemployee';
import { EditEmployee } from './editemployee';
import { DeleteEmployee } from './deleteemployee';
import { Signup } from './signup';
import { PrivateRoute } from './privateroute';
import { PasswordChange } from './passwordchange';
import { ForgotPassword } from './forgot-password';
import { VerifyOTP } from './verifyotp';
import { ResetPassword } from './resetpassword';
import { Dashboard } from './dashboard';

function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Login />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
      <Route path='forgot-password' element={<ForgotPassword/>}/>
      <Route path='verify-otp' element={<VerifyOTP/>}/>
      <Route path='reset-password' element={<ResetPassword/>}/>

      <Route path='dashboard' element={
        <PrivateRoute><Dashboard /></PrivateRoute>
      } />
      <Route path='dashboard/employee-dashboard' element={
        <PrivateRoute><EmployeeDashboard /></PrivateRoute>
      } />

      <Route path='dashboard/employee-dashboard/add' element={
        <PrivateRoute><AddEmployee /></PrivateRoute>
      } />

      <Route path='dashboard/employee-dashboard/edit/:id' element={
        <PrivateRoute><EditEmployee /></PrivateRoute>
      } />

      <Route path='dashboard/employee-dashboard/delete/:id' element={
        <PrivateRoute><DeleteEmployee /></PrivateRoute>
      } />

      <Route path='dashboard/password-change' element={
        <PrivateRoute><PasswordChange/></PrivateRoute>
      }/>

    </Routes>
    </BrowserRouter>
  );
}

export default App;
