// import { useTheme } from "../context/ThemeContext.tsx";
// import { Search, UserPlus, Mail, Phone, MoreVertical } from "lucide-react";
// import { useEffect, useState } from "react";
// import { PageHeader } from "../components/PageHeader";
// import { StatCard } from "../components/StatCard";
// import { Button } from "../components/Button";
// import {Card } from "../components/Card";
// import { Badge } from "../components/Badge";

// export function UserDirectoryPage() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch("/api/users");
//       if (!response.ok) {
//         throw new Error("Failed to fetch users");
//       }

//       const usersData = await response.json();
//       setUsers(usersData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter(user =>
//       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//       <div className="p-8 space-y-6">
//         <PageHeader
//             title="User Directory"
//             description="Manage user accounts and permissions"
//             actions={<Button variant="primary"><UserPlus className="w-4 h-4" /> Add User</Button>}
//         />

//         <Card>
//           <div className="relative">
//             <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-400"}`} />
//             <input
//                 type="text"
//                 placeholder="Search users by name, email..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none ${isDark ? "bg-[rgba(255,255,255,0.05)] text-white" : "bg-gray-100 text-black"}`}
//             />
//           </div>
//         </Card>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           <StatCard label="Total Users" value={users.length} />
//           <StatCard label="Active" value={users.filter(u => u.status === "Active").length} valueColorClass="text-green-500" />
//           <StatCard label="Admins" value={users.filter(u => u.role === "Admin").length} />
//         </div>

//         <Card noPadding>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className={`${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"}`}>
//               <tr>
//                 {["Name", "Email", "Phone", "Role", "" ].map(h => (
//                     <th key={h} className="px-6 py-4 text-left font-medium uppercase tracking-wider text-xs">{h}</th>
//                 ))}
//               </tr>
//               </thead>
//               <tbody className="divide-y divide-[rgba(255,255,255,0.1)] dark:divide-gray-200">
//               {filteredUsers.map((user) => (
//                   <tr key={user.id} className={isDark ? "hover:bg-[rgba(255,255,255,0.02)]" : "hover:bg-gray-50"}>
//                     <td className="px-6 py-4 flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold">
//                         {user.name.charAt(0)}
//                       </div>
//                       {user.name}
//                     </td>
//                     <td className="px-6 py-4"><div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</div></td>
//                     <td className="px-6 py-4"><div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</div></td>
//                     <td className="px-6 py-4">
//                       <Badge variant={user.role === "Admin" ? "purple" : user.role === "Manager" ? "info" : "neutral"}>
//                         {user.role}
//                       </Badge>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><MoreVertical className="w-4 h-4" /></button>
//                     </td>
//                   </tr>
//               ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </div>
//   );
// }



// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useTheme } from "../context/ThemeContext.tsx";
// import { Search, UserPlus, Mail, Phone, MoreVertical, Loader2 } from "lucide-react";
// import { PageHeader } from "../components/PageHeader";
// import { StatCard } from "../components/StatCard";
// import { Button } from "../components/Button";
// import { Card } from "../components/Card";
// import { Badge } from "../components/Badge";


// interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   role: string;
//   status: string;
// }

// export function UserDirectoryPage() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   // States
//   const [users, setUsers] = useState<User[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

  
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
      
//         const response = await axios.get("http://localhost:8080/api/users"); 
//         setUsers(response.data);
//         setError(null);
//       } catch (err: unknown) {
//         console.error("Error fetching users:", err);
//         setError("Can't get users. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Search Logic
//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-8 space-y-6">
//       {/* Header */}
//       <PageHeader
//         title="User Directory"
//         description="Manage user accounts and permissions"
//         actions={
//           <Button variant="primary">
//             <UserPlus className="w-4 h-4" /> Add User
//           </Button>
//         }
//       />

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <StatCard 
//             label="Total Users" 
//             value={users.length} 
//         />
//         <StatCard 
//             label="Active" 
//             value={users.filter(u => u.status === "Active").length} 
//             valueColorClass="text-green-500" 
//         />
//         <StatCard 
//             label="Admins" 
//             value={users.filter(u => u.role === "Admin").length} 
//         />
//       </div>

//       {/* Search Bar */}
//       <Card>
//         <div className="relative">
//           <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
//             isDark ? "text-white/40" : "text-gray-400"
//           }`} />
//           <input
//             type="text"
//             placeholder="Search users by name, email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-all ${
//               isDark 
//                 ? "bg-white/5 text-white border border-white/10 focus:border-blue-500" 
//                 : "bg-gray-100 text-black border border-transparent focus:bg-white focus:border-blue-500"
//             }`}
//           />
//         </div>
//       </Card>

//       {/* Users Table Card */}
//       <Card noPadding>
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center p-20 gap-4">
//               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//               <p className={isDark ? "text-white/60" : "text-gray-500"}>Loading users...</p>
//             </div>
//           ) : error ? (
//             <div className="p-20 text-center text-red-500 font-medium">
//               {error}
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className={`${isDark ? "bg-white/5" : "bg-gray-50"}`}>
//                 <tr>
//                   {["Name", "Email", "Phone", "Role", ""].map((h) => (
//                     <th key={h} className="px-6 py-4 text-left font-medium uppercase tracking-wider text-xs">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-200"}`}>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <tr key={user.id} className={`transition-colors ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50"}`}>
//                       <td className="px-6 py-4 flex items-center gap-3 font-medium">
//                         <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
//                           {user.name.charAt(0).toUpperCase()}
//                         </div>
//                         {user.name}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <Mail className="w-4 h-4 opacity-60" /> {user.email}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2 text-xs">
//                           <Phone className="w-4 h-4 opacity-60" /> {user.phone}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <Badge variant={user.role === "Admin" ? "purple" : user.role === "Manager" ? "info" : "neutral"}>
//                           {user.role}
//                         </Badge>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <button className={`p-1.5 rounded-md transition-colors ${
//                           isDark ? "hover:bg-white/10" : "hover:bg-gray-200"
//                         }`}>
//                           <MoreVertical className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-10 text-center opacity-50">
//                       there is No Users.
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
// import { Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle, RefreshCw } from "lucide-react";
// import { PageHeader } from "../components/PageHeader";
// import { StatCard } from "../components/StatCard";
// import { Button } from "../components/Button";
// import { Card } from "../components/Card";
// import { Badge } from "../components/Badge";

// interface UnifiedUser {
//   id: string | number;
//   displayName: string;
//   displayEmail: string;
//   displayPhone: string;
//   role: string;
//   status: string;
// }

// export function UserDirectoryPage() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const [allUsers, setAllUsers] = useState<UnifiedUser[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null); 
//       const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaGF0aHUxMjMiLCJpYXQiOjE3NzU0NjY1ODcsImV4cCI6MTc3NTU1Mjk4N30.ydnYQHX77WjY6aTG-iTl5AqU70qgyqXGLGadMCqLADI";
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       const [userRes, adminRes] = await Promise.all([
//         axios.get("http://localhost:8080/api/admin/users", config),
//         axios.get("http://localhost:8080/api/admin/alladmins", config)
//       ]);

//       const usersMapped: UnifiedUser[] = (userRes.data.data || []).map((u: any, index: number) => ({
//         id: u.email || `user-${index}`,
//         displayName: u.name || "N/A",
//         displayEmail: u.email || "No Email",
//         displayPhone: u.phoneNumber || "N/A",
//         role: "User",
//         status: "Active"
//       }));

//       const adminsMapped: UnifiedUser[] = (adminRes.data.data || []).map((a: any, index: number) => ({
//         id: a.username || `admin-${index}`,
//         displayName: a.username || "N/A",
//         displayEmail: a.email || "No Email",
//         displayPhone: a.phone || "N/A",
//         role: "Admin",
//         status: "Active"
//       }));

//       setAllUsers([...adminsMapped, ...usersMapped]);
//     } catch (err: any) {
//       console.error("Fetch Error:", err);
//       // Connection Lost
//       if (!err.response) {
//         setError("Connection Lost.Please check your network and try again.");
//       } else {
//         setError(err.response?.data?.message || "Failed to fetch data.");
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

//   return (
//     <div className="p-8 space-y-6">
//       <PageHeader
//         title="User Directory"
//         description="Unified view of Admins and Users"
//         actions={<Button variant="primary"><UserPlus className="w-4 h-4" /> Add Member</Button>}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <StatCard label="Total Found" value={filteredUsers.length} />
//         <StatCard label="Admins" value={filteredUsers.filter(u => u.role === "Admin").length} valueColorClass="text-purple-500" />
//         <StatCard label="Users" value={filteredUsers.filter(u => u.role === "User").length} valueColorClass="text-green-500" />
//       </div>

//       <Card>
//         <div className="relative">
//           <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-all ${
//               isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-100 text-black border-gray-200"
//             } focus:ring-2 focus:ring-blue-500`}
//           />
//         </div>
//       </Card>

//       <Card noPadding>
//         <div className="overflow-x-auto min-h-[300px]">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center p-20 gap-3">
//               <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
//               <p className="text-sm opacity-60">Syncing with server...</p>
//             </div>
//           ) : error ? (
            
//             <div className="p-20 text-center flex flex-col items-center gap-4 text-red-500">
//               <AlertCircle className="w-12 h-12 opacity-50" />
//               <div className="max-w-xs mx-auto">
//                 <p className="font-semibold">Failed to fetch data!</p>
//                 <p className="text-xs opacity-80 mt-1">{error}</p>
//               </div>
//               <Button onClick={() => fetchAllData()} variant="outline" className="mt-2">
//                 <RefreshCw className="w-4 h-4 mr-2" /> Retry Connection
//               </Button>
//             </div>
//           ) : (
//             <table className="w-full text-sm text-left">
//               <thead className={isDark ? "bg-white/5 text-white/60" : "bg-gray-50 text-gray-500"}>
//                 <tr>
//                   <th className="px-6 py-4 uppercase text-[10px] font-bold">Member</th>
//                   <th className="px-6 py-4 uppercase text-[10px] font-bold">Contact</th>
//                   <th className="px-6 py-4 uppercase text-[10px] font-bold">Role</th>
//                   <th className="px-6 py-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-200"}`}>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <tr key={`${user.role}-${user.id}`} className="hover:bg-blue-500/5 transition-colors group">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${
//                             user.role === "Admin" ? "bg-purple-600" : "bg-blue-600"
//                           }`}>
//                             {user.displayName.charAt(0).toUpperCase()}
//                           </div>
//                           <span className="font-medium">{user.displayName}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-0.5">
//                           <span className="flex items-center gap-1.5 opacity-80 text-xs lowercase italic"><Mail className="w-3 h-3" /> {user.displayEmail}</span>
//                           <span className="flex items-center gap-1.5 opacity-50 text-[10px]"><Phone className="w-3 h-3" /> {user.displayPhone}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <Badge variant={user.role === "Admin" ? "purple" : "neutral"}>{user.role}</Badge>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"><MoreVertical className="w-4 h-4" /></button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
                  
//                   <tr>
//                     <td colSpan={4} className="px-6 py-24 text-center">
//                        <div className="flex flex-col items-center opacity-40 italic gap-2">
//                           <Search className="w-8 h-8" />
//                           <p>Failed to find any members.</p>
//                        </div>
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
import { Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";


interface UnifiedUser {
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


  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      

      const token = sessionStorage.getItem("token") || "";
      const config = { headers: { Authorization: `Bearer ${token}` } };


      const [userRes, adminRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/users", config),
        axios.get("http://localhost:8080/api/admin/alladmins", config)
      ]);


      const usersMapped: UnifiedUser[] = (userRes.data.data || []).map((u: any, index: number) => ({
        id: u.email || `user-${index}`,
        displayName: u.name || "Unknown User",
        displayEmail: u.email || "No Email",
        displayPhone: u.phoneNumber || "No Phone",
        role: "User",
        status: "Active"
      }));


      const adminsMapped: UnifiedUser[] = (adminRes.data.data || []).map((a: any, index: number) => ({
        id: a.username || `admin-${index}`,
        displayName: a.username || "Unknown Admin",
        displayEmail: a.email || "No Email",
        displayPhone: a.phone || "No Phone",
        role: "Admin",
        status: "Active"
      }));


      setAllUsers([...adminsMapped, ...usersMapped]);

    } catch (err: any) {
      console.error("Fetch Error:", err);
      if (!err.response) {
        setError("Network Error: Please check your connection and try again.");
      } else {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allUsers;
    return allUsers.filter(u => 
      u.displayName.toLowerCase().includes(query) || 
      u.displayEmail.toLowerCase().includes(query)
    );
  }, [allUsers, searchQuery]);

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="User Directory"
        description="Unified management for all system accounts"
        actions={<Button variant="primary"><UserPlus className="w-4 h-4" /> Add Member</Button>}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Members" value={filteredUsers.length} />
        <StatCard 
          label="Admins" 
          value={filteredUsers.filter(u => u.role === "Admin").length} 
          valueColorClass="text-purple-500" 
        />
        <StatCard 
          label="Users" 
          value={filteredUsers.filter(u => u.role === "User").length} 
          valueColorClass="text-green-500" 
        />
      </div>

      {/* Search Input */}
      <Card>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
          <input
            type="text"
            placeholder="Search by name or email..."
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

      {/* Data Table Section */}
      <Card noPadding>
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center p-24 gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-sm font-medium opacity-60">Syncing directory...</p>
            </div>
          ) : error ? (
            /* Error/Connection Lost State */
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
                  filteredUsers.map((user) => (
                    <tr key={`${user.role}-${user.id}`} className="hover:bg-blue-500/[0.03] transition-colors group">
                      {/* Member Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                              user.role === "Admin" ? "bg-purple-600" : "bg-blue-600"
                            }`}>
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                            {/* Active Indicator Dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                          </div>
                          <span className="font-semibold text-[15px]">{user.displayName}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-xs opacity-70 lowercase"><Mail className="w-3 h-3" /> {user.displayEmail}</span>
                          <span className="flex items-center gap-1.5 text-[11px] opacity-50"><Phone className="w-3 h-3" /> {user.displayPhone}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <Badge variant={user.role === "Admin" ? "purple" : "neutral"}>
                          {user.role}
                        </Badge>
                      </td>

                      {/* Status Indicator */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                           <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              {user.status}
                           </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                          <MoreVertical className="w-4 h-4 opacity-50" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* No Results State */
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                       <div className="flex flex-col items-center opacity-30 gap-3">
                          <Search className="w-12 h-12" />
                          <div className="italic text-sm">
                            No members matching "{searchQuery}" were found.
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
    </div>
  );
}