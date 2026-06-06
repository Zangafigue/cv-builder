const FormatDate = ({ dateString, format = 'short', showDay = false }) => {
  if (!dateString) return '';
  
  // If the date string is already a formatted period/text (e.g. "Oct. 2024"), just return it
  if (isNaN(Date.parse(dateString)) && !/^\d{4}-\d{2}$/.test(dateString) && !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const options = { year: 'numeric' };
  
  if (format === 'short') { // e.g Jan 2023
    options.month = 'short';
  } else if (format === 'long') { // e.g Janvier 2023
    options.month = 'long';
  } else if (format === 'numeric') { // e.g 01/2023
    options.month = '2-digit';
  }
  
  if (showDay) {
    options.day = '2-digit';
  }
  
  try {
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch {
    return dateString;
  }
};

export default FormatDate;
