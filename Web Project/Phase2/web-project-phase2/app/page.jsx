'use client'
import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log();
    

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      window.location.href = '/phase1/html/student.html'; // Redirect to dashboard
    } else {
      setError(data.message);
    }


  };

  return (
    <div className="container">
      <header>
          <img src="https://mystore.qu.edu.qa/media/catalog/product/cache/32dcc05ffc19517695e57ddc1f6a4b4d/q/u/qu_logo-01_2.png" alt="Qatar University Logo" />
      </header>

      <main>
        <form onSubmit={handleLogin}>
          <div id="email">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div id="password">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div id="buttom">
            <input type="submit" value="Login" />
          </div>
        </form>
      </main>
      <footer>
        &copy; All the copy rights are for Qatar University 2025
      </footer>
    </div>
  );
};

export default LoginPage;
