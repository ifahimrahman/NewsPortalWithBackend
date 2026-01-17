import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:4000/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') login();
    };

    const login = async () => {
        if (!email || !password) return alert('Email and password are required');
        try {
            const res = await fetch(API + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) return alert('Login failed');
            const data = await res.json();
            localStorage.setItem('auth', JSON.stringify(data));
            nav('/news');
        } catch (e) { alert('Login error'); }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-80">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                <input className="border w-full p-2 mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onKeyPress={handleKeyPress} />
                <input type="password" className="border w-full p-2 mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress} />
                <button onClick={login} className="bg-blue-500 text-white w-full mt-2 p-2 rounded">Login</button>
                <p className="mt-4 text-sm text-center">
                    Don't have an account? <Link to="/register" className="text-green-600">Register</Link>
                </p>
            </div>
        </div>
    );
}