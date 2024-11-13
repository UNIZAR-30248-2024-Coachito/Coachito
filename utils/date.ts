export const calculateDaysDifferenceNow = (dateString: string): number => {
  const date = new Date(dateString);
  const currentDate = new Date();

  const differenceInMillis = currentDate.getTime() - date.getTime();

  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  return Math.floor(differenceInDays);
};

export const formatToChartLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
  };

  return new Intl.DateTimeFormat('en-ES', options)
    .format(date)
    .replace(',', '');
};
