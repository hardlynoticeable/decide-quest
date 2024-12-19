export const GA_TRACKING_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

// Log the pageview with the given URL
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Log specific events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}; 