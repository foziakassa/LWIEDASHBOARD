"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal"; // Assuming you have a modal component
import { Plus, RefreshCw, Filter } from "lucide-react";
import axiosInstance from "@/shared/axiosinstance";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  joinDate: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'User' // default role
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      const response = await axiosInstance.post('/users', newUser);
      setUsers((prev) => [...prev, response.data]);
      setFilteredUsers((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'User' });
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const columns = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "joinDate", header: "Join Date" },
  ];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <DataTable columns={columns} data={filteredUsers} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New User">
          <div className="p-4">
            <h2 className="text-xl mb-4">Add New User</h2>
            <Input
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mb-2"
              type="email" // Use email input type for validation
            />
            <Input
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="mb-2"
              type="password" // Use password input type for