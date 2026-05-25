export const CREDENTIALS = [
    { role: "Super Admin", badge: "super_admin", badgeClass: "super_admin", email: "manjusha.racca@gmail.com", pass: "Password123" },
    { role: "User", badge: "user", badgeClass: "user", email: "rashmika@gmail.com", pass: "Password123" },
    // { role: "Employee", badge: "employee", badgeClass: "employee", email: "mgkcode@gmail.com", pass: "Password123" },
] as const;

export const ROLES = {
    super_admin: {role:"super_admin", text: "Super Admin", color: "bg-rose-100 border-rose-200 text-rose-700"},
    user: {role: "user", text: "User", color: "bg-orange-100 border-orange-200 text-orange-700"},
    // employee: {role: "employee", text: "Employee", color: "bg-green-100 border-green-200 text-green-700"},
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES]['role']
