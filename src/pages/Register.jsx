import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:4000/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('reader');
    const nav = useNavigate();

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') register();
    };

    const register = async () => {
        if (!name || !email || !password || !confirmPassword) {
            return alert('All fields are required');
        }
        if (password !== confirmPassword) {
            return alert('Passwords do not match');
        }
        if (password.length < 6) {
            return alert('Password must be at least 6 characters');
        }
        try {
            const res = await fetch(API + '/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            if (!res.ok) {
                const err = await res.json();
                return alert(err.message || 'Registration failed');
            }
            const data = await res.json();
            localStorage.setItem('auth', JSON.stringify(data));
            nav('/news');
        } catch (e) { alert('Registration error'); }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-80">
                <h1 className="text-xl font-bold mb-4">Register</h1>
                <input 
                    className="border w-full p-2 mb-2" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    onKeyPress={handleKeyPress}
                />
                <input 
                    className="border w-full p-2 mb-2" 
                    placeholder="Email" 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    onKeyPress={handleKeyPress}
                />
                <input 
                    type="password" 
                    className="border w-full p-2 mb-2" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    onKeyPress={handleKeyPress}
                />
                <input 
                    type="password" 
                    className="border w-full p-2 mb-2" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    onKeyPress={handleKeyPress}
                />
                <select 
                    className="border w-full p-2 mb-2" 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                >
                    <option value="reader">Reader</option>
                    <option value="author">Author</option>
                </select>
                <button 
                    onClick={register} 
                    className="bg-green-500 text-white w-full mt-2 p-2 rounded"
                >
                    Register
                </button>
                <p className="mt-4 text-sm text-center">
                    Already have an account? <Link to="/" className="text-blue-600">Login</Link>
                </p>
            </div>
        </div>
    );
}
