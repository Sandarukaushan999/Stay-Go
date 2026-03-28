import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const dummyProfile = {
  name: "Ryan Foster",
  email: "ryan_admn@staygo.edu",
  phone: "+1 234 567 8901",
  address: "Block A Admin Suite, Campus Core",
  role: "Super Admin",
  joined: "October 15, 2023",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
};

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: dummyProfile.name,
    email: dummyProfile.email,
    phone: dummyProfile.phone,
    address: dummyProfile.address,
  });
  
  const [edit, setEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [image, setImage] = useState(dummyProfile.image);
  const fileInput = useRef();

  const handleEdit = () => setEdit(true);
  const handleCancel = () => {
    setProfile({
      name: dummyProfile.name,
      email: dummyProfile.email,
      phone: dummyProfile.phone,
      address: dummyProfile.address,
    });
    setEdit(false);
  };
  
  const handleSave = () => {
    setEdit(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    }
  };

  return (
    <div className="font-[Inter,sans-serif] h-full">
      {/* Header Notification */}
      {showSuccess && (
        <motion.div
          className="fixed top-20 right-8 bg-[#BAF91A] text-[#101312] px-6 py-3 rounded-2xl font-bold shadow-lg z-50 flex items-center gap-2"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <span>✓</span> Profile updated successfully!
        </motion.div>
      )}

      {/* 1. Header Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start justify-between mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#F5F6FA] to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-[#E2FF99] to-[#BAF91A] shadow-md">
              <img
                src={image}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
            </div>
            <button
              className="absolute bottom-0 right-0 bg-[#101312] text-white hover:bg-gray-800 rounded-full p-2 shadow-lg transition transform hover:scale-105"
              onClick={() => fileInput.current.click()}
              aria-label="Change image"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
              </svg>
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInput} onChange={handleImageChange} />
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">{profile.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {dummyProfile.role}
              </span>
              <span className="text-gray-400 text-sm font-medium">Joined {dummyProfile.joined}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 width on large screens) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* 2. Personal Information Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              {!edit ? (
                <button 
                  onClick={handleEdit}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Edit Details
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleCancel} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                {edit ? (
                  <input name="name" value={profile.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAF91A] transition font-medium" />
                ) : (
                  <div className="text-gray-900 font-semibold text-lg">{profile.name}</div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                {edit ? (
                  <input name="email" value={profile.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAF91A] transition font-medium" />
                ) : (
                  <div className="text-gray-900 font-semibold text-lg">{profile.email}</div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                {edit ? (
                  <input name="phone" value={profile.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAF91A] transition font-medium" />
                ) : (
                  <div className="text-gray-900 font-semibold text-lg">{profile.phone}</div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location / Address</label>
                {edit ? (
                  <input name="address" value={profile.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAF91A] transition font-medium" />
                ) : (
                  <div className="text-gray-900 font-semibold text-lg">{profile.address}</div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Security Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
            
            <div className="flex flex-col gap-6">
              {/* 2FA Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <div className="font-bold text-gray-900 mb-1">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Adds an extra layer of security to your Admin account.</div>
                </div>
                <button 
                  onClick={() => setTwoFA(!twoFA)}
                  className={`mt-4 sm:mt-0 relative w-14 h-8 rounded-full transition-colors duration-300 ${twoFA ? 'bg-[#BAF91A]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${twoFA ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Password Change */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Account Password</div>
                    <div className="text-sm text-gray-500">Last changed 3 months ago.</div>
                  </div>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-white border text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition"
                  >
                    Change
                  </button>
                </div>

                {showPassword && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowPassword(false);
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 2000);
                      setPasswords({ old: "", new: "", confirm: "" });
                    }}
                  >
                    <input type="password" name="old" placeholder="Current Password" value={passwords.old} onChange={handlePasswordChange} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                    <div className="flex gap-3">
                      <input type="password" name="new" placeholder="New Password" value={passwords.new} onChange={handlePasswordChange} required className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                      <input type="password" name="confirm" placeholder="Confirm" value={passwords.confirm} onChange={handlePasswordChange} required className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                    </div>
                    <button type="submit" className="self-end bg-[#101312] hover:bg-gray-800 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition mt-2">
                       Update Password
                    </button>
                  </motion.form>
                )}
              </div>

              {/* Active Sessions */}
              <div>
                <div className="font-bold text-gray-900 mb-3 ml-1">Active Sessions</div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center bg-white border border-[#BAF91A]/30 rounded-xl p-4 shadow-[0_2px_8px_rgba(186,249,26,0.1)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#BAF91A]/20 rounded-full flex items-center justify-center text-xl">💻</div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">MacBook Pro 16" &middot; Chrome</div>
                        <div className="text-xs text-[#876DFF] font-medium mt-0.5">Current Session &middot; Campus WiFi</div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-wide transition">Log out</button>
                  </div>
                  <div className="flex justify-between items-center bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl grayscale opacity-60">📱</div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">iPhone 14 Pro &middot; Safari</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">Last active 2 hrs ago &middot; Colombo</div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-wide transition">Log out</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width on large screens) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* 4. Activity Stats Card (Accent Green) */}
          <div className="bg-[#E2FF99] rounded-[32px] p-8 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-lg transition">
            <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-white/40 blur-[40px] rounded-full pointer-events-none group-hover:bg-white/60 transition duration-500" />
            <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10 flex items-center gap-2">
              <span>📈</span> Admin Pulse
            </h2>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-gray-700 font-semibold text-sm">Actions this Month</span>
                <span className="text-2xl font-bold text-[#101312]">1,284</span>
              </div>
              <div className="bg-[#101312] border border-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <span className="text-gray-300 font-semibold text-sm">Pending Approvals</span>
                <span className="text-2xl font-bold text-[#BAF91A]">42</span>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-gray-700 font-semibold text-sm">Alerts Resolved</span>
                <span className="text-2xl font-bold text-[#876DFF]">98%</span>
              </div>
            </div>
          </div>

          {/* 5. Permissions Card (Dark Card) */}
          <div className="bg-[#101312] rounded-[32px] p-8 shadow-xl flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[80%] h-full bg-[radial-gradient(ellipse_at_top_right,rgba(186,249,26,0.1),transparent_70%)] pointer-events-none" />
            
            <h2 className="text-xl font-bold text-white mb-2 relative z-10">Role & Access</h2>
            <p className="text-gray-400 text-sm mb-6 relative z-10">You have unlimited administrative privileges.</p>
            
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 relative z-10">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#BAF91A]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#BAF91A] text-xs">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">Manage System Users</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#BAF91A]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#BAF91A] text-xs">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">Approve Maintenance Tickets</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#BAF91A]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#BAF91A] text-xs">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">View Financial & Performance</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#BAF91A]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#BAF91A] text-xs">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">Edit Global Configurations</span>
                </li>
              </ul>
              <button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl transition text-sm">
                View Full Audit Log
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
