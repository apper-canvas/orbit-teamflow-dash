import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format } from "date-fns";

const EmployeeCard = ({ employee, onEdit, onView, onDelete, className }) => {
const fullName = `${employee.first_name_c} ${employee.last_name_c}`;

  return (
    <div className={cn(
      "bg-white rounded-lg border border-secondary-200 shadow-card hover:shadow-card-hover transition-all duration-200 transform hover:scale-[1.02]",
      className
    )}>
      <div className="p-6">
        {/* Header with avatar and basic info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar
src={employee.photo_url_c}
              name={fullName}
              size="lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">{fullName}</h3>
              <p className="text-sm text-secondary-600">{employee.role}</p>
              <p className="text-xs text-secondary-500">{employee.department}</p>
            </div>
          </div>
<StatusBadge status={employee.status_c} type="employee" />
        </div>

        {/* Contact info */}
        <div className="space-y-2 mb-4">
<div className="flex items-center text-sm text-secondary-600">
            <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-secondary-400" />
            <span className="truncate">{employee.email_c}</span>
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-secondary-400" />
            <span>{employee.phone_c}</span>
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-secondary-400" />
            <span>Joined {format(new Date(employee.hire_date_c), "MMM yyyy")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-secondary-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(employee)}
            className="flex-1"
          >
            <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit?.(employee)}
            className="flex-1"
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(employee)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;