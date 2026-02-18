import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboard } from '../../api/services';
import { toast } from 'react-toastify';
import HamburgerMenu from '../../components/HamburgerMenu';
import './StudentDashboard.css';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await getStudentDashboard();
            if (response.success) {
                setStudent(response.student);
            }
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
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
                    <h1 className="welcome-message">
                        Welcome Back, {student?.full_name}!
                    </h1>

                    <div className="action-cards">
                        <div
                            className="action-card"
                            onClick={() => navigate('/student/request')}
                        >
                            <div className="card-icon-wrapper">
                                <svg className="card-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="12" y="8" width="32" height="40" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <line x1="18" y1="16" x2="38" y2="16" stroke="currentColor" strokeWidth="2" />
                                    <line x1="18" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="2" />
                                    <line x1="18" y1="32" x2="32" y2="32" stroke="currentColor" strokeWidth="2" />
                                    <path d="M42 38 L48 44 L48 52 L44 48 L38 48 L42 38 Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>Request Consultation</h3>
                            <p>Schedule a meeting with your professor</p>
                        </div>

                        <div
                            className="action-card action-card-primary"
                            onClick={() => navigate('/student/history')}
                        >
                            <div className="card-icon-wrapper">
                                <svg className="card-icon-check" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="3" />
                                    <path d="M25 40 L35 50 L55 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>View Consultation Requests</h3>
                            <p>Check the status of your requests</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
