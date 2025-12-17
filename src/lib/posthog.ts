import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

export const initPostHog = () => {
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not configured. Analytics disabled.');
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'always',
    capture_pageview: false, // We'll handle this manually with React Router
    capture_pageleave: true,
    autocapture: true,
  });
};

export { posthog };
