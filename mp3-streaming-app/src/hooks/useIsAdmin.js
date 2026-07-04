import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAIL } from "../utils/constants";

/**
 * True only for the one account allowed to upload/remove songs (see
 * src/utils/constants.js for why this is UI-only, not real security).
 */
export function useIsAdmin() {
  const { user } = useAuth();
  return !!user?.email && user.email.toLowerCase() === ADMIN_EMAIL;
}
