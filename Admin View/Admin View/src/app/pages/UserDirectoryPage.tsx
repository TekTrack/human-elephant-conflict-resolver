import { useTheme } from "../context/ThemeContext.tsx";
import { Search, UserPlus, Mail, Phone, MoreVertical } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import {Card } from "../components/Card";
import { Badge } from "../components/Badge";

export function UserDirectoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    { id: 1, name: "Saman Kumara", email: "natali.craig@example.com", phone: "+1 (555) 123-4567", role: "Admin", status: "Active" },
    { id: 2, name: "shanthi akka", email: "drew.cano@example.com", phone: "+1 (555) 234-5678", role: "Admin", status: "Active" },
    { id: 4, name: "kusumasa ", email: "koray.okumus@example.com", phone: "+1 (555) 456-7890", role: "User", status: "Inactive" },
  ];

  const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="p-8 space-y-6">
        <PageHeader
            title="User Directory"
            description="Manage user accounts and permissions"
            actions={<Button variant="primary"><UserPlus className="w-4 h-4" /> Add User</Button>}
        />

        <Card>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-400"}`} />
            <input
                type="text"
                placeholder="Search users by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none ${isDark ? "bg-[rgba(255,255,255,0.05)] text-white" : "bg-gray-100 text-black"}`}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard label="Total Users" value={users.length} />
          <StatCard label="Active" value={users.filter(u => u.status === "Active").length} valueColorClass="text-green-500" />
          <StatCard label="Admins" value={users.filter(u => u.role === "Admin").length} />
        </div>

        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"}`}>
              <tr>
                {["Name", "Email", "Phone", "Role", "" ].map(h => (
                    <th key={h} className="px-6 py-4 text-left font-medium uppercase tracking-wider text-xs">{h}</th>
                ))}
              </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.1)] dark:divide-gray-200">
              {filteredUsers.map((user) => (
                  <tr key={user.id} className={isDark ? "hover:bg-[rgba(255,255,255,0.02)]" : "hover:bg-gray-50"}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</div></td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === "Admin" ? "purple" : user.role === "Manager" ? "info" : "neutral"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
  );
}