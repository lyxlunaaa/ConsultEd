import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfessorDashboard } from '../../api/services';
import { toast } from 'react-toastify';
import HamburgerMenu from '../../components/HamburgerMenu';
import '../student/StudentDashboard.css';
import { Link } from 'react-router-dom';

const ProfessorDashboard = () => {
    const [professor, setProfessor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await getProfessorDashboard();
            if (response.success) {
                setProfessor(response.professor);
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
                <Link to="/professor/dashboard" className="logo">
                    <span className="logo-consult">Consult</span>
                    <span className="logo-ed">Ed</span>
                </Link>
                    <HamburgerMenu userRole="professor" />
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <h1 className="welcome-message">
                        Welcome Back, Prof. {professor?.full_name}!
                    </h1>

                    <div className="action-cards">
                        <div
                            className="action-card"
                            onClick={() => navigate('/professor/requests')}
                        >
                            <div className="card-icon-wrapper">
                                <svg className="card-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <path d="M20 32 L28 40 L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            </div>
                            <h3>View Consultation Requests</h3>
                            <p>Review and respond to student requests</p>
                        </div>

                        <div
                            className="action-card"
                            onClick={() => navigate('/professor/schedule')}
                        >
                            <div className="card-icon-wrapper">
                                <svg className="card-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="10" y="14" width="44" height="40" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <line x1="10" y1="22" x2="54" y2="22" stroke="currentColor" strokeWidth="3" />
                                    <line x1="18" y1="10" x2="18" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="46" y1="10" x2="46" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    <rect x="18" y="30" width="6" height="6" fill="currentColor" />
                                    <rect x="29" y="30" width="6" height="6" fill="currentColor" />
                                    <rect x="40" y="30" width="6" height="6" fill="currentColor" />
                                    <rect x="18" y="42" width="6" height="6" fill="currentColor" />
                                    <rect x="29" y="42" width="6" height="6" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>View Schedule</h3>
                            <p>See your upcoming consultations</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfessorDashboard;
