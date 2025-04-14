import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Users,
  FileText,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SidebarItem = ({
  icon,
  label,
  to,
  collapsed = false,
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
          isActive
            ? 'bg-[#F2F3FF] border-l-4 border-primary font-semibold'
            : clicked
            ? 'hover:bg-gray-100 text-gray-700'
            : 'text-gray-700'
        } ${collapsed ? 'justify-center' : 'justify-start'}`
      }
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${collapsed ? 'mr-0' : 'mr-3'}`}>{icon}</div>
        {!collapsed && <span className="font-medium">{label}</span>}
      </div>
    </NavLink>
  );
};

const DoctorSidebar = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        sidebarWidth,
        className
      )}
    >
      {/* Header */}
      <div className={cn('p-4', collapsed ? 'text-center' : '')}>
        {!collapsed ? (
          <h2 className="text-lg font-semibold text-medical-primary">Doctor Dashboard</h2>
        ) : (
          <BarChart2 className="h-5 w-5 text-medical-primary mx-auto" />
        )}
      </div>

      {/* Toggle button */}
      <div className="absolute -right-3 top-20">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full bg-white border border-gray-200 shadow-md h-6 w-6 flex items-center justify-center"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      {/* Sidebar items */}
      <div className="flex-1 overflow-y-auto p-3">
        <SidebarItem
          icon={<BarChart2 className="h-5 w-5" />}
          label="Dashboard"
          to="/doctor-dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Calendar className="h-5 w-5" />}
          label="Appointments"
          to="/doctor-appointments"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          label="Patients"
          to="/doctor-patients"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FileText className="h-5 w-5" />}
          label="Medical Records"
          to="/doctor-records"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<User className="h-5 w-5" />}
          label="My Profile"
          to="/doctor-profile"
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default DoctorSidebar