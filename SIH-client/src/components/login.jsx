import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contacts/AuthProviders';
import { GoogleAuthProvider } from 'firebase/auth';



const Login = () => {
    const { login, loginWithGoogle } = useContext(AuthContext);
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        

        login(email, password)
            .then(() => {
                // Logged in successfully
                alert("Login Successful");
                setError(''); // Clear error state on success
                navigate(from, { replace: true });
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    const handleLoginWithGoogle = () => {
        loginWithGoogle().then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            alert("Login Successful with Google");
            navigate(from, { replace: true });
        }).catch((error) => {
            console.error('Google Login Error:', error);
            const errorMessage = error.message;
            setError(errorMessage);
        });
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">Login Form</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleLogin} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                    <input id="email" name="email" type="text" placeholder="Email Address" className="peer  h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" />
                                </div>
                                <div className="relative">
                                    <input autoComplete="off" id="password" name="password" placeholder="Password" type="password" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" />
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                                <p> If you don't have an account. Please <Link to="/sign-up" className='text-blue-600 underline'>Sign Up</Link> Here</p>
                                <div className="relative">
                                    <button type='submit' className="bg-blue-500 text-white rounded-md px-2 py-1">Login</button>
                                </div>
                            </form>
                        </div>

                        <hr />
                        <div className="flex w-full items-center flex-col mt-5 gap-3">
                            <button onClick={handleLoginWithGoogle} className="bg-blue-500 text-white rounded-md px-2 py-1">
                                Login with Google
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
