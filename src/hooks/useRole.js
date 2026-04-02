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
const ADMIN_ROLES = ["Super Admin", "Admin"];

const useRole = () => {
  const user = useSelector((state) => state.user.currentUser);
  const role = user?.role || "Member";
  const isAdmin = ADMIN_ROLES.includes(role);

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
