import api from "@/utils/api";
import dayjs from "dayjs";

const AvailabilityService = {
  async getAvailability(facility_id: number, date: Date) {
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      if (facility_id === 1) {
        const response = await api.get(`/availfacility1/${facility_id}/${formattedDate}`);
      return response.data;
      }
      if (facility_id === 2) {
        const response = await api.get(`/availfacility2/${facility_id}/${formattedDate}`);
      return response.data;
      }
      if (facility_id === 3) {
        const response = await api.get(`/availfacility3/${facility_id}/${formattedDate}`);
      return response.data;
      }
      
    } catch (error) {
      console.error("Error fetching availability:", error);
      throw error;
    }
  },
};

export default AvailabilityService;
