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
import { leaveRequestService } from "@/services/api/leaveRequestService";
import { employeeService } from "@/services/api/employeeService";
import { format, differenceInDays } from "date-fns";

const LeaveRequests = () => {
  const { onMenuClick } = useOutletContext();
  
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [leaveRequests, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [requestsData, employeesData] = await Promise.all([
        leaveRequestService.getAll(),
        employeeService.getAll()
      ]);
      setLeaveRequests(requestsData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...leaveRequests];

    if (statusFilter) {
filtered = filtered.filter(req => req.status_c === statusFilter);
    }

    // Sort by request date (newest first)
filtered.sort((a, b) => new Date(b.request_date_c) - new Date(a.request_date_c));

    setFilteredRequests(filtered);
  };

  const handleApprove = async (request) => {
    try {
      await leaveRequestService.approve(request.Id, "HR Admin");
      await loadData();
      toast.success("Leave request approved");
    } catch (err) {
      toast.error("Failed to approve leave request");
    }
  };

  const handleReject = async (request) => {
    if (window.confirm("Are you sure you want to reject this leave request?")) {
      try {
        await leaveRequestService.reject(request.Id, "HR Admin");
        await loadData();
        toast.success("Leave request rejected");
      } catch (err) {
        toast.error("Failed to reject leave request");
      }
    }
  };

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" }
  ];

  const getStatusCounts = () => {
    return {
pending: leaveRequests.filter(req => req.status_c === "Pending").length,
      approved: leaveRequests.filter(req => req.status_c === "Approved").length,
      rejected: leaveRequests.filter(req => req.status_c === "Rejected").length,
      total: leaveRequests.length
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

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Leave Requests"
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="XCircle" className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
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
              
              <span className="text-sm text-secondary-600">
                {filteredRequests.length} of {leaveRequests.length} requests
              </span>
            </div>
          </div>

          {/* Leave Requests List */}
          <div className="bg-white rounded-lg shadow-card border border-secondary-200">
            {filteredRequests.length === 0 ? (
              <div className="p-6">
                <Empty
                  title="No leave requests found"
                  description={statusFilter 
                    ? "No requests match your current filter." 
                    : "No leave requests have been submitted yet."
                  }
                  icon="Calendar"
                />
              </div>
            ) : (
              <div className="divide-y divide-secondary-200">
                {filteredRequests.map((request) => {
const employee = employees.find(emp => emp.Id === request.employee_id_c?.Id);
                  if (!employee) return null;

const duration = differenceInDays(new Date(request.end_date_c), new Date(request.start_date_c)) + 1;

                  return (
                    <div key={request.Id} className="p-6 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar
src={employee?.photo_url_c}
                            name={employee ? `${employee.first_name_c} ${employee.last_name_c}` : request.employee_id_c?.Name || 'Unknown'}
                            size="lg"
                          />
                          <div>
<h3 className="text-lg font-semibold text-secondary-900">
                              {employee ? `${employee.first_name_c} ${employee.last_name_c}` : request.employee_id_c?.Name || 'Unknown Employee'}
                            </h3>
                            <p className="text-sm text-secondary-600">{employee?.role_c || ''} • {employee?.department_c || ''}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center text-sm text-secondary-600">
                                <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
{format(new Date(request.start_date_c), "MMM dd")} - {format(new Date(request.end_date_c), "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center text-sm text-secondary-600">
                                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                                {duration} day{duration > 1 ? "s" : ""}
                              </div>
                              <div className="flex items-center text-sm text-secondary-600">
                                <ApperIcon name="Tag" className="w-4 h-4 mr-1" />
{request.type_c}
                              </div>
                            </div>
                            {request.reason && (
<p className="text-sm text-secondary-600 mt-2">
                                <span className="font-medium">Reason:</span> {request.reason_c}
                              </p>
                            )}
                            <p className="text-xs text-secondary-500 mt-1">
Requested on {format(new Date(request.request_date_c), "MMM dd, yyyy")}
                              {request.approved_by_c && ` • ${request.status_c} by ${request.approved_by_c}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
<StatusBadge status={request.status_c} type="leave" />
                          
{request.status_c === "Pending" && (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="accent"
                                size="sm"
                                onClick={() => handleApprove(request)}
                              >
                                <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(request)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
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

export default LeaveRequests;