import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfessors, createConsultationRequest, getStudentDashboard } from '../../api/services';
import { toast } from 'react-toastify';
import HamburgerMenu from '../../components/HamburgerMenu';
import './RequestConsultation.css';
import { Link } from 'react-router-dom';

const RequestConsultation = () => {
    const [professors, setProfessors] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [student, setStudent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        section: '',
        subject: '',
        purpose: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profResponse, studentResponse] = await Promise.all([
                getProfessors(),
                getStudentDashboard()
            ]);

            if (profResponse.success) {
                setProfessors(profResponse.professors);
            }

            if (studentResponse.success) {
                setStudent(studentResponse.student);
                setFormData(prev => ({
                    ...prev,
                    name: studentResponse.student.full_name,
                    studentId: studentResponse.student.student_id
                }));
            }
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfessorSelect = (prof) => {
        setSelectedProfessor(prof);
        setFormData(prev => ({
            ...prev,
            section: prof.section,
            subject: `${prof.course_code} - ${prof.course_name}`
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProfessor) {
            toast.error('Please select a professor');
            return;
        }

        setSubmitting(true);
        try {
            const response = await createConsultationRequest({
                professor_id: selectedProfessor.professor_id,
                course_id: selectedProfessor.course_id,
                purpose: formData.purpose
            });

            if (response.success) {
                navigate('/student/success', {
                    state: { requestId: response.request_id }
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                <Link to="/student/dashboard" className="logo">
                    <span className="logo-consult">Consult</span>
                    <span className="logo-ed">Ed</span>
                    </Link>
                    <HamburgerMenu userRole="student" />
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    {!selectedProfessor ? (
                        <>
                            <div className="professor-grid">
                                {professors.map((prof) => (
                                    <div
                                        key={`${prof.professor_id}-${prof.course_id}`}
                                        className="professor-card"
                                    >
                                        <div className="professor-avatar">
                                            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="32" cy="32" r="32" fill="#000000" />
                                                <circle cx="32" cy="24" r="10" fill="white" />
                                                <path d="M16 56 C16 45 22 40 32 40 C42 40 48 45 48 56" fill="white" />
                                            </svg>
                                        </div>
                                        <h3 className="professor-name">{prof.first_name} {prof.last_name}</h3>
                                        <p className="professor-course">[{prof.course_code}]</p>
                                        <p className="professor-section">[{prof.section}]</p>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleProfessorSelect(prof)}
                                        >
                                            Request Consultation
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="request-form-container">
                            <div className="card">
                                <h2 className="form-title">Consultation Request Form</h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Enter Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.name}
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Student ID</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.studentId}
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Section</label>
                                        <select
                                            className="form-select"
                                            value={formData.section}
                                            disabled
                                        >
                                            <option value={formData.section}>{formData.section}</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Subject</label>
                                        <select
                                            className="form-select"
                                            value={formData.subject}
                                            disabled
                                        >
                                            <option value={formData.subject}>{formData.subject}</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Purpose of Request</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.purpose}
                                            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                                            placeholder="Subject"
                                            required
                                            minLength={10}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RequestConsultation;

