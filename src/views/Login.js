import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'contexts/UserContext';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import '../assets/css/login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUserEmail } = useUser(); // Get setUserEmail from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUserEmail(email); // Set email in context after login
        setErrorMessage('');
        // Redirect to the admin dashboard after successful login
        navigate('/admin/user-profile');
      } else {
        setErrorMessage(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card text-center">
        <CardHeader>Login to Admin Panel</CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <Button type="submit" color="primary" block>
              Login
            </Button>
          </form>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
