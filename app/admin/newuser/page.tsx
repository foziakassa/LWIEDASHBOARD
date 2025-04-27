// pages/NewUser.tsx
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { useRouter } from 'next/router';
import { useRouter } from "next/navigation"

import axiosInstance from "@/shared/axiosinstance";

export default function NewUser() {
  const router = useRouter();
  const [newUser, setNewUser] = useState({
    Firstname: '',
    Lastname: '',
    Email: '',
    Password: '',
    Role: 'User' // default role
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axiosInstance.post('/users', newUser);
      console.log('User created successfully:', response.data);
      router.push('/admin/users'); // redirect to users list page
    } catch (error) {
      console.error("Failed to add user:", error);
      // Optionally, show an error message
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create New User</h2>
      <form onSubmit={handleAddUser}>
        <Input
          placeholder="First Name"
          value={newUser.Firstname}
          onChange={(e) => setNewUser({ ...newUser, Firstname: e.target.value })}
          className="mb-4"
          required
        />
        <Input
          placeholder="Last Name"
          value={newUser.Lastname}
          onChange={(e) => setNewUser({ ...newUser, Lastname: e.target.value })}
          className="mb-4"
          required
        />
        <Input
          placeholder="Email"
          value={newUser.Email}
          onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
          className="mb-4"
          type="email"
          required
        />
        <Input
          placeholder="Password"
          value={newUser.Password}
          onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
          className="mb-4"
          type="password"
          required
        />
        <div className="mb-4">
          <label className="block mb-1">Role</label>
          <select
            value={newUser.Role}
            onChange={(e) => setNewUser({ ...newUser, Role: e.target.value })}
            className="border rounded p-2 w-full"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <Button type="submit">Create User</Button>
      </form>
    </div>
  );
}