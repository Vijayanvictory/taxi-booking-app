// Generate unique booking reference ID
const generateReferenceId = () => {
  const prefix = 'BK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Calculate fare based on distance
const calculateFare = (distance, ratePerKm, baseFare) => {
  const fare = (distance * ratePerKm) + baseFare;
  return parseFloat(fare.toFixed(2));
};

// Format date for database
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

module.exports = {
  generateReferenceId,
  calculateFare,
  formatDate
};
