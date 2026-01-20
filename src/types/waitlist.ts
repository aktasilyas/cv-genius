// Waitlist feature flags for easy switching to paid flow later
export const WAITLIST_MODE = {
  // When true, the app is in waitlist/pre-launch mode
  // When false, payment flow is enabled
  enabled: true,
  
  // Feature restrictions in waitlist mode
  restrictions: {
    pdfExport: true,        // Block PDF export
    premiumTemplates: true, // Block premium templates
    aiFeatures: false,      // Allow AI features for MVP testing
    linkedInImport: false,  // Allow LinkedIn import for MVP testing
    jobMatching: false,     // Allow job matching for MVP testing
    unlimitedCVs: true,     // Block unlimited CVs
  },
} as const;

// Check if a feature is restricted in waitlist mode
export function isFeatureRestricted(feature: keyof typeof WAITLIST_MODE.restrictions): boolean {
  return WAITLIST_MODE.enabled && WAITLIST_MODE.restrictions[feature];
}

// Check if we're in waitlist mode
export function isWaitlistMode(): boolean {
  return WAITLIST_MODE.enabled;
}
