import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import './SignupPage.css';

const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        // if (password !== confirmPassword) {
        //     alert("Passwords do not match!");
        //     return;
        // }
        const response = await fetch('http://localhost:2000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                confirm_password: confirmPassword,
                dob: age,
                address,
                mobile_no: phone
            })
        });
        const data = await response.json();
        if (!response.ok) {
            toast.error(data.msg);
            return;
        }
        toast.success("Registered Succesfully");
        // console.log('Signed up with:', { firstName, lastName, email, password, phone, username, age, address });
        setTimeout(() => navigate('/login'), 2000);
    };

    return (
        <div className='body-child'>
            <div className="signup-page">
            <div className="signup-form-container">
                <h2>Sign Up</h2>
                <form className='form' onSubmit={handleSignup}>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="full-width">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="full-width">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="full-width">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Age:</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </div>
                    <div className="full-width">
                        <label>Address:</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
            <ToastContainer
                position='top-center'
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
        </div>
        </div>
    );
};

export default SignupPage;
