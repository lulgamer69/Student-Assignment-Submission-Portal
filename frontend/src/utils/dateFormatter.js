/**
 * Format date to readable string
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted date like "12 Apr 2026, 2:30 PM"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (err) {
    console.error('Date formatting error:', err);
    return 'N/A';
  }
};

/**
 * Format date to short form
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted date like "12 Apr"
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (err) {
    return 'N/A';
  }
};

/**
 * Check if date is in the past
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {boolean}
 */
export const isDeadlinePassed = (dateString) => {
  try {
    const date = new Date(dateString);
    return date < new Date();
  } catch (err) {
    return false;
  }
};
