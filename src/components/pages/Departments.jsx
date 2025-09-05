import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Employees from "@/components/pages/Employees";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import employeeMetadata from "@/metadata/tables/employee_c.json";
import departmentMetadata from "@/metadata/tables/department_c.json";
import leaveRequestMetadata from "@/metadata/tables/leave_request_c.json";
import attendanceMetadata from "@/metadata/tables/attendance_c.json";

const Departments = () => {
  const { onMenuClick } = useOutletContext();
  
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      setDepartments(departmentsData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const getDepartmentEmployees = (departmentName) => {
    return employees.filter(emp => emp.department_c === departmentName);
  };

const getDepartmentManager = (managerId) => {
    if (!managerId) return null;
    return employees.find(emp => emp.Id === managerId?.Id || emp.Id?.toString() === managerId?.toString());
  };

  const getDepartmentStats = () => {
    const stats = {};
    departments.forEach(dept => {
      const deptEmployees = getDepartmentEmployees(dept.name);
stats[dept.name_c] = {
        total: deptEmployees.length,
        active: deptEmployees.filter(emp => emp.status_c === "Active").length,
        onLeave: deptEmployees.filter(emp => emp.status_c === "On Leave").length
      };
    });
    return stats;
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

  const departmentStats = getDepartmentStats();

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Departments"
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Departments</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {departments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Employees</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    {employees.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Avg per Department</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {Math.round(employees.length / departments.length)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.map((department) => {
const manager = getDepartmentManager(department.manager_id_c);
              const deptEmployees = getDepartmentEmployees(department.name_c);
              const stats = departmentStats[department.name_c];

              return (
                <div key={department.Id} className="bg-white rounded-lg shadow-card border border-secondary-200 hover:shadow-card-hover transition-all duration-200">
                  <div className="p-6 border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-secondary-900">{department.name_c}</h3>
                        <p className="text-sm text-secondary-600 mt-1">{department.description_c}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-200 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Building2" className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Department Manager */}
                    {manager && (
                      <div className="flex items-center space-x-3 mb-4 p-3 bg-secondary-50 rounded-lg">
                        <Avatar
src={manager?.photo_url_c}
                          name={manager ? `${manager.first_name_c} ${manager.last_name_c}` : 'Unknown Manager'}
                        />
                        <div>
                          <p className="text-sm font-medium text-secondary-900">
{manager ? `${manager.first_name_c} ${manager.last_name_c}` : 'Unknown Manager'}
                          </p>
                          <p className="text-xs text-secondary-600">Department Manager</p>
                        </div>
                      </div>
                    )}

                    {/* Department Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-xs text-secondary-600">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        <p className="text-xs text-secondary-600">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{stats.onLeave}</p>
                        <p className="text-xs text-secondary-600">On Leave</p>
                      </div>
                    </div>

                    {/* Employee List */}
                    {deptEmployees.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-secondary-700 mb-3">Team Members</h4>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {deptEmployees.map((employee) => (
                            <div key={employee.Id} className="flex items-center space-x-3 p-2 hover:bg-secondary-50 rounded-md transition-colors">
                              <Avatar
src={employee.photo_url_c}
                                name={`${employee.first_name_c} ${employee.last_name_c}`}
                                size="sm"
                              />
<div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-secondary-900 truncate">
                                  {employee.first_name_c} {employee.last_name_c}
                                </p>
<p className="text-xs text-secondary-600">{employee.role_c || 'Employee'}</p>
                              </div>
<div className={`w-2 h-2 rounded-full ${
                                employee.status_c === "Active" ? "bg-green-400" :
                                employee.status_c === "On Leave" ? "bg-orange-400" :
                                "bg-red-400"
                              }`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <ApperIcon name="Users" className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                        <p className="text-sm text-secondary-600">No employees assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {departments.length === 0 && (
            <Empty
              title="No departments found"
              description="Start by creating your first department to organize your team structure."
              icon="Building2"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Departments;