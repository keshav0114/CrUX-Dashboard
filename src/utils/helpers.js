/**
 * Checks if a value is within a "good" range for a specific metric
 * @param {string} metric - The metric name
 * @param {number} value - The metric value
 * @returns {string} - 'good', 'needs-improvement', or 'poor'
 */
export const getMetricRating = (metric, value) => {
  if (!metric || value === undefined || value === null) return 'unknown';

  // Based on Core Web Vitals thresholds
  // https://web.dev/vitals/
  switch (metric.toLowerCase()) {
    case 'lcp': // Largest Contentful Paint (ms)
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    
    case 'fid': // First Input Delay (ms)
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    
    case 'cls': // Cumulative Layout Shift
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    
    case 'fcp': // First Contentful Paint (ms)
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    
    case 'ttfb': // Time to First Byte (ms)
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    
    case 'inp': // Interaction to Next Paint (ms)
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    
    default:
      return 'unknown';
  }
};

/**
 * Formats a metric value for display
 * @param {string} metric - The metric name
 * @param {number} value - The metric value
 * @returns {string} - Formatted value
 */
export const formatMetricValue = (metric, value) => {
  if (value === undefined || value === null) return '-';
  
  // Format based on metric type
  switch (metric.toLowerCase()) {
    case 'cls': // Cumulative Layout Shift (unitless)
      return value.toFixed(3);
    
    case 'lcp': // Largest Contentful Paint (ms)
    case 'fid': // First Input Delay (ms)
    case 'fcp': // First Contentful Paint (ms)
    case 'ttfb': // Time to First Byte (ms)
    case 'inp': // Interaction to Next Paint (ms)
      return `${Math.round(value)} ms`;
    
    default:
      return value.toString();
  }
};

/**
 * Returns a human-readable description of a metric
 * @param {string} metric - The metric name
 * @returns {string} - Description
 */
export const getMetricDescription = (metric) => {
  switch (metric.toLowerCase()) {
    case 'lcp':
      return 'Largest Contentful Paint - measures loading performance';
    case 'fid':
      return 'First Input Delay - measures interactivity';
    case 'cls':
      return 'Cumulative Layout Shift - measures visual stability';
    case 'fcp':
      return 'First Contentful Paint - measures when the first content is painted';
    case 'ttfb':
      return 'Time to First Byte - measures time until the first byte of the page is received';
    case 'inp':
      return 'Interaction to Next Paint - measures responsiveness';
    default:
      return metric;
  }
}; 