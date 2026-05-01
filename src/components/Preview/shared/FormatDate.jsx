const FormatDate = ({ dateString, format = 'short', showDay = false }) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
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

  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

export default FormatDate;
