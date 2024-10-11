export const calculateDaysDifferenceNow = (date: Date): number => {
  const currentDate = new Date();

  const differenceInMillis = currentDate.getTime() - date.getTime();

  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  return Math.floor(differenceInDays);
};
