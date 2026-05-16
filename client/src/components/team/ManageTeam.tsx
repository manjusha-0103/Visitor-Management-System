// import { useState, useEffect, useMemo } from "react";
// // import { useSelector } from "react-redux";
// import AdminSubHeader from "@/components/AdminSubHeader";
// // import CommonFilter from "@/components/CommonFilter";
// import TeamTable from "./TeamTable";
// import { DUMMY_TEAM } from "@/components/team/dummy-team";
// import type { TeamMember } from "@/components/team/dummy-team";
// // import { selectUser } from "@/lib/features/auth/authSlice";

// const LIMIT = 10;

// export default function ManageTeam() {
//   // const user = useSelector(selectUser);

//   // ── Data (swap for RTK Query when API is ready) ───────────────────────────
//   const [allMembers, setAllMembers] = useState<TeamMember[]>(DUMMY_TEAM);

//   // ── Pagination ────────────────────────────────────────────────────────────
//   const [page, setPage] = useState(1);

//   // ── Search ────────────────────────────────────────────────────────────────
//   const [searchInput, setSearchInput]     = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchInput);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(handler);
//   }, [searchInput]);

//   // ── Column filters ────────────────────────────────────────────────────────
//   const [columnFilters, setColumnFilters] = useState<any[]>([]);

//   // ── Modal state ───────────────────────────────────────────────────────────
//   const [editMember, setEditMember] = useState<TeamMember | null>(null);
//   const [editOpen, setEditOpen]     = useState(false);
//   const [viewMember, setViewMember] = useState<TeamMember | null>(null);
//   const [viewOpen, setViewOpen]     = useState(false);

//   // ── Client-side search ────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const q = debouncedSearch.toLowerCase();
//     return allMembers.filter(
//       (m) =>
//         !q ||
//         m.full_name.toLowerCase().includes(q) ||
//         m.email.toLowerCase().includes(q) ||
//         m.phone.includes(q) ||
//         m.position.toLowerCase().includes(q) ||
//         m.department_name.toLowerCase().includes(q)
//     );
//   }, [allMembers, debouncedSearch]);

//   // ── Pagination slice ──────────────────────────────────────────────────────
//   const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
//   const paginated  = useMemo(
//     () => filtered.slice((page - 1) * LIMIT, page * LIMIT),
//     [filtered, page]
//   );

//   const handlePrevious = () => setPage((p) => Math.max(p - 1, 1));
//   const handleNext     = () => setPage((p) => (p < totalPages ? p + 1 : p));

//   // const handleClear = () => {
//   //   setSearchInput("");
//   //   setDebouncedSearch("");
//   //   setPage(1);
//   // };

//   // ── Delete (local for now) ────────────────────────────────────────────────
//   const handleDelete = (id: string) => {
//     setAllMembers((prev) => prev.filter((m) => m.id !== id));
//   };

//   return (
//     <section className="mb-10">
//       <AdminSubHeader
//       showBack={true}
//         to="/admin"
//         heading="Manage Team"
//         subh="View all employees — their department, position, and visitor activity"
//       />

//       {/* TODO: Add ManageTeamForm sheet here when form is ready */}

//       {/* Search bar + Add button */}
//       {/* <CommonFilter
//         setEditWho={setEditMember}
//         setEditOpen={setEditOpen}
//         searchInput={searchInput}
//         setSearchInput={setSearchInput}
//         handleClear={handleClear}
//         buttonText="Add Employee"
//         placeholder="Search by name, email, position, department..."
//       /> */}

//       {/* Table */}
//       <TeamTable
//         members={paginated}
//         setEditMember={setEditMember}
//         setEditOpen={setEditOpen}
//         setViewMember={setViewMember}
//         setViewOpen={setViewOpen}
//         onDelete={handleDelete}
//         setPage={setPage}
//         columnFilters={columnFilters}
//         setColumnFilters={setColumnFilters}
//         totalPages={totalPages}
//         page={page}
//         onPrevious={handlePrevious}
//         onNext={handleNext}
//       />
//     </section>
//   );
// }