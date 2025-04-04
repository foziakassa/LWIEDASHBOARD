'use client';
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import poster from "@/shared/post";

const fetcher = (url: string) => poster(url, {});

const LoginPage = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setError(null);   // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    try {
      const data = await poster('api/adminlogin', { Email, Password });
      console.log("Login Successful", data);
      
      // Set success message
      setSuccessMessage("Login successful! Welcome!");

      // You can optionally set the user data in cache or a global state here
      mutate('api/adminlogin'); // This can refresh the data with SWR if needed

      // Optionally, you can set user data in local storage or context/state if needed
    } catch (err) {
      console.error("Login Failed", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false); // Set loading to false in any case (success or error)
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {loading ? (
          <p style={{ color: "blue" }}>Logging in...</p>
        ) : (
          <button type="submit">Login</button>
        )}
      </form>
    </div>
  );
};

export default LoginPage;