import api from "@/utils/api";
import dayjs from "dayjs";

const AvailabilityService = {
  async getAvailability(facility_id: number, date: Date) {
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const response = await api.get(`/availability/${facility_id}/${formattedDate}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching availability:", error);
      throw error;
    }
  },
};

export default AvailabilityService;
