import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStudents, createStudent, updateStudent, deleteStudent, getPrograms } from '../../api/services';
import { toast } from 'react-toastify';
import HamburgerMenu from '../../components/HamburgerMenu';
import ConfirmDialog from '../../components/ConfirmDialog';
import './ManageStudents.css';
import { Link } from 'react-router-dom';


const ManageStudents = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({
        student_number: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        program_id: '',
        section: ''
    });
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
        fetchPrograms();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await getStudents(search);

            if (response.success) {
                setStudents(response.students);
            }
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            if (response.success) {
                setPrograms(response.programs);
            }
        } catch (error) {
            // Programs might not be accessible for all roles
            console.error('Failed to load programs');
        }
    };

    const handleSearch = () => {
        fetchStudents();
    };

    const handleAdd = () => {
        setEditingStudent(null);
        setFormData({
            student_number: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            program_id: '',
            section: ''
        });
        setShowModal(true);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            student_number: student.student_number,
            first_name: student.first_name,
            last_name: student.last_name,
            middle_name: student.middle_name || '',
            program_id: student.program_id,
            section: student.section || ''
        });
        setShowModal(true);
    };

    const handleDelete = (studentId) => {
        setStudentToDelete(studentId);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteStudent(studentToDelete);
            if (response.success) {
                toast.success('Student deleted successfully');
                fetchStudents();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete student');
        } finally {
            setShowConfirm(false);
            setStudentToDelete(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (editingStudent) {
                response = await updateStudent(editingStudent.student_id, formData);
            } else {
                response = await createStudent(formData);
            }

            if (response.success) {
                toast.success(editingStudent ? 'Student updated successfully' : 'Student created successfully');
                setShowModal(false);
                fetchStudents();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save student');
        }
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
                    <div className="students-header-container">
                        <h1 className="page-title">Students</h1>
                        {/* <div className="warning-note">
                        </div> */}
                        <div className="search-box">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search student"
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
                                    <th>Student ID#</th>
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Course</th>
                                    <th>Block Section</th>
                                    <th>Enrolled Courses</th>
                                    <th>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            No students found
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, index) => (
                                        <tr key={student.student_id}>
                                            <td>{index + 1}</td>
                                            <td>{student.student_number}</td>
                                            <td>{student.last_name || ''}</td>
                                            <td>{student.first_name || ''}</td>
                                            <td>{student.middle_name || ''}</td>
                                            <td>{student.program_code || ''}</td>
                                            <td>{student.section || '[Section]'}</td>
                                            <td className="enrolled-courses-cell">
                                                {student.enrolled_courses ? (
                                                    student.enrolled_courses.split(',').map((course, idx) => (
                                                        <div key={idx}>{course.trim()}</div>
                                                    ))
                                                ) : (
                                                    <div>[No courses]</div>
                                                )}
                                            </td>
                                            <td className="manage-cell">
                                                <a
                                                    href="#"
                                                    className="edit-student-link"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleEdit(student);
                                                    }}
                                                >
                                                    CLICK HERE TO EDIT STUDENT INFO
                                                </a>
                                                <br />
                                                {/* <span className="edit-note">
                                                </span> */}
                                                <br />
                                                <button
                                                    className="delete-student-btn"
                                                    onClick={() => handleDelete(student.student_id)}
                                                >
                                                    Delete Student
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
                            + Add Student
                        </button>
                        {/* <div className="add-note">
                            Pag clinick yung "Add student" mag kakaron bagong row
                        </div> */}
                    </div>
                </div>
            </main>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete Student"
                message="Are you sure you want to delete this student? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {editingStudent ? 'Edit Student' : 'Add New Student'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Student Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.student_number}
                                    onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                                    required
                                    disabled={!!editingStudent}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Middle Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.middle_name}
                                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Program</label>
                                    <select
                                        className="form-select"
                                        value={formData.program_id}
                                        onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Program</option>
                                        {programs.map((program) => (
                                            <option key={program.program_id} value={program.program_id}>
                                                {program.program_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Section</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingStudent ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudents;
