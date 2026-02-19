import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSections } from '../../api/services';
import { toast } from 'react-toastify';
import HamburgerMenu from '../../components/HamburgerMenu';
import './ManageStudents.css';
import { Link } from 'react-router-dom';


const ManageSections = () => {
    const { user } = useAuth();
    const [sections, setSections] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await getSections();
            if (response.success) {
                setSections(response.sections);
            }
        } catch (error) {
            toast.error('Failed to load sections');
        } finally {
            setLoading(false);
        }
    };

    const filterSections = () => {
        if (search != '' && sections.length > 0) {
            var filteredSections = sections;

            const value = Number(search);

            if (!isNaN(value)) {
                filteredSections = sections.filter(section => {
                    return section.course_id == value
                })
            } else {
                filteredSections = sections.filter(section => {
                    const coercedSearch = RegExp(search.toLowerCase(), "gi");

                    const resultCourseName = section.course_name.toLowerCase().match(coercedSearch);
                    const resultCourseCode = section.course_code.toLowerCase().match(coercedSearch);
                    const flag = (resultCourseCode != null && resultCourseCode.lenght > 0) || (resultCourseName != null && resultCourseName.length > 0) 

                    return flag;
                })
            }

            setSections(filteredSections)
        } else {
            fetchSections()
        }
    }

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
                        <h1 className="page-title">Sections</h1>
                        <div className="search-box">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search section"
                                value={search}
                                onChange={(e) => {setSearch(e.target.value); filterSections()}}
                            />
                            <button className="search-clear" onClick={() => {setSearch(''); fetchSections()}}>×</button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Section</th>
                                    <th>Course Name</th>
                                    <th>Course Code</th>
                                    <th>Schedule</th>
                                    <th>Professor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No sections found
                                        </td>
                                    </tr>
                                ) : (
                                    
                                    sections.map((section, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{section.section}</td>
                                            <td>-{section.course_name?.toUpperCase() || 'OBJECT ORIENTED PROGRAMMING'}"</td>
                                            <td>{section.course_code}</td>
                                            <td>{section.schedule}</td>
                                            <td className="professor-dropdown-cell">
                                                {section.prof_first_name} {section.prof_last_name}
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

export default ManageSections;
