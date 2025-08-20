import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(att => att.Id === parseInt(id));
    if (!record) {
      throw new Error(`Attendance record with ID ${id} not found`);
    }
    return { ...record };
  },

  async getByEmployeeId(employeeId) {
    await delay(200);
    return attendance.filter(att => att.employeeId === employeeId.toString());
  },

  async getByDate(date) {
    await delay(200);
    const targetDate = new Date(date).toISOString().split('T')[0];
    return attendance.filter(att => {
      const recordDate = new Date(att.date).toISOString().split('T')[0];
      return recordDate === targetDate;
    });
  },

  async create(attendanceData) {
    await delay(500);
    const maxId = Math.max(...attendance.map(att => att.Id), 0);
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(400);
    const index = attendance.findIndex(att => att.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Attendance record with ID ${id} not found`);
    }
    const updatedRecord = {
      ...attendanceData,
      Id: parseInt(id)
    };
    attendance[index] = updatedRecord;
    return { ...updatedRecord };
  },

  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(att => att.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Attendance record with ID ${id} not found`);
    }
    const deletedRecord = attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  }
};