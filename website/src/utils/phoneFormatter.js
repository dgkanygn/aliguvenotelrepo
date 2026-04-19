export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d]/g, '');
  let formatted = cleaned;
  
  // If it starts with 90, remove it
  if (formatted.startsWith('90')) formatted = formatted.substring(2);
  // If it doesn't start with 0, add it
  if (!formatted.startsWith('0') && formatted.length === 10) formatted = '0' + formatted;
  
  if (formatted.length === 11) {
    return `${formatted.slice(0, 1)} ${formatted.slice(1, 4)} ${formatted.slice(4, 7)} ${formatted.slice(7, 9)} ${formatted.slice(9, 11)}`;
  }
  return phone;
};
