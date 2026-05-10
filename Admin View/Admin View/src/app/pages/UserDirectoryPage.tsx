
// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useTheme } from "../context/ThemeContext.tsx";
// import {
//   Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle,
//   RefreshCw, CheckCircle2, Info, Trash2, X
// } from "lucide-react";
// import { PageHeader } from "../components/PageHeader";
// import { StatCard } from "../components/StatCard";
// import { Button } from "../components/Button";
// import { Card } from "../components/Card";
// import { Badge } from "../components/Badge";
// import { PopupCard } from "../components/PopupCard";



// interface UnifiedUser {
//   adminId: string;
//   id: string | number;
//   displayName: string;
//   displayEmail: string;
//   displayPhone: string;
//   role: "Admin" | "User";
//   status: "Active" | "Inactive";
// }

// export function UserDirectoryPage() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const [allUsers, setAllUsers] = useState<UnifiedUser[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ── Create Modal ──
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userType, setUserType] = useState("User");
//   const [formData, setFormData] = useState<any>({});
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // ── Dropdown ──
//   const [activeMenu, setActiveMenu] = useState<string | number | null>(null);

//   // ── View Modal ──
//   const [viewUser, setViewUser] = useState<UnifiedUser | null>(null);

//   // ── Delete Modal ──
//   const [deleteTarget, setDeleteTarget] = useState<UnifiedUser | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // ── Tab ──
//   const [activeTab, setActiveTab] = useState<"Admin" | "User">("Admin");

//   // ── Close dropdown on outside click/scroll ──
//   useEffect(() => {
//     const closeMenu = () => setActiveMenu(null);
//     if (activeMenu) {
//       window.addEventListener("click", closeMenu);
//       window.addEventListener("scroll", closeMenu, true);
//     }
//     return () => {
//       window.removeEventListener("click", closeMenu);
//       window.removeEventListener("scroll", closeMenu, true);
//     };
//   }, [activeMenu]);

//   // ── Fetch all users & admins ──
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem("authToken") || "";
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       const [userRes, adminRes] = await Promise.all([
//         axios.get("http://localhost:8080/api/admin/users", config),
//         axios.get("http://localhost:8080/api/admin/alladmins", config),
//       ]);
//       console.log("Fetched Users:", userRes.data);
//       console.log("Fetched Admins:", adminRes.data);

//       const usersMapped: UnifiedUser[] = (userRes.data.data || []).map((u: any, index: number) => ({
//         adminId: u.adminID || null,
//         id: u.email || `user-${index}`,
//         displayName: u.name || "Unknown User",
//         displayEmail: u.email || "No Email",
//         displayPhone: u.phoneNumber || "No Phone",
//         role: "User",
//         status: "Active",
//       }));

//       const adminsMapped: UnifiedUser[] = (adminRes.data.data || []).map((a: any, index: number) => ({
//         adminId: a.adminId || null,
//         id: a.username || `admin-${index}`,
//         displayName: a.name || "Unknown Admin",
//         displayEmail: a.email || "No Email",
//         displayPhone: a.phone || "No Phone",
//         role: "Admin",
//         status: a.is_logged ? "Active" : "Inactive",
//         //status: "Active",
//       }));

//       setAllUsers([...adminsMapped, ...usersMapped]);
//     } catch (err: any) {
//       if (!err.response) {
//         setError("Network Error: Please check your connection and try again.");
//       } else {
//         setError(err.response?.data?.message || "An error occurred while fetching data.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAllData(); }, []);

//   const filteredUsers = useMemo(() => {
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return allUsers;
//     return allUsers.filter(
//       (u) =>
//         u.displayName.toLowerCase().includes(query) ||
//         u.displayEmail.toLowerCase().includes(query)
//     );
//   }, [allUsers, searchQuery]);

//   // ─── Validation Helpers ──────────────────────────────────────────────────────

//   const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validatePassword = (password: string) =>
//     password.length >= 8 &&
//     /[A-Z]/.test(password) &&
//     /[a-z]/.test(password) &&
//     /\d/.test(password) &&
//     /[!@#$%^&*(),.?":{}|<>]/.test(password);
//   const validatePhoneNumber = (phone: string) => /^\d{10}$/.test(phone);
//   const validateAdminID = (adminId: string) => /^ADM-\d{3}$/.test(adminId);
//   const validateIdentityID = (id: string) =>
//     /^\d{9}[V]$/.test(id) || /^\d{12}$/.test(id) || /^[A-Z0-9]{5,}$/.test(id);
//   const validateAssignedAdmin = (adminId: string) =>
//     allUsers.some((u) => u.role === "Admin" && u.adminId === adminId);

//   // ─── Create Form Validation ──────────────────────────────────────────────────

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (userType === "Admin") {
//       if (!formData.name?.trim()) newErrors.name = "Full name is required.";
//       if (!formData.email?.trim()) newErrors.email = "Email is required.";
//       else if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address.";
//       if (!formData.password?.trim()) newErrors.password = "Password is required.";
//       else if (!validatePassword(formData.password)) newErrors.password = "Min 8 chars with uppercase, lowercase, number & special character.";
//       if (!formData.username?.trim()) newErrors.username = "Username is required.";
//       if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
//       else if (!validatePhoneNumber(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
//       if (!formData.adminid?.trim()) newErrors.adminid = "Admin ID is required.";
//       else if (!validateAdminID(formData.adminid)) newErrors.adminid = "Format must be ADM-001.";
//     } else {
//       if (!formData.name?.trim()) newErrors.name = "Full name is required.";
//       if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
//       else if (!validatePhoneNumber(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
//       if (!formData.userCategory) newErrors.userCategory = "Please select a user category.";
//       if (!formData.identityId?.trim()) newErrors.identityId = "Identity ID is required.";
//       else if (!validateIdentityID(formData.identityId)) newErrors.identityId = "Enter a valid NIC or Passport.";
//       if (!formData.assignedAdminId?.trim()) newErrors.assignedAdminId = "Assigned Admin ID is required.";
//       else if (!validateAssignedAdmin(formData.assignedAdminId)) newErrors.assignedAdminId = "No admin found with this ID.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const closeModal = () => { setIsModalOpen(false); setFormData({}); setErrors({}); };

//   // ─── Create User / Admin ─────────────────────────────────────────────────────

//   const handleCreateUserandAdmin = async () => {
//     if (!validateForm()) return;
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken") || "";
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       let endpoint = "";
//       let payload = {};

//       if (userType === "Admin") {
//         endpoint = "http://localhost:8080/api/admin/newadmin";
//         payload = {
//           username: formData.username,
//           password: formData.password,
//           email: formData.email,
//           phone: formData.phone,
//           adminid: formData.adminid,
//           name: formData.name,
//         };
//       } else {
//         endpoint = "http://localhost:8080/api/admin/createuser";
//         payload = {
//           name: formData.name,
//           phoneNumber: formData.phone,
//           userCategory: formData.userCategory,
//           identityID: formData.identityId,
//           adminID: formData.assignedAdminId,
//         };
//       }

//       console.log(payload);

//       const response = await axios.post(endpoint, payload, config);
//       if (response.status === 201 || response.status === 200) {
//         alert(`${userType} created successfully!`);
//         closeModal();
//         fetchAllData();
//       }
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Failed to create account.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Delete ──────────────────────────────────────────────────────────────────

//   const handleDeleteConfirm = async () => {
//     if (!deleteTarget) return;
//     try {
//       setDeleteLoading(true);
//       const token = localStorage.getItem("authToken") || "";
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       let endpoint = "";
//       let payload = {};
//       if (deleteTarget.role === "Admin") {
//         endpoint = "http://localhost:8080/api/admin/deleteadmin";
//         payload = { adminId: deleteTarget.adminId };
//       } else {
//         endpoint = "http://localhost:8080/api/admin/deleteuser";
//         payload = { phoneNumber: deleteTarget.displayPhone };
//       }
//       const response = await axios.post(endpoint, payload, config);
//       if (response.status === 200) {
//         setDeleteTarget(null);
//         fetchAllData();
//       }
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Failed to remove member.");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   // ─── Shared UI Helpers ───────────────────────────────────────────────────────

//   const FieldError = ({ name }: { name: string }) =>
//     errors[name] ? (
//       <span className="text-red-400 text-[10px] mt-1 block">{errors[name]}</span>
//     ) : null;

//   const inputClass = (name: string) =>
//     `w-full px-4 py-2 rounded-xl border outline-none transition-all text-sm ${
//       errors[name]
//         ? "border-red-500/60 bg-red-500/5"
//         : isDark
//         ? "bg-white/5 border-white/10 text-white focus:border-blue-400"
//         : "bg-gray-50 border-gray-200 focus:border-blue-500"
//     }`;

//   const labelClass = "text-[10px] font-bold uppercase tracking-widest opacity-50";

//   const InfoItem = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
//     <div className={`p-3 rounded-xl border ${isDark ? "bg-white/[0.04] border-white/[0.06]" : "bg-gray-50 border-gray-100"}`}>
//       <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-1">{label}</p>
//       <p className={`text-xs break-all ${accent ? "text-green-400" : isDark ? "text-white/85" : "text-gray-800"}`}>{value}</p>
//     </div>
//   );

//   const filteredAdmins = filteredUsers.filter((u) => u.role === "Admin");
//   const filteredRegularUsers = filteredUsers.filter((u) => u.role === "User");



//   // ────────────────────────────────────────────────────────────────────────────

//   return (
//     <div className="p-8 space-y-6">
//       <PageHeader
//         title="User Directory"
//         description="Unified management for all system accounts"
//         actions={
//           <Button variant="primary" onClick={() => setIsModalOpen(true)}>
//             <UserPlus className="w-4 h-4" /> Add Member
//           </Button>
//         }
//       />

//       {/* ══════════════════════════════════════════════════════════
//           CREATE MODAL
//       ══════════════════════════════════════════════════════════ */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
//         <div className="bg-[#212121] rounded-lg">
//           <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
//             <div className="p-6 space-y-6">

//               {/* Header */}
//               <div className="flex items-center justify-between border-b pb-4 border-white/10">
//                 <div>
//                   <h2 className={`text-xl  font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Create Account</h2>

//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant={userType === "Admin" ? "purple" : "neutral"}>{userType}</Badge>
//                   <button onClick={closeModal} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Toggle */}
//               <div className="flex bg-white/5 p-1 rounded-xl gap-1 border border-white/5">
//                 {["User", "Admin"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => { setUserType(type); setErrors({}); setFormData({}); }}
//                     className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
//                       userType === type
//                         ? isDark ? "bg-white/10 text-white border border-white/10 shadow-sm" : "bg-white text-blue-600 shadow-sm border border-gray-200"
//                         : isDark ? "text-white/40 hover:text-white/60 bg-transparent" : "text-gray-400 hover:text-gray-600 bg-transparent"
//                     }`}
//                   >{type}</button>
//                 ))}
//               </div>

//               {/* Form Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

//                 {/* ── ADMIN FIELDS ── */}
//                 {userType === "Admin" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Full Name</label>
//                       <input name="name" type="text" placeholder="John Doe" autoComplete="off" onChange={handleInputChange} value={formData.name || ""} className={inputClass("name")} />
//                       <FieldError name="name" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Email Address</label>
//                       <input name="email" type="email" placeholder="name@example.com" autoComplete="off" onChange={handleInputChange} value={formData.email || ""} className={inputClass("email")} />
//                       <FieldError name="email" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Password</label>
//                       <input name="password" type="password" placeholder="••••••••" autoComplete="off" onChange={handleInputChange} value={formData.password || ""} className={inputClass("password")} />
//                       <FieldError name="password" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Username</label>
//                       <input name="username" type="text" placeholder="admin_user" autoComplete="none" onChange={handleInputChange} value={formData.username || ""} className={inputClass("username")} />
//                       <FieldError name="username" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Phone Number</label>
//                       <input name="phone" type="text" placeholder="0770744305" maxLength={10} autoComplete="none" onChange={handleInputChange} value={formData.phone || ""} className={inputClass("phone")} />
//                       <FieldError name="phone" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Admin ID</label>
//                       <input name="adminid" type="text" placeholder="ADM-001" autoComplete="none" onChange={handleInputChange} value={formData.adminid || ""} className={inputClass("adminid")} />
//                       <FieldError name="adminid" />
//                     </div>
//                   </>
//                 )}

//                 {/* ── USER FIELDS ── */}
//                 {userType === "User" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Full Name</label>
//                       <input name="name" type="text" placeholder="John Doe" autoComplete="off" onChange={handleInputChange} value={formData.name || ""} className={inputClass("name")} />
//                       <FieldError name="name" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Phone Number</label>
//                       <input name="phone" type="text" maxLength={10} placeholder="0770744305" autoComplete="none" onChange={handleInputChange} value={formData.phone || ""} className={inputClass("phone")} />
//                       <FieldError name="phone" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>User Category</label>
//                       <select
//                         name="userCategory"
//                         value={formData.userCategory || ""}
//                         onChange={handleInputChange}
//                         className={`${inputClass("userCategory")} cursor-pointer appearance-none`}
//                         style={{
//                           backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? "white" : "black"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
//                           backgroundRepeat: "no-repeat",
//                           backgroundPosition: "right 1rem center",
//                           backgroundSize: "1em",
//                         }}
//                       >
//                         <option value="" disabled>Select category</option>
//                         <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Civil">Civil</option>
//                         <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Guide">Guide</option>
//                         <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="PhotoGrapher">PhotoGrapher</option>
//                       </select>
//                       <FieldError name="userCategory" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Identity ID</label>
//                       <input name="identityId" type="text" placeholder="NIC / Passport" autoComplete="none" onChange={handleInputChange} value={formData.identityId || ""} className={inputClass("identityId")} />
//                       <FieldError name="identityId" />
//                     </div>
//                     <div className="space-y-1.5 md:col-span-2">
//                       <label className={labelClass}>Assigned Admin ID</label>
//                       <input name="assignedAdminId" type="text" placeholder="ADM-001" maxLength={7} autoComplete="none" onChange={handleInputChange} value={formData.assignedAdminId || ""} className={inputClass("assignedAdminId")} />
//                       <FieldError name="assignedAdminId" />
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center gap-3 pt-4 border-t border-white/10">
//                 <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
//                 <Button variant="primary" onClick={handleCreateUserandAdmin} disabled={loading} className="flex-1 shadow-lg shadow-blue-500/20">
//                   {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                   <CheckCircle2 className="w-4 h-4 mr-2" /> Save {userType}
//                 </Button>
//               </div>
//             </div>
//           </Card>
//           </div>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════════════
//           VIEW FULL INFO admin/user
//       ══════════════════════════════════════════════════════════ */}
//     {viewUser && (
//       <PopupCard
//         open={!!viewUser}
//         onClose={() => setViewUser(null)}
//         title="Member Details"
//         badge={<Badge variant={viewUser.role === "Admin" ? "purple" : "neutral"}>{viewUser.role}</Badge>}
//         footer={
//           <Button variant="outline" className="w-full" onClick={() => setViewUser(null)}>
//             Close
//           </Button>
//         }
//       >
//         {/* Avatar + name */}
//         <div className="flex items-center gap-4 mb-5">
//           <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${viewUser.role === "Admin" ? "bg-blue-600" : "bg-blue-600"}`}>
//             {viewUser.displayName.charAt(0).toUpperCase()}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className={`font-semibold text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>
//               {viewUser.displayName}
//             </p>
//             <p className="text-xs opacity-50 mt-0.5 truncate">
//               {viewUser.role === "Admin"
//                 ? `System Administrator · ${viewUser.adminId || "—"}`
//                 : `User · ${viewUser.id}`}
//             </p>
//           </div>
//           <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase flex-shrink-0">
//             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
//           </span>
//         </div>

//         {/* Contact */}
//         <div className="mb-4">
//           <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Contact</p>
//           <div className="grid grid-cols-2 gap-3">
//             <InfoItem label="Email" value={viewUser.displayEmail} />
//             <InfoItem label="Phone" value={viewUser.displayPhone} />
//           </div>
//         </div>

//         {/* Account */}
//         <div>
//           <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Account</p>
//           <div className="grid grid-cols-2 gap-3">
//             <InfoItem label="Role" value={viewUser.role} />
//             <InfoItem label="Admin ID" value={viewUser.adminId || "—"} />
//             <InfoItem label={viewUser.role === "Admin" ? "Username" : "User ID"} value={String(viewUser.id)} />
//             <InfoItem label="Status" value={viewUser.status} accent />
//           </div>
//         </div>
//       </PopupCard>
//     )}

//       {/* ══════════════════════════════════════════════════════════
//           DELETE CONFIRMATION MODAL
//       ══════════════════════════════════════════════════════════ */}
//       {deleteTarget && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//           <Card className={`w-full max-w-sm shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
//             <div className="p-6 text-center space-y-4">
//               <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
//                 <Trash2 className="w-5 h-5 text-red-400" />
//               </div>
//               <div>
//                 <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Remove Member?</h3>
//                 <p className="text-sm opacity-50 leading-relaxed">
//                   You're about to remove{" "}
//                   <span className={`font-semibold ${isDark ? "text-white/80" : "text-gray-700"}`}>{deleteTarget.displayName}</span>{" "}
//                   from the system. This action cannot be undone.
//                 </p>
//               </div>
//               <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${isDark ? "bg-red-500/6 border-red-500/15" : "bg-red-50 border-red-100"}`}>
//                 <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
//                 <span className="text-red-400 text-[11px] font-semibold text-left">This will also delete all associated data.</span>
//               </div>
//               <div className="flex gap-3 pt-1">
//                 <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   disabled={deleteLoading}
//                   className="flex-1 py-2 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-bold border border-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//                 >
//                   {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
//                   Yes, Remove
//                 </button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════════════
//           STATS
//       ══════════════════════════════════════════════════════════ */}




//       <Card className="!p-2 md:!p-3">
//         {/* Changed to justify-between to push search bar to the right */}
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">

//           {/* Segmented Control / Tabs - Increased parent padding slightly */}
//           <div className={`flex rounded-full p-1.5 shrink-0 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
//                 <button
//                   onClick={() => setActiveTab('Admin')}
//                   className={`px-6 py-2 md:px-8 md:py-2.5 rounded-full text-sm font-bold tracking-wider transition-all ${
//                     activeTab === 'Admin'
//                       ? "bg-blue-600 text-white shadow-md" // Solid blue for the active state
//                       : isDark
//                           ? "text-white/60 hover:text-white hover:bg-white/10"
//                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
//                   }`}
//                 >
//                   ADMINS ({filteredUsers.filter((u) => u.role === "Admin").length})
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('User')}
//                   className={`px-6 py-2 md:px-8 md:py-2.5 rounded-full text-sm font-bold tracking-wider transition-all ${
//                     activeTab === 'User'
//                       ? "bg-blue-600 text-white shadow-md" // Solid blue for the active state
//                       : isDark
//                           ? "text-white/60 hover:text-white hover:bg-white/10"
//                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
//                   }`}
//                 >
//                   USERS ({filteredUsers.filter((u) => u.role === "User").length})
//                 </button>
//               </div>

//           {/* Search Input - Removed flex-1, added max-w-sm to explicitly shorten it */}
//           <div className="relative w-full md:max-w-sm lg:max-w-md">
//             <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               autoComplete="off"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               // Adjusted padding to match the taller buttons
//               className={`w-full pl-10 pr-4 py-2.5 rounded-full outline-none transition-all text-sm ${
//                 isDark
//                   ? "bg-transparent text-white border border-white/10 focus:border-white/30 hover:border-white/20"
//                   : "bg-transparent text-black border border-gray-200 focus:border-gray-400 hover:border-gray-300"
//               }`}
//             />
//           </div>

//         </div>
//       </Card>

//       {/* ══════════════════════════════════════════════════════════
//           TAB SWITCHER
//       ══════════════════════════════════════════════════════════ */}
//       {/*}<div className="flex gap-2">
//         {(["Admin", "User"] as const).map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all
//               ${activeTab === tab
//                 ? isDark
//                   ? "bg-white/10 border-white/20 text-white"
//                   : "bg-blue-50 border-blue-200 text-blue-600"
//                 : isDark
//                 ? "bg-transparent border-white/10 text-white/40 hover:text-white/60"
//                 : "bg-transparent border-gray-200 text-gray-400 hover:text-gray-600"
//               }`}
//           >
//             {tab === "Admin"
//               ? `Admins (${filteredAdmins.length})`
//               : `Users (${filteredRegularUsers.length})`}
//           </button>
//         ))}
//       </div>*/}

//       {/* ══════════════════════════════════════════════════════════
//           ADMINS — CARD GRID
//       ══════════════════════════════════════════════════════════ */}
//       {activeTab === "Admin" && (
//         <>
//           {loading ? (
//             <div className="flex flex-col items-center justify-center p-24 gap-3">
//               <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
//               <p className="text-sm font-medium opacity-60">Syncing directory...</p>
//             </div>
//           ) : error ? (
//             <div className="p-20 text-center flex flex-col items-center gap-4 text-red-500">
//               <AlertCircle className="w-16 h-16 opacity-30" />
//               <div className="space-y-1">
//                 <h3 className="text-lg font-bold">Connection Failed</h3>
//                 <p className="text-sm opacity-80 max-w-xs">{error}</p>
//               </div>
//               <Button onClick={fetchAllData} variant="outline" className="mt-2 group">
//                 <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
//                 Try Again
//               </Button>
//             </div>
//           ) : filteredAdmins.length === 0 ? (
//             <div className="flex flex-col items-center opacity-30 gap-3 py-24">
//               <Search className="w-12 h-12" />
//               <div className="italic text-sm">
//                 {searchQuery ? `No admins matching "${searchQuery}" were found.` : "No admins found."}
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredAdmins.map((user) => (
//                 <Card key={`admin-${user.id}`} className={`p-4 space-y-3 transition-all hover:border-blue-500/30 ${isDark ? "border-white/10" : "border-gray-200"}`}>
//                   {/* Card Top */}
//                   <div className="flex items-center gap-3">
//                     <div className="relative flex-shrink-0">
//                       <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600">
//                         {user.displayName.charAt(0).toUpperCase()}
//                       </div>
//                       <div className={user.status === "Active" ? `absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full` : "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 border-2 border-white dark:border-[#121212] rounded-full"} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
//                         {user.displayName}
//                       </p>
//                       <p className="text-xs opacity-50 truncate">{user.adminId || "—"}</p>
//                     </div>
//                     <Badge variant="purple">Admin</Badge>
//                   </div>

//                   <hr className={isDark ? "border-white/10" : "border-gray-100"} />

//                   {/* Info */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <div>
//                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-0.5">Email</p>
//                       <p className={`text-xs truncate ${isDark ? "text-white/80" : "text-gray-700"}`}>{user.displayEmail}</p>
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-0.5">Phone</p>
//                       <p className={`text-xs ${isDark ? "text-white/80" : "text-gray-700"}`}>{user.displayPhone}</p>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex gap-2 pt-1">
//                     <button
//                       onClick={() => setViewUser(user)}
//                       className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5
//                         ${isDark ? "border-white/10 hover:bg-white/5 text-white/60 hover:text-white" : "border-gray-200 hover:bg-gray-50 text-gray-500"}`}
//                     >
//                       <Info className="w-3 h-3" /> View
//                     </button>
//                     <button
//                       onClick={() => setDeleteTarget(user)}
//                       className="flex-1 py-1.5 rounded-xl text-xs font-bold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-1.5"
//                     >
//                       <Trash2 className="w-3 h-3" /> Remove
//                     </button>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* ══════════════════════════════════════════════════════════
//           USERS — TABLE (original)
//       ══════════════════════════════════════════════════════════ */}
//       {activeTab === "User" && (
//         <Card noPadding>
//           <div className="overflow-x-auto min-h-[400px]">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center p-24 gap-3">
//                 <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
//                 <p className="text-sm font-medium opacity-60">Syncing directory...</p>
//               </div>
//             ) : error ? (
//               <div className="p-20 text-center flex flex-col items-center gap-4 text-red-500">
//                 <AlertCircle className="w-16 h-16 opacity-30" />
//                 <div className="space-y-1">
//                   <h3 className="text-lg font-bold">Connection Failed</h3>
//                   <p className="text-sm opacity-80 max-w-xs">{error}</p>
//                 </div>
//                 <Button onClick={fetchAllData} variant="outline" className="mt-2 group">
//                   <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
//                   Try Again
//                 </Button>
//               </div>
//             ) : (
//               <table className="w-full text-sm text-left">
//                 <thead className={isDark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}>
//                   <tr>
//                     <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Member</th>
//                     <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Contact</th>
//                     <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Role</th>
//                     <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
//                     <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-100"}`}>
//                   {filteredRegularUsers.length > 0 ? (
//                     filteredRegularUsers.map((user, index) => (
//                       <tr key={`user-${user.id}`} className="hover:bg-blue-500/[0.03] transition-colors group">
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-4">
//                             <div className="relative">
//                               <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm bg-blue-600">
//                                 {user.displayName.charAt(0).toUpperCase()}
//                               </div>
//                               <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full" />
//                             </div>
//                             <span className="font-semibold text-[15px]">{user.displayName}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col gap-1">
//                             <span className="flex items-center gap-1.5 text-xs opacity-70 lowercase">
//                               <Mail className="w-3 h-3" /> {user.displayEmail}
//                             </span>
//                             <span className="flex items-center gap-1.5 text-[11px] opacity-50">
//                               <Phone className="w-3 h-3" /> {user.displayPhone}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <Badge variant="neutral">{user.role}</Badge>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center justify-center gap-2">
//                             <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
//                               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                               {user.status}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="relative inline-block">
//                             <button
//                               data-menu-trigger={String(user.id)}
//                               onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === user.id ? null : user.id); }}
//                               className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
//                             >
//                               <MoreVertical className="w-4 h-4 opacity-50" />
//                             </button>

//                             {activeMenu === user.id && (() => {
//                               const btn = document.querySelector(`[data-menu-trigger="${user.id}"]`);
//                               const rect = btn?.getBoundingClientRect();
//                               const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;
//                               const goUp = spaceBelow < 120;
//                               return (
//                               <div
//                                 className={`fixed w-48 rounded-2xl shadow-2xl border backdrop-blur-md z-[200] py-2 overflow-hidden animate-in fade-in zoom-in duration-200
//                                   ${isDark ? "bg-[#252525]/90 border-white/10 shadow-black/40 text-gray-200" : "bg-gray-50/95 border-gray-200 shadow-gray-200/80 text-gray-800"}`}
//                                 style={{
//                                   top: rect ? (goUp ? `${rect.top - 96}px` : `${rect.bottom + 4}px`) : "auto",
//                                   right: rect ? `${window.innerWidth - rect.right}px` : "60px",
//                                 }}
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <button
//                                   onClick={() => { setViewUser(user); setActiveMenu(null); }}
//                                   className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"}`}
//                                 >
//                                   <Info className="w-3.5 h-3.5 opacity-60" />
//                                   View Full Info
//                                 </button>
//                                 <div className={`border-t my-1.5 ${isDark ? "border-white/5" : "border-gray-200/50"}`} />
//                                 <button
//                                   onClick={() => { setDeleteTarget(user); setActiveMenu(null); }}
//                                   className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
//                                 >
//                                   <Trash2 className="w-3.5 h-3.5" />
//                                   Remove Member
//                                 </button>
//                               </div>
//                               );
//                             })()}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-32 text-center">
//                         <div className="flex flex-col items-center opacity-30 gap-3">
//                           <Search className="w-12 h-12" />
//                           <div className="italic text-sm">
//                             {searchQuery
//                               ? `No users matching "${searchQuery}" were found.`
//                               : "No users found."}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }


import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext.tsx";
import {
  Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle,
  RefreshCw, CheckCircle2, Info, Trash2, X
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { PopupCard } from "../components/PopupCard";



interface UnifiedUser {
  adminId: string;
  id: string | number;
  displayName: string;
  displayEmail: string;
  displayPhone: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}

export function UserDirectoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [allUsers, setAllUsers] = useState<UnifiedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Create Modal ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState("User");
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Dropdown ──
  const [activeMenu, setActiveMenu] = useState<string | number | null>(null);

  // ── View Modal ──
  const [viewUser, setViewUser] = useState<UnifiedUser | null>(null);

  // ── Delete Modal ──
  const [deleteTarget, setDeleteTarget] = useState<UnifiedUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Tab ──
  const [activeTab, setActiveTab] = useState<"Admin" | "User">("Admin");

  // ── Close dropdown on outside click/scroll ──
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    if (activeMenu) {
      window.addEventListener("click", closeMenu);
      window.addEventListener("scroll", closeMenu, true);
    }
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [activeMenu]);

  // ── Fetch all users & admins ──
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken") || "";
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [userRes, adminRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/users", config),
        axios.get("http://localhost:8080/api/admin/alladmins", config),
      ]);

      const usersMapped: UnifiedUser[] = (userRes.data.data || []).map((u: any, index: number) => ({
        adminId: u.adminID || null,
        id: u.email || `user-${index}`,
        displayName: u.name || "Unknown User",
        displayEmail: u.email || "No Email",
        displayPhone: u.phoneNumber || "No Phone",
        role: "User",
        status: u.is_logged ? "Active" : "Inactive",
      }));

      const adminsMapped: UnifiedUser[] = (adminRes.data.data || []).map((a: any, index: number) => ({
        adminId: a.adminId || null,
        id: a.username || `admin-${index}`,
        displayName: a.name || "Unknown Admin",
        displayEmail: a.email || "No Email",
        displayPhone: a.phone || "No Phone",
        role: "Admin",
        status: a.is_logged ? "Active" : "Inactive",
      }));

      setAllUsers([...adminsMapped, ...usersMapped]);
    } catch (err: any) {
      if (!err.response) {
        setError("Network Error: Please check your connection and try again.");
      } else {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allUsers;
    return allUsers.filter(
      (u) =>
        u.displayName.toLowerCase().includes(query) ||
        u.displayEmail.toLowerCase().includes(query)
    );
  }, [allUsers, searchQuery]);

  // ─── Validation Helpers ──────────────────────────────────────────────────────

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const validatePhoneNumber = (phone: string) => /^\d{10}$/.test(phone);
  const validateAdminID = (adminId: string) => /^ADM-\d{3}$/.test(adminId);
  const validateIdentityID = (id: string) =>
    /^\d{9}[V]$/.test(id) || /^\d{12}$/.test(id) || /^[A-Z0-9]{5,}$/.test(id);
  const validateAssignedAdmin = (adminId: string) =>
    allUsers.some((u) => u.role === "Admin" && u.adminId === adminId);

  // ─── Create Form Validation ──────────────────────────────────────────────────

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (userType === "Admin") {
      if (!formData.name?.trim()) newErrors.name = "Full name is required.";
      if (!formData.email?.trim()) newErrors.email = "Email is required.";
      else if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address.";
      if (!formData.password?.trim()) newErrors.password = "Password is required.";
      else if (!validatePassword(formData.password)) newErrors.password = "Min 8 chars with uppercase, lowercase, number & special character.";
      if (!formData.username?.trim()) newErrors.username = "Username is required.";
      if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
      else if (!validatePhoneNumber(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
      if (!formData.adminid?.trim()) newErrors.adminid = "Admin ID is required.";
      else if (!validateAdminID(formData.adminid)) newErrors.adminid = "Format must be ADM-001.";
    } else {
      if (!formData.name?.trim()) newErrors.name = "Full name is required.";
      if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
      else if (!validatePhoneNumber(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
      if (!formData.userCategory) newErrors.userCategory = "Please select a user category.";
      if (!formData.identityId?.trim()) newErrors.identityId = "Identity ID is required.";
      else if (!validateIdentityID(formData.identityId)) newErrors.identityId = "Enter a valid NIC or Passport.";
      if (!formData.assignedAdminId?.trim()) newErrors.assignedAdminId = "Assigned Admin ID is required.";
      else if (!validateAssignedAdmin(formData.assignedAdminId)) newErrors.assignedAdminId = "No admin found with this ID.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const closeModal = () => { setIsModalOpen(false); setFormData({}); setErrors({}); };

  // ─── Create User / Admin ─────────────────────────────────────────────────────

  const handleCreateUserandAdmin = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken") || "";
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let endpoint = "";
      let payload = {};

      if (userType === "Admin") {
        endpoint = "http://localhost:8080/api/admin/newadmin";
        payload = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone: formData.phone,
          adminid: formData.adminid,
          name: formData.name,
        };
      } else {
        endpoint = "http://localhost:8080/api/admin/createuser";
        payload = {
          name: formData.name,
          phoneNumber: formData.phone,
          userCategory: formData.userCategory,
          identityID: formData.identityId,
          adminID: formData.assignedAdminId,
        };
      }

      console.log(payload);

      const response = await axios.post(endpoint, payload, config);
      if (response.status === 201 || response.status === 200) {
        alert(`${userType} created successfully!`);
        closeModal();
        fetchAllData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("authToken") || "";
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let endpoint = "";
      let payload = {};
      if (deleteTarget.role === "Admin") {
        endpoint = "http://localhost:8080/api/admin/deleteadmin";
        payload = { adminId: deleteTarget.adminId };
      } else {
        endpoint = "http://localhost:8080/api/admin/deleteuser";
        payload = { phoneNumber: deleteTarget.displayPhone };
      }
      const response = await axios.post(endpoint, payload, config);
      if (response.status === 200) {
        setDeleteTarget(null);
        fetchAllData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove member.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Shared UI Helpers ───────────────────────────────────────────────────────

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? (
      <span className="text-red-400 text-[10px] mt-1 block">{errors[name]}</span>
    ) : null;

  const inputClass = (name: string) =>
    `w-full px-4 py-2 rounded-xl border outline-none transition-all text-sm ${
      errors[name]
        ? "border-red-500/60 bg-red-500/5"
        : isDark
        ? "bg-white/5 border-white/10 text-white focus:border-blue-400"
        : "bg-gray-50 border-gray-200 focus:border-blue-500"
    }`;

  const labelClass = "text-[10px] font-bold uppercase tracking-widest opacity-50";

  const InfoItem = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className={`p-3 rounded-xl border ${isDark ? "bg-white/[0.04] border-white/[0.06]" : "bg-gray-50 border-gray-100"}`}>
      <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-1">{label}</p>
      <p className={`text-xs break-all ${accent ? "text-green-400" : isDark ? "text-white/85" : "text-gray-800"}`}>{value}</p>
    </div>
  );

  // ─── Status Helpers ──────────────────────────────────────────────────────────

  const StatusDot = ({ status, size = "sm" }: { status: "Active" | "Inactive"; size?: "sm" | "md" }) => {
    const sizeClass = size === "md" ? "w-3.5 h-3.5" : "w-3 h-3";
    return (
      <div
        className={`${sizeClass} rounded-full border-2 border-white dark:border-[#121212] ${
          status === "Active" ? "bg-green-500" : "bg-gray-500"
        }`}
      />
    );
  };

  const StatusBadge = ({ status }: { status: "Active" | "Inactive" }) => (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
        status === "Active"
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "bg-gray-500/10 text-gray-500 dark:text-gray-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Active" ? "bg-green-500 animate-pulse" : "bg-gray-500"
        }`}
      />
      {status}
    </span>
  );

  const filteredAdmins = filteredUsers.filter((u) => u.role === "Admin");
  const filteredRegularUsers = filteredUsers.filter((u) => u.role === "User");



  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="User Directory"
        description="Unified management for all system accounts"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-4 h-4" /> Add Member
          </Button>
        }
      />

      {/* ══════════════════════════════════════════════════════════
          CREATE MODAL
      ══════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
        <div className="bg-[#212121] rounded-lg">
          <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <div className="p-6 space-y-6">

              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 border-white/10">
                <div>
                  <h2 className={`text-xl  font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Create Account</h2>

                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={userType === "Admin" ? "purple" : "neutral"}>{userType}</Badge>
                  <button onClick={closeModal} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex bg-white/5 p-1 rounded-xl gap-1 border border-white/5">
                {["User", "Admin"].map((type) => (
                  <button
                    key={type}
                    onClick={() => { setUserType(type); setErrors({}); setFormData({}); }}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                      userType === type
                        ? isDark ? "bg-white/10 text-white border border-white/10 shadow-sm" : "bg-white text-blue-600 shadow-sm border border-gray-200"
                        : isDark ? "text-white/40 hover:text-white/60 bg-transparent" : "text-gray-400 hover:text-gray-600 bg-transparent"
                    }`}
                  >{type}</button>
                ))}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

                {/* ── ADMIN FIELDS ── */}
                {userType === "Admin" && (
                  <>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Full Name</label>
                      <input name="name" type="text" placeholder="John Doe" autoComplete="off" onChange={handleInputChange} value={formData.name || ""} className={inputClass("name")} />
                      <FieldError name="name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Email Address</label>
                      <input name="email" type="email" placeholder="name@example.com" autoComplete="off" onChange={handleInputChange} value={formData.email || ""} className={inputClass("email")} />
                      <FieldError name="email" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Password</label>
                      <input name="password" type="password" placeholder="••••••••" autoComplete="off" onChange={handleInputChange} value={formData.password || ""} className={inputClass("password")} />
                      <FieldError name="password" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Username</label>
                      <input name="username" type="text" placeholder="admin_user" autoComplete="none" onChange={handleInputChange} value={formData.username || ""} className={inputClass("username")} />
                      <FieldError name="username" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Phone Number</label>
                      <input name="phone" type="text" placeholder="0770744305" maxLength={10} autoComplete="none" onChange={handleInputChange} value={formData.phone || ""} className={inputClass("phone")} />
                      <FieldError name="phone" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Admin ID</label>
                      <input name="adminid" type="text" placeholder="ADM-001" autoComplete="none" onChange={handleInputChange} value={formData.adminid || ""} className={inputClass("adminid")} />
                      <FieldError name="adminid" />
                    </div>
                  </>
                )}

                {/* ── USER FIELDS ── */}
                {userType === "User" && (
                  <>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Full Name</label>
                      <input name="name" type="text" placeholder="John Doe" autoComplete="off" onChange={handleInputChange} value={formData.name || ""} className={inputClass("name")} />
                      <FieldError name="name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Phone Number</label>
                      <input name="phone" type="text" maxLength={10} placeholder="0770744305" autoComplete="none" onChange={handleInputChange} value={formData.phone || ""} className={inputClass("phone")} />
                      <FieldError name="phone" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>User Category</label>
                      <select
                        name="userCategory"
                        value={formData.userCategory || ""}
                        onChange={handleInputChange}
                        className={`${inputClass("userCategory")} cursor-pointer appearance-none`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? "white" : "black"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1em",
                        }}
                      >
                        <option value="" disabled>Select category</option>
                        <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Civil">Civil</option>
                        <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Guide">Guide</option>
                        <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="PhotoGrapher">PhotoGrapher</option>
                      </select>
                      <FieldError name="userCategory" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Identity ID</label>
                      <input name="identityId" type="text" placeholder="NIC / Passport" autoComplete="none" onChange={handleInputChange} value={formData.identityId || ""} className={inputClass("identityId")} />
                      <FieldError name="identityId" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className={labelClass}>Assigned Admin ID</label>
                      <input name="assignedAdminId" type="text" placeholder="ADM-001" maxLength={7} autoComplete="none" onChange={handleInputChange} value={formData.assignedAdminId || ""} className={inputClass("assignedAdminId")} />
                      <FieldError name="assignedAdminId" />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
                <Button variant="primary" onClick={handleCreateUserandAdmin} disabled={loading} className="flex-1 shadow-lg shadow-blue-500/20">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Save {userType}
                </Button>
              </div>
            </div>
          </Card>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW FULL INFO admin/user
      ══════════════════════════════════════════════════════════ */}
    {viewUser && (
      <PopupCard
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        title="Member Details"
        badge={<Badge variant={viewUser.role === "Admin" ? "purple" : "neutral"}>{viewUser.role}</Badge>}
        footer={
          <Button variant="outline" className="w-full" onClick={() => setViewUser(null)}>
            Close
          </Button>
        }
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${viewUser.role === "Admin" ? "bg-blue-600" : "bg-blue-600"}`}>
            {viewUser.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>
              {viewUser.displayName}
            </p>
            <p className="text-xs opacity-50 mt-0.5 truncate">
              {viewUser.role === "Admin"
                ? `System Administrator · ${viewUser.adminId || "—"}`
                : `User · ${viewUser.id}`}
            </p>
          </div>
          {/* ── Dynamic status badge in view modal ── */}
          <StatusBadge status={viewUser.status} />
        </div>

        {/* Contact */}
        <div className="mb-4">
          <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Email" value={viewUser.displayEmail} />
            <InfoItem label="Phone" value={viewUser.displayPhone} />
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Account</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Role" value={viewUser.role} />
            <InfoItem label="Admin ID" value={viewUser.adminId || "—"} />
            <InfoItem label={viewUser.role === "Admin" ? "Username" : "User ID"} value={String(viewUser.id)} />
            {/* ── accent only when Active ── */}
            <InfoItem label="Status" value={viewUser.status} accent={viewUser.status === "Active"} />
          </div>
        </div>
      </PopupCard>
    )}

      {/* ══════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ══════════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <Card className={`w-full max-w-sm shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Remove Member?</h3>
                <p className="text-sm opacity-50 leading-relaxed">
                  You're about to remove{" "}
                  <span className={`font-semibold ${isDark ? "text-white/80" : "text-gray-700"}`}>{deleteTarget.displayName}</span>{" "}
                  from the system. This action cannot be undone.
                </p>
              </div>
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${isDark ? "bg-red-500/6 border-red-500/15" : "bg-red-50 border-red-100"}`}>
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="text-red-400 text-[11px] font-semibold text-left">This will also delete all associated data.</span>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 py-2 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-bold border border-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Yes, Remove
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STATS CARDS
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-4">
        {/* Admins Card */}
        <Card className={`p-5 border ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? "text-white/40" : "text-gray-400"}`}>
            Admins
          </p>
          <p className={`text-3xl font-bold mb-3 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
            {allUsers.filter((u) => u.role === "Admin").length}
          </p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {allUsers.filter((u) => u.role === "Admin" && u.status === "Active").length} Active
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              {allUsers.filter((u) => u.role === "Admin" && u.status === "Inactive").length} Inactive
            </span>
          </div>
        </Card>

        {/* Users Card */}
        <Card className={`p-5 border ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? "text-white/40" : "text-gray-400"}`}>
            Users
          </p>
          <p className={`text-3xl font-bold mb-3 ${isDark ? "text-green-400" : "text-green-600"}`}>
            {allUsers.filter((u) => u.role === "User").length}
          </p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {allUsers.filter((u) => u.role === "User" && u.status === "Active").length} Active
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              {allUsers.filter((u) => u.role === "User" && u.status === "Inactive").length} Inactive
            </span>
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SEARCH / TAB BAR
      ══════════════════════════════════════════════════════════ */}
      <Card className="!p-2 md:!p-3">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">

          {/* Segmented Control / Tabs */}
          <div className={`flex rounded-full p-1.5 shrink-0 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <button
                  onClick={() => setActiveTab('Admin')}
                  className={`px-6 py-2 md:px-8 md:py-2.5 rounded-full text-sm font-bold tracking-wider transition-all ${
                    activeTab === 'Admin'
                      ? "bg-blue-600 text-white shadow-md"
                      : isDark
                          ? "text-white/60 hover:text-white hover:bg-white/10"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
                >
                  ADMINS ({filteredUsers.filter((u) => u.role === "Admin").length})
                </button>

                <button
                  onClick={() => setActiveTab('User')}
                  className={`px-6 py-2 md:px-8 md:py-2.5 rounded-full text-sm font-bold tracking-wider transition-all ${
                    activeTab === 'User'
                      ? "bg-blue-600 text-white shadow-md"
                      : isDark
                          ? "text-white/60 hover:text-white hover:bg-white/10"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
                >
                  USERS ({filteredUsers.filter((u) => u.role === "User").length})
                </button>
              </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-sm lg:max-w-md">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/40" : "text-gray-400"}`} />
            <input
              type="text"
              placeholder="Search by name or email..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-full outline-none transition-all text-sm ${
                isDark
                  ? "bg-transparent text-white border border-white/10 focus:border-white/30 hover:border-white/20"
                  : "bg-transparent text-black border border-gray-200 focus:border-gray-400 hover:border-gray-300"
              }`}
            />
          </div>

        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════
          ADMINS — CARD GRID
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "Admin" && (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-24 gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-sm font-medium opacity-60">Syncing directory...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 text-red-500">
              <AlertCircle className="w-16 h-16 opacity-30" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Connection Failed</h3>
                <p className="text-sm opacity-80 max-w-xs">{error}</p>
              </div>
              <Button onClick={fetchAllData} variant="outline" className="mt-2 group">
                <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </Button>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex flex-col items-center opacity-30 gap-3 py-24">
              <Search className="w-12 h-12" />
              <div className="italic text-sm">
                {searchQuery ? `No admins matching "${searchQuery}" were found.` : "No admins found."}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAdmins.map((user) => (
                <Card key={`admin-${user.id}`} className={`p-4 space-y-3 transition-all hover:border-blue-500/30 ${isDark ? "border-white/10" : "border-gray-200"}`}>
                  {/* Card Top */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      {/* ── Dynamic status dot ── */}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white dark:border-[#121212] rounded-full ${
                        user.status === "Active" ? "bg-green-500" : "bg-gray-500"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                        {user.displayName}
                      </p>
                      <p className="text-xs opacity-50 truncate">{user.adminId || "—"}</p>
                    </div>
                    <Badge variant="purple">Admin</Badge>
                  </div>

                  <hr className={isDark ? "border-white/10" : "border-gray-100"} />

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-0.5">Email</p>
                      <p className={`text-xs truncate ${isDark ? "text-white/80" : "text-gray-700"}`}>{user.displayEmail}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-0.5">Phone</p>
                      <p className={`text-xs ${isDark ? "text-white/80" : "text-gray-700"}`}>{user.displayPhone}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setViewUser(user)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5
                        ${isDark ? "border-white/10 hover:bg-white/5 text-white/60 hover:text-white" : "border-gray-200 hover:bg-gray-50 text-gray-500"}`}
                    >
                      <Info className="w-3 h-3" /> View
                    </button>
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="flex-1 py-1.5 rounded-xl text-xs font-bold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          USERS — TABLE
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "User" && (
        <Card noPadding>
          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-24 gap-3">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="text-sm font-medium opacity-60">Syncing directory...</p>
              </div>
            ) : error ? (
              <div className="p-20 text-center flex flex-col items-center gap-4 text-red-500">
                <AlertCircle className="w-16 h-16 opacity-30" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Connection Failed</h3>
                  <p className="text-sm opacity-80 max-w-xs">{error}</p>
                </div>
                <Button onClick={fetchAllData} variant="outline" className="mt-2 group">
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Try Again
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className={isDark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}>
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Member</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Contact</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Role</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-100"}`}>
                  {filteredRegularUsers.length > 0 ? (
                    filteredRegularUsers.map((user) => (
                      <tr key={`user-${user.id}`} className="hover:bg-blue-500/[0.03] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm bg-blue-600">
                                {user.displayName.charAt(0).toUpperCase()}
                              </div>
                              {/* ── Dynamic status dot on avatar ── */}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-[#121212] rounded-full ${
                                user.status === "Active" ? "bg-green-500" : "bg-gray-500"
                              }`} />
                            </div>
                            <span className="font-semibold text-[15px]">{user.displayName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-xs opacity-70 lowercase">
                              <Mail className="w-3 h-3" /> {user.displayEmail}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] opacity-50">
                              <Phone className="w-3 h-3" /> {user.displayPhone}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="neutral">{user.role}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* ── Dynamic status badge ── */}
                            <StatusBadge status={user.status} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              data-menu-trigger={String(user.id)}
                              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === user.id ? null : user.id); }}
                              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                            >
                              <MoreVertical className="w-4 h-4 opacity-50" />
                            </button>

                            {activeMenu === user.id && (() => {
                              const btn = document.querySelector(`[data-menu-trigger="${user.id}"]`);
                              const rect = btn?.getBoundingClientRect();
                              const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;
                              const goUp = spaceBelow < 120;
                              return (
                              <div
                                className={`fixed w-48 rounded-2xl shadow-2xl border backdrop-blur-md z-[200] py-2 overflow-hidden animate-in fade-in zoom-in duration-200
                                  ${isDark ? "bg-[#252525]/90 border-white/10 shadow-black/40 text-gray-200" : "bg-gray-50/95 border-gray-200 shadow-gray-200/80 text-gray-800"}`}
                                style={{
                                  top: rect ? (goUp ? `${rect.top - 96}px` : `${rect.bottom + 4}px`) : "auto",
                                  right: rect ? `${window.innerWidth - rect.right}px` : "60px",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => { setViewUser(user); setActiveMenu(null); }}
                                  className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"}`}
                                >
                                  <Info className="w-3.5 h-3.5 opacity-60" />
                                  View Full Info
                                </button>
                                <div className={`border-t my-1.5 ${isDark ? "border-white/5" : "border-gray-200/50"}`} />
                                <button
                                  onClick={() => { setDeleteTarget(user); setActiveMenu(null); }}
                                  className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove Member
                                </button>
                              </div>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-32 text-center">
                        <div className="flex flex-col items-center opacity-30 gap-3">
                          <Search className="w-12 h-12" />
                          <div className="italic text-sm">
                            {searchQuery
                              ? `No users matching "${searchQuery}" were found.`
                              : "No users found."}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}