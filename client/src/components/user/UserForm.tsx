// import { useEffect } from "react";
// import { useForm } from "react-hook-form";

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";

// import { Button } from "@/components/ui/button";

// import {
//   Loader2,
//   User as UserIcon,
//   Mail,
//   Phone,
// } from "lucide-react";

// import {
//   CustomInputField,
//   SelectField,
// } from "@/components/form/FormFields";

// import {
//   useUpdateUserMutation,
//   type User,
// } from "@/lib/features/users/usersApi";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { userSchema } from "@/schema";

// type UserFormValues =
//   z.infer<typeof userSchema>;

// // ─────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────

// interface UserFormProps {
//   open: boolean;

//   onClose: (
//     open: boolean
//   ) => void;

//   user?: User | null;

//   mode?: "edit";
// }

// // ─────────────────────────────────────
// // COMPONENT
// // ─────────────────────────────────────

// export default function UserForm({
//   open,
//   onClose,
//   user,
//   mode = "edit",
// }: UserFormProps) {

//   const isEdit =
//     mode === "edit";

//   const {
//     control,
//     handleSubmit,
//     reset,
//   } = useForm<UserFormValues>({
//     resolver: zodResolver(
//       userSchema
//     ),

//     defaultValues: {
//       first_name: "",
//       last_name: "",
//       email: "",
//       phone: "",
//       role: "visitor",
//     },
//   });

//   const [
//     updateUser,
//     { isLoading },
//   ] = useUpdateUserMutation();

//   // ─────────────────────────────────────
//   // PREFILL
//   // ─────────────────────────────────────

//   useEffect(() => {
//     if (user && isEdit) {
//       reset({
//         first_name:
//           user.first_name || "",
//         last_name:
//           user.last_name || "",
//         email:
//           user.email || "",
//         phone:
//           user.phone || "",
//         role:
//           user.role || "visitor",
//       });
//     } else {
//       reset({
//         first_name: "",
//         last_name: "",
//         email: "",
//         phone: "",
//         role: "visitor",
//       });
//     }
//   }, [
//     user,
//     isEdit,
//     reset,
//     open,
//   ]);

//   // ─────────────────────────────────────
//   // SUBMIT
//   // ─────────────────────────────────────

//   const onSubmit = async (
//     values: UserFormValues
//   ) => {
//     try {
//       if (
//         isEdit &&
//         user
//       ) {
//         await updateUser({
//           user_id: user.id,
//           ...values,
//         }).unwrap();

//         reset();

//         onClose(false);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Sheet
//       open={open}
//       onOpenChange={onClose}
//     >
//       <SheetContent className="w-full sm:max-w-md lg:max-w-xl bg-white p-0 flex flex-col">

//         <form
//           onSubmit={handleSubmit(
//             onSubmit
//           )}
//           className="h-full flex flex-col"
//         >

//           {/* Header */}
//           <SheetHeader className="border-b border-gray-200 p-4">

//             <SheetTitle>
//               Edit User
//             </SheetTitle>

//             <SheetDescription>
//               Update user information
//             </SheetDescription>

//           </SheetHeader>

//           {/* Body */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">

//             {/* Name */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//               <CustomInputField<UserFormValues>
//                 name="first_name"
//                 label="First Name"
//                 placeholder="Rahul"
//                 control={control}
//                 icon={UserIcon}
//               />

//               <CustomInputField<UserFormValues>
//                 name="last_name"
//                 label="Last Name"
//                 placeholder="Sharma"
//                 control={control}
//                 icon={UserIcon}
//               />

//             </div>

//             {/* Contact */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//               <CustomInputField<UserFormValues>
//                 name="email"
//                 label="Email"
//                 placeholder="rahul@gmail.com"
//                 control={control}
//                 type="email"
//                 icon={Mail}
//                 // disabled
//               />

//               <CustomInputField<UserFormValues>
//                 name="phone"
//                 label="Phone"
//                 placeholder="9876543210"
//                 control={control}
//                 icon={Phone}
//               />

//             </div>

//             {/* Role */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//               <SelectField<UserFormValues>
//                 name="role"
//                 label="Role"
//                 control={control}
//                 options={[
//                   {
//                     label:
//                       "Super Admin",
//                     value:
//                       "super_admin",
//                   },
//                   {
//                     label:
//                       "Receptionist",
//                     value:
//                       "receptionist",
//                   },
//                   {
//                     label:
//                       "Visitor",
//                     value:
//                       "visitor",
//                   },
//                 ]}
//               />

//             </div>

//           </div>

//           {/* Footer */}
//           <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200 p-4">

//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="basis-1/2 bg-maroon hover:bg-maroon-dark"
//             >

//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />

//                   Updating...
//                 </>
//               ) : (
//                 "Update User"
//               )}

//             </Button>

//             <Button
//               type="button"
//               variant="outline"
//               className="basis-1/2"
//               onClick={() =>
//                 onClose(false)
//               }
//             >
//               Cancel
//             </Button>

//           </SheetFooter>

//         </form>

//       </SheetContent>
//     </Sheet>
//   );
// }