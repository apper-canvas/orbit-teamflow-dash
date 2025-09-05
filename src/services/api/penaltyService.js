const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const penaltyService = {
  async getAll() {
    try {
      await delay(300);
      
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('penalty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching penalties:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('penalty_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching penalty ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(penaltyData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: penaltyData.Name,
          employee_id_c: parseInt(penaltyData.employee_id_c),
          date_c: penaltyData.date_c,
          type_c: penaltyData.type_c,
          reason_c: penaltyData.reason_c,
          amount_c: parseFloat(penaltyData.amount_c) || 0,
          status_c: penaltyData.status_c || "Active"
        }]
      };

      const response = await apperClient.createRecord('penalty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} penalty records:`, failed);
          const errorMessage = failed[0].message || "Failed to create penalty";
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating penalty:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, penaltyData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: penaltyData.Name,
          employee_id_c: parseInt(penaltyData.employee_id_c),
          date_c: penaltyData.date_c,
          type_c: penaltyData.type_c,
          reason_c: penaltyData.reason_c,
          amount_c: parseFloat(penaltyData.amount_c) || 0,
          status_c: penaltyData.status_c
        }]
      };

      const response = await apperClient.updateRecord('penalty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} penalty records:`, failed);
          const errorMessage = failed[0].message || "Failed to update penalty";
          throw new Error(errorMessage);
        }
        
        return successful[0]?.data;
      }
      
      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating penalty:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('penalty_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} penalty records:`, failed);
          const errorMessage = failed[0].message || "Failed to delete penalty";
          throw new Error(errorMessage);
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting penalty:", error?.response?.data?.message || error);
      throw error;
    }
  }
};