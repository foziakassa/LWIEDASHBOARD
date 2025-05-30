"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  LayoutTemplate,
  Users,
  Settings,
  ChevronDown,
  Gift,
  Megaphone,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import { getUserCookie } from '../lib/cookies'; // Import getUserCookie

// Updated navigation without Purchase Order and Measurement
const mainNav = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: FileText,
  },
  {
    title: "Items",
    href: "/admin/items",
    icon: ArrowRightLeft,
  },
  // {
  //   title: "Template",
  //   href: "/admin/template",
  //   icon: LayoutTemplate,
    
  //   showForRoles: ["Admin"], // Only show for "Admin" role (uppercase)
  // },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
    {
    title: "post",
    href: "/admin/post",
    icon:  FileText, // Or Bullhorn

  },
    {
    title: "swap",
    href: "/admin/swap",
    icon: ArrowRightLeft, // Or Bullhorn

  },

  {
    title: "Charity",
    href: "/admin/charity",
    icon: Gift,
    // showForRoles: ["Manager"], // Only show for "Admin" role (uppercase)

  },
  {
    title: "Advertisment",
    href: "/admin/advertisements/components/allad",
    icon: Megaphone, // Or Bullhorn

  },
   {
    title: "Revenue",
    href: "/admin/revenue",
    icon: Megaphone, // Or Bullhorn

  }
  
  

];

export function MainNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // State for user role

  // Get user role from cookie
  useEffect(() => {
    const userData = getUserCookie(); // Get the user data object
    setUserRole(userData?.Role || null); // Access the Role property
  }, []);

  // Fix hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-64 bg-[#004D4D]"></div>;
  }

  return (
    <nav className="w-64 bg-[#004D4D] text-white flex flex-col min-h-screen lg:h-screen lg:sticky lg:top-0">
      <div className="h-16 border-b border-white/10 flex items-center px-4">
        <span className="font-semibold">Lwie Admin</span>
      </div>
      <div className="flex-1 py-4 space-y-1 overflow-y-auto">
      {mainNav.map((item) => {
       if (!userRole) return null;
       // Check if the item should be shown based on the user's role
      //  if (item.showForRoles && !item.showForRoles.includes(userRole)) {
      //    return null; // Skip rendering this item
      //  }

      

          return (
            <div key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors",
                  pathname === item.href && "bg-white/10"
                )}
               
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.title}</span>
              
              </Link>
             
            </div>
          );
        })}
      </div>
    </nav>
  );
}