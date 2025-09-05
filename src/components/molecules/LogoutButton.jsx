import React, { useContext } from 'react';
import { AuthContext } from '@/App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="text-secondary-600 hover:text-secondary-900 p-1"
      title="Logout"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
    </Button>
  );
};

export default LogoutButton;