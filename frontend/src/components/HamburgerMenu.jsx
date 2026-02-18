import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = ({ userRole = 'student' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = {
        student: [
            { label: 'Dashboard', path: '/student/dashboard' },
            { label: 'Request Consultation', path: '/student/request' },
            { label: 'View Requests', path: '/student/history' }
        ],
        professor: [
            { label: 'Dashboard', path: '/professor/dashboard' },
            { label: 'View Requests', path: '/professor/requests' },
            { label: 'View Schedule', path: '/professor/schedule' }
        ],
        admin: [
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Manage Students', path: '/admin/students' },
            { label: 'Manage Sections', path: '/admin/sections' },
            { label: 'Manage Professors', path: '/admin/professors' }
        ],
        program_chair: [
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Manage Students', path: '/admin/students' },
            { label: 'Manage Sections', path: '/admin/sections' },
            { label: 'Manage Professors', path: '/admin/professors' }
        ],
        dean: [
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Manage Students', path: '/admin/students' },
            { label: 'Manage Sections', path: '/admin/sections' },
            { label: 'Manage Professors', path: '/admin/professors' }
        ]
    };

    const items = menuItems[userRole] || menuItems.student;

    return (
        <div className="hamburger-menu" ref={menuRef}>
            <button
                className="hamburger-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
            >
                <div className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {isOpen && (
                <div className="hamburger-dropdown">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            className="dropdown-item"
                            onClick={() => {
                                navigate(item.path);
                                setIsOpen(false);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                    <div className="dropdown-divider"></div>
                    <button
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
