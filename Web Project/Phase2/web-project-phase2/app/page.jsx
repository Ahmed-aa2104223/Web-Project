// app/page.jsx
"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaGithub, FaGoogle, FaFacebook } from "react-icons/fa";  

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="container">
        <header>
          <img
            src="https://mystore.qu.edu.qa/media/catalog/product/cache/32dcc05ffc19517695e57ddc1f6a4b4d/q/u/qu_logo-01_2.png"
            alt="Qatar University Logo"
          />
        </header>
        <main>
          <p>Loading...</p>
        </main>
        <footer>&copy; All the copy rights are for Qatar University 2025</footer>
      </div>
    );
  }

  if (session) {
    return (
      <div className="container">
        <header>
          <img
            src="https://mystore.qu.edu.qa/media/catalog/product/cache/32dcc05ffc19517695e57ddc1f6a4b4d/q/u/qu_logo-01_2.png"
            alt="Qatar University Logo"
          />
        </header>
        <main style={{ textAlign: "center", marginTop: "2rem" }}>
          <h1>Welcome, {session.user.email}</h1>
          <p>Signed in with {session.user.provider}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </main>
        <footer>&copy; All the copy rights are for Qatar University 2025</footer>
      </div>
    );
  }

  const handleCredentialSignIn = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      window.location.href = "/phase1/html/student.html";
    }
  };

  return (
    <div className="container">
      <header>
        <img
          src="https://mystore.qu.edu.qa/media/catalog/product/cache/32dcc05ffc19517695e57ddc1f6a4b4d/q/u/qu_logo-01_2.png"
          alt="Qatar University Logo"
        />
      </header>

      <main>
        <form onSubmit={handleCredentialSignIn}>
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
          <div id="button">
            <input type="submit" value="Login" />
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2>Or sign in with</h2>
          <button
            onClick={() =>
              signIn("github", { callbackUrl: "/statistics" })
            }
            style={{
              margin: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "10rem",
              height: "3rem",
              fontSize: "1.1rem",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <FaGithub style={{ marginRight: "0.5rem", fontSize: "1.5rem" }} /> GitHub
          </button>

          <button
            onClick={() =>
              signIn("google", { callbackUrl: "/statistics" })
            }
            style={{
              margin: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "10rem",
              height: "3rem",
              fontSize: "1.1rem",
              backgroundColor: "#DB4437",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <FaGoogle style={{ marginRight: "0.5rem", fontSize: "1.5rem" }} /> Google
          </button>

          <button
            onClick={() =>
              signIn("facebook", { callbackUrl: "/statistics" })
            }
            style={{
              margin: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "10rem",
              height: "3rem",
              fontSize: "1.1rem",
              backgroundColor: "#3b5998",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <FaFacebook style={{ marginRight: "0.5rem", fontSize: "1.5rem" }} /> Facebook
          </button>
        </div>
      </main>

      <footer>&copy; All the copy rights are for Qatar University 2025</footer>
    </div>
  );
}
