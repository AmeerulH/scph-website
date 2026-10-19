type ReviewEnvironment = { nodeEnv?: string; vercelEnv?: string; localMode?: string };

/** Server deployment configuration only; request parameters cannot enable samples. */
export function canReviewGtpLibrary(environment: ReviewEnvironment = {
  nodeEnv: process.env.NODE_ENV,
  vercelEnv: process.env.VERCEL_ENV,
  localMode: process.env.GTP_LIBRARY_REVIEW_MODE,
}) {
  if (environment.nodeEnv === "production") return environment.vercelEnv === "preview";
  return environment.nodeEnv === "development" && environment.localMode === "1" && environment.vercelEnv !== "production";
}
