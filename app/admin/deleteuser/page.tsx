// pages/DeleteUser.tsx
'use client'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosInstance from "@/shared/axiosinstance";
import { Button } from '@/components/ui/button';

export default async function DeleteUser() {
  const router = useRouter();
  const { id } = router.query; // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get(`/users/${id}`);
          setUser(response.data);
        } catch (error) {
          
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [id]);
  const userdata = await axiosInstance.get(`/users/${id}`);
 const data1 = userdata.data;
  const handleDeleteUser = async () => {
    if(userdata){
    if (confirm(`Are you sure you want to delete user ${data1.Firstname} ${data1.lastName}?`)) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        alert("User deleted successfully.");
        router.push('/users'); // Redirect after deletion
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user.");
      }
    }
  };
}

  if (loading) return <p>Loading...</p>;
  
  if (!user) return <p>User not found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Delete User</h2>
      <p>Are you sure you want to delete the following user?</p>
      <p className="mt-4"><strong>Name:</strong> {data1.Firstname} {data1.Lastname}</p>
      <p><strong>Email:</strong> {data1.Email}</p>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => router.push('/users')} className="mr-2">Cancel</Button>
        <Button onClick={handleDeleteUser} className="bg-red-500 text-white">Delete User</Button>
      </div>
    </div>
  );
};

