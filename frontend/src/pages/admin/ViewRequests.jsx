import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminConsultationRequests } from '../../api/services';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import '../student/ConsultationHistory.css';

const ViewRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await getAdminConsultationRequests();
            if (response.success) {
                setRequests(response.requests);
            }
        } catch (error) {
            toast.error('Failed to load requests');
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

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-consult">Consult</span>
                        <span className="logo-ed">Ed</span>
                    </div>
                    <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <h1 className="page-title">All Consultation Requests</h1>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Date</th>
                                    <th>Student</th>
                                    <th>Professor</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No consultation requests
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request.request_id}>
                                            <td>#{request.request_id}</td>
                                            <td>{format(new Date(request.created_at), 'MMM dd, yyyy')}</td>
                                            <td>
                                                {request.student_first_name} {request.student_last_name}
                                            </td>
                                            <td>
                                                {request.prof_first_name} {request.prof_last_name}
                                            </td>
                                            <td>{request.course_code}</td>
                                            <td>
                                                <span className={getStatusBadge(request.status)}>
                                                    {request.status.toUpperCase()}
                                                </span>
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

export default ViewRequests;
