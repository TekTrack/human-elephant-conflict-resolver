// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useTheme } from "../context/ThemeContext.tsx";
// import { Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle, RefreshCw, CheckCircle2, Edit2, Info, Trash2, Users } from "lucide-react";
// import { PageHeader } from "../components/PageHeader";
// import { StatCard } from "../components/StatCard";
// import { Button } from "../components/Button";
// import { Card } from "../components/Card";
// import { Badge } from "../components/Badge";
// import type { on } from "events";
// //import { router } from "../routes.ts";
// //import { format } from "path";


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
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userType, setUserType] = useState("User");
//   const [formData, setFormData] = useState<any>({});
// const [activeMenu, setActiveMenu] = useState<string | number | null>(null);
// const [errors, setErrors] = useState<any>({});


// //Edits menue
// useEffect(() => {
//   const closeMenue = () => setActiveMenu(null);

//   if(activeMenu){
//     window.addEventListener('click', closeMenue);
//     window.addEventListener('scroll', closeMenue, true);
//   }

//   return () =>{
//     window.removeEventListener('click', closeMenue);
//     window.removeEventListener('scroll', closeMenue,true);
//   };
// }, [activeMenu]);



//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      

//       const token = localStorage.getItem("authToken") || "";
//       const config = { headers: { Authorization: `Bearer ${token}` } };


//       const [userRes, adminRes] = await Promise.all([
//         axios.get("http://localhost:8080/api/admin/users", config),
//         axios.get("http://localhost:8080/api/admin/alladmins", config)
//       ]);

//       const getUsers = () =>{
//         console.log("All Users:", userRes.data.data);
//         console.log("All Admins:", adminRes.data.data);
//       }

//       getUsers();

//       const usersMapped: UnifiedUser[] = (userRes.data.data || []).map((u: any, index: number) => ({
       
//         adminId: u.AdminID || null,
//         id: u.email || `user-${index}`,
//         displayName: u.name || "Unknown User",
//         displayEmail: u.email || "No Email",
//         displayPhone: u.phoneNumber || "No Phone",
//         role: "User",
//         status: "Active"
//       }));


//       const adminsMapped: UnifiedUser[] = (adminRes.data.data || []).map((a: any, index: number) => ({
//         adminId: a.adminId || null,
//         id: a.username || `admin-${index}`,
//         displayName: a.username || "Unknown Admin",
//         displayEmail: a.email || "No Email",
//         displayPhone: a.phone || "No Phone",
//         role: "Admin",
//         status: "Active"
//       }));


//       setAllUsers([...adminsMapped, ...usersMapped]);

//     } catch (err: any) {
//       console.error("Fetch Error:", err);
//       if (!err.response) {
//         setError("Network Error: Please check your connection and try again.");
//       } else {
//         setError(err.response?.data?.message || "An error occurred while fetching data.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

  
//   const filteredUsers = useMemo(() => {
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return allUsers;
//     return allUsers.filter(u => 
//       u.displayName.toLowerCase().includes(query) || 
//       u.displayEmail.toLowerCase().includes(query)
//     );
//   }, [allUsers, searchQuery]);


// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//   const { name, value } = e.target;
//   setFormData((prev: any) => ({ ...prev, [name]: value }));

//   if(errors[name]){
//     setErrors((prev: any) => ({ ...prev, [name]: null }));
//   }
// }

// const closeModal = () => {
//   setIsModalOpen(false);
//   setFormData({});
// }

// //validation for the password
// const validatePassword = (password: string) => {
//   const minLength = 8;
//   const hasUpperCase = /[A-Z]/.test(password);
//   const hasLowerCase = /[a-z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//   return (
//     minLength <= password.length &&
//     hasUpperCase &&
//     hasLowerCase &&
//     hasNumber &&
//     hasSpecialChar
//   );
// };

// //validEmail function to validate the email format
// const validateEmail = (email: string) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }



// //validation for the phone number
// const validatePhoneNumber = (phone: string) => {
//   const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number format
//   return phoneRegex.test(phone);
// }

// //validation for the admin ID format
// const validateAdminID = (adminId: string) => {
//   const adminIdRegex = /^ADM-\d{3}$/; // Example format: ADM-001
//   return adminIdRegex.test(adminId);
// }

// //validation for the identity ID (NIC/Passport)
// const validateIdentityID = (identityId: string) => {
//   const nicRegex = /^\d{9}[V]$/; // Example format for NIC: 123456789V or 123456789X
//   const newNICRegex = /^\d{12}$/; // Example format for new NIC: 199012345678
//   const passportRegex = /^[A-Z0-9]{5,}$/; // Basic format for passport (can be adjusted based on specific requirements)
//   return nicRegex.test(identityId) || newNICRegex.test(identityId) || passportRegex.test(identityId);
// }

// //checking if requested admin exists before assigning to a user
// const validateAssignedAdmin = (adminId: string) => {
// //all admins
// console.log("All Admins:", allUsers.filter(u => u.role === "Admin"));


//   return allUsers.some(u => u.role === "Admin" && u.adminId === adminId);
// }


// //new user and admin creation modal related states and functions will go here
//   const handleCreateUserandAdmin = async () =>{
//     try{

      
//       setLoading(true);
//       const token = localStorage.getItem("authToken") || "";
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       let endpoint = "";
//       let payload = {};
// //validation added to here based on userType before making the API call
//       if(userType === "Admin"){
//         if(!formData.username || !formData.password || !formData.email || !formData.phone || !formData.adminid || !formData.name){
//           alert("Please fill in all required fields for Admin.");
//           setLoading(false);
//           return;
//         }

//         if(!validatePassword(formData.password)){
//           alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
//           setLoading(false);
//           return;
//         }
//         if(!validateEmail(formData.email)){
//           alert("Please enter a valid email address.");
//           setLoading(false);
//           return;
//         }
//         if(!validatePhoneNumber(formData.phone)){
//           alert("Please enter a valid 10-digit phone number.");
//           setLoading(false);
//           return;
//         }
//         if(!validateAdminID(formData.adminid)){
//           alert("Admin ID must be in the format ADM-001.");
//           setLoading(false);
//           return;
//         }
        
        
//       }else{
//         if(!formData.name || !formData.email || !formData.password || !formData.phone || !formData.userCategory || !formData.identityId || !formData.assignedAdminId){
//           setErrors("Please fill in all required fields for User.");
//           setLoading(false);
//           return;
//         }
//         if(!validateEmail(formData.email)){
//           newErr
//           setLoading(false);
//           return;
//         }
//         if(!validatePassword(formData.password)){
//           alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
//           setLoading(false);
//           return;
//         }
//         if(!validatePhoneNumber(formData.phone)){
//           alert("Please enter a valid 10-digit phone number.");
//           setLoading(false);
//           return;
//         }
//         if(!validateIdentityID(formData.identityId)){
//           alert("Please enter a valid Identity ID (NIC/Passport).");
//           setLoading(false);
//           return;
//         }
//         if(!validateAssignedAdmin(formData.assignedAdminId)){
//           alert("Please select a valid assigned admin.");
//           setLoading(false);
//           return;
//         }

//       }



//       if(userType === "Admin"){
//         endpoint = "http://localhost:8080/api/admin/newadmin";
//         payload = {
//           username: formData.username,
//           password: formData.password,
//           email: formData.email,
//           phone: formData.phone,
//           adminid: formData.adminid,
//           name: formData.name
//         };
//       }else{
//         endpoint = "http://localhost:8080/api/admin/createuser";
//         payload = {
//           email: formData.email,
//           password: formData.password,
//           name: formData.name,
//           phoneNumber: formData.phone,
//           userCategory: formData.userCategory,
//           IdentityID: formData.identityId,
//           AdminID: formData.assignedAdminId
//         };
//       }

//       console.log("Submitting Payload:", payload);

//       const response = await axios.post(endpoint,payload, config);
//       if(response.status === 201 || response.status === 200){
//         alert(`${userType} cerated successfully!`);
//         closeModal();
//         fetchAllData();
//       }
//     }catch(err: any){
//       console.error("Submission Error:", err);
//        alert(err.response?.data?.message || "Failed to create account.");
//     } finally {
//       setLoading(false);
//     }
//   }



// //Delete Users
// const DeleteUsers = async  (Users) =>{

//   console.log(Users);

// } 


//   return (
//     <div className="p-8 space-y-6">
//       <PageHeader
//         title="User Directory"
//         description="Unified management for all system accounts"
//         actions={<Button
//            variant="primary"
//            onClick={() => setIsModalOpen(true)}>
//             <UserPlus className="w-4 h-4" /> Add Member</Button>}
//       />


//        {/* Add Member Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
//           <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
//             <div className="p-6 space-y-6">
//               <div className="flex items-center justify-between border-b pb-4 border-white/10">
//                 <div>
//                   <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Create Account</h2>
//                   <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">Registering a new {userType} to the system</p>
//                 </div>
//                 <Badge variant={userType === "Admin" ? "purple" : "neutral"}>{userType}</Badge>
//               </div>

//               {/* Account Type Toggle */}
//               <div className="flex bg-white/5 p-1 rounded-xl gap-1 border border-white/5">
//               {["User", "Admin"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setUserType(type)}
//                     className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
//                       userType === type 
//                         ? (isDark 
//                             ? "bg-white/10 text-white border border-white/10 shadow-sm" 
//                             : "bg-white text-blue-600 shadow-sm border border-gray-200" 
//                           )
//                         : (isDark
//                             ? "text-white/40 hover:text-white/60 bg-transparent"        
//                             : "text-gray-400 hover:text-gray-600 bg-transparent" 
//                           )
//                     }`}
//                   >
//                     {type}
//                   </button>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
//                 {/* --- COMMON FIELDS --- */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Full Name</label>
//                   <input 
//                   name="name"
//                   type="text"
//                   placeholder="John Doe"
//                   autoComplete="off"
//                   onChange={handleInputChange}
//                   required
//                   className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
//                   {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Email Address</label>
//                   <input
//                   name="email"
//                   type="email"
//                   placeholder="name@example.com"
//                   autoComplete="off"
//                   onChange={handleInputChange}
//                   required 
//                   className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
//                   {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Password</label>
//                   <input
//                   name="password"
//                   type="password"
//                   placeholder="••••••••"
//                   autoComplete="off"
//                   onChange={handleInputChange}
//                   required
//                   className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
//                   {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                 </div>

//                 {/* --- ADMIN SPECIFIC FIELDS --- */}
//                 {userType === "Admin" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Username</label>
//                       <input
//                         name="username"
//                         type="text"
//                         placeholder="admin_user"
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         required
//                         className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white font-mono" : "bg-gray-50 border-gray-200"}`} />
//                         {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone</label>
//                       <input
//                         name="phone"
//                         type="text"
//                         placeholder="0770744305"
//                         maxLength={10}
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         required
//                         className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
//                         {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Admin ID</label>
//                       <input
//                         name="adminid"
//                         type="text"
//                         placeholder="ADM-001"
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         required
//                         className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white font-mono" : "bg-gray-50 border-gray-200"}`} />
//                         {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                     </div>
//                   </>
//                 )}

//                 {/* --- USER SPECIFIC FIELDS --- */}
//                 {userType === "User" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone Number</label>
//                       <input 
//                       name="phone"
//                       type="text"
//                       maxLength={10}
//                       placeholder="0770744305"
//                       autoComplete="none"
//                       onChange={handleInputChange}
//                       required
//                       className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
//                       {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                     </div>
  
//                       <div className="space-y-1.5">
//                     <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">
//                       User Category
//                     </label>
//                     <select 
//                       name="userCategory"
//                       value={formData.userCategory || "Civil"}
//                       onChange={handleInputChange}
//                       required
//                       className={`w-full px-4 py-2 rounded-xl border outline-none transition-all cursor-pointer appearance-none ${
//                         isDark 
//                           ? "bg-white/5 border-white/10 text-white focus:border-white/20" 
//                           : "bg-gray-50 border-gray-200 text-black focus:border-blue-500"
//                       }`}
//                       style={{
//                         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? "white" : "black"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "right 1rem center",
//                         backgroundSize: "1em"
//                       }}
//                     >
//                       {/* Options */}
//                       <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Civil">Civil</option>
//                       <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Guide">Guide</option>
//                       <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="PhotoGrapher">PhotoGrapher</option>
//                     </select>
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Identity ID</label>
//                       <input
//                       name="identityId"
//                       type="text"
//                       placeholder="NIC / Passport"
//                       autoComplete="none"
//                       onChange={handleInputChange}
//                       required
//                       className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
//                       {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Assigned Admin ID</label>
//                       <input
//                       name="assignedAdminId"
//                       type="text"
//                       placeholder=" EX:(ADM-001)"
//                       maxLength={7}
//                       autoComplete="none"
//                       onChange={handleInputChange}
//                       required
//                       className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
//                       {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email}</span>}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center gap-3 pt-4 border-t border-white/10">
//                 <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button variant="primary"
//                 onClick={handleCreateUserandAdmin}
//                 disabled={loading}
//                 className="flex-1 shadow-lg shadow-blue-500/20">
//                   {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                   <CheckCircle2 className="w-4 h-4 mr-2" /> Save {userType}
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}
//       {/* Stats Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <StatCard label="Total Members" value={filteredUsers.length} />
//         <StatCard 
//           label="Admins" 
//           value={filteredUsers.filter(u => u.role === "Admin").length} 
//           valueColorClass="text-purple-500" 
//         />
//         <StatCard 
//           label="Users" 
//           value={filteredUsers.filter(u => u.role === "User").length} 
//           valueColorClass="text-green-500" 
//         />
//       </div>

//       {/* Search Input */}
//       <Card>
//         <div className="relative">
//           <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             autoComplete="off"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all ${
//               isDark 
//                 ? "bg-white/5 text-white border border-white/10 focus:border-blue-500" 
//                 : "bg-gray-50 text-black border border-gray-200 focus:bg-white focus:border-blue-500 shadow-sm"
//             }`}
//           />
//         </div>
//       </Card>

//       {/* Data Table Section */}
//       <Card noPadding>
//         <div className="overflow-x-auto min-h-[400px]">
//           {loading ? (
//             /* Loading State */
//             <div className="flex flex-col items-center justify-center p-24 gap-3">
//               <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
//               <p className="text-sm font-medium opacity-60">Syncing directory...</p>
//             </div>
//           ) : error ? (
//             /* Error/Connection Lost State */
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
//           ) : (
//             <table className="w-full text-sm text-left">
//               <thead className={isDark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}>
//                 <tr>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Member</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Contact</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Role</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-100"}`}>
//   {filteredUsers.length > 0 ? (
//     filteredUsers.map((user, index) => (
//       <tr key={`${user.role}-${user.id}`} className="hover:bg-blue-500/[0.03] transition-colors group">
//         {/* Member Info */}
//         <td className="px-6 py-4">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
//                 user.role === "Admin" ? "bg-purple-600" : "bg-blue-600"
//               }`}>
//                 {user.displayName.charAt(0).toUpperCase()}
//               </div>
//               <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
//             </div>
//             <span className="font-semibold text-[15px]">{user.displayName}</span>
//           </div>
//         </td>

//         {/* Contact Info */}
//         <td className="px-6 py-4">
//           <div className="flex flex-col gap-1">
//             <span className="flex items-center gap-1.5 text-xs opacity-70 lowercase">
//               <Mail className="w-3 h-3" /> {user.displayEmail}
//             </span>
//             <span className="flex items-center gap-1.5 text-[11px] opacity-50">
//               <Phone className="w-3 h-3" /> {user.displayPhone}
//             </span>
//           </div>
//         </td>

//         {/* Role Badge */}
//         <td className="px-6 py-4">
//           <Badge variant={user.role === "Admin" ? "purple" : "neutral"}>
//             {user.role}
//           </Badge>
//         </td>

//         {/* Status Indicator */}
//         <td className="px-6 py-4">
//           <div className="flex items-center justify-center gap-2">
//             <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//               {user.status}
//             </span>
//           </div>
//         </td>

//         {/* Actions Dropdown */}
//         <td className="px-6 py-4 text-right relative">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setActiveMenu(activeMenu === user.id ? null : user.id);
//             }}
//             className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
//           >
//             <MoreVertical className="w-4 h-4 opacity-50" />
//           </button>

//           {activeMenu === user.id && (
//             // <div 
//             //   className={`absolute right-10 w-48 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 
//             //     ${index >= filteredUsers.length - 2 ? "bottom-0 mb-10" : "top-0 mt-2"} 
//             //     ${isDark 
//             //       ? "bg-black/60 border-white/10 shadow-black/50 text-white" 
//             //       : "bg-white/90 border-gray-100 shadow-gray-200/50 text-gray-900"
//             //     }`}
//             //   onClick={(e) => e.stopPropagation()}
//             // >
//             //   <button 
//             //     onClick={() => { console.log("Edit", user); setActiveMenu(null); }}
//             //     className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-gray-50"}`}
//             //   >
//             //     Edit Member
//             //   </button>
//             //   <button 
//             //     onClick={() => { console.log("Info", user); setActiveMenu(null); }}
//             //     className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-gray-50"}`}
//             //   >
//             //     View Full Info
//             //   </button>
//             //   <div className={`border-t my-1.5 ${isDark ? "border-white/10" : "border-gray-100"}`}></div>
//             //   <button 
//             //     className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all"
//             //   >
//             //     Remove Member
//             //   </button>
//             // </div>
//             <div 
//   className={`absolute right-10 w-48 rounded-2xl shadow-2xl border backdrop-blur-md z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 
//     ${index >= filteredUsers.length - 2 ? "bottom-0 mb-10" : "top-0 mt-2"} 
//     ${isDark 
//       ? "bg-[#252525]/90 border-white/10 shadow-black/40 text-gray-200"
//       : "bg-gray-50/95 border-gray-200 shadow-gray-200/80 text-gray-800"  
//     }`}
//   onClick={(e) => e.stopPropagation()}
// >
//   <button 
//     onClick={() => { console.log("Edit", user); setActiveMenu(null); }}
//     className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${
//       isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"
//     }`}
//   >
//     <Edit2 className="w-3.5 h-3.5 opacity-60" />
//     Edit Member
//   </button>
  
//   <button 
//     onClick={() => { console.log("Info", user); setActiveMenu(null); }}
//     className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${
//       isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"
//     }`}
//   >
//     <Info className="w-3.5 h-3.5 opacity-60" />
//     View Full Info
//   </button>

//   <div className={`border-t my-1.5 ${isDark ? "border-white/5" : "border-gray-200/50"}`}></div>

//   <button 
//   onClick={() => DeleteUsers(user)}
//     className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
//   >
//     <Trash2 className="w-3.5 h-3.5" />
//     Remove Member
//   </button>
// </div>
//           )}
//         </td>
//       </tr>
//     ))
//   ) : (
//     /* No Results State */
//     <tr>
//       <td colSpan={5} className="px-6 py-32 text-center">
//         <div className="flex flex-col items-center opacity-30 gap-3">
//           <Search className="w-12 h-12" />
//           <div className="italic text-sm">
//             No members matching "{searchQuery}" were found.
//           </div>
//         </div>
//       </td>
//     </tr>
//   )}
// </tbody>
//             </table>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }




// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useTheme } from "../context/ThemeContext.tsx";
// import { Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle, RefreshCw, CheckCircle2, Edit2, Info, Trash2 } from "lucide-react";
// import { PageHeader } from "../components/PageHeader";
// import { StatCard } from "../components/StatCard";
// import { Button } from "../components/Button";
// import { Card } from "../components/Card";
// import { Badge } from "../components/Badge";

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
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userType, setUserType] = useState("User");
//   const [formData, setFormData] = useState<any>({});
//   const [activeMenu, setActiveMenu] = useState<string | number | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Close dropdown on outside click or scroll
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

//       const usersMapped: UnifiedUser[] = (userRes.data.data || []).map((u: any, index: number) => ({
//         adminId: u.AdminID || null,
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
//         displayName: a.username || "Unknown Admin",
//         displayEmail: a.email || "No Email",
//         displayPhone: a.phone || "No Phone",
//         role: "Admin",
//         status: "Active",
//       }));

//       setAllUsers([...adminsMapped, ...usersMapped]);
//     } catch (err: any) {
//       console.error("Fetch Error:", err);
//       if (!err.response) {
//         setError("Network Error: Please check your connection and try again.");
//       } else {
//         setError(err.response?.data?.message || "An error occurred while fetching data.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

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

//   // ─── Form-level Validation ───────────────────────────────────────────────────

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     // Common fields
//     if (!formData.name?.trim()) {
//       newErrors.name = "Full name is required.";
//     }

//     if (!formData.email?.trim()) {
//       newErrors.email = "Email is required.";
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = "Enter a valid email address.";
//     }

//     if (!formData.password?.trim()) {
//       newErrors.password = "Password is required.";
//     } else if (!validatePassword(formData.password)) {
//       newErrors.password = "Min 8 chars with uppercase, lowercase, number & special character.";
//     }

//     if (userType === "Admin") {
//       if (!formData.username?.trim()) {
//         newErrors.username = "Username is required.";
//       }
//       if (!formData.phone?.trim()) {
//         newErrors.phone = "Phone number is required.";
//       } else if (!validatePhoneNumber(formData.phone)) {
//         newErrors.phone = "Enter a valid 10-digit phone number.";
//       }
//       if (!formData.adminid?.trim()) {
//         newErrors.adminid = "Admin ID is required.";
//       } else if (!validateAdminID(formData.adminid)) {
//         newErrors.adminid = "Format must be ADM-001.";
//       }
//     } else {
//       if (!formData.phone?.trim()) {
//         newErrors.phone = "Phone number is required.";
//       } else if (!validatePhoneNumber(formData.phone)) {
//         newErrors.phone = "Enter a valid 10-digit phone number.";
//       }
//       if (!formData.userCategory) {
//         newErrors.userCategory = "Please select a user category.";
//       }
//       if (!formData.identityId?.trim()) {
//         newErrors.identityId = "Identity ID is required.";
//       } else if (!validateIdentityID(formData.identityId)) {
//         newErrors.identityId = "Enter a valid NIC (123456789V / 199012345678) or Passport.";
//       }
//       if (!formData.assignedAdminId?.trim()) {
//         newErrors.assignedAdminId = "Assigned Admin ID is required.";
//       } else if (!validateAssignedAdmin(formData.assignedAdminId)) {
//         newErrors.assignedAdminId = "No admin found with this ID.";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ─── Input Change Handler ────────────────────────────────────────────────────

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//     // Clear the error for this field as user types
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // ─── Modal Helpers ───────────────────────────────────────────────────────────

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormData({});
//     setErrors({});
//   };

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
//           email: formData.email,
//           password: formData.password,
//           name: formData.name,
//           phoneNumber: formData.phone,
//           userCategory: formData.userCategory,
//           IdentityID: formData.identityId,
//           AdminID: formData.assignedAdminId,
//         };
//       }

//       console.log("Submitting Payload:", payload);

//       const response = await axios.post(endpoint, payload, config);
//       if (response.status === 201 || response.status === 200) {
//         alert(`${userType} created successfully!`);
//         closeModal();
//         fetchAllData();
//       }
//     } catch (err: any) {
//       console.error("Submission Error:", err);
//       alert(err.response?.data?.message || "Failed to create account.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Delete User ─────────────────────────────────────────────────────────────

//   const DeleteUsers = async (user: UnifiedUser) => {
//     //console.log(user);

//       try {
//         setLoading(true);
//         const token = localStorage.getItem("authToken") || "";
//         const config = { headers: { Authorization: `Bearer ${token}` } };

//         let endpoint = "";
//         let payload = {};
//         if (user.role === "Admin") {
//           endpoint = "http://localhost:8080/api/admin/deleteadmin";
//           payload = { adminId: user.adminId };
//         } else {
//           endpoint = "http://localhost:8080/api/admin/deleteuser";
//           payload = { email: user.displayEmail };
//         }

//         const response = await axios.post(endpoint, payload, config);
//         if (response.status === 200) {
//           alert(`${user.role} removed successfully!`);
//           fetchAllData();
//         }
//       } catch (err: any) {
//         console.error("Deletion Error:", err);
//         alert(err.response?.data?.message || "Failed to remove member.");
//       } finally {
//         setLoading(false);
//       }
      

//   };

//   // ─── Shared error message component ─────────────────────────────────────────

//   const FieldError = ({ name }: { name: string }) =>
//     errors[name] ? (
//       <span className="text-red-400 text-[10px] mt-1 block">{errors[name]}</span>
//     ) : null;

//   // ─── Shared input class ──────────────────────────────────────────────────────

//   const inputClass = (name: string) =>
//     `w-full px-4 py-2 rounded-xl border outline-none transition-all ${
//       errors[name]
//         ? "border-red-500/60 bg-red-500/5"
//         : isDark
//         ? "bg-white/5 border-white/10 text-white focus:border-blue-400"
//         : "bg-gray-50 border-gray-200 focus:border-blue-500"
//     }`;

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

//       {/* ── Add Member Modal ─────────────────────────────────────────────────── */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
//           <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
//             <div className="p-6 space-y-6">
//               {/* Header */}
//               <div className="flex items-center justify-between border-b pb-4 border-white/10">
//                 <div>
//                   <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
//                     Create Account
//                   </h2>
//                   <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">
//                     Registering a new {userType} to the system
//                   </p>
//                 </div>
//                 <Badge variant={userType === "Admin" ? "purple" : "neutral"}>{userType}</Badge>
//               </div>

//               {/* Account Type Toggle */}
//               <div className="flex bg-white/5 p-1 rounded-xl gap-1 border border-white/5">
//                 {["User", "Admin"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => {
//                       setUserType(type);
//                       setErrors({});
//                       setFormData({});
//                     }}
//                     className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
//                       userType === type
//                         ? isDark
//                           ? "bg-white/10 text-white border border-white/10 shadow-sm"
//                           : "bg-white text-blue-600 shadow-sm border border-gray-200"
//                         : isDark
//                         ? "text-white/40 hover:text-white/60 bg-transparent"
//                         : "text-gray-400 hover:text-gray-600 bg-transparent"
//                     }`}
//                   >
//                     {type}
//                   </button>
//                 ))}
//               </div>

//               {/* Form Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

//                 {/* Full Name */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Full Name</label>
//                   <input
//                     name="name"
//                     type="text"
//                     placeholder="John Doe"
//                     autoComplete="off"
//                     onChange={handleInputChange}
//                     value={formData.name || ""}
//                     className={inputClass("name")}
//                   />
//                   <FieldError name="name" />
//                 </div>

//                 {/* Email */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Email Address</label>
//                   <input
//                     name="email"
//                     type="email"
//                     placeholder="name@example.com"
//                     autoComplete="off"
//                     onChange={handleInputChange}
//                     value={formData.email || ""}
//                     className={inputClass("email")}
//                   />
//                   <FieldError name="email" />
//                 </div>

//                 {/* Password */}
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Password</label>
//                   <input
//                     name="password"
//                     type="password"
//                     placeholder="••••••••"
//                     autoComplete="off"
//                     onChange={handleInputChange}
//                     value={formData.password || ""}
//                     className={inputClass("password")}
//                   />
//                   <FieldError name="password" />
//                 </div>

//                 {/* ── Admin-specific fields ───────────────────────────────── */}
//                 {userType === "Admin" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Username</label>
//                       <input
//                         name="username"
//                         type="text"
//                         placeholder="admin_user"
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         value={formData.username || ""}
//                         className={inputClass("username")}
//                       />
//                       <FieldError name="username" />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone</label>
//                       <input
//                         name="phone"
//                         type="text"
//                         placeholder="0770744305"
//                         maxLength={10}
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         value={formData.phone || ""}
//                         className={inputClass("phone")}
//                       />
//                       <FieldError name="phone" />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Admin ID</label>
//                       <input
//                         name="adminid"
//                         type="text"
//                         placeholder="ADM-001"
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         value={formData.adminid || ""}
//                         className={inputClass("adminid")}
//                       />
//                       <FieldError name="adminid" />
//                     </div>
//                   </>
//                 )}

//                 {/* ── User-specific fields ────────────────────────────────── */}
//                 {userType === "User" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone Number</label>
//                       <input
//                         name="phone"
//                         type="text"
//                         maxLength={10}
//                         placeholder="0770744305"
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         value={formData.phone || ""}
//                         className={inputClass("phone")}
//                       />
//                       <FieldError name="phone" />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">User Category</label>
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
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Identity ID</label>
//                       <input
//                         name="identityId"
//                         type="text"
//                         placeholder="NIC / Passport"
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         value={formData.identityId || ""}
//                         className={inputClass("identityId")}
//                       />
//                       <FieldError name="identityId" />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Assigned Admin ID</label>
//                       <input
//                         name="assignedAdminId"
//                         type="text"
//                         placeholder="ADM-001"
//                         maxLength={7}
//                         autoComplete="none"
//                         onChange={handleInputChange}
//                         value={formData.assignedAdminId || ""}
//                         className={inputClass("assignedAdminId")}
//                       />
//                       <FieldError name="assignedAdminId" />
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center gap-3 pt-4 border-t border-white/10">
//                 <Button variant="outline" className="flex-1" onClick={closeModal}>
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={handleCreateUserandAdmin}
//                   disabled={loading}
//                   className="flex-1 shadow-lg shadow-blue-500/20"
//                 >
//                   {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                   <CheckCircle2 className="w-4 h-4 mr-2" /> Save {userType}
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ── Stats ────────────────────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <StatCard label="Total Members" value={filteredUsers.length} />
//         <StatCard
//           label="Admins"
//           value={filteredUsers.filter((u) => u.role === "Admin").length}
//           valueColorClass="text-purple-500"
//         />
//         <StatCard
//           label="Users"
//           value={filteredUsers.filter((u) => u.role === "User").length}
//           valueColorClass="text-green-500"
//         />
//       </div>

//       {/* ── Search ───────────────────────────────────────────────────────────── */}
//       <Card>
//         <div className="relative">
//           <Search
//             className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
//               isDark ? "text-white/40" : "text-gray-400"
//             }`}
//           />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             autoComplete="off"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all ${
//               isDark
//                 ? "bg-white/5 text-white border border-white/10 focus:border-blue-500"
//                 : "bg-gray-50 text-black border border-gray-200 focus:bg-white focus:border-blue-500 shadow-sm"
//             }`}
//           />
//         </div>
//       </Card>

//       {/* ── Data Table ───────────────────────────────────────────────────────── */}
//       <Card noPadding>
//         <div className="overflow-x-auto min-h-[400px]">
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
//           ) : (
//             <table className="w-full text-sm text-left">
//               <thead className={isDark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}>
//                 <tr>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Member</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Contact</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Role</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-100"}`}>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user, index) => (
//                     <tr
//                       key={`${user.role}-${user.id}`}
//                       className="hover:bg-blue-500/[0.03] transition-colors group"
//                     >
//                       {/* Member Info */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                             <div
//                               className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
//                                 user.role === "Admin" ? "bg-purple-600" : "bg-blue-600"
//                               }`}
//                             >
//                               {user.displayName.charAt(0).toUpperCase()}
//                             </div>
//                             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full" />
//                           </div>
//                           <span className="font-semibold text-[15px]">{user.displayName}</span>
//                         </div>
//                       </td>

//                       {/* Contact */}
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <span className="flex items-center gap-1.5 text-xs opacity-70 lowercase">
//                             <Mail className="w-3 h-3" /> {user.displayEmail}
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[11px] opacity-50">
//                             <Phone className="w-3 h-3" /> {user.displayPhone}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Role */}
//                       <td className="px-6 py-4">
//                         <Badge variant={user.role === "Admin" ? "purple" : "neutral"}>
//                           {user.role}
//                         </Badge>
//                       </td>

//                       {/* Status */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-2">
//                           <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
//                             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                             {user.status}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Actions Dropdown */}
//                       <td className="px-6 py-4 text-right relative">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setActiveMenu(activeMenu === user.id ? null : user.id);
//                           }}
//                           className={`p-2 rounded-lg transition-colors ${
//                             isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
//                           }`}
//                         >
//                           <MoreVertical className="w-4 h-4 opacity-50" />
//                         </button>

//                         {activeMenu === user.id && (
//                           <div
//                             className={`absolute right-10 w-48 rounded-2xl shadow-2xl border backdrop-blur-md z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200
//                               ${index >= filteredUsers.length - 2 ? "bottom-0 mb-10" : "top-0 mt-2"}
//                               ${
//                                 isDark
//                                   ? "bg-[#252525]/90 border-white/10 shadow-black/40 text-gray-200"
//                                   : "bg-gray-50/95 border-gray-200 shadow-gray-200/80 text-gray-800"
//                               }`}
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <button
//                               onClick={() => { console.log("Edit", user); setActiveMenu(null); }}
//                               className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${
//                                 isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"
//                               }`}
//                             >
//                               <Edit2 className="w-3.5 h-3.5 opacity-60" />
//                               Edit Member
//                             </button>

//                             <button
//                               onClick={() => { console.log("Info", user); setActiveMenu(null); }}
//                               className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${
//                                 isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"
//                               }`}
//                             >
//                               <Info className="w-3.5 h-3.5 opacity-60" />
//                               View Full Info
//                             </button>

//                             <div className={`border-t my-1.5 ${isDark ? "border-white/5" : "border-gray-200/50"}`} />

//                             <button
//                               onClick={() => DeleteUsers(user)}
//                               className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
//                             >
//                               <Trash2 className="w-3.5 h-3.5" />
//                               Remove Member
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-32 text-center">
//                       <div className="flex flex-col items-center opacity-30 gap-3">
//                         <Search className="w-12 h-12" />
//                         <div className="italic text-sm">
//                           No members matching "{searchQuery}" were found.
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }



// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { useTheme } from "../context/ThemeContext.tsx";
// import {
//   Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle,
//   RefreshCw, CheckCircle2, Edit2, Info, Trash2, Eye, EyeOff, Save, X
// } from "lucide-react";
// import { PageHeader } from "../components/PageHeader";
// import { StatCard } from "../components/StatCard";
// import { Button } from "../components/Button";
// import { Card } from "../components/Card";
// import { Badge } from "../components/Badge";

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

//   // ── Edit Modal ──
//   const [editUser, setEditUser] = useState<UnifiedUser | null>(null);
//   const [editForm, setEditForm] = useState<any>({});
//   const [editErrors, setEditErrors] = useState<Record<string, string>>({});
//   const [editLoading, setEditLoading] = useState(false);
//   const [showEditPassword, setShowEditPassword] = useState(false);

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

//       const usersMapped: UnifiedUser[] = (userRes.data.data || []).map((u: any, index: number) => ({
//         adminId: u.AdminID || null,
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
//         displayName: a.username || "Unknown Admin",
//         displayEmail: a.email || "No Email",
//         displayPhone: a.phone || "No Phone",
//         role: "Admin",
//         status: "Active",
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
//     if (!formData.name?.trim()) newErrors.name = "Full name is required.";
//     if (!formData.email?.trim()) newErrors.email = "Email is required.";
//     else if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address.";
//     if (!formData.password?.trim()) newErrors.password = "Password is required.";
//     else if (!validatePassword(formData.password)) newErrors.password = "Min 8 chars with uppercase, lowercase, number & special character.";

//     if (userType === "Admin") {
//       if (!formData.username?.trim()) newErrors.username = "Username is required.";
//       if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
//       else if (!validatePhoneNumber(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
//       if (!formData.adminid?.trim()) newErrors.adminid = "Admin ID is required.";
//       else if (!validateAdminID(formData.adminid)) newErrors.adminid = "Format must be ADM-001.";
//     } else {
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
//         payload = { username: formData.username, password: formData.password, email: formData.email, phone: formData.phone, adminid: formData.adminid, name: formData.name };
//       } else {
//         endpoint = "http://localhost:8080/api/admin/createuser";
//         payload = { email: formData.email, password: formData.password, name: formData.name, phoneNumber: formData.phone, userCategory: formData.userCategory, IdentityID: formData.identityId, AdminID: formData.assignedAdminId };
//       }
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
//         payload = { email: deleteTarget.displayEmail };
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

//   // ─── Edit ────────────────────────────────────────────────────────────────────

//   const openEditModal = (user: UnifiedUser) => {
//     setEditUser(user);
//     setShowEditPassword(false);
//     if (user.role === "Admin") {
//       setEditForm({
//         adminId: user.adminId || "",
//         email: user.displayEmail,
//         phone: user.displayPhone,
//         name: user.displayName,
//         password: "",
//       });
//     } else {
//       setEditForm({
//        // email: user.displayEmail,
//         phone: user.displayPhone,
//         name: user.displayName,
//         password: "",
//       });
//     }
//     setEditErrors({});
//   };

//   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditForm((prev: any) => ({ ...prev, [name]: value }));
//     if (editErrors[name]) setEditErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateEditForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!editForm.name?.trim()) newErrors.name = "Full name is required.";

//     if (!editForm.email?.trim()) newErrors.email = "Email is required.";
//     else if (!validateEmail(editForm.email)) newErrors.email = "Enter a valid email address.";

//     if (!editForm.phone?.trim()) newErrors.phone = "Phone number is required.";
//     else if (!validatePhoneNumber(editForm.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";

//     if (editUser?.role === "Admin") {
//       if (!editForm.adminId?.trim()) newErrors.adminId = "Admin ID is required.";
//       else if (!validateAdminID(editForm.adminId)) newErrors.adminId = "Format must be ADM-001.";
//     }

//     if (editForm.password && editForm.password.trim() !== "") {
//       if (!validatePassword(editForm.password)) {
//         newErrors.password = "Min 8 chars with uppercase, lowercase, number & special character.";
//       }
//     }

//     setEditErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleEditSave = async () => {
//     if (!validateEditForm() || !editUser) return;
//     try {
//       setEditLoading(true);
//       const token = localStorage.getItem("authToken") || "";
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       let endpoint = "";
//       let payload: any = {};

//       if (editUser.role === "Admin") {
//         endpoint = "http://localhost:8080/api/admin/updateadmin";
//         payload = {
//           adminId: editForm.adminId,
//           email: editForm.email,
//           phone: editForm.phone,
//           name: editForm.name,
//         };
//         if (editForm.password?.trim()) payload.password = editForm.password;
//       } else {
//         endpoint = "http://localhost:8080/api/admin/updateuser";
//         payload = {
//           //email: editForm.email,
//           phoneNumber: editForm.phone,
//           name: editForm.name,
//         };
//         if (editForm.password?.trim()) payload.password = editForm.password;
//       }
//       console.log("Updating with payload:", payload);
//       const response = await axios.post(endpoint, payload, config);
//       if (response.status === 200 || response.status === 201) {
//         setEditUser(null);
//         fetchAllData();
//       }
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Failed to update member.");
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   // ─── Shared UI Helpers ───────────────────────────────────────────────────────

//   const FieldError = ({ name, errMap = errors }: { name: string; errMap?: Record<string, string> }) =>
//     errMap[name] ? (
//       <span className="text-red-400 text-[10px] mt-1 block">{errMap[name]}</span>
//     ) : null;

//   const inputClass = (name: string, errMap = errors) =>
//     `w-full px-4 py-2 rounded-xl border outline-none transition-all text-sm ${
//       errMap[name]
//         ? "border-red-500/60 bg-red-500/5"
//         : isDark
//         ? "bg-white/5 border-white/10 text-white focus:border-blue-400"
//         : "bg-gray-50 border-gray-200 focus:border-blue-500"
//     }`;

//   const labelClass = "text-[10px] font-bold uppercase tracking-widest opacity-50";

//   // ─── Shared Info Grid used in View + Edit headers ────────────────────────────

//   const InfoItem = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
//     <div className={`p-3 rounded-xl border ${isDark ? "bg-white/[0.04] border-white/[0.06]" : "bg-gray-50 border-gray-100"}`}>
//       <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-1">{label}</p>
//       <p className={`text-xs break-all ${accent ? "text-green-400" : isDark ? "text-white/85" : "text-gray-800"}`}>{value}</p>
//     </div>
//   );

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
//           <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
//             <div className="p-6 space-y-6">
//               <div className="flex items-center justify-between border-b pb-4 border-white/10">
//                 <div>
//                   <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Create Account</h2>
//                   <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">Registering a new {userType} to the system</p>
//                 </div>
//                 <Badge variant={userType === "Admin" ? "purple" : "neutral"}>{userType}</Badge>
//               </div>

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

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
//                 <div className="space-y-1.5">
//                   <label className={labelClass}>Full Name</label>
//                   <input name="name" type="text" placeholder="John Doe" autoComplete="off" onChange={handleInputChange} value={formData.name || ""} className={inputClass("name")} />
//                   <FieldError name="name" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className={labelClass}>Email Address</label>
//                   <input name="email" type="email" placeholder="name@example.com" autoComplete="off" onChange={handleInputChange} value={formData.email || ""} className={inputClass("email")} />
//                   <FieldError name="email" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className={labelClass}>Password</label>
//                   <input name="password" type="password" placeholder="••••••••" autoComplete="off" onChange={handleInputChange} value={formData.password || ""} className={inputClass("password")} />
//                   <FieldError name="password" />
//                 </div>

//                 {userType === "Admin" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Username</label>
//                       <input name="username" type="text" placeholder="admin_user" autoComplete="none" onChange={handleInputChange} value={formData.username || ""} className={inputClass("username")} />
//                       <FieldError name="username" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Phone</label>
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

//                 {userType === "User" && (
//                   <>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Phone Number</label>
//                       <input name="phone" type="text" maxLength={10} placeholder="0770744305" autoComplete="none" onChange={handleInputChange} value={formData.phone || ""} className={inputClass("phone")} />
//                       <FieldError name="phone" />
//                     </div>
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>User Category</label>
//                       <select name="userCategory" value={formData.userCategory || ""} onChange={handleInputChange}
//                         className={`${inputClass("userCategory")} cursor-pointer appearance-none`}
//                         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? "white" : "black"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1em" }}>
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
//                     <div className="space-y-1.5">
//                       <label className={labelClass}>Assigned Admin ID</label>
//                       <input name="assignedAdminId" type="text" placeholder="ADM-001" maxLength={7} autoComplete="none" onChange={handleInputChange} value={formData.assignedAdminId || ""} className={inputClass("assignedAdminId")} />
//                       <FieldError name="assignedAdminId" />
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="flex items-center gap-3 pt-4 border-t border-white/10">
//                 <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
//                 <Button variant="primary" onClick={handleCreateUserandAdmin} disabled={loading} className="flex-1 shadow-lg shadow-blue-500/20">
//                   {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                   <CheckCircle2 className="w-4 h-4 mr-2" /> Save {userType}
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════════════
//           VIEW FULL INFO MODAL
//       ══════════════════════════════════════════════════════════ */}
//       {viewUser && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//           <Card className={`w-full max-w-md shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
//             <div className="p-6 space-y-5">
//               <div className="flex items-center justify-between border-b pb-4 border-white/10">
//                 <div>
//                   <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Member Details</h2>
//                   <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">Full profile information</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant={viewUser.role === "Admin" ? "purple" : "neutral"}>{viewUser.role}</Badge>
//                   <button onClick={() => setViewUser(null)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${viewUser.role === "Admin" ? "bg-purple-600" : "bg-blue-600"}`}>
//                   {viewUser.displayName.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className={`font-semibold text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>{viewUser.displayName}</p>
//                   <p className="text-xs opacity-50 mt-0.5 truncate">
//                     {viewUser.role === "Admin" ? `System Administrator · ${viewUser.adminId || "—"}` : `User · ${viewUser.id}`}
//                   </p>
//                 </div>
//                 <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase flex-shrink-0">
//                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
//                 </span>
//               </div>

//               <div>
//                 <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Contact</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   <InfoItem label="Email" value={viewUser.displayEmail} />
//                   <InfoItem label="Phone" value={viewUser.displayPhone} />
//                 </div>
//               </div>

//               <div>
//                 <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Account</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   <InfoItem label="Role" value={viewUser.role} />
//                   <InfoItem label="Admin ID" value={viewUser.adminId || "—"} />
//                   <InfoItem label={viewUser.role === "Admin" ? "Username" : "User ID"} value={String(viewUser.id)} />
//                   <InfoItem label="Status" value={viewUser.status} accent />
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-2 border-t border-white/10">
//                 <Button variant="outline" className="flex-1" onClick={() => setViewUser(null)}>Close</Button>
//                 <Button variant="primary" className="flex-1" onClick={() => { openEditModal(viewUser); setViewUser(null); }}>
//                   <Edit2 className="w-4 h-4 mr-2" /> Edit Member
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════════════
//           EDIT MODAL
//       ══════════════════════════════════════════════════════════ */}
//       {editUser && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//           <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
//             <div className="p-6 space-y-6">
//               {/* Header */}
//               <div className="flex items-center justify-between border-b pb-4 border-white/10">
//                 <div>
//                   <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Edit Member</h2>
//                   <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">
//                     Updating {editUser.role === "Admin" ? "admin" : "user"} — {editUser.displayName}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant={editUser.role === "Admin" ? "purple" : "neutral"}>{editUser.role}</Badge>
//                   <button onClick={() => setEditUser(null)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* User identity hint */}
//               <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-gray-50 border-gray-100"}`}>
//                 <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${editUser.role === "Admin" ? "bg-purple-600" : "bg-blue-600"}`}>
//                   {editUser.displayName.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="min-w-0">
//                   <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{editUser.displayName}</p>
//                   <p className="text-[11px] opacity-40 truncate">{editUser.displayEmail}</p>
//                 </div>
//                 {editUser.role === "Admin" && editUser.adminId && (
//                   <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"}`}>
//                     {editUser.adminId}
//                   </span>
//                 )}
//               </div>

//               {/* Form Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">

//                 {/* Full Name */}
//                 <div className="space-y-1.5">
//                   <label className={labelClass}>Full Name</label>
//                   <input name="name" type="text" placeholder="John Doe" autoComplete="off" onChange={handleEditInputChange} value={editForm.name || ""} className={inputClass("name", editErrors)} />
//                   <FieldError name="name" errMap={editErrors} />
//                 </div>

//                 {/* Email — editable for Admins */}
//                 {editUser.role === "Admin" && (
//                   <div className="space-y-1.5">
//                     <label className={labelClass}>Email Address</label>
//                     <input name="email" type="email" placeholder="name@example.com" autoComplete="off" onChange={handleEditInputChange} value={editForm.email || ""} className={inputClass("email", editErrors)} />
//                     <FieldError name="email" errMap={editErrors} />
//                   </div>
//                 )}

//                 {/* Phone */}
//                 <div className="space-y-1.5">
//                   <label className={labelClass}>Phone Number</label>
//                   <input name="phone" type="text" maxLength={10} placeholder="0770744305" autoComplete="off" onChange={handleEditInputChange} value={editForm.phone || ""} className={inputClass("phone", editErrors)} />
//                   <FieldError name="phone" errMap={editErrors} />
//                 </div>

//                 {/* Admin ID — only for admins */}
//                 {editUser.role === "Admin" && (
//                   <div className="space-y-1.5">
//                     <label className={labelClass}>Admin ID</label>
//                     <input name="adminId" type="text" placeholder="ADM-001" autoComplete="off" onChange={handleEditInputChange} value={editForm.adminId || ""} className={inputClass("adminId", editErrors)} />
//                     <FieldError name="adminId" errMap={editErrors} />
//                   </div>
//                 )}

//                 {/* Password — optional, both roles */}
//                 <div className={`space-y-1.5 ${editUser.role === "Admin" ? "" : "md:col-span-2"}`}>
//                   <label className={labelClass}>
//                     New Password{" "}
//                     <span className="normal-case text-[9px] opacity-40 ml-1">(leave blank to keep current)</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       name="password"
//                       type={showEditPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       autoComplete="new-password"
//                       onChange={handleEditInputChange}
//                       value={editForm.password || ""}
//                       className={`${inputClass("password", editErrors)} pr-10`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowEditPassword((v) => !v)}
//                       className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"}`}
//                     >
//                       {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                     </button>
//                   </div>
//                   <FieldError name="password" errMap={editErrors} />
//                 </div>

//                 {/* Password strength hint */}
//                 {editForm.password && editForm.password.length > 0 && (
//                   <div className={`md:col-span-2 text-[10px] px-3 py-2 rounded-lg border flex items-start gap-2 ${
//                     validatePassword(editForm.password)
//                       ? isDark ? "bg-green-500/8 border-green-500/20 text-green-400" : "bg-green-50 border-green-200 text-green-600"
//                       : isDark ? "bg-amber-500/8 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"
//                   }`}>
//                     <span className="mt-0.5">
//                       {validatePassword(editForm.password) ? "✓" : "!"}
//                     </span>
//                     {validatePassword(editForm.password)
//                       ? "Password meets all requirements."
//                       : "Min 8 chars — needs uppercase, lowercase, number & special character."}
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center gap-3 pt-4 border-t border-white/10">
//                 <Button variant="outline" className="flex-1" onClick={() => setEditUser(null)}>
//                   <X className="w-4 h-4 mr-2" /> Cancel
//                 </Button>
//                 <Button variant="primary" onClick={handleEditSave} disabled={editLoading} className="flex-1 shadow-lg shadow-blue-500/20">
//                   {editLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
//                   Save Changes
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}

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
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <StatCard label="Total Members" value={filteredUsers.length} />
//         <StatCard label="Admins" value={filteredUsers.filter((u) => u.role === "Admin").length} valueColorClass="text-purple-500" />
//         <StatCard label="Users" value={filteredUsers.filter((u) => u.role === "User").length} valueColorClass="text-green-500" />
//       </div>

//       {/* ══════════════════════════════════════════════════════════
//           SEARCH
//       ══════════════════════════════════════════════════════════ */}
//       <Card>
//         <div className="relative">
//           <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             autoComplete="off"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all ${
//               isDark
//                 ? "bg-white/5 text-white border border-white/10 focus:border-blue-500"
//                 : "bg-gray-50 text-black border border-gray-200 focus:bg-white focus:border-blue-500 shadow-sm"
//             }`}
//           />
//         </div>
//       </Card>

//       {/* ══════════════════════════════════════════════════════════
//           DATA TABLE
//       ══════════════════════════════════════════════════════════ */}
//       <Card noPadding>
//         <div className="overflow-x-auto min-h-[400px]">
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
//           ) : (
//             <table className="w-full text-sm text-left">
//               <thead className={isDark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}>
//                 <tr>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Member</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Contact</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Role</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
//                   <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-100"}`}>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user, index) => (
//                     <tr key={`${user.role}-${user.id}`} className="hover:bg-blue-500/[0.03] transition-colors group">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${user.role === "Admin" ? "bg-purple-600" : "bg-blue-600"}`}>
//                               {user.displayName.charAt(0).toUpperCase()}
//                             </div>
//                             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full" />
//                           </div>
//                           <span className="font-semibold text-[15px]">{user.displayName}</span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <span className="flex items-center gap-1.5 text-xs opacity-70 lowercase">
//                             <Mail className="w-3 h-3" /> {user.displayEmail}
//                           </span>
//                           <span className="flex items-center gap-1.5 text-[11px] opacity-50">
//                             <Phone className="w-3 h-3" /> {user.displayPhone}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <Badge variant={user.role === "Admin" ? "purple" : "neutral"}>{user.role}</Badge>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-2">
//                           <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
//                             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                             {user.status}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Actions Dropdown */}
//                       <td className="px-6 py-4 text-right relative">
//                         <button
//                           onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === user.id ? null : user.id); }}
//                           className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
//                         >
//                           <MoreVertical className="w-4 h-4 opacity-50" />
//                         </button>

//                         {activeMenu === user.id && (
//                           <div
//                             className={`absolute right-10 w-48 rounded-2xl shadow-2xl border backdrop-blur-md z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200
//                               ${index >= filteredUsers.length - 2 ? "bottom-0 mb-10" : "top-0 mt-2"}
//                               ${isDark ? "bg-[#252525]/90 border-white/10 shadow-black/40 text-gray-200" : "bg-gray-50/95 border-gray-200 shadow-gray-200/80 text-gray-800"}`}
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <button
//                               onClick={() => { openEditModal(user); setActiveMenu(null); }}
//                               className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"}`}
//                             >
//                               <Edit2 className="w-3.5 h-3.5 opacity-60" />
//                               Edit Member
//                             </button>

//                             <button
//                               onClick={() => { setViewUser(user); setActiveMenu(null); }}
//                               className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"}`}
//                             >
//                               <Info className="w-3.5 h-3.5 opacity-60" />
//                               View Full Info
//                             </button>

//                             <div className={`border-t my-1.5 ${isDark ? "border-white/5" : "border-gray-200/50"}`} />

//                             <button
//                               onClick={() => { setDeleteTarget(user); setActiveMenu(null); }}
//                               className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
//                             >
//                               <Trash2 className="w-3.5 h-3.5" />
//                               Remove Member
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-32 text-center">
//                       <div className="flex flex-col items-center opacity-30 gap-3">
//                         <Search className="w-12 h-12" />
//                         <div className="italic text-sm">No members matching "{searchQuery}" were found.</div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext.tsx";
import {
  Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle,
  RefreshCw, CheckCircle2, Edit2, Info, Trash2, Eye, EyeOff, Save, X
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

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

  // ── Edit Modal ──
  const [editUser, setEditUser] = useState<UnifiedUser | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

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
        adminId: u.AdminID || null,
        id: u.email || `user-${index}`,
        displayName: u.name || "Unknown User",
        displayEmail: u.email || "No Email",
        displayPhone: u.phoneNumber || "No Phone",
        role: "User",
        status: "Active",
      }));

      const adminsMapped: UnifiedUser[] = (adminRes.data.data || []).map((a: any, index: number) => ({
        adminId: a.adminId || null,
        id: a.username || `admin-${index}`,
        displayName: a.name || "Unknown Admin",
        displayEmail: a.email || "No Email",
        displayPhone: a.phone || "No Phone",
        role: "Admin",
        status: "Active",
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
    if (!formData.name?.trim()) newErrors.name = "Full name is required.";
    if (!formData.email?.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!formData.password?.trim()) newErrors.password = "Password is required.";
    else if (!validatePassword(formData.password)) newErrors.password = "Min 8 chars with uppercase, lowercase, number & special character.";

    if (userType === "Admin") {
      if (!formData.username?.trim()) newErrors.username = "Username is required.";
      if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
      else if (!validatePhoneNumber(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
      if (!formData.adminid?.trim()) newErrors.adminid = "Admin ID is required.";
      else if (!validateAdminID(formData.adminid)) newErrors.adminid = "Format must be ADM-001.";
    } else {
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
        payload = { username: formData.username, password: formData.password, email: formData.email, phone: formData.phone, adminid: formData.adminid, name: formData.name };
      } else {
        endpoint = "http://localhost:8080/api/admin/createuser";
        payload = { email: formData.email, password: formData.password, name: formData.name, phoneNumber: formData.phone, userCategory: formData.userCategory, IdentityID: formData.identityId, AdminID: formData.assignedAdminId };
      }
      console.log("Creating with payload:", payload);
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
        payload = { email: deleteTarget.displayEmail };
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

  // ─── Edit ────────────────────────────────────────────────────────────────────

  const openEditModal = (user: UnifiedUser) => {
    setEditUser(user);
    setShowEditPassword(false);
    if (user.role === "Admin") {
      setEditForm({
        username: user.id,
        adminId: user.adminId || "",
        email: user.displayEmail,
        phone: user.displayPhone,
        name: user.displayName,
        password: "",
      });
    } else {
      setEditForm({
        email: user.displayEmail,
        phone: user.displayPhone,
        name: user.displayName,
        password: "",
      });
    }
    setEditErrors({});
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
    if (editErrors[name]) setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEditForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editForm.name?.trim()) newErrors.name = "Full name is required.";

    // Admin-only fields
    if (editUser?.role === "Admin") {
      if (!editForm.email?.trim()) newErrors.email = "Email is required.";
      else if (!validateEmail(editForm.email)) newErrors.email = "Enter a valid email address.";

      if (!editForm.adminId?.trim()) newErrors.adminId = "Admin ID is required.";
      else if (!validateAdminID(editForm.adminId)) newErrors.adminId = "Format must be ADM-001.";
    }

    if (!editForm.phone?.trim()) newErrors.phone = "Phone number is required.";
    else if (!validatePhoneNumber(editForm.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";

    if (editForm.password && editForm.password.trim() !== "") {
      if (!validatePassword(editForm.password)) {
        newErrors.password = "Min 8 chars with uppercase, lowercase, number & special character.";
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSave = async () => {
    if (!validateEditForm() || !editUser) return;
    try {
      setEditLoading(true);
      const token = localStorage.getItem("authToken") || "";
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let endpoint = "";
      let payload: any = {};

      if (editUser.role === "Admin") {
        endpoint = "http://localhost:8080/api/admin/updateadmin";
        payload = {
          adminId: editForm.adminId,
          email: editForm.email,
          phone: editForm.phone,
          name: editForm.name,
          username: editForm.username,
        };
        if (editForm.password?.trim()) payload.password = editForm.password;
      } else {
        endpoint = "http://localhost:8080/api/admin/updateuser";
        payload = {
          email: editForm.email,
          phoneNumber: editForm.phone,
          name: editForm.name,
        };
        if (editForm.password?.trim()) payload.password = editForm.password;
      }

      const response = await axios.post(endpoint, payload, config);
      if (response.status === 200 || response.status === 201) {
        setEditUser(null);
        fetchAllData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update member.");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Shared UI Helpers ───────────────────────────────────────────────────────

  const FieldError = ({ name, errMap = errors }: { name: string; errMap?: Record<string, string> }) =>
    errMap[name] ? (
      <span className="text-red-400 text-[10px] mt-1 block">{errMap[name]}</span>
    ) : null;

  const inputClass = (name: string, errMap = errors) =>
    `w-full px-4 py-2 rounded-xl border outline-none transition-all text-sm ${
      errMap[name]
        ? "border-red-500/60 bg-red-500/5"
        : isDark
        ? "bg-white/5 border-white/10 text-white focus:border-blue-400"
        : "bg-gray-50 border-gray-200 focus:border-blue-500"
    }`;

  const labelClass = "text-[10px] font-bold uppercase tracking-widest opacity-50";

  // ─── Shared Info Grid used in View + Edit headers ────────────────────────────

  const InfoItem = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className={`p-3 rounded-xl border ${isDark ? "bg-white/[0.04] border-white/[0.06]" : "bg-gray-50 border-gray-100"}`}>
      <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-1">{label}</p>
      <p className={`text-xs break-all ${accent ? "text-green-400" : isDark ? "text-white/85" : "text-gray-800"}`}>{value}</p>
    </div>
  );

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
          <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-white/10">
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Create Account</h2>
                  <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">Registering a new {userType} to the system</p>
                </div>
                <Badge variant={userType === "Admin" ? "purple" : "neutral"}>{userType}</Badge>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
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

                {userType === "Admin" && (
                  <>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Username</label>
                      <input name="username" type="text" placeholder="admin_user" autoComplete="none" onChange={handleInputChange} value={formData.username || ""} className={inputClass("username")} />
                      <FieldError name="username" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Phone</label>
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

                {userType === "User" && (
                  <>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Phone Number</label>
                      <input name="phone" type="text" maxLength={10} placeholder="0770744305" autoComplete="none" onChange={handleInputChange} value={formData.phone || ""} className={inputClass("phone")} />
                      <FieldError name="phone" />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>User Category</label>
                      <select name="userCategory" value={formData.userCategory || ""} onChange={handleInputChange}
                        className={`${inputClass("userCategory")} cursor-pointer appearance-none`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? "white" : "black"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1em" }}>
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
                    <div className="space-y-1.5">
                      <label className={labelClass}>Assigned Admin ID</label>
                      <input name="assignedAdminId" type="text" placeholder="ADM-001" maxLength={7} autoComplete="none" onChange={handleInputChange} value={formData.assignedAdminId || ""} className={inputClass("assignedAdminId")} />
                      <FieldError name="assignedAdminId" />
                    </div>
                  </>
                )}
              </div>

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
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW FULL INFO MODAL
      ══════════════════════════════════════════════════════════ */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <Card className={`w-full max-w-md shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-4 border-white/10">
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Member Details</h2>
                  <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">Full profile information</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={viewUser.role === "Admin" ? "purple" : "neutral"}>{viewUser.role}</Badge>
                  <button onClick={() => setViewUser(null)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${viewUser.role === "Admin" ? "bg-purple-600" : "bg-blue-600"}`}>
                  {viewUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>{viewUser.displayName}</p>
                  <p className="text-xs opacity-50 mt-0.5 truncate">
                    {viewUser.role === "Admin" ? `System Administrator · ${viewUser.adminId || "—"}` : `User · ${viewUser.id}`}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                </span>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Contact</p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Email" value={viewUser.displayEmail} />
                  <InfoItem label="Phone" value={viewUser.displayPhone} />
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Account</p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Role" value={viewUser.role} />
                  <InfoItem label="Admin ID" value={viewUser.adminId || "—"} />
                  <InfoItem label={viewUser.role === "Admin" ? "Username" : "User ID"} value={String(viewUser.id)} />
                  <InfoItem label="Status" value={viewUser.status} accent />
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-white/10">
                <Button variant="outline" className="flex-1" onClick={() => setViewUser(null)}>Close</Button>
                <Button variant="primary" className="flex-1" onClick={() => { openEditModal(viewUser); setViewUser(null); }}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Member
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          EDIT MODAL
      ══════════════════════════════════════════════════════════ */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? "border-white/10" : "border-gray-200"}`}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 border-white/10">
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Edit Member</h2>
                  <p className="text-xs opacity-50 uppercase tracking-tighter mt-1">
                    Updating {editUser.role === "Admin" ? "admin" : "user"} — {editUser.displayName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={editUser.role === "Admin" ? "purple" : "neutral"}>{editUser.role}</Badge>
                  <button onClick={() => setEditUser(null)} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-gray-100 text-gray-400"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* User identity hint */}
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-gray-50 border-gray-100"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${editUser.role === "Admin" ? "bg-purple-600" : "bg-blue-600"}`}>
                  {editUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{editUser.displayName}</p>
                  <p className="text-[11px] opacity-40 truncate">{editUser.displayEmail}</p>
                </div>
                {editUser.role === "Admin" && editUser.adminId && (
                  <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"}`}>
                    {editUser.adminId}
                  </span>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Full Name</label>
                  <input name="name" type="text" placeholder="John Doe" autoComplete="off" onChange={handleEditInputChange} value={editForm.name || ""} className={inputClass("name", editErrors)} />
                  <FieldError name="name" errMap={editErrors} />
                </div>

                {/* Email — Admin only */}
                {editUser.role === "Admin" && (
                  <div className="space-y-1.5">
                    <label className={labelClass}>Email Address</label>
                    <input name="email" type="email" placeholder="name@example.com" autoComplete="off" onChange={handleEditInputChange} value={editForm.email || ""} className={inputClass("email", editErrors)} />
                    <FieldError name="email" errMap={editErrors} />
                  </div>
                )}

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Phone Number</label>
                  <input name="phone" type="text" maxLength={10} placeholder="0770744305" autoComplete="off" onChange={handleEditInputChange} value={editForm.phone || ""} className={inputClass("phone", editErrors)} />
                  <FieldError name="phone" errMap={editErrors} />
                </div>

                {/* Admin ID — only for admins */}
                {editUser.role === "Admin" && (
                  <div className="space-y-1.5">
                    <label className={labelClass}>Admin ID</label>
                    <input name="adminId" type="text" placeholder="ADM-001" autoComplete="off" onChange={handleEditInputChange} value={editForm.adminId || ""} className={inputClass("adminId", editErrors)} />
                    <FieldError name="adminId" errMap={editErrors} />
                  </div>
                )}

                {/* Password — optional, both roles */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    New Password{" "}
                    <span className="normal-case text-[9px] opacity-40 ml-1">(leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showEditPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      onChange={handleEditInputChange}
                      value={editForm.password || ""}
                      className={`${inputClass("password", editErrors)} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword((v) => !v)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError name="password" errMap={editErrors} />
                </div>

                {/* Password strength hint */}
                {editForm.password && editForm.password.length > 0 && (
                  <div className={`md:col-span-2 text-[10px] px-3 py-2 rounded-lg border flex items-start gap-2 ${
                    validatePassword(editForm.password)
                      ? isDark ? "bg-green-500/8 border-green-500/20 text-green-400" : "bg-green-50 border-green-200 text-green-600"
                      : isDark ? "bg-amber-500/8 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"
                  }`}>
                    <span className="mt-0.5">
                      {validatePassword(editForm.password) ? "✓" : "!"}
                    </span>
                    {validatePassword(editForm.password)
                      ? "Password meets all requirements."
                      : "Min 8 chars — needs uppercase, lowercase, number & special character."}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Button variant="outline" className="flex-1" onClick={() => setEditUser(null)}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button variant="primary" onClick={handleEditSave} disabled={editLoading} className="flex-1 shadow-lg shadow-blue-500/20">
                  {editLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
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
          STATS
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Members" value={filteredUsers.length} />
        <StatCard label="Admins" value={filteredUsers.filter((u) => u.role === "Admin").length} valueColorClass="text-purple-500" />
        <StatCard label="Users" value={filteredUsers.filter((u) => u.role === "User").length} valueColorClass="text-green-500" />
      </div>

      {/* ══════════════════════════════════════════════════════════
          SEARCH
      ══════════════════════════════════════════════════════════ */}
      <Card>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
          <input
            type="text"
            placeholder="Search by name or email..."
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all ${
              isDark
                ? "bg-white/5 text-white border border-white/10 focus:border-blue-500"
                : "bg-gray-50 text-black border border-gray-200 focus:bg-white focus:border-blue-500 shadow-sm"
            }`}
          />
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════
          DATA TABLE
      ══════════════════════════════════════════════════════════ */}
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={`${user.role}-${user.id}`} className="hover:bg-blue-500/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${user.role === "Admin" ? "bg-purple-600" : "bg-blue-600"}`}>
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full" />
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
                        <Badge variant={user.role === "Admin" ? "purple" : "neutral"}>{user.role}</Badge>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            {user.status}
                          </span>
                        </div>
                      </td>

                      {/* Actions Dropdown */}
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === user.id ? null : user.id); }}
                          className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                        >
                          <MoreVertical className="w-4 h-4 opacity-50" />
                        </button>

                        {activeMenu === user.id && (
                          <div
                            className={`absolute right-10 w-48 rounded-2xl shadow-2xl border backdrop-blur-md z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200
                              ${index >= filteredUsers.length - 2 ? "bottom-0 mb-10" : "top-0 mt-2"}
                              ${isDark ? "bg-[#252525]/90 border-white/10 shadow-black/40 text-gray-200" : "bg-gray-50/95 border-gray-200 shadow-gray-200/80 text-gray-800"}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => { openEditModal(user); setActiveMenu(null); }}
                              className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold transition-all flex items-center gap-2 ${isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-200/50"}`}
                            >
                              <Edit2 className="w-3.5 h-3.5 opacity-60" />
                              Edit Member
                            </button>

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
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center opacity-30 gap-3">
                        <Search className="w-12 h-12" />
                        <div className="italic text-sm">No members matching "{searchQuery}" were found.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
