"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; 
import axiosInstance from "@/shared/axiosinstance"; 
import { Card } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; 

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  joinDate: string; 
}

const UserInfoPage = () => {
  const router = useRouter();
  const params = useParams<{ userid: string }>(); // Use the correct type for params
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.userid) {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get(`/users/${params.userid}`);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [params?.userid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <Card>
        <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        <p>Status: {user?.status}</p>
        <p>Join Date: {user?.joinDate}</p>

        <Button onClick={() => router.push('/admin/users')} variant="outline">
          Back to Users
        </Button>
      </Card>
    </div>
  );
};

export default UserInfoPage;
