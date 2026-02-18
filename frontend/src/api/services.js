import axios from './axios';

// ========== AUTH ==========
export const login = async (username, password) => {
    const response = await axios.post('/auth/login', { username, password });
    return response.data;
};

// ========== STUDENT ==========
export const getStudentDashboard = async () => {
    const response = await axios.get('/student/dashboard');
    return response.data;
};

export const getProfessors = async () => {
    const response = await axios.get('/student/professors');
    return response.data;
};

export const createConsultationRequest = async (data) => {
    const response = await axios.post('/student/consultation-request', data);
    return response.data;
};

export const getStudentConsultationRequests = async () => {
    const response = await axios.get('/student/consultation-requests');
    return response.data;
};

// ========== PROFESSOR ==========
export const getProfessorDashboard = async () => {
    const response = await axios.get('/professor/dashboard');
    return response.data;
};

export const getProfessorConsultationRequests = async () => {
    const response = await axios.get('/professor/consultation-requests');
    return response.data;
};

export const getConsultationRequestDetails = async (id) => {
    const response = await axios.get(`/professor/consultation-requests/${id}`);
    return response.data;
};

export const approveConsultationRequest = async (id, data) => {
    const response = await axios.put(`/professor/consultation-requests/${id}/approve`, data);
    return response.data;
};

export const rejectConsultationRequest = async (id) => {
    const response = await axios.put(`/professor/consultation-requests/${id}/reject`);
    return response.data;
};

export const getProfessorSchedule = async () => {
    const response = await axios.get('/professor/schedule');
    return response.data;
};

// ========== ADMIN ==========
export const getStudents = async (search = '') => {
    const response = await axios.get('/admin/students', { params: { search } });
    return response.data;
};

export const getStudent = async (id) => {
    const response = await axios.get(`/admin/students/${id}`);
    return response.data;
};

export const createStudent = async (data) => {
    const response = await axios.post('/admin/students', data);
    return response.data;
};

export const updateStudent = async (id, data) => {
    const response = await axios.put(`/admin/students/${id}`, data);
    return response.data;
};

export const deleteStudent = async (id) => {
    const response = await axios.delete(`/admin/students/${id}`);
    return response.data;
};

export const getProfessorsAdmin = async (search = '') => {
    const response = await axios.get('/admin/professors', { params: { search } });
    return response.data;
};

export const createProfessor = async (data) => {
    const response = await axios.post('/admin/professors', data);
    return response.data;
};

export const updateProfessor = async (id, data) => {
    const response = await axios.put(`/admin/professors/${id}`, data);
    return response.data;
};

export const deleteProfessor = async (id) => {
    const response = await axios.delete(`/admin/professors/${id}`);
    return response.data;
};

export const getSections = async () => {
    const response = await axios.get('/admin/sections');
    return response.data;
};

export const getPrograms = async () => {
    const response = await axios.get('/admin/programs');
    return response.data;
};

export const getAdminConsultationRequests = async () => {
    const response = await axios.get('/admin/consultation-requests');
    return response.data;
};
