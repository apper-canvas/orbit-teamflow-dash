import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useOutletContext } from 'react-router-dom';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import StatusBadge from '@/components/molecules/StatusBadge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { paymentService } from '@/services/api/paymentService';
import { employeeService } from '@/services/api/employeeService';

const PaymentCard = ({ payment, onEdit, onDelete, className }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border border-secondary-200 shadow-card hover:shadow-card-hover transition-all duration-200 transform hover:scale-[1.02]",
      className
    )}>
      <div className="p-6">
        {/* Header with payment info and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">{payment.Name}</h3>
              <p className="text-sm text-secondary-600">{payment.employee_c?.Name || 'No Employee'}</p>
              <p className="text-xs text-secondary-500">
                {payment.payment_date_c ? format(new Date(payment.payment_date_c), "MMM dd, yyyy") : 'No Date'}
              </p>
            </div>
          </div>
          <StatusBadge status={payment.status_c} type="payment" />
        </div>

        {/* Payment details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Amount:</span>
            <span className="text-lg font-bold text-accent-600">
              {formatCurrency(payment.amount_c)}
            </span>
          </div>
          {payment.Tags && (
            <div className="flex items-center text-sm text-secondary-600">
              <ApperIcon name="Tags" className="w-4 h-4 mr-2 text-secondary-400" />
              <span>{payment.Tags}</span>
            </div>
          )}
          {payment.reason_c && (
            <div className="text-sm text-secondary-600">
              <span className="font-medium">Reason:</span>
              <p className="mt-1 text-secondary-500">{payment.reason_c}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-secondary-100">
          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit?.(payment)}
            className="flex-1"
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(payment)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, payment, onSave, employees }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    employee_c: '',
    payment_date_c: '',
    amount_c: '',
    status_c: 'Pending',
    reason_c: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (payment) {
      setFormData({
        Name: payment.Name || '',
        Tags: payment.Tags || '',
        employee_c: payment.employee_c?.Id || '',
        payment_date_c: payment.payment_date_c || '',
        amount_c: payment.amount_c || '',
        status_c: payment.status_c || 'Pending',
        reason_c: payment.reason_c || ''
      });
    } else {
      setFormData({
        Name: '',
        Tags: '',
        employee_c: '',
        payment_date_c: '',
        amount_c: '',
        status_c: 'Pending',
        reason_c: ''
      });
    }
    setErrors({});
  }, [payment, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name?.trim()) {
      newErrors.Name = 'Payment name is required';
    }
    
    if (!formData.employee_c) {
      newErrors.employee_c = 'Employee is required';
    }
    
    if (!formData.payment_date_c) {
      newErrors.payment_date_c = 'Payment date is required';
    }
    
    if (!formData.amount_c || isNaN(parseFloat(formData.amount_c)) || parseFloat(formData.amount_c) <= 0) {
      newErrors.amount_c = 'Valid amount is required';
    }
    
    if (!formData.status_c) {
      newErrors.status_c = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
              {payment ? 'Edit Payment' : 'Add New Payment'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Payment Name"
                required
                error={errors.Name}
                value={formData.Name}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                placeholder="Enter payment name"
                disabled={loading}
              />

              <FormField
                label="Employee"
                required
                error={errors.employee_c}
              >
                <select
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.employee_c}
                  onChange={(e) => handleInputChange('employee_c', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.Id} value={employee.Id}>
                      {employee.first_name_c} {employee.last_name_c}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Payment Date"
                required
                error={errors.payment_date_c}
                type="date"
                value={formData.payment_date_c}
                onChange={(e) => handleInputChange('payment_date_c', e.target.value)}
                disabled={loading}
              />

              <FormField
                label="Amount"
                required
                error={errors.amount_c}
                type="number"
                step="0.01"
                min="0"
                value={formData.amount_c}
                onChange={(e) => handleInputChange('amount_c', e.target.value)}
                placeholder="0.00"
                disabled={loading}
              />

              <FormField
                label="Status"
                required
                error={errors.status_c}
              >
                <select
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.status_c}
                  onChange={(e) => handleInputChange('status_c', e.target.value)}
                  disabled={loading}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </FormField>

              <FormField
                label="Tags"
                error={errors.Tags}
                value={formData.Tags}
                onChange={(e) => handleInputChange('Tags', e.target.value)}
                placeholder="Enter tags (comma separated)"
                disabled={loading}
              />
            </div>

            <FormField
              label="Reason"
              error={errors.reason_c}
            >
              <textarea
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                value={formData.reason_c}
                onChange={(e) => handleInputChange('reason_c', e.target.value)}
                placeholder="Enter payment reason (optional)"
                disabled={loading}
              />
            </FormField>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                ) : (
                  payment ? 'Update Payment' : 'Create Payment'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Payments = () => {
  const { onMenuClick } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getAll();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
      setError('Failed to load payments');
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  useEffect(() => {
    loadPayments();
    loadEmployees();
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.Name?.toLowerCase().includes(query) ||
        payment.employee_c?.Name?.toLowerCase().includes(query) ||
        payment.reason_c?.toLowerCase().includes(query) ||
        payment.Tags?.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status_c === statusFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchQuery, statusFilter]);

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsModalOpen(true);
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      if (selectedPayment) {
        await paymentService.update(selectedPayment.Id, paymentData);
      } else {
        await paymentService.create(paymentData);
      }
      await loadPayments();
    } catch (error) {
      throw error;
    }
  };

  const handleDeletePayment = async (payment) => {
    if (!confirm(`Are you sure you want to delete payment "${payment.Name}"?`)) {
      return;
    }

    try {
      const success = await paymentService.delete(payment.Id);
      if (success) {
        await loadPayments();
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status_c === 'Pending').length,
    completed: payments.filter(p => p.status_c === 'Completed').length,
    failed: payments.filter(p => p.status_c === 'Failed').length,
    totalAmount: payments.reduce((sum, p) => sum + (parseFloat(p.amount_c) || 0), 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPayments} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Payments</h1>
            <p className="text-secondary-600 mt-1">Manage employee payments and transactions</p>
          </div>
        </div>
        <Button onClick={handleAddPayment} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-card">
          <div className="text-2xl font-bold text-secondary-900">{stats.total}</div>
          <div className="text-sm text-secondary-600">Total Payments</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-card">
          <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          <div className="text-sm text-secondary-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-card">
          <div className="text-2xl font-bold text-success">{stats.completed}</div>
          <div className="text-sm text-secondary-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-card">
          <div className="text-2xl font-bold text-error">{stats.failed}</div>
          <div className="text-sm text-secondary-600">Failed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-card col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-accent-600">{formatCurrency(stats.totalAmount)}</div>
          <div className="text-sm text-secondary-600">Total Amount</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search payments, employees, or reasons..."
          />
        </div>
        <select
          className="px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Grid */}
      {filteredPayments.length === 0 ? (
        <Empty
          title="No payments found"
          description={searchQuery || statusFilter ? "No payments match your search criteria." : "Get started by adding your first payment."}
          action={!searchQuery && !statusFilter && (
            <Button onClick={handleAddPayment}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.Id}
              payment={payment}
              onEdit={handleEditPayment}
              onDelete={handleDeletePayment}
            />
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payment={selectedPayment}
        onSave={handleSavePayment}
        employees={employees}
      />
    </div>
  );
};

export default Payments;