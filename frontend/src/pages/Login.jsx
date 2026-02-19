import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../api/services';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginAPI(username, password);

            if (response.success) {
                // Store auth data
                login(response.user, response.token);

                // Redirect based on role
                const role = response.user.role;
                if (role === 'student') {
                    navigate('/student/dashboard');
                } else if (role === 'professor') {
                    navigate('/professor/dashboard');
                } else if (['registrar', 'dean', 'program_chair'].includes(role)) {
                    navigate('/admin/dashboard');
                }

                toast.success('Login successful!');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form-wrapper">
                    <div className="login-logo">
                        <span className="logo-consult-login">Consult</span>
                        <span className="logo-ed-login">Ed</span>
                    </div>

                    <h1 className="login-title">Welcome Back!</h1>
                    <p className="login-subtitle">
                        Sign in to access the faculty advising and consulting system
                    </p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ID Number"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary login-button"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <div className="login-hero">
                    <h2 className="hero-tagline">
                        "Closing the Gap Between Students and Faculty."
                    </h2>
                    <p className="hero-description">
                        ConsultEd is an innovative system that streamlines faculty advising and consultation requests. It helps CCIT students reach the right professors quickly while keeping appointments organized and hassle-free.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
