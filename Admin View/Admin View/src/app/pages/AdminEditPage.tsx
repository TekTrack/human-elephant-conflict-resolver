
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext.tsx";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Save, Loader2, Eye, EyeOff, Shield,
  Mail, Phone, User, Hash, Key, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import API_BASE_URL from "../config/url.js";

export function AdminEditPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    adminId: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const response = await axios.get(`${API_BASE_URL}/api/admin/me`, config);
        const data = response.data.data;

        setForm(prev => ({
          ...prev,
          name: data.displayName || data.name || "",
          email: data.displayEmail || data.email || "",
          phone: data.displayPhone || data.phone || "",
          adminId: data.adminId || "",
          username: data.username || "",
        }));

      } catch (err) {
        console.error("Failed to load profile", err);
        alert("session end.please try Again..");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => /^\d{10}$/.test(p);
  const validatePassword = (p: string) =>
    p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!validateEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!validatePhone(form.phone)) e.phone = "Enter a valid 10-digit phone number.";

    if (changePassword) {
      if (!form.newPassword.trim()) e.newPassword = "New password is required.";
      else if (!validatePassword(form.newPassword)) e.newPassword = "Min 8 chars (Uppercase, Lowercase, Number & Special).";
      
      if (!form.confirmPassword.trim()) e.confirmPassword = "Please confirm your password.";
      else if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const infoPayload = {
        adminid: form.adminId,
        email: form.email,
        phone: form.phone,
        name: form.name,
        username: form.username,
      };


      console.log("Admin ryghshghghgdghdgh" + infoPayload);

      await axios.post(`${API_BASE_URL}/api/admin/updateadmin`, infoPayload, config);

      if (changePassword) {
        await axios.post(`${API_BASE_URL}/api/admin/changepassword`, {
          adminid: form.adminId,
          password: form.newPassword,
        }, config);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      <p className="text-sm opacity-50">Loading your profile...</p>
    </div>
  );

  const inputClass = (name: string) => `w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm ${errors[name] ? "border-red-500/60 bg-red-500/5 text-red-300" : isDark ? "bg-white/5 border-white/10 text-white focus:border-blue-400" : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500"}`;
  const labelClass = "text-[10px] font-bold uppercase tracking-widest opacity-50 flex items-center gap-1.5";

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className={`p-2 rounded-xl border ${isDark ? "border-white/10 text-white/60" : "border-gray-200 text-gray-500"}`}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>My Profile</h1>
          <p className="text-xs opacity-40 uppercase tracking-widest mt-0.5">Edit your personal information</p>
        </div>
        <div className="ml-auto"><Badge variant="purple">Logged In</Badge></div>
      </div>

      <Card>
        <div className="flex items-center gap-4 p-1">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {form.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>{form.name}</p>
            <p className="text-xs opacity-40">{form.email}</p>
          </div>
          <div className="text-right">
            <p className={`text-[10px] font-bold px-2 py-1 rounded-md ${isDark ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-600"}`}>
              ID: {form.adminId}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-1 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}><User className="w-3 h-3" /> Full Name</label>
              <input name="name" type="text" onChange={handleChange} value={form.name} className={inputClass("name")} />
              {errors.name && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Mail className="w-3 h-3" /> Email</label>
              <input name="email" type="email" onChange={handleChange} value={form.email} className={inputClass("email")} />
              {errors.email && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}><Phone className="w-3 h-3" /> Phone</label>
              <input name="phone" type="text" maxLength={10} onChange={handleChange} value={form.phone} className={inputClass("phone")} />
              {errors.phone && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.phone}</p>}
            </div>
            <div className="space-y-1.5 opacity-60">
              <label className={labelClass}><Hash className="w-3 h-3" /> Admin ID (Fixed)</label>
              <input name="adminId" type="text" value={form.adminId} readOnly className={`${inputClass("adminId")} cursor-not-allowed`} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Key className="w-4 h-4 opacity-40" />
               <h2 className="text-sm font-bold uppercase opacity-50">Security</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              setChangePassword(!changePassword);
              setErrors({}); // reset errors when toggling
            }}>
              {changePassword ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {changePassword && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <input 
                    name="newPassword" 
                    type={showNew ? "text" : "password"} 
                    placeholder="••••••••" 
                    onChange={handleChange} 
                    value={form.newPassword} 
                    className={`${inputClass("newPassword")} pr-10`} 
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30">
                    {showNew ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.newPassword}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <input 
                    name="confirmPassword" 
                    type={showConfirm ? "text" : "password"} 
                    placeholder="••••••••" 
                    onChange={handleChange} 
                    value={form.confirmPassword} 
                    className={`${inputClass("confirmPassword")} pr-10`} 
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30">
                    {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.confirmPassword}</p>}
                {!errors.confirmPassword && form.confirmPassword && form.newPassword === form.confirmPassword && (
                   <p className="text-green-400 text-[10px] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Passwords match.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Button 
        variant="primary" 
        className="w-full h-12 text-lg" 
        onClick={handleSave} 
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="animate-spin mr-2" /> : saveSuccess ? <CheckCircle2 className="mr-2" /> : <Save className="mr-2" />}
        {isSaving ? "Updating..." : saveSuccess ? "Profile Updated!" : "Save Changes"}
      </Button>
    </div>
  );
}