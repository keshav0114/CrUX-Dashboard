import axios from 'axios';

// The CrUX API endpoint
const CRUX_API_URL = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_CRUX_API_KEY || 'YOUR_API_KEY';

/**
 * Fetches Chrome UX Report data for a given URL
 * @param {string} url - The URL to query
 * @returns {Promise<Object>} - Processed CrUX data
 */
export const fetchCruxData = async (url) => {
  try {
    // Prepare request data following CrUX API requirements
    const requestData = {
      url: url,
      formFactor: 'PHONE', // Can be PHONE, DESKTOP, or ALL_FORM_FACTORS
    };

    // Make the API request
    const response = await axios.post(
      `${CRUX_API_URL}?key=${API_KEY}`,
      requestData
    );

    // Process the response data
    return processCruxData(response.data);
  } catch (error) {
    console.error('Error fetching CrUX data:', error);
    
    // Check if the error response contains detailed information
    if (error.response && error.response.data) {
      console.error('API Error details:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Processes raw CrUX API response into a more usable format
 * @param {Object} data - Raw CrUX API response
 * @returns {Object} - Processed data with metrics
 */
const processCruxData = (data) => {
  // For demo/mock purpose, if we're using a placeholder API key
  if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
    return generateMockData();
  }
  
  if (!data || !data.record || !data.record.metrics) {
    throw new Error('Invalid data format from CrUX API');
  }

  const { metrics } = data.record;
  const processedMetrics = {};

  // Process Core Web Vitals metrics (if available)
  // LCP (Largest Contentful Paint)
  if (metrics.largest_contentful_paint) {
    processedMetrics.lcp = metrics.largest_contentful_paint.percentiles.p75;
  }

  // FID (First Input Delay)
  if (metrics.first_input_delay) {
    processedMetrics.fid = metrics.first_input_delay.percentiles.p75;
  }

  // CLS (Cumulative Layout Shift)
  if (metrics.cumulative_layout_shift) {
    processedMetrics.cls = metrics.cumulative_layout_shift.percentiles.p75;
  }

  // FCP (First Contentful Paint)
  if (metrics.first_contentful_paint) {
    processedMetrics.fcp = metrics.first_contentful_paint.percentiles.p75;
  }

  // TTFB (Time to First Byte)
  if (metrics.experimental_time_to_first_byte) {
    processedMetrics.ttfb = metrics.experimental_time_to_first_byte.percentiles.p75;
  }

  // INP (Interaction to Next Paint)
  if (metrics.interaction_to_next_paint) {
    processedMetrics.inp = metrics.interaction_to_next_paint.percentiles.p75;
  }

  return {
    metrics: processedMetrics,
    origin: data.record.key.origin,
    collectionPeriod: {
      firstDate: data.record.collectionPeriod?.firstDate,
      lastDate: data.record.collectionPeriod?.lastDate,
    }
  };
};

/**
 * Generates mock data for testing when no API key is provided
 * @returns {Object} - Mock CrUX data
 */
const generateMockData = () => {
  return {
    metrics: {
      lcp: Math.random() * 4000 + 1000, // 1000-5000ms
      fid: Math.random() * 300, // 0-300ms
      cls: Math.random() * 0.25, // 0-0.25
      fcp: Math.random() * 2000 + 500, // 500-2500ms
      ttfb: Math.random() * 800 + 200, // 200-1000ms
      inp: Math.random() * 500 + 50, // 50-550ms
    },
    origin: 'https://example.com',
    collectionPeriod: {
      firstDate: { year: 2023, month: 6, day: 1 },
      lastDate: { year: 2023, month: 6, day: 28 },
    }
  };
}; 