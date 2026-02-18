import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrograms } from '../../api/services';
import { toast } from 'react-toastify';
import './ManageStudents.css';

const ViewPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            if (response.success) {
                setPrograms(response.programs);
            }
        } catch (error) {
            toast.error('Failed to load programs');
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
                    <h1 className="page-title">View Programs</h1>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Program Code</th>
                                    <th>Program Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="text-center">
                                            No programs found
                                        </td>
                                    </tr>
                                ) : (
                                    programs.map((program) => (
                                        <tr key={program.program_id}>
                                            <td>{program.program_code}</td>
                                            <td>{program.program_name}</td>
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

export default ViewPrograms;
