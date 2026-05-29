// import { useMemo } from "react";
// import type { Employee } from "@/lib/features/employee/employeeApi";
// import { useMemo } from "react";
import { AuditDataTable } from "./table/data-table";
import { auditColumns } from "./table/column";
import { useMemo } from "react";

// const AUDITS = [
//     {
//         "id": "15c34c74-14b3-4bee-8e7b-f639abe18a7d",
//         "created_at": "2026-05-28 12:53:36.888202+00",
//         "ip_address": "127.0.0.1",
//         "audit_record": "{\"updated_by\":{\"email\":\"rupeshchincholkar14@gmail.com\",\"name\":\"Sunil Singh\",\"phone\":\"9168040409\"},\"profile\":{\"id\":\"50c82a0c-bcd8-4343-9007-7788508ac5e7\",\"name\":\"Sunil Singh\",\"email\":\"rupeshchincholkar14@gmail.com\",\"phone\":\"9168040409\",\"date\":\"2015-05-20T00:00:00.000Z\",\"role\":\"super_admin\",\"position\":null,\"company\":null,\"department\":null}}",
//         "action": "update_profile"
//     },
//     {
//         "id": "16a6d891-2e54-47e0-b69b-ca5d35983438",
//         "created_at": "2026-05-29 04:28:10.555342+00",
//         "ip_address": "127.0.0.1",
//         "audit_record": "{\"updated_by\":{\"email\":\"rupeshchincholkar14@gmail.com\",\"name\":\"Sunil Singh\",\"phone\":\"9168040409\",\"last_login\":\"2026-05-29T04:28:07.126Z\"},\"id\":\"50c82a0c-bcd8-4343-9007-7788508ac5e7\",\"first_name\":\"Sunil\",\"last_name\":\"Singh\",\"email\":\"rupeshchincholkar14@gmail.com\",\"role\":\"super_admin\",\"google_calendar_connected\":true,\"phone\":\"9168040409\",\"birth_date\":\"2015-05-20T00:00:00.000Z\",\"last_login\":\"2026-05-29T04:28:07.126Z\",\"created_at\":\"2026-05-13T18:10:19.790Z\",\"position\":null,\"company\":null,\"department_id\":null,\"department\":null}",
//         "action": "signin"
//     },
//     {
//         "id": "4a39acae-16f9-4367-b92d-19164273979c",
//         "created_at": "2026-05-29 01:01:56.830779+00",
//         "ip_address": "127.0.0.1",
//         "audit_record": "{\"updated_by\":{\"email\":\"rashmika@gmail.com\",\"name\":\"Rashmika Sing\",\"phone\":\"6587474649\",\"last_login\":\"2026-05-29T01:01:49.005Z\"},\"id\":\"b47b9955-bb90-4ad9-9568-3b86445e13e5\",\"first_name\":\"Rashmika\",\"last_name\":\"Sing\",\"email\":\"rashmika@gmail.com\",\"role\":\"user\",\"google_calendar_connected\":false,\"phone\":\"6587474649\",\"birth_date\":\"2000-05-28T00:00:00.000Z\",\"last_login\":\"2026-05-29T01:01:49.005Z\",\"created_at\":\"2026-05-15T12:18:50.845Z\",\"position\":\"Receptionist\",\"company\":\"Iravya\",\"department_id\":\"f49faabd-9ba8-4a40-a0ca-aa86739a593b\",\"department\":\"Receptionist\"}",
//         "action": "signin"
//     },
//     {
//         "id": "5f60008e-045a-4dcf-820a-f1ec9ebdc8e6",
//         "created_at": "2026-05-29 06:15:03.398672+00",
//         "ip_address": "127.0.0.1",
//         "audit_record": "{\"updated_by\":{\"email\":\"manjusha.racca@gmail.com\",\"name\":\"Sunil Singh\",\"phone\":\"9168040408\"},\"message\":\"User logged out successfully\"}",
//         "action": "logout"
//     },
//     {
//         "id": "74bdea57-38dc-40b7-b774-08245a1aea2f",
//         "created_at": "2026-05-29 01:03:51.875225+00",
//         "ip_address": "127.0.0.1",
//         "audit_record": "{\"updated_by\":{\"email\":\"rupeshchincholkar14@gmail.com\",\"name\":\"Sunil Singh\",\"phone\":\"9168040409\",\"last_login\":\"2026-05-29T01:03:45.965Z\"},\"id\":\"50c82a0c-bcd8-4343-9007-7788508ac5e7\",\"first_name\":\"Sunil\",\"last_name\":\"Singh\",\"email\":\"rupeshchincholkar14@gmail.com\",\"role\":\"super_admin\",\"google_calendar_connected\":true,\"phone\":\"9168040409\",\"birth_date\":\"2015-05-20T00:00:00.000Z\",\"last_login\":\"2026-05-29T01:03:45.965Z\",\"created_at\":\"2026-05-13T18:10:19.790Z\",\"position\":null,\"company\":null,\"department_id\":null,\"department\":null}",
//         "action": "signin"
//     }
// ]


interface AuditTableProps {
  data?: any;
  setPage: (p: number) => void;
  columnFilters: any[];
  setColumnFilters: (f: any) => void;
  totalPages: number;
  page: number;
  onPrevious: () => void;
  onNext: () => void;
  isFetching?: boolean;
  action: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
//   setEditMember: (employee: Employee | null) => void;
// setEditOpen: (open: boolean) => void;
// setSheetMode: (mode: "add" | "edit") => void;
}

export default function AuditTable({
  data,
  setPage, columnFilters, setColumnFilters,
  totalPages, page, onPrevious, onNext, isFetching,action, setAction
}: AuditTableProps) {

  const meta = useMemo(() => ({
    action, setAction
  }), [action, setAction])

  return (
    <section className="mt-6 px-4 lg:px-10">
      <div className="border rounded-lg">
        <AuditDataTable
          columns={auditColumns}
          data={data}
          meta={meta}
          setPage={setPage}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          totalPages={totalPages}
          page={page}
          onPrevious={onPrevious}
          onNext={onNext}
          isFetching={isFetching}
        />
      </div>
    </section>
  );
}