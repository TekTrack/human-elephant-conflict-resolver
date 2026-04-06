import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext.tsx";
import { Search, UserPlus, Mail, Phone, MoreVertical, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { router } from "../routes.ts";


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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState("User");
  const [formData, setFormData] = useState<any>({});


  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      

      const token = localStorage.getItem("authToken") || "";
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


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData((prev: any) => ({ ...prev, [name]: value }));
}

const closeModal = () => {
  setIsModalOpen(false);
  setFormData({});
}



  //new user and admin creation modal related states and functions will go here
  const handleCreateUserandAdmin = async () =>{
    try{
      setLoading(true);
      const token = localStorage.getItem("authToken") || "";
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let endpoint = "";
      let payload = {};

      if(userType === "Admin"){
        endpoint = "http://localhost:8080/api/admin/newadmin";
        payload = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone: formData.phone,
          adminid: formData.adminid,
          name: formData.name
        };
      }else{
        endpoint = "http://localhost:8080/api/admin/createuser";
        payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          userCategory: formData.userCategory,
          IdentitiyID: formData.identityId,
          AdminID: formData.assignedAdminId
        };
      }

      console.log("Submitting Payload:", payload);

      const response = await axios.post(endpoint,payload, config);
      if(response.status === 201 || response.status === 200){
        alert(`${userType} cerated successfully!`);
        closeModal();
        fetchAllData();
      }
    }catch(err: any){
      console.error("Submission Error:", err);
       alert(err.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="User Directory"
        description="Unified management for all system accounts"
        actions={<Button
           variant="primary"
           onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-4 h-4" /> Add Member</Button>}
      />


       {/* Add Member Modal */}
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

              {/* Account Type Toggle */}
              <div className="flex bg-white/5 p-1 rounded-xl gap-1 border border-white/5">
              {["User", "Admin"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                      userType === type 
                        ? (isDark 
                            ? "bg-white/10 text-white border border-white/10 shadow-sm" 
                            : "bg-white text-blue-600 shadow-sm border border-gray-200" 
                          )
                        : (isDark
                            ? "text-white/40 hover:text-white/60 bg-transparent"        
                            : "text-gray-400 hover:text-gray-600 bg-transparent" 
                          )
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* --- COMMON FIELDS --- */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Full Name</label>
                  <input 
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Email Address</label>
                  <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required 
                  className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Password</label>
                  <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
                </div>

                {/* --- ADMIN SPECIFIC FIELDS --- */}
                {userType === "Admin" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Username</label>
                      <input
                        name="username"
                        type="text"
                        placeholder="admin_user"
                        autoComplete="none"
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white font-mono" : "bg-gray-50 border-gray-200"}`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone</label>
                      <input
                        name="phone"
                        type="text"
                        placeholder="+94..."
                        autoComplete="none"
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Admin ID</label>
                      <input
                        name="adminid"
                        type="text"
                        placeholder="ADM-001"
                        autoComplete="none"
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white font-mono" : "bg-gray-50 border-gray-200"}`} />
                    </div>
                  </>
                )}

                {/* --- USER SPECIFIC FIELDS --- */}
                {userType === "User" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Phone Number</label>
                      <input 
                      name="phone"
                      type="text"
                      placeholder="+94..."
                      autoComplete="none"
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
                    </div>
  
                      <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                      User Category
                    </label>
                    <select 
                      name="userCategory"
                      onChange={handleInputChange}

                      className={`w-full px-4 py-2 rounded-xl border outline-none transition-all cursor-pointer appearance-none ${
                        isDark 
                          ? "bg-white/5 border-white/10 text-white focus:border-white/20" 
                          : "bg-gray-50 border-gray-200 text-black focus:border-blue-500"
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? "white" : "black"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1em"
                      }}
                    >
                      {/* Options */}
                      <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Civil">Civil</option>
                      <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="Guide">Guide</option>
                      <option className={isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} value="PhotoGrapher">PhotoGrapher</option>
                    </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Identity ID</label>
                      <input
                      name="identityId"
                      type="text"
                      placeholder="NIC / Passport"
                      autoComplete="none"
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Assigned Admin ID</label>
                      <input
                      name="assignedAdminId"
                      type="text"
                      placeholder="Ref Admin"
                      autoComplete="none"
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-xl border outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`} />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary"
                onClick={handleCreateUserandAdmin}
                disabled={loading}
                className="flex-1 shadow-lg shadow-blue-500/20">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Save {userType}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
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