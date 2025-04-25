/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/auth/register`, {
                name,
                email,
                password,
                role: isAdmin ? 'admin' : 'user'
            });

            toast.success('🎉 Registered successfully! Please log in.');
            navigate('/login');
        } catch (error: any) {
            console.log(error);
            const errorMessage = error?.response?.data?.error || '❌ Something went wrong';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
                <h2 className="text-xl font-bold text-center text-black">Register</h2>
                <input
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    type="name"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                    <input
                        id="adminCheck"
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="adminCheck" className="text-sm text-gray-700">
                        Register as Admin
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600"
                >
                    Register
                </button>
                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '} <Link to="/login" className="text-blue-500">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
