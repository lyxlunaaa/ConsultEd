import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import RequestConsultation from './pages/student/RequestConsultation';
import ConsultationHistory from './pages/student/ConsultationHistory';
import SuccessPage from './pages/student/SuccessPage';

// Professor Pages
import ProfessorDashboard from './pages/professor/ProfessorDashboard';
import ProfessorRequests from './pages/professor/ProfessorRequests';
import Schedule from './pages/professor/Schedule';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageProfessors from './pages/admin/ManageProfessors';
import ManageSections from './pages/admin/ManageSections';
import ViewPrograms from './pages/admin/ViewPrograms';
import ViewRequests from './pages/admin/ViewRequests';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                        <Route path="/student/dashboard" element={<StudentDashboard />} />
                        <Route path="/student/request" element={<RequestConsultation />} />
                        <Route path="/student/history" element={<ConsultationHistory />} />
                        <Route path="/student/success" element={<SuccessPage />} />
                    </Route>

                    {/* Professor Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['professor']} />}>
                        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
                        <Route path="/professor/requests" element={<ProfessorRequests />} />
                        <Route path="/professor/schedule" element={<Schedule />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['registrar', 'dean', 'program_chair']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/students" element={<ManageStudents />} />
                        <Route path="/admin/professors" element={<ManageProfessors />} />
                        <Route path="/admin/sections" element={<ManageSections />} />
                        <Route path="/admin/programs" element={<ViewPrograms />} />
                        <Route path="/admin/requests" element={<ViewRequests />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
