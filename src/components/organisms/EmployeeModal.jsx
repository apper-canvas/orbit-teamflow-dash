import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import FormField from "@/components/molecules/FormField";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format } from "date-fns";

const EmployeeModal = ({ employee, isOpen, onClose, onSave, mode = "view" }) => {
  const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    department_c: "",
    role_c: "",
    hire_date_c: "",
    salary_c: "",
    status_c: "Active",
    address_street_c: "",
    address_city_c: "",
    address_state_c: "",
    address_zip_code_c: "",
    emergency_contact_name_c: "",
    emergency_contact_relationship_c: "",
    emergency_contact_phone_c: ""
  });

const [activeTab, setActiveTab] = useState("personal");

  // Helper function to validate dates
  const isValidDate = (dateValue) => {
    if (!dateValue) return false;
    const date = new Date(dateValue);
    return !isNaN(date.getTime());
  };

useEffect(() => {
    if (employee) {
      let formattedHireDate = "";
      
      try {
        if (employee.hire_date_c && isValidDate(employee.hire_date_c)) {
          formattedHireDate = format(new Date(employee.hire_date_c), "yyyy-MM-dd");
        }
      } catch (error) {
        console.warn('Invalid hire date format:', employee.hire_date_c);
        formattedHireDate = "";
      }

      setFormData({
        first_name_c: employee.first_name_c || "",
        last_name_c: employee.last_name_c || "",
        email_c: employee.email_c || "",
        phone_c: employee.phone_c || "",
        department_c: employee.department_c || "",
        role_c: employee.role_c || "",
        hire_date_c: formattedHireDate,
        salary_c: employee.salary_c || "",
        status_c: employee.status_c || "Active",
        address_street_c: employee.address_street_c || "",
        address_city_c: employee.address_city_c || "",
        address_state_c: employee.address_state_c || "",
        address_zip_code_c: employee.address_zip_code_c || "",
        emergency_contact_name_c: employee.emergency_contact_name_c || "",
        emergency_contact_relationship_c: employee.emergency_contact_relationship_c || "",
        emergency_contact_phone_c: employee.emergency_contact_phone_c || ""
      });
    }
  }, [employee]);

const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handleSave = () => {
    let processedHireDate;
    
    try {
      if (formData.hire_date_c && isValidDate(formData.hire_date_c)) {
        processedHireDate = new Date(formData.hire_date_c).toISOString();
      } else {
        processedHireDate = new Date().toISOString();
        console.warn('No valid hire date provided, using current date');
      }
    } catch (error) {
      console.error('Date processing error:', error);
      processedHireDate = new Date().toISOString();
    }

    const dataToSave = {
      ...formData,
      hire_date_c: processedHireDate,
      salary_c: parseFloat(formData.salary_c) || 0
    };
    
    onSave(dataToSave);
  };

  if (!isOpen) return null;

const fullName = employee ? `${employee.first_name_c} ${employee.last_name_c}` : "New Employee";

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "job", label: "Job Details", icon: "Briefcase" },
    { id: "contact", label: "Emergency Contact", icon: "Phone" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
            <div className="flex items-center space-x-3">
              <Avatar
src={employee?.photo_url_c}
                name={fullName}
                size="lg"
              />
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  {mode === "add" ? "Add New Employee" : fullName}
                </h2>
                {employee && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-secondary-600">{employee.role_c}</span>
                    <StatusBadge status={employee.status_c} type="employee" />
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-200">
            <nav className="flex px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                  )}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField
                  label="First Name"
                  required
                  value={formData.first_name_c}
                  onChange={(e) => handleInputChange("first_name_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Last Name"
                  required
                  value={formData.last_name_c}
                  onChange={(e) => handleInputChange("last_name_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Email"
                  type="email"
                  required
                  value={formData.email_c}
                  onChange={(e) => handleInputChange("email_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Phone"
                  value={formData.phone_c}
                  onChange={(e) => handleInputChange("phone_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Street Address"
                  value={formData.address_street_c}
                  onChange={(e) => handleInputChange("address_street_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="City"
                  value={formData.address_city_c}
                  onChange={(e) => handleInputChange("address_city_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="State"
                  value={formData.address_state_c}
                  onChange={(e) => handleInputChange("address_state_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="ZIP Code"
                  value={formData.address_zip_code_c}
                  onChange={(e) => handleInputChange("address_zip_code_c", e.target.value)}
                  disabled={mode === "view"}
                />
              </div>
            )}

            {activeTab === "job" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
label="Department"
                  required
                  value={formData.department_c}
                  onChange={(e) => handleInputChange("department_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Role"
                  required
                  value={formData.role_c}
                  onChange={(e) => handleInputChange("role_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Hire Date"
                  type="date"
                  required
                  value={formData.hire_date_c}
                  onChange={(e) => handleInputChange("hire_date_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Salary"
                  type="number"
                  value={formData.salary_c}
                  onChange={(e) => handleInputChange("salary_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField label="Status" className="md:col-span-2">
                  <select
                    value={formData.status_c}
                    onChange={(e) => handleInputChange("status_c", e.target.value)}
                    disabled={mode === "view"}
                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </FormField>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
label="Emergency Contact Name"
                  value={formData.emergency_contact_name_c}
                  onChange={(e) => handleInputChange("emergency_contact_name_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Relationship"
                  value={formData.emergency_contact_relationship_c}
                  onChange={(e) => handleInputChange("emergency_contact_relationship_c", e.target.value)}
                  disabled={mode === "view"}
                />
                <FormField
                  label="Emergency Contact Phone"
                  value={formData.emergency_contact_phone_c}
                  onChange={(e) => handleInputChange("emergency_contact_phone_c", e.target.value)}
                  disabled={mode === "view"}
                  className="md:col-span-2"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 px-6 py-4 border-t border-secondary-200">
            <Button variant="outline" onClick={onClose}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button onClick={handleSave}>
                {mode === "add" ? "Add Employee" : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;