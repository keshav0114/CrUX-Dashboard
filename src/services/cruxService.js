import axios from 'axios';

const CRUX_API_URL = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';

const API_KEY = import.meta.env.VITE_CRUX_API_KEY;

/**
 * Fetches Chrome UX Report data for a given URL
 * @param {string} url - The URL to query
 * @returns {Promise<Object>} - Processed CrUX data
 */
export const fetchCruxData = async (url) => {
  try {
    const requestData = {
      url: url,
      formFactor: 'PHONE', // Can be PHONE, DESKTOP, or ALL_FORM_FACTORS
    };

    const response = await axios.post(
      `${CRUX_API_URL}?key=${API_KEY}`,
      requestData
    );

    return processCruxData(response.data);
  } catch (error) {
    console.error('Error fetching CrUX data:', error);
    
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
  if (!data || !data.record || !data.record.metrics) {
    throw new Error('Invalid data format from CrUX API');
  }

  const { metrics } = data.record;
  const processedMetrics = {};

  if (metrics.largest_contentful_paint) {
    processedMetrics.lcp = Number(metrics.largest_contentful_paint.percentiles.p75);
  }

  if (metrics.first_input_delay) {
    processedMetrics.fid = Number(metrics.first_input_delay.percentiles.p75);
  }

  if (metrics.cumulative_layout_shift) {
    processedMetrics.cls = Number(metrics.cumulative_layout_shift.percentiles.p75);
  }

  if (metrics.first_contentful_paint) {
    processedMetrics.fcp = Number(metrics.first_contentful_paint.percentiles.p75);
  }

  if (metrics.experimental_time_to_first_byte) {
    processedMetrics.ttfb = Number(metrics.experimental_time_to_first_byte.percentiles.p75);
  }

  if (metrics.interaction_to_next_paint) {
    processedMetrics.inp = Number(metrics.interaction_to_next_paint.percentiles.p75);
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