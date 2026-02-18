import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HamburgerMenu from '../../components/HamburgerMenu';
import './SuccessPage.css';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const requestId = location.state?.requestId || 'XXXXXX';

    return (
        <div className="success-page">
            <header className="dashboard-header">
                <div className="header-content">
                <Link to="/student/dashboard" className="logo">
                    <span className="logo-consult">Consult</span>
                    <span className="logo-ed">Ed</span>
                    </Link>
                    <HamburgerMenu userRole="student" />
                </div>
            </header>

            <div className="success-container">
                <div className="success-card">
                    <div className="success-icon">
                        <svg viewBox="0 0 120 120" className="checkmark">
                            <circle cx="60" cy="60" r="58" fill="#7CB342" />
                            <path
                                d="M35 60 L52 77 L85 44"
                                stroke="white"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    <h1 className="success-title">Request Submitted!</h1>

                    <p className="success-message">
                        Your request number is
                    </p>
                    <p className="request-number">[#{requestId}]</p>

                    <p className="success-instructions">
                        Please check your <span className="highlight">'View Consultation Request'</span> for the status of your request
                    </p>

                    <button
                        className="btn btn-primary success-button"
                        onClick={() => navigate('/student/history')}
                    >
                        View Consultation Requests
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;

