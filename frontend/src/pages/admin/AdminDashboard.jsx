import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HamburgerMenu from '../../components/HamburgerMenu';
import '../student/StudentDashboard.css';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [roleTitle, setRoleTitle] = useState('');

    useEffect(() => {
        if (user) {
            const titles = {
                'registrar': 'Registrar',
                'dean': 'Dean',
                'program_chair': `Prog Chair`
            };
            setRoleTitle(titles[user.role] || 'Admin');
        }
    }, [user]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                <Link to="/admin/dashboard" className="logo">
    <span className="logo-consult">Consult</span>
    <span className="logo-ed">Ed</span>
</Link>

                    <HamburgerMenu userRole= "admin"/>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <h1 className="welcome-message">
                        Welcome Back, {roleTitle}!
                    </h1>

                    <div className="action-cards admin-cards-grid">
                        <div
                            className="action-card admin-card"
                            onClick={() => navigate('/admin/students')}
                        >
                            <div className="card-icon-wrapper">
                                <svg className="card-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <path d="M20 32 L28 40 L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            </div>
                            <h3>Manage Students</h3>
                        </div>

                        <div
                            className="action-card admin-card"
                            onClick={() => navigate('/admin/sections')}
                        >
                            <div className="card-icon-wrapper">
                                <svg className="card-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="20" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <circle cx="40" cy="20" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <circle cx="32" cy="44" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <path d="M24 28 L24 36 M40 28 L40 36 M24 36 L40 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>View Sections</h3>
                        </div>

                        <div
                            className="action-card admin-card"
                            onClick={() => navigate('/admin/professors')}
                        >
                            <div className="card-icon-wrapper">
                                <svg className="card-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="12" y="20" width="40" height="30" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <line x1="12" y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="3" />
                                    <circle cx="32" cy="12" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <line x1="20" y1="38" x2="44" y2="38" stroke="currentColor" strokeWidth="2" />
                                    <line x1="20" y1="44" x2="38" y2="44" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>Manage Professors</h3>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
