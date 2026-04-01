import { useTheme } from "../context/ThemeContext";
import { Search, UserPlus, Mail, Phone, MoreVertical } from "lucide-react";
import { useState } from "react";

export function UserDirectoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    { id: 1, name: "Natali Craig", email: "natali.craig@example.com", phone: "+1 (555) 123-4567", role: "Admin", status: "Active", department: "IT" },
    { id: 2, name: "Drew Cano", email: "drew.cano@example.com", phone: "+1 (555) 234-5678", role: "Manager", status: "Active", department: "Operations" },
    { id: 3, name: "Andi Lane", email: "andi.lane@example.com", phone: "+1 (555) 345-6789", role: "User", status: "Active", department: "Sales" },
    { id: 4, name: "Koray Okumus", email: "koray.okumus@example.com", phone: "+1 (555) 456-7890", role: "User", status: "Inactive", department: "Marketing" },
    { id: 5, name: "Kate Morrison", email: "kate.morrison@example.com", phone: "+1 (555) 567-8901", role: "Manager", status: "Active", department: "HR" },
    { id: 6, name: "Melody Macy", email: "melody.macy@example.com", phone: "+1 (555) 678-9012", role: "User", status: "Active", department: "Finance" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Directory</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
            Manage user accounts and permissions
          </p>
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
          isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}>
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-400"
          }`} />
          <input
            type="text"
            placeholder="Search users by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDark
                ? "bg-[rgba(255,255,255,0.05)] text-white placeholder-[rgba(255,255,255,0.4)]"
                : "bg-white text-black placeholder-gray-400"
            } outline-none`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Total Users</p>
          <p className="text-2xl font-semibold mt-1">{users.length}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Active</p>
          <p className="text-2xl font-semibold mt-1 text-green-500">
            {users.filter(u => u.status === "Active").length}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Admins</p>
          <p className="text-2xl font-semibold mt-1">
            {users.filter(u => u.role === "Admin").length}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}>
          <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>Departments</p>
          <p className="text-2xl font-semibold mt-1">6</p>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl overflow-hidden border ${
        isDark
          ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
          : "bg-white border-gray-200"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-opacity-10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`${isDark ? "hover:bg-[rgba(255,255,255,0.02)]" : "hover:bg-gray-50"}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${
                        isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-200"
                      } flex items-center justify-center`}>
                        <span className="text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 opacity-50" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 opacity-50" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm">{user.department}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "Manager"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className={`p-1 rounded hover:bg-opacity-50 ${
                      isDark ? "hover:bg-[rgba(255,255,255,0.1)]" : "hover:bg-gray-200"
                    }`}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
