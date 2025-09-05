import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { penaltyService } from '@/services/api/penaltyService';

const PenaltyModal = ({ isOpen, onClose, employees, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    employee_id_c: '',
    date_c: '',
    type_c: '',
    reason_c: '',
    amount_c: '',
    status_c: 'Active'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Penalty name is required';
    }
    
    if (!formData.employee_id_c) {
      newErrors.employee_id_c = 'Employee selection is required';
    }
    
    if (!formData.date_c) {
      newErrors.date_c = 'Date is required';
    }
    
    if (!formData.type_c) {
      newErrors.type_c = 'Penalty type is required';
    }
    
    if (!formData.reason_c.trim()) {
      newErrors.reason_c = 'Reason is required';
    }

    if (formData.amount_c && isNaN(parseFloat(formData.amount_c))) {
      newErrors.amount_c = 'Amount must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await penaltyService.create(formData);
      toast.success('Penalty record created successfully');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating penalty:', error);
      toast.error(error.message || 'Failed to create penalty record');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      Name: '',
      employee_id_c: '',
      date_c: '',
      type_c: '',
      reason_c: '',
      amount_c: '',
      status_c: 'Active'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const typeOptions = [
    { value: '', label: 'Select penalty type' },
    { value: 'Verbal Warning', label: 'Verbal Warning' },
    { value: 'Written Warning', label: 'Written Warning' },
    { value: 'Suspension', label: 'Suspension' },
    { value: 'Termination', label: 'Termination' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Resolved', label: 'Resolved' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Create Penalty Record</h2>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2"
            disabled={loading}
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Penalty Name"
              required
              error={errors.Name}
            >
              <Input
                value={formData.Name}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                placeholder="Enter penalty name"
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Employee"
              required
              error={errors.employee_id_c}
            >
              <select
                value={formData.employee_id_c}
                onChange={(e) => handleInputChange('employee_id_c', e.target.value)}
                className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.Id} value={employee.Id}>
                    {employee.first_name_c} {employee.last_name_c} - {employee.department_c}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Date"
              required
              error={errors.date_c}
            >
              <Input
                type="date"
                value={formData.date_c}
                onChange={(e) => handleInputChange('date_c', e.target.value)}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Penalty Type"
              required
              error={errors.type_c}
            >
              <select
                value={formData.type_c}
                onChange={(e) => handleInputChange('type_c', e.target.value)}
                className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Amount"
              error={errors.amount_c}
            >
              <Input
                type="number"
                step="0.01"
                value={formData.amount_c}
                onChange={(e) => handleInputChange('amount_c', e.target.value)}
                placeholder="Optional penalty amount"
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Status"
              error={errors.status_c}
            >
              <select
                value={formData.status_c}
                onChange={(e) => handleInputChange('status_c', e.target.value)}
                className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            label="Reason"
            required
            error={errors.reason_c}
          >
            <textarea
              value={formData.reason_c}
              onChange={(e) => handleInputChange('reason_c', e.target.value)}
              placeholder="Enter reason for penalty"
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
          </FormField>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-secondary-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Create Penalty
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PenaltyModal;