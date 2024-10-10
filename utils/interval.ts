export const convertIntervalToMinutes = (interval: string): number => {
  const [hours, minutes, seconds] = interval.split(':').map(Number);
  return hours * 60 + minutes + Math.floor(seconds / 60);
};
