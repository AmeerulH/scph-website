import {
  FullPageLoadingOverlay,
  type RouteLoadingVariant,
} from "./full-page-loading-overlay";

export type { RouteLoadingVariant };

type Props = {
  variant?: RouteLoadingVariant;
};

/**
 * Route transition loading UI (App Router `loading.tsx`). Same visuals as form pending overlay.
 */
export default function RouteLoading({ variant = "scph" }: Props) {
  return <FullPageLoadingOverlay variant={variant} label="Loading page" />;
}
