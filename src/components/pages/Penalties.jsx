import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Header from "@/components/organisms/Header";
import StatusBadge from "@/components/molecules/StatusBadge";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { penaltyService } from "@/services/api/penaltyService";
import { employeeService } from "@/services/api/employeeService";
import { format } from "date-fns";

const Penalties = () => {
  const { onMenuClick } = useOutletContext();
  
  const [penalties, setPenalties] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredPenalties, setFilteredPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPenalties();
  }, [penalties, statusFilter, typeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [penaltiesData, employeesData] = await Promise.all([
        penaltyService.getAll(),
        employeeService.getAll()
      ]);
      setPenalties(penaltiesData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPenalties = () => {
    let filtered = [...penalties];

    if (statusFilter) {
      filtered = filtered.filter(penalty => penalty.status_c === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(penalty => penalty.type_c === typeFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date_c) - new Date(a.date_c));

    setFilteredPenalties(filtered);
  };

  const handleDelete = async (penalty) => {
    if (window.confirm("Are you sure you want to delete this penalty record?")) {
      try {
        await penaltyService.delete(penalty.Id);
        await loadData();
        toast.success("Penalty record deleted successfully");
      } catch (err) {
        toast.error("Failed to delete penalty record");
      }
    }
  };

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Resolved", value: "Resolved" }
  ];

  const typeOptions = [
    { label: "Verbal Warning", value: "Verbal Warning" },
    { label: "Written Warning", value: "Written Warning" },
    { label: "Suspension", value: "Suspension" },
    { label: "Termination", value: "Termination" }
  ];

  const getStatusCounts = () => {
    return {
      active: penalties.filter(penalty => penalty.status_c === "Active").length,
      resolved: penalties.filter(penalty => penalty.status_c === "Resolved").length,
      total: penalties.length
    };
  };

  const getTypeCounts = () => {
    return {
      verbal: penalties.filter(penalty => penalty.type_c === "Verbal Warning").length,
      written: penalties.filter(penalty => penalty.type_c === "Written Warning").length,
      suspension: penalties.filter(penalty => penalty.type_c === "Suspension").length,
      termination: penalties.filter(penalty => penalty.type_c === "Termination").length
    };
  };

  if (loading) return <Loading variant="skeleton" className="p-6" />;

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadData}
        className="p-6"
      />
    );
  }

  const statusCounts = getStatusCounts();
  const typeCounts = getTypeCounts();

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Penalties"
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Penalties</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="AlertCircle" className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Active</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.resolved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Ban" className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Suspensions</p>
                  <p className="text-2xl font-bold text-orange-600">{typeCounts.suspension}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FilterDropdown
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Statuses"
              />
              
              <FilterDropdown
                options={typeOptions}
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder="All Types"
              />
              
              <span className="text-sm text-secondary-600">
                {filteredPenalties.length} of {penalties.length} penalties
              </span>
            </div>
          </div>

          {/* Penalties List */}
          <div className="bg-white rounded-lg shadow-card border border-secondary-200">
            {filteredPenalties.length === 0 ? (
              <div className="p-6">
                <Empty
                  title="No penalties found"
                  description={statusFilter || typeFilter 
                    ? "No penalties match your current filters." 
                    : "No penalty records have been created yet."
                  }
                  icon="AlertTriangle"
                />
              </div>
            ) : (
              <div className="divide-y divide-secondary-200">
                {filteredPenalties.map((penalty) => {
                  const employee = employees.find(emp => emp.Id === penalty.employee_id_c?.Id);
                  if (!employee) return null;

                  return (
                    <div key={penalty.Id} className="p-6 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            src={employee?.photo_url_c}
                            name={employee ? `${employee.first_name_c} ${employee.last_name_c}` : penalty.employee_id_c?.Name || 'Unknown'}
                            size="lg"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {employee ? `${employee.first_name_c} ${employee.last_name_c}` : penalty.employee_id_c?.Name || 'Unknown Employee'}
                            </h3>
                            <p className="text-sm text-secondary-600">{employee?.role_c || ''} • {employee?.department_c || ''}</p>
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center text-sm text-secondary-600">
                                <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                                {format(new Date(penalty.date_c), "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center text-sm text-secondary-600">
                                <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-1" />
                                {penalty.type_c}
                              </div>
                              {penalty.amount_c && penalty.amount_c > 0 && (
                                <div className="flex items-center text-sm text-secondary-600">
                                  <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
                                  ${penalty.amount_c}
                                </div>
                              )}
                            </div>
                            
                            {penalty.reason_c && (
                              <p className="text-sm text-secondary-600 mt-2">
                                <span className="font-medium">Reason:</span> {penalty.reason_c}
                              </p>
                            )}
                            
                            <p className="text-xs text-secondary-500 mt-1">
                              Record created on {format(new Date(penalty.CreatedOn), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <StatusBadge status={penalty.status_c} type="penalty" />
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(penalty)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Penalties;