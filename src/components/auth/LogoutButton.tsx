import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";
export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline" 
      size="sm"
      className="flex items-center gap-1"
    >
      <LogOut className="h-4 w-4 mr-1" />
      Logout
    </Button>
  );
}
