import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Login.css';
import { UserContext } from "../UserContext";
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const {setUser}=useContext(UserContext)

    const [signupData, setSignupData] = useState({
        fullName: '',
        signupEmail: '',
        signupPassword: '',
        confirmPassword: '',
        gender: '',
        dob: '',
        country: '',
        role:'customer'
    });

    const navigate = useNavigate(); // Initialize useNavigate

    //const mockUser = {
    //    email: 'testuser@example.com',
    //    password: 'password123'
    //};

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    try{
    
    if (!validateEmail(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
    }
    const {data}= await axios.post('http://localhost:5000/api/auth/login',{email,password})
    navigate('/dashboard');
    console.log(data.user,data.token)
    setUser(data.user)
}
catch(e){
    console.log(e)
    alert("Login Failed")
}
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try{
            
        if (signupData.signupPassword !== signupData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        console.log('Pre Sign Up Data:', signupData);
        const {data}= await axios.post('http://localhost:5000/api/auth/register',signupData)
        // Implement sign-up logic here
        console.log('Sign Up Data:', signupData,data);
        
        alert('Sign-up successful!');
        setShowPopup(false); // Close the pop-up after sign-up
        }
        catch(e){
            alert("Something went wrong")
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value
        });
    };

    return (
        <div className="login-container">
            <div className="side-panel">
                <h1>Welcome to TelecomCo</h1>
                <p className="subtitle">We're holding the door for you! Login now and manage all your TelecomCo services with ease.</p>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login to TelecomCo</h2>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="login-button">Login</button>

                <p className="forgot-password">
                    <a href="#forgot-password">Forgot Password?</a>
                </p>

                <div className="sign-up-link">
                    <a href="#signup" onClick={() => setShowPopup(true)}>Sign Up</a>
                </div>
            </form>

            {showPopup && (
                <>
                    <div className="overlay" onClick={() => setShowPopup(false)}></div>
                    <div className="popup">
                        <button type="button" className="close-x-button" onClick={() => setShowPopup(false)}>X</button>
                        <h2>Sign Up for TelecomCo</h2>
                        <form onSubmit={handleSignUp}>
                            <div className="input-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName"
                                    value={signupData.fullName} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signupEmail">Email Address</label>
                                <input 
                                    type="email" 
                                    id="signupEmail" 
                                    name="signupEmail"
                                    value={signupData.signupEmail} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signupPassword">Password</label>
                                <input 
                                    type="password" 
                                    id="signupPassword" 
                                    name="signupPassword"
                                    value={signupData.signupPassword} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    value={signupData.confirmPassword} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="gender">Gender</label>
                                <select 
                                    id="gender" 
                                    name="gender"
                                    value={signupData.gender} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="dob">Date of Birth</label>
                                <input 
                                    type="date" 
                                    id="dob" 
                                    name="dob"
                                    value={signupData.dob} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="country">Country</label>
                                <input 
                                    type="text" 
                                    id="country" 
                                    name="country"
                                    value={signupData.country} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <button type="submit" className="register-button">Register</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;
