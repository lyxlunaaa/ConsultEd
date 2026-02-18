import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfessorsAdmin, createProfessor, updateProfessor, deleteProfessor } from '../../api/services';
import { toast } from 'react-toastify';
import HamburgerMenu from '../../components/HamburgerMenu';
import ConfirmDialog from '../../components/ConfirmDialog';
import './ManageStudents.css';
import { Link } from 'react-router-dom';


const ManageProfessors = () => {
    const { user } = useAuth();
    const [professors, setProfessors] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProfessor, setCurrentProfessor] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        department: '',
        username: '',
        password: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [professorToDelete, setProfessorToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfessors();
    }, []);

    const fetchProfessors = async () => {
        try {
            const response = await getProfessorsAdmin(search);
            if (response.success) {
                setProfessors(response.professors);
            }
        } catch (error) {
            toast.error('Failed to load professors');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchProfessors();
    };

    const handleAdd = () => {
        setEditMode(false);
        setCurrentProfessor(null);
        setFormData({
            employee_id: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            department: '',
            username: '',
            password: '',
            status: 'active'
        });
        setShowModal(true);
    };

    const handleEdit = (professor) => {
        setEditMode(true);
        setCurrentProfessor(professor);
        setFormData({
            employee_id: professor.employee_id,
            first_name: professor.first_name,
            last_name: professor.last_name,
            middle_name: professor.middle_name || '',
            department: professor.department,
            username: '',
            password: '',
            status: professor.status
        });
        setShowModal(true);
    };

    const handleDelete = (professorId) => {
        setProfessorToDelete(professorId);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteProfessor(professorToDelete);
            if (response.success) {
                toast.success('Professor deleted successfully');
                fetchProfessors();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete professor');
        } finally {
            setShowConfirm(false);
            setProfessorToDelete(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editMode) {
                const response = await updateProfessor(currentProfessor.professor_id, formData);
                if (response.success) {
                    toast.success('Professor updated successfully');
                    setShowModal(false);
                    fetchProfessors();
                }
            } else {
                const response = await createProfessor(formData);
                if (response.success) {
                    toast.success('Professor created successfully');
                    setShowModal(false);
                    fetchProfessors();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

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
                    <div className="page-header-with-search">
                        <h1 className="page-title">Professors</h1>
                        <div className="search-box">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search professor"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="search-clear" onClick={() => setSearch('')}>×</button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Employee ID</th>
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Department</th>
                                    <th>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professors.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No professors found
                                        </td>
                                    </tr>
                                ) : (
                                    professors.map((professor, index) => (
                                        <tr key={professor.professor_id}>
                                            <td>{index + 1}</td>
                                            <td>{professor.employee_id}</td>
                                            <td>{professor.last_name}</td>
                                            <td>{professor.first_name}</td>
                                            <td>{professor.middle_name || ''}</td>
                                            <td>{professor.department}</td>
                                            <td className="manage-cell">
                                                <a
                                                    href="#"
                                                    className="edit-student-link"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleEdit(professor);
                                                    }}
                                                >
                                                    EDIT PROFESSOR
                                                </a>
                                                <br />
                                                <button
                                                    className="delete-student-btn"
                                                    onClick={() => handleDelete(professor.professor_id)}
                                                >
                                                    Delete Professor
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="add-section-container">
                        <button className="add-student-btn" onClick={handleAdd}>
                            + Add Professor
                        </button>
                    </div>
                </div>
            </main>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Professor"
                message="Are you sure you want to delete this professor? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editMode ? 'Edit Professor' : 'Add Professor'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Employee ID *</label>
                                <input
                                    type="text"
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    required
                                    disabled={editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Middle Name</label>
                                <input
                                    type="text"
                                    name="middle_name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Department *</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {!editMode && (
                                <>
                                    <div className="form-group">
                                        <label>Username (optional)</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Defaults to Employee ID"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password (optional)</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Default Password 'password'"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Status *</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProfessors;
