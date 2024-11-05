export const convertIntervalToMinutes = (interval: string): number => {
  const [hours, minutes, seconds] = interval.split(':').map(Number);
  return hours * 60 + minutes + Math.floor(seconds / 60);
};

export const convertIntervalToMinutesAndSeconds = (
  interval: string
): string => {
  if (!interval || interval === '0') {
    return 'DESACTIVADO';
  }

  const [hours, minutes, seconds] = interval.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const minutesPart = totalMinutes > 0 ? `${totalMinutes} min` : '';
  const secondsPart = seconds > 0 ? `${seconds} s` : '';
  return [minutesPart, secondsPart].filter(Boolean).join(' y ');
};

export const convertIntervalToSeconds = (restTimeStr: string | null) => {
  if (!restTimeStr) return 0;
  const [hours, minutes, seconds] = restTimeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const convertStringToInterval = (time: string | null): string => {
  let minutes = 0;
  let seconds = 0;

  const minuteMatch = time!.match(/(\d+)\s*min/);
  const secondMatch = time!.match(/(\d+)\s*s/);

  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }

  if (secondMatch) {
    seconds = parseInt(secondMatch[1], 10);
  }

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `00:${formattedMinutes}:${formattedSeconds}`;
};
