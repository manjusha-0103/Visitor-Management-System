// import AdminSubHeader from "@/components/AdminSubHeader";
// import UserFilters from "@/components/user/UserFilter";
// import UserForm from "@/components/user/UserForm";
// import UsersTable from "@/components/user/UserTable";
// import { useGetAllUsersQuery, type User } from "@/lib/features/users/usersApi";
// import { useEffect, useMemo, useState } from "react";
// // import type { User } from "@/components/manage-users/users-table/columns";

// const LIMIT = 10;

// type ColumnFilter = {
//   id: string;
//   value: string;
// };

// export default function ManageUsers() {
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
//   const [userSheetOpen, setUserSheetOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [sheetMode, setSheetMode] = useState<"edit">("edit");
//   // const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");


//   // ── Extract role filter to pass to API ────────────────────────────────────
//   const roleFilter = useMemo(
//     () => columnFilters.find((f) => f.id === "role")?.value || "",
//     [columnFilters]
//   );

//   // ── Debounce search ───────────────────────────────────────────────────────
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchInput);
//       setPage(1);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [searchInput]);

//   // ── Reset page on role filter change ─────────────────────────────────────
//   useEffect(() => {
//     setPage(1);
//   }, [roleFilter]);

//   const { data, isLoading, isFetching } = useGetAllUsersQuery({
//     page,
//     limit: LIMIT,
//     search: debouncedSearch,
//     role: roleFilter,
//   });

//   const users = useMemo(() => data?.data?.data || [], [data]);
//   const totalPages  = useMemo(() => data?.data?.pagination?.totalPages || 1, [data]);
//   const currentPage = useMemo(() => data?.data?.pagination?.page || 1, [data]);

//   const handleClear = () => {
//     setSearchInput("");
//     setDebouncedSearch("");
//     setPage(1);
//   };

//   const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
//   const handleNext     = () => setPage((p) => (p < totalPages ? p + 1 : p));


//    // const handleAddUser = () => {
//    //      setSheetMode("add");
//    //      setSelectedUser(null);
//    //      setUserSheetOpen(true);
//    //  };

//   return (
//     <section className="mb-10">
//       <AdminSubHeader
//         showBack={true}
//         to="/admin"
//         heading="Manage Users"
//         subh="View all users — visitors, employees, receptionists"
//       />

//       {/* Add edit / view sheets here when ready */}

//       <UserFilters
//         searchInput={searchInput}
//         setSearchInput={setSearchInput}
//         handleClear={handleClear}
//       />

//       <UsersTable
//         users={users}
//         columnFilters={columnFilters}
//         setColumnFilters={setColumnFilters}
//         totalPages={totalPages}
//         page={currentPage}
//         setPage={setPage}
//         onPrevious={handlePrevious}
//         onNext={handleNext}
//         isFetching={isFetching || isLoading}
//         setEditMember={setSelectedUser}
//         setEditOpen={setUserSheetOpen}
//         setSheetMode={setSheetMode} 
//       />


//       <UserForm
//         open={userSheetOpen}
//         onClose={setUserSheetOpen}
//         user={selectedUser}
//         mode={sheetMode}
//       />
//     </section>
//   );
// }
