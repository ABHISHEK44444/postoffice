import React, { useState } from 'react';
import { UserIcon, LockClosedIcon, InformationCircleIcon } from './icons';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        // Check for specific demo credentials
        if (username === 'admin' && password === 'password') {
            onLogin();
        } else {
            setError('Invalid credentials. Please use the demo account.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border border-gray-200">
                <div className="text-center">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png" 
                        alt="Emblem of India" 
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">Department of Posts</h1>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center">
                         <InformationCircleIcon className="w-5 h-5 mr-2" />
                        <p>Use <strong className="font-semibold">admin</strong> / <strong className="font-semibold">password</strong> to login.</p>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-700 sr-only">Username</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Username"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password"  className="text-sm font-medium text-gray-700 sr-only">Password</label>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-xs text-red-600 text-center">{error}</p>}

                    <div className="flex items-center justify-between text-sm">
                        <div/>
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </a>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;