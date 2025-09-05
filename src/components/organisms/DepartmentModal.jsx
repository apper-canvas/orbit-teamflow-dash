import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const DepartmentModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  loading = false, 
  employees = [],
  mode = "create" 
}) => {
  const [formData, setFormData] = useState({
    name_c: "",
    manager_id_c: "",
    employee_count_c: 0,
    description_c: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && mode === "create") {
      // Reset form when modal opens for creating
      setFormData({
        name_c: "",
        manager_id_c: "",
        employee_count_c: 0,
        description_c: ""
      });
      setErrors({});
    }
  }, [isOpen, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = "Department name is required";
    }

    if (!formData.manager_id_c) {
      newErrors.manager_id_c = "Manager selection is required";
    }

    if (!formData.description_c.trim()) {
      newErrors.description_c = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const dataToSave = {
      name_c: formData.name_c.trim(),
      manager_id_c: parseInt(formData.manager_id_c),
      employee_count_c: parseInt(formData.employee_count_c) || 0,
      description_c: formData.description_c.trim()
    };
    
    onSave(dataToSave);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Add New Department
                </h2>
                <p className="text-sm text-secondary-600">Create a new department</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={loading}
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-4">
            <FormField
              label="Department Name"
              required
              value={formData.name_c}
              onChange={(e) => handleInputChange("name_c", e.target.value)}
              error={errors.name_c}
              placeholder="Enter department name"
              disabled={loading}
            />

            <FormField label="Manager" required error={errors.manager_id_c}>
              <select
                value={formData.manager_id_c}
                onChange={(e) => handleInputChange("manager_id_c", e.target.value)}
                disabled={loading}
                className={cn(
                  "flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  errors.manager_id_c && "border-red-500"
                )}
              >
                <option value="">Select a manager</option>
                {employees.map((employee) => (
                  <option key={employee.Id} value={employee.Id}>
                    {employee.first_name_c} {employee.last_name_c} - {employee.role_c}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Initial Employee Count"
              type="number"
              value={formData.employee_count_c}
              onChange={(e) => handleInputChange("employee_count_c", e.target.value)}
              placeholder="0"
              min="0"
              disabled={loading}
            />

            <FormField
              label="Description"
              required
              value={formData.description_c}
              onChange={(e) => handleInputChange("description_c", e.target.value)}
              error={errors.description_c}
              placeholder="Enter department description"
              disabled={loading}
            >
              <textarea
                value={formData.description_c}
                onChange={(e) => handleInputChange("description_c", e.target.value)}
                disabled={loading}
                rows={3}
                placeholder="Enter department description"
                className={cn(
                  "flex w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed resize-none",
                  errors.description_c && "border-red-500"
                )}
              />
            </FormField>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 px-6 py-4 border-t border-secondary-200">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Create Department
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;