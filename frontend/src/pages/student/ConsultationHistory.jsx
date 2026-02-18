import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentConsultationRequests } from '../../api/services';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import HamburgerMenu from '../../components/HamburgerMenu';
import './ConsultationHistory.css';
import { Link } from 'react-router-dom';

const ConsultationHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await getStudentConsultationRequests();
            if (response.success) {
                setRequests(response.requests);
            }
        } catch (error) {
            toast.error('Failed to load consultation requests');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-pending',
            approved: 'badge-approved',
            rejected: 'badge-rejected'
        };
        return `badge ${badges[status] || ''}`;
    };

    const formatStatus = (request) => {
        if (request.status === 'approved') {
            return `[Approved/Declined]\n[If approved, date and time dapat nandito and kung online or ftf consultation sha based sa approved ng prof]`;
        } else if (request.status === 'rejected') {
            return '[Declined]';
        }
        return '[Pending]';
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
                    <h1 className="page-title">Consultation requests</h1>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Date requested</th>
                                    <th>Professor</th>
                                    <th>Subject</th>
                                    <th>Purpose of request</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No consultation requests yet
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request.request_id}>
                                            <td>#{request.request_id}</td>
                                            <td>
                                                {format(new Date(request.created_at), 'MM/dd/yyyy')}
                                            </td>
                                            <td>
                                                Prof. {request.prof_first_name} {request.prof_last_name}
                                            </td>
                                            <td>
                                                [{request.course_code}]
                                            </td>
                                            <td className="purpose-cell">
                                                {request.purpose}
                                            </td>
                                            <td className="status-cell">
                                                {request.status === 'approved' && (
                                                    <div className="status-content">
                                                    <div className="status-label">[Approved]</div>
                                                    <div className="status-details">
                                                        Date: {format(new Date(request.approved_date), 'MM/dd/yyyy')}
                                                        <br />
                                                        Time: {request.approved_time}
                                                        <br />
                                                        Type: {request.consultation_type === 'face_to_face' ? 'Face-to-face' : 'Online'}
                                                    </div>
                                                </div>
                                            )}
                                                {request.status === 'rejected' && (
                                                    <div className="status-content">
                                                        <div className="status-label">[Declined]</div>
                                                    </div>
                                                )}
                                                {request.status === 'pending' && (
                                                    <div className="status-content">
                                                        <div className="status-label">[Pending]</div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConsultationHistory;

