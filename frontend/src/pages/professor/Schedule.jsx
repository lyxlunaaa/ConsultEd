import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfessorSchedule } from '../../api/services';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import HamburgerMenu from '../../components/HamburgerMenu';
import './Schedule.css';
import { Link } from 'react-router-dom';


const Schedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await getProfessorSchedule();
            if (response.success) {
                setSchedule(response.schedule);
            }
        } catch (error) {
            toast.error('Failed to load schedule');
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    };

    const getConsultationsForDay = (day) => {
        return schedule.filter(item =>
            isSameDay(parseISO(item.approved_date), day)
        );
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    const days = getDaysInMonth();
    const monthName = format(currentDate, 'MMMM yyyy').toUpperCase().split('').join(' ');

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
                    <h1 className="page-title">SCHEDULE</h1>

                    <div className="calendar-container">
                        <div className="calendar-grid">
                            <div className="calendar-month-header">{monthName}</div>

                            <div className="calendar-day-header">SUNDAY</div>
                            <div className="calendar-day-header">MONDAY</div>
                            <div className="calendar-day-header">TUESDAY</div>
                            <div className="calendar-day-header">WEDNESDAY</div>
                            <div className="calendar-day-header">THURSDAY</div>
                            <div className="calendar-day-header">FRIDAY</div>
                            <div className="calendar-day-header">SATURDAY</div>

                            {/* Empty cells for days before month starts */}
                            {Array.from({ length: days[0].getDay() }).map((_, index) => (
                                <div key={`empty-${index}`} className="calendar-day empty"></div>
                            ))}

                            {/* Actual days */}
                            {days.map((day) => {
                                const consultations = getConsultationsForDay(day);
                                const isToday = isSameDay(day, new Date());

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`calendar-day ${isToday ? 'today' : ''} ${consultations.length > 0 ? 'has-consultations' : ''}`}
                                    >
                                        <div className="day-number">{format(day, 'd')}</div>
                                        <div className="day-consultations">
                                            {consultations.map((consultation) => (
                                                <div key={consultation.request_id} className="consultation-item">
                                                    <div className="consultation-text">
                                                        Consultation
                                                    </div>
                                                    <div className="consultation-text">
                                                        Date: {format(parseISO(consultation.approved_date), 'yyyy-MM-dd')}
                                                    </div>
                                                    <div className="consultation-text">
                                                        Type: {consultation.consultation_type === 'face_to_face' ? 'Face to Face' : 'Online'}
                                                    </div>
                                                    <div className="consultation-text">
                                                        Time: {consultation.approved_time}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {schedule.length === 0 && (
                        <div className="empty-schedule">
                            <p>No consultations scheduled yet</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Schedule;
