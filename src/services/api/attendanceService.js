export const attendanceService = {
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await apperClient.getRecordById('attendance_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error);
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employee attendance:", error);
      return [];
    }
  },

  async getByDate(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const targetDate = new Date(date).toISOString().split('T')[0];

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [targetDate]}]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error);
      return [];
    }
  },

  async create(attendanceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Name: attendanceData.Name || `Attendance ${new Date().getTime()}`,
          employee_id_c: parseInt(attendanceData.employee_id_c),
          date_c: attendanceData.date_c,
          check_in_c: attendanceData.check_in_c,
          check_out_c: attendanceData.check_out_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c
        }]
      };

      const response = await apperClient.createRecord('attendance_c', payload);
      
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
      console.error("Error creating attendance record:", error);
      return null;
    }
  },

  async update(id, attendanceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          employee_id_c: parseInt(attendanceData.employee_id_c),
          date_c: attendanceData.date_c,
          check_in_c: attendanceData.check_in_c,
          check_out_c: attendanceData.check_out_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c
        }]
      };

      const response = await apperClient.updateRecord('attendance_c', payload);
      
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
      console.error("Error updating attendance record:", error);
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

      const response = await apperClient.deleteRecord('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      return false;
}
  }
};