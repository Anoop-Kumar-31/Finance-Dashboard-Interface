import { useSelector } from "react-redux";

/**
 * Simple role-based access hook.
 * 
 * Roles:
 *  - "Super Admin" → full access (add, edit, delete)
 *  - "Admin"       → full access (add, edit, delete)
 *  - "Member"      → view only
 *  - default       → view only
 */
const ADMIN_ROLES = ["Super Admin", "Admin", "admin"]; // Support various casing

const useRole = () => {
  const user = useSelector((state) => state.user.currentUser);
  const role = user?.role || "Viewer"; // Defaulting to the least privileged role
  
  // Robust case-insensitive check to avoid intermittent visibility bugs
  const isAdmin = ADMIN_ROLES.some(r => r.toLowerCase() === role.toLowerCase());

  return {
    role,
    isAdmin,
    canAdd: isAdmin,
    canEdit: isAdmin,
    canDelete: isAdmin,
    canExport: true, // everyone can export
  };
};

export default useRole;
