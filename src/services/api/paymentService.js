import { toast } from 'react-toastify';

export const paymentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "employee_c"}},
          {"field": {"Name": "payment_date_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords('payment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error?.response?.data?.message || error);
      throw error;
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
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "employee_c"}},
          {"field": {"Name": "payment_date_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "reason_c"}}
        ]
      };

      const response = await apperClient.getRecordById('payment_c', id, params);
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(paymentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const params = {
        records: [{
          Name: paymentData.Name,
          Tags: paymentData.Tags || "",
          employee_c: parseInt(paymentData.employee_c),
          payment_date_c: paymentData.payment_date_c,
          amount_c: parseFloat(paymentData.amount_c),
          status_c: paymentData.status_c,
          reason_c: paymentData.reason_c || ""
        }]
      };

      const response = await apperClient.createRecord('payment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create payment:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        toast.success('Payment created successfully');
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating payment:", error?.response?.data?.message || error);
      toast.error("Failed to create payment");
      throw error;
    }
  },

  async update(id, paymentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: paymentData.Name,
          Tags: paymentData.Tags || "",
          employee_c: parseInt(paymentData.employee_c),
          payment_date_c: paymentData.payment_date_c,
          amount_c: parseFloat(paymentData.amount_c),
          status_c: paymentData.status_c,
          reason_c: paymentData.reason_c || ""
        }]
      };

      const response = await apperClient.updateRecord('payment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update payment:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        toast.success('Payment updated successfully');
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating payment:", error?.response?.data?.message || error);
      toast.error("Failed to update payment");
      throw error;
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

      const response = await apperClient.deleteRecord('payment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete payment:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        toast.success('Payment deleted successfully');
        return true;
      }
    } catch (error) {
      console.error("Error deleting payment:", error?.response?.data?.message || error);
      toast.error("Failed to delete payment");
      return false;
    }
  }
};