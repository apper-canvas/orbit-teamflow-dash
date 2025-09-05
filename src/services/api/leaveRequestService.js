export const leaveRequestService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "request_date_c"}}
        ],
        orderBy: [{"fieldName": "request_date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('leave_request_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "request_date_c"}}
        ]
      };

      const response = await apperClient.getRecordById('leave_request_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching leave request ${id}:`, error);
      return null;
    }
  },

  async getByEmployeeId(employeeId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "request_date_c"}}
        ],
        where: [{"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}],
        orderBy: [{"fieldName": "request_date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('leave_request_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employee leave requests:", error);
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "request_date_c"}}
        ],
        orderBy: [{"fieldName": "request_date_c", "sorttype": "DESC"}]
      };

      if (status) {
        params.where = [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}];
      }

      const response = await apperClient.fetchRecords('leave_request_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching leave requests by status:", error);
      return [];
    }
  },

  async create(leaveRequestData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Name: leaveRequestData.Name || `Leave Request ${new Date().getTime()}`,
          employee_id_c: parseInt(leaveRequestData.employee_id_c),
          start_date_c: leaveRequestData.start_date_c,
          end_date_c: leaveRequestData.end_date_c,
          type_c: leaveRequestData.type_c,
          reason_c: leaveRequestData.reason_c,
          status_c: leaveRequestData.status_c || "Pending",
          approved_by_c: leaveRequestData.approved_by_c || "",
          request_date_c: leaveRequestData.request_date_c || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('leave_request_c', payload);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating leave request:", error);
      return null;
    }
  },

  async update(id, leaveRequestData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          employee_id_c: parseInt(leaveRequestData.employee_id_c),
          start_date_c: leaveRequestData.start_date_c,
          end_date_c: leaveRequestData.end_date_c,
          type_c: leaveRequestData.type_c,
          reason_c: leaveRequestData.reason_c,
          status_c: leaveRequestData.status_c,
          approved_by_c: leaveRequestData.approved_by_c,
          request_date_c: leaveRequestData.request_date_c
        }]
      };

      const response = await apperClient.updateRecord('leave_request_c', payload);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating leave request:", error);
      return null;
    }
  },

  async approve(id, approvedBy) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          status_c: "Approved",
          approved_by_c: approvedBy
        }]
      };

      const response = await apperClient.updateRecord('leave_request_c', payload);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error approving leave request:", error);
      return null;
    }
  },

  async reject(id, approvedBy) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          status_c: "Rejected",
          approved_by_c: approvedBy
        }]
      };

      const response = await apperClient.updateRecord('leave_request_c', payload);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('leave_request_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting leave request:", error);
      return false;
    }
  }
};