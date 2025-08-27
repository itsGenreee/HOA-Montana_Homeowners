import dayjs from "dayjs";

export const formatDate = (d: Date | null) => {
  return d ? dayjs(d).format("MMMM D, YYYY") : "N/A";
};

export const formatTime = (d: Date | null) => {
  return d ? dayjs(d).format("h:mm A") : "N/A";
};
