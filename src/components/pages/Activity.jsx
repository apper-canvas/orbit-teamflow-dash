import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { activityService } from "@/services/api/activityService";
import { employeeService } from "@/services/api/employeeService";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ActivityModal = ({ activity, employees, isOpen, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState({
    Name_c: "",
    type_c: "",
    description_c: "",
    activity_date_c: "",
    employee_id_c: ""
  });
  const [loading, setLoading] = useState(false);

  const activityTypes = [
    { label: "Meeting", value: "Meeting" },
    { label: "Call", value: "Call" },
    { label: "Email", value: "Email" },
    { label: "Task", value: "Task" },
    { label: "Other", value: "Other" }
  ];

  useEffect(() => {
    if (activity && (mode === "edit" || mode === "view")) {
      setFormData({
        Name_c: activity.Name_c || "",
        type_c: activity.type_c || "",
        description_c: activity.description_c || "",
        activity_date_c: activity.activity_date_c 
          ? new Date(activity.activity_date_c).toISOString().slice(0, 16)
          : "",
        employee_id_c: activity.employee_id_c?.Id || activity.employee_id_c || ""
      });
    } else if (mode === "add") {
      setFormData({
        Name_c: "",
        type_c: "",
        description_c: "",
        activity_date_c: "",
        employee_id_c: ""
      });
    }
  }, [activity, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        activity_date_c: formData.activity_date_c 
          ? new Date(formData.activity_date_c).toISOString()
          : null
      };
      
      await onSave(submitData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {mode === "add" ? "Add Activity" : 
             mode === "edit" ? "Edit Activity" : "Activity Details"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              disabled={mode === "view"}
              value={formData.Name_c}
              onChange={(e) => setFormData({...formData, Name_c: e.target.value})}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50"
              placeholder="Enter activity name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Type *
            </label>
            <select
              required
              disabled={mode === "view"}
              value={formData.type_c}
              onChange={(e) => setFormData({...formData, type_c: e.target.value})}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50"
            >
              <option value="">Select type</option>
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Employee
            </label>
            <select
              disabled={mode === "view"}
              value={formData.employee_id_c}
              onChange={(e) => setFormData({...formData, employee_id_c: e.target.value})}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50"
            >
              <option value="">Select employee</option>
              {employees.map(employee => (
                <option key={employee.Id} value={employee.Id}>
                  {employee.first_name_c} {employee.last_name_c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              disabled={mode === "view"}
              value={formData.activity_date_c}
              onChange={(e) => setFormData({...formData, activity_date_c: e.target.value})}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Description
            </label>
            <textarea
              disabled={mode === "view"}
              value={formData.description_c}
              onChange={(e) => setFormData({...formData, description_c: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50"
              placeholder="Enter activity description"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "add" ? "Adding..." : "Updating..."}
                  </>
                ) : (
                  mode === "add" ? "Add Activity" : "Update Activity"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity, onEdit, onView, onDelete, className }) => {
  const getTypeColor = (type) => {
    const colors = {
      Meeting: "bg-blue-100 text-blue-800",
      Call: "bg-green-100 text-green-800",
      Email: "bg-purple-100 text-purple-800",
      Task: "bg-orange-100 text-orange-800",
      Other: "bg-gray-100 text-gray-800"
    };
    return colors[type] || colors.Other;
  };

  const getTypeIcon = (type) => {
    const icons = {
      Meeting: "Users",
      Call: "Phone",
      Email: "Mail",
      Task: "CheckCircle",
      Other: "Activity"
    };
    return icons[type] || icons.Other;
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border border-secondary-200 shadow-card hover:shadow-card-hover transition-all duration-200 transform hover:scale-[1.02]",
      className
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name={getTypeIcon(activity.type_c)} className="w-5 h-5 text-secondary-500" />
              <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getTypeColor(activity.type_c))}>
                {activity.type_c}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              {activity.Name_c}
            </h3>
            {activity.employee_id_c?.Name && (
              <p className="text-sm text-secondary-600 flex items-center">
                <ApperIcon name="User" className="w-4 h-4 mr-1" />
                {activity.employee_id_c.Name}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-secondary-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-secondary-400" />
            <span>
              {activity.activity_date_c 
                ? format(new Date(activity.activity_date_c), "PPP 'at' p")
                : "No date set"}
            </span>
          </div>
          {activity.description_c && (
            <div className="text-sm text-secondary-600">
              <p className="line-clamp-2">{activity.description_c}</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t border-secondary-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(activity)}
            className="flex-1"
          >
            <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit?.(activity)}
            className="flex-1"
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(activity)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Activity = () => {
  const { onMenuClick } = useOutletContext();
  
  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, typeFilter, employeeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [activitiesData, employeesData] = await Promise.all([
        activityService.getAll(),
        employeeService.getAll()
      ]);
      
      setActivities(activitiesData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.Name_c?.toLowerCase().includes(query) ||
        activity.type_c?.toLowerCase().includes(query) ||
        activity.description_c?.toLowerCase().includes(query)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(activity => activity.type_c === typeFilter);
    }

    if (employeeFilter) {
      filtered = filtered.filter(activity => 
        activity.employee_id_c?.Id === parseInt(employeeFilter)
      );
    }

    setFilteredActivities(filtered);
  };

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleDeleteActivity = async (activity) => {
    if (window.confirm(`Are you sure you want to delete "${activity.Name_c}"?`)) {
      try {
        await activityService.delete(activity.Id);
        await loadData();
        toast.success("Activity deleted successfully");
      } catch (err) {
        toast.error("Failed to delete activity");
      }
    }
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (modalMode === "add") {
        await activityService.create(activityData);
        toast.success("Activity added successfully");
      } else {
        await activityService.update(selectedActivity.Id, activityData);
        toast.success("Activity updated successfully");
      }
      await loadData();
      setModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${modalMode === "add" ? "add" : "update"} activity`);
    }
  };

  const activityTypes = [
    { label: "Meeting", value: "Meeting" },
    { label: "Call", value: "Call" },
    { label: "Email", value: "Email" },
    { label: "Task", value: "Task" },
    { label: "Other", value: "Other" }
  ];

  const employeeOptions = employees.map(emp => ({
    label: `${emp.first_name_c} ${emp.last_name_c}`,
    value: emp.Id.toString()
  }));

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

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Activities"
        onMenuClick={onMenuClick}
        showSearch
        onSearch={setSearchQuery}
        actions={
          <Button onClick={handleAddActivity}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        }
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FilterDropdown
                options={activityTypes}
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder="All Types"
              />
              
              <FilterDropdown
                options={employeeOptions}
                value={employeeFilter}
                onChange={setEmployeeFilter}
                placeholder="All Employees"
              />
              
              <span className="text-sm text-secondary-600">
                {filteredActivities.length} of {activities.length} activities
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

          {filteredActivities.length === 0 ? (
            <Empty
              title="No activities found"
              description={searchQuery || typeFilter || employeeFilter
                ? "Try adjusting your search or filter criteria." 
                : "Start by adding your first activity to track employee interactions."
              }
              action={handleAddActivity}
              actionLabel="Add Activity"
              icon="Activity"
            />
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.Id}
                  activity={activity}
                  onView={handleViewActivity}
                  onEdit={handleEditActivity}
                  onDelete={handleDeleteActivity}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ActivityModal
        activity={selectedActivity}
        employees={employees}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveActivity}
        mode={modalMode}
      />
    </div>
  );
};

export default Activity;