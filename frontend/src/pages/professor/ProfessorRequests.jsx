import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfessorConsultationRequests, approveConsultationRequest, rejectConsultationRequest } from '../../api/services';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import HamburgerMenu from '../../components/HamburgerMenu';
import './ProfessorRequests.css';
import { Link } from 'react-router-dom';


const ProfessorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [approvalData, setApprovalData] = useState({
        approved_date: '',
        approved_time: '',
        consultation_type: 'face_to_face',
        consultation_note: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await getProfessorConsultationRequests();
            if (response.success) {
                setRequests(response.requests);
            }
        } catch (error) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await approveConsultationRequest(selectedRequest.request_id, approvalData);
            if (response.success) {
                toast.success('Consultation request approved!');
                setShowApprovalForm(false);
                setSelectedRequest(null);
                fetchRequests();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async (requestId) => {
        if (!window.confirm('Are you sure you want to reject this request?')) {
            return;
        }

        try {
            const response = await rejectConsultationRequest(requestId);
            if (response.success) {
                toast.success('Request rejected');
                fetchRequests();
            }
        } catch (error) {
            toast.error('Failed to reject request');
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
                <Link to="/professor/dashboard" className="logo">
                    <span className="logo-consult">Consult</span>
                    <span className="logo-ed">Ed</span>
                    </Link>
                    <HamburgerMenu userRole="professor" />
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <h1 className="page-title">Consultation requests</h1>

                    {selectedRequest && !showApprovalForm ? (
                        <div className="request-detail-card">
                            <div className="card">
                                <h2 className="card-title">Request ID: #{selectedRequest.request_id}</h2>

                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={`${selectedRequest.student_first_name} ${selectedRequest.student_last_name}`}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Student ID</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedRequest.student_number}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Section</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={`Section (Ex. COM241)`}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedRequest.course_code}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Purpose of Request</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedRequest.purpose}
                                        disabled
                                    />
                                </div>

                                {selectedRequest.status === 'pending' && (
                                    <div className="form-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowApprovalForm(true)}
                                        >
                                            APPROVE
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                handleReject(selectedRequest.request_id);
                                                setSelectedRequest(null);
                                            }}
                                        >
                                            DECLINE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : showApprovalForm ? (
                        <div className="approval-form-card">
                            <div className="card">
                                <h2 className="card-title">
                                    Request ID: #{selectedRequest.request_id} (ONLY IF APPROVED)
                                </h2>

                                <form onSubmit={handleApprove}>
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={approvalData.approved_date}
                                            onChange={(e) => setApprovalData({ ...approvalData, approved_date: e.target.value })}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Time</label>
                                        <input
                                            type="time"
                                            className="form-input"
                                            value={approvalData.approved_time}
                                            onChange={(e) => setApprovalData({ ...approvalData, approved_time: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Type of Consultation</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="consultation_type"
                                                    value="face_to_face"
                                                    checked={approvalData.consultation_type === 'face_to_face'}
                                                    onChange={(e) => setApprovalData({ ...approvalData, consultation_type: e.target.value })}
                                                />
                                                Face to Face
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="consultation_type"
                                                    value="online"
                                                    checked={approvalData.consultation_type === 'online'}
                                                    onChange={(e) => setApprovalData({ ...approvalData, consultation_type: e.target.value })}
                                                />
                                                Online
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Note</label>
                                        <textarea
                                            className="form-textarea"
                                            value={approvalData.consultation_note}
                                            onChange={(e) => setApprovalData({ ...approvalData, consultation_note: e.target.value })}
                                            placeholder={approvalData.consultation_type === 'face_to_face'
                                                ? 'Enter location (e.g., Room 301, Faculty Office)'
                                                : 'Enter meeting link (e.g., Zoom, Google Meet)'}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowApprovalForm(false);
                                                setApprovalData({
                                                    approved_date: '',
                                                    approved_time: '',
                                                    consultation_type: 'face_to_face',
                                                    consultation_note: ''
                                                });
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Submitting...' : 'SUBMIT'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
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
                                                No consultation requests
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((request) => (
                                            <tr key={request.request_id}>
                                                <td>
                                                    <button
                                                        className="request-id-link"
                                                        onClick={() => setSelectedRequest(request)}
                                                    >
                                                        #{request.request_id}
                                                    </button>
                                                    <br />
                                                    <span className="view-request-link">Click here to view Request</span>
                                                </td>
                                                <td>[{format(new Date(request.created_at), 'MM/yy/yyyy')}]</td>
                                                <td>Prof. [{request.student_first_name} {request.student_last_name}]</td>
                                                <td>[{request.course_code}]</td>
                                                <td className="purpose-cell">
                                                    [{request.purpose}]
                                                </td>
                                                <td>
                                                    [{request.status === 'pending' ? 'Pending' : request.status === 'approved' ? 'Approved' : 'Declined'}]
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProfessorRequests;
