import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import LogoutButton from '@/components/molecules/LogoutButton';

const Sidebar = ({ className, onClose }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      current: location.pathname === "/"
    },
    {
      name: "Employees",
      href: "/employees",
      icon: "Users",
      current: location.pathname.startsWith("/employees")
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: "Clock",
      current: location.pathname === "/attendance"
    },
    {
      name: "Leave Requests",
      href: "/leave-requests",
      icon: "Calendar",
      current: location.pathname === "/leave-requests"
    },
{
      name: "Departments",
      href: "/departments",
      icon: "Building2",
      current: location.pathname === "/departments"
    },
    {
      name: "Payments",
      href: "/payments",
      icon: "DollarSign",
      current: location.pathname === "/payments"
    },
    {
      name: "Penalties",
      href: "/penalties",
      icon: "AlertTriangle",
      current: location.pathname === "/penalties"
    },
    {
      name: "Activities",
      href: "/activities",
      icon: "Activity",
      current: location.pathname === "/activities"
    }
  ];

  return (
    <div className={cn("flex flex-col bg-white border-r border-secondary-200", className)}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-secondary-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Users" className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            TeamFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border-r-2 border-primary-600"
                  : "text-secondary-600 hover:bg-gradient-to-r hover:from-secondary-50 hover:to-secondary-100 hover:text-secondary-900"
              )
            }
          >
            <ApperIcon
              name={item.icon}
              className="mr-3 h-5 w-5 flex-shrink-0"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

{/* User Profile */}
      <div className="border-t border-secondary-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">HR</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-secondary-900">HR Admin</p>
              <p className="text-xs text-secondary-500">Administrator</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;