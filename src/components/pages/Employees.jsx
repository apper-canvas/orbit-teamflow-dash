import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { employeeService } from "@/services/api/employeeService";
import ApperIcon from "@/components/ApperIcon";
import EmployeeCard from "@/components/organisms/EmployeeCard";
import Header from "@/components/organisms/Header";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import employeeMetadata from "@/metadata/tables/employee_c.json";
import departmentMetadata from "@/metadata/tables/department_c.json";
import leaveRequestMetadata from "@/metadata/tables/leave_request_c.json";
import attendanceMetadata from "@/metadata/tables/attendance_c.json";

const Employees = () => {
  const { onMenuClick } = useOutletContext();
  
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, departmentFilter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const filterEmployees = () => {
    let filtered = [...employees];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.first_name_c?.toLowerCase().includes(query) ||
        emp.last_name_c?.toLowerCase().includes(query) ||
        emp.email_c?.toLowerCase().includes(query) ||
        emp.role_c?.toLowerCase().includes(query)
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department_c === departmentFilter);
    }

    setFilteredEmployees(filtered);
  };

const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode("add");
    setModalOpen(true);
  };

const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.first_name_c} ${employee.last_name_c}?`)) {
      try {
        await employeeService.delete(employee.Id);
        await loadEmployees();
        toast.success("Employee deleted successfully");
      } catch (err) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (modalMode === "add") {
        await employeeService.create(employeeData);
        toast.success("Employee added successfully");
      } else {
        await employeeService.update(selectedEmployee.Id, employeeData);
        toast.success("Employee updated successfully");
      }
      await loadEmployees();
      setModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${modalMode === "add" ? "add" : "update"} employee`);
    }
  };
const departments = [...new Set(employees.map(emp => emp.department_c).filter(Boolean))].map(dept => ({
    label: dept,
    value: dept
  }));

  if (loading) return <Loading variant="skeleton" className="p-6" />;

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadEmployees}
        className="p-6"
      />
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Employees"
        onMenuClick={onMenuClick}
        showSearch
        onSearch={setSearchQuery}
        actions={
          <Button onClick={handleAddEmployee}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        }
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FilterDropdown
                options={departments}
                value={departmentFilter}
                onChange={setDepartmentFilter}
                placeholder="All Departments"
              />
              
              <span className="text-sm text-secondary-600">
                {filteredEmployees.length} of {employees.length} employees
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <ApperIcon name="List" className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Employee Grid/List */}
          {filteredEmployees.length === 0 ? (
            <Empty
              title="No employees found"
              description={searchQuery || departmentFilter 
                ? "Try adjusting your search or filter criteria." 
                : "Start by adding your first employee to the system."
              }
              action={handleAddEmployee}
              actionLabel="Add Employee"
              icon="Users"
            />
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.Id}
                  employee={employee}
                  onView={handleViewEmployee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Employee Modal */}
      <EmployeeModal
        employee={selectedEmployee}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEmployee}
        mode={modalMode}
      />
    </div>
  );
};

export default Employees;