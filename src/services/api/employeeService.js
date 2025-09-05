export const employeeService = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}}
        ],
        orderBy: [{"fieldName": "first_name_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}}
        ]
      };

      const response = await apperClient.getRecordById('employee_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      return null;
    }
  },

  async create(employeeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Name: `${employeeData.first_name_c} ${employeeData.last_name_c}`,
          first_name_c: employeeData.first_name_c,
          last_name_c: employeeData.last_name_c,
          email_c: employeeData.email_c,
          phone_c: employeeData.phone_c,
          photo_url_c: employeeData.photo_url_c,
          department_c: employeeData.department_c,
          role_c: employeeData.role_c,
          hire_date_c: employeeData.hire_date_c,
          salary_c: parseFloat(employeeData.salary_c) || 0,
          status_c: employeeData.status_c,
          address_street_c: employeeData.address_street_c,
          address_city_c: employeeData.address_city_c,
          address_state_c: employeeData.address_state_c,
          address_zip_code_c: employeeData.address_zip_code_c,
          emergency_contact_name_c: employeeData.emergency_contact_name_c,
          emergency_contact_relationship_c: employeeData.emergency_contact_relationship_c,
          emergency_contact_phone_c: employeeData.emergency_contact_phone_c
        }]
      };

      const response = await apperClient.createRecord('employee_c', payload);
      
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
      console.error("Error creating employee:", error);
      return null;
    }
  },

  async update(id, employeeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          first_name_c: employeeData.first_name_c,
          last_name_c: employeeData.last_name_c,
          email_c: employeeData.email_c,
          phone_c: employeeData.phone_c,
          photo_url_c: employeeData.photo_url_c,
          department_c: employeeData.department_c,
          role_c: employeeData.role_c,
          hire_date_c: employeeData.hire_date_c,
          salary_c: parseFloat(employeeData.salary_c) || 0,
          status_c: employeeData.status_c,
          address_street_c: employeeData.address_street_c,
          address_city_c: employeeData.address_city_c,
          address_state_c: employeeData.address_state_c,
          address_zip_code_c: employeeData.address_zip_code_c,
          emergency_contact_name_c: employeeData.emergency_contact_name_c,
          emergency_contact_relationship_c: employeeData.emergency_contact_relationship_c,
          emergency_contact_phone_c: employeeData.emergency_contact_phone_c
        }]
      };

      const response = await apperClient.updateRecord('employee_c', payload);
      
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
      console.error("Error updating employee:", error);
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

      const response = await apperClient.deleteRecord('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return false;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "department_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "role_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching employees:", error);
      return [];
    }
  },

  async filterByDepartment(department) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}}
        ]
      };

      if (department) {
        params.where = [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}];
      }

      const response = await apperClient.fetchRecords('employee_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error filtering employees by department:", error);
      return [];
    }
}
};