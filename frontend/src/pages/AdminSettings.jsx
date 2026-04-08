import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ value, onChange, color = "#BAF91A" }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none`}
      style={{ backgroundColor: value ? color : "#D1D5DB" }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300"
        style={{ left: value ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ title, icon, children }) {
  return (
    <motion.div
      className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </motion.div>
  );
}

// ── Row for toggle settings ───────────────────────────────────────────────────
function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <div className="text-sm font-semibold text-gray-800">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminSettings() {
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", address: "", role: "admin",
  });
  const [editPersonal, setEditPersonal] = useState(false);
  const [draft, setDraft] = useState({});
  const [showPwForm, setShowPwForm] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showSuccess, setShowSuccess] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Security
  const [twoFA, setTwoFA] = useState(false);

  // Notifications
  const [notif, setNotif] = useState({
    email: true, rideUpdates: true, approvals: true, systemAlerts: false,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    showPhone: false, showEmail: true, allowContact: true,
  });

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: "Light Mode",
    language: "English",
    timeFormat: "12-hour",
    region: "Sri Lanka",
  });

  // Role-based (student)
  const [studentSettings, setStudentSettings] = useState({
    emergencyContact: "", pickupLocation: "", rideTime: "",
  });

  // Role-based (rider)
  const [riderSettings, setRiderSettings] = useState({
    vehicleType: "", license: "", available: false,
  });

  // Role-based (technician)
  const [techSettings, setTechSettings] = useState({
    specialization: "Electrical", available: true,
  });

  // Role-based (admin)
  const [adminSettings, setAdminSettings] = useState({
    approvalNotif: true, weeklyDigest: false,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    if (stored) {
      setProfile({
        name: stored.name || "",
        email: stored.email || "",
        phone: stored.phone || "",
        address: stored.address || "",
        role: stored.role || "admin",
      });
      setDraft({
        name: stored.name || "",
        email: stored.email || "",
        phone: stored.phone || "",
        address: stored.address || "",
      });
    }
  }, []);

  const roleLabel = () => {
    const map = { admin: "Admin", student: "Student", rider: "Rider", technician: "Technician" };
    return map[profile.role] || profile.role || "User";
  };

  const toast = (msg) => {
    setShowSuccess(msg);
    setTimeout(() => setShowSuccess(""), 2800);
  };

  const savePersonal = () => {
    const updated = { ...JSON.parse(localStorage.getItem("user") || "{}"), ...draft };
    localStorage.setItem("user", JSON.stringify(updated));
    setProfile((p) => ({ ...p, ...draft }));
    setEditPersonal(false);
    toast("Personal information saved!");
  };

  const savePw = (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) return toast("Passwords do not match.");
    setPw({ current: "", next: "", confirm: "" });
    setShowPwForm(false);
    toast("Password updated successfully!");
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="font-[Inter,sans-serif] h-full">

      {/* Toast */}
      {showSuccess && (
        <motion.div
          className="fixed top-20 right-8 bg-[#BAF91A] text-[#101312] px-6 py-3 rounded-2xl font-bold shadow-lg z-50 flex items-center gap-2"
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>✓</span> {showSuccess}
        </motion.div>
      )}

      {/* ── Profile Header Card ── */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start justify-between mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#F5F6FA] to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-[#E2FF99] to-[#BAF91A] shadow-md flex items-center justify-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&size=80`}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-white"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{profile.name || "—"}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{profile.email}</p>
            <span className="inline-block mt-2 bg-[#101312] text-[#BAF91A] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              {roleLabel()}
            </span>
          </div>
        </div>
        <button
          onClick={() => setEditPersonal(true)}
          className="mt-4 md:mt-0 relative z-10 flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
          </svg>
          Edit Profile
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT: 2/3 */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* 1. Personal Information */}
          <SectionCard title="Personal Information" icon="👤">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {[
                { label: "Full Name", key: "name" },
                { label: "Email Address", key: "email" },
                { label: "Phone Number", key: "phone" },
                { label: "Address", key: "address" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
                  {editPersonal ? (
                    <input
                      value={draft[key] || ""}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A] transition font-medium"
                    />
                  ) : (
                    <div className="text-gray-900 font-semibold text-sm py-2.5">{profile[key] || <span className="text-gray-300">Not set</span>}</div>
                  )}
                </div>
              ))}
            </div>
            {editPersonal ? (
              <div className="flex gap-2 mt-5">
                <button onClick={() => setEditPersonal(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition">Cancel</button>
                <button onClick={savePersonal} className="bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">Save Changes</button>
              </div>
            ) : (
              <button onClick={() => setEditPersonal(true)} className="mt-5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-xl text-sm font-semibold transition">
                Edit Details
              </button>
            )}
          </SectionCard>

          {/* 2. Security Settings */}
          <SectionCard title="Security Settings" icon="🔒">
            {/* 2FA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
              <div>
                <div className="font-bold text-gray-900 text-sm mb-0.5">Two-Factor Authentication</div>
                <div className="text-xs text-gray-400">Adds an extra layer of protection to your account.</div>
              </div>
              <Toggle value={twoFA} onChange={setTwoFA} />
            </div>

            {/* Change Password */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="font-bold text-gray-900 text-sm">Account Password</div>
                  <div className="text-xs text-gray-400">Keep it strong and unique.</div>
                </div>
                <button
                  onClick={() => setShowPwForm(!showPwForm)}
                  className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-gray-50 transition"
                >
                  {showPwForm ? "Cancel" : "Change"}
                </button>
              </div>
              {showPwForm && (
                <form onSubmit={savePw} className="flex flex-col gap-3 pt-4 border-t border-gray-200 mt-3">
                  <input type="password" placeholder="Current Password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                  <div className="flex gap-3">
                    <input type="password" placeholder="New Password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                    <input type="password" placeholder="Confirm" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                  </div>
                  <button type="submit" className="self-end bg-[#101312] hover:bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition">Update Password</button>
                </form>
              )}
            </div>

            {/* Logout all devices */}
            <button
              onClick={() => toast("Logged out from all other devices.")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 text-sm font-bold transition"
            >
              🚪 Logout from all devices
            </button>
          </SectionCard>

          {/* 3. Notification Settings */}
          <SectionCard title="Notification Settings" icon="🔔">
            <ToggleRow label="Email Notifications" sub="Receive updates via email" value={notif.email} onChange={(v) => setNotif({ ...notif, email: v })} />
            <ToggleRow label="Ride / Request Updates" sub="Get notified on ride and request changes" value={notif.rideUpdates} onChange={(v) => setNotif({ ...notif, rideUpdates: v })} />
            <ToggleRow label="Approval Notifications" sub="Alerts when items need your approval" value={notif.approvals} onChange={(v) => setNotif({ ...notif, approvals: v })} />
            <ToggleRow label="System Alerts" sub="Critical system-level notifications" value={notif.systemAlerts} onChange={(v) => setNotif({ ...notif, systemAlerts: v })} />
            <button onClick={() => toast("Notification preferences saved!")} className="mt-4 bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">
              Save Preferences
            </button>
          </SectionCard>

          {/* 4. Privacy Settings */}
          <SectionCard title="Privacy Settings" icon="🛡️">
            <ToggleRow label="Show Phone Number" sub="Visible to other users in the system" value={privacy.showPhone} onChange={(v) => setPrivacy({ ...privacy, showPhone: v })} />
            <ToggleRow label="Show Email Address" sub="Allow other users to see your email" value={privacy.showEmail} onChange={(v) => setPrivacy({ ...privacy, showEmail: v })} />
            <ToggleRow label="Allow others to contact me" sub="Receive messages from system users" value={privacy.allowContact} onChange={(v) => setPrivacy({ ...privacy, allowContact: v })} />
            <button onClick={() => toast("Privacy preferences saved!")} className="mt-4 bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">
              Save Preferences
            </button>
          </SectionCard>



          {/* 6. Role-Based Settings */}
          <SectionCard
            title={`${roleLabel()} Settings`}
            icon={profile.role === "admin" ? "⚙️" : profile.role === "student" ? "🎓" : profile.role === "rider" ? "🛵" : "🛠️"}
          >
            {profile.role === "student" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Emergency Contact</label>
                  <input value={studentSettings.emergencyContact} onChange={(e) => setStudentSettings({ ...studentSettings, emergencyContact: e.target.value })} placeholder="+94 7XX XXX XXXX" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Preferred Pickup Location</label>
                  <input value={studentSettings.pickupLocation} onChange={(e) => setStudentSettings({ ...studentSettings, pickupLocation: e.target.value })} placeholder="e.g. Gate B, Main Campus" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Preferred Ride Time</label>
                  <input type="time" value={studentSettings.rideTime} onChange={(e) => setStudentSettings({ ...studentSettings, rideTime: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                </div>
                <button onClick={() => toast("Student settings saved!")} className="self-start bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">Save</button>
              </div>
            )}

            {profile.role === "rider" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vehicle Type</label>
                  <select value={riderSettings.vehicleType} onChange={(e) => setRiderSettings({ ...riderSettings, vehicleType: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]">
                    <option value="">Select</option>
                    <option>Motorcycle</option><option>Car</option><option>Van</option><option>Bicycle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">License Number</label>
                  <input value={riderSettings.license} onChange={(e) => setRiderSettings({ ...riderSettings, license: e.target.value })} placeholder="e.g. B1234567" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Availability</div>
                    <div className="text-xs text-gray-400">{riderSettings.available ? "🟢 Online" : "⚫ Offline"}</div>
                  </div>
                  <Toggle value={riderSettings.available} onChange={(v) => setRiderSettings({ ...riderSettings, available: v })} color="#BAF91A" />
                </div>
                <button onClick={() => toast("Rider settings saved!")} className="self-start bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">Save</button>
              </div>
            )}

            {profile.role === "technician" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Specialization</label>
                  <select value={techSettings.specialization} onChange={(e) => setTechSettings({ ...techSettings, specialization: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]">
                    <option>Electrical</option><option>Plumbing</option><option>HVAC</option><option>Carpentry</option><option>General Maintenance</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Availability</div>
                    <div className="text-xs text-gray-400">{techSettings.available ? "🟢 Available" : "🔴 Unavailable"}</div>
                  </div>
                  <Toggle value={techSettings.available} onChange={(v) => setTechSettings({ ...techSettings, available: v })} color="#BAF91A" />
                </div>
                <button onClick={() => toast("Technician settings saved!")} className="self-start bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">Save</button>
              </div>
            )}

            {(profile.role === "admin" || !profile.role) && (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Approval Notifications</div>
                    <div className="text-xs text-gray-400">Get notified for pending approvals</div>
                  </div>
                  <Toggle value={adminSettings.approvalNotif} onChange={(v) => setAdminSettings({ ...adminSettings, approvalNotif: v })} />
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Weekly Digest</div>
                    <div className="text-xs text-gray-400">Summary email every Monday</div>
                  </div>
                  <Toggle value={adminSettings.weeklyDigest} onChange={(v) => setAdminSettings({ ...adminSettings, weeklyDigest: v })} />
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Access Level</div>
                  <div className="text-gray-900 font-semibold text-sm">Super Admin — Full System Access</div>
                </div>
                <button onClick={() => toast("Admin preferences saved!")} className="self-start bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition">Save</button>
              </div>
            )}
          </SectionCard>

          {/* 6. Account Management */}
          <SectionCard title="Account Management" icon="⚠️">
            <p className="text-sm text-gray-400 mb-5">Manage your account status. These actions are permanent and cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="flex-1 py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-sm transition"
              >
                Deactivate Account
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition"
              >
                🗑️ Delete Account
              </button>
            </div>
          </SectionCard>

        </div>

        {/* RIGHT: 1/3 */}
        <div className="xl:col-span-1 flex flex-col gap-6">

          {/* 5. Appearance Settings Moved Here */}
          <SectionCard title="Appearance Settings" icon="🎨">
            <div className="flex flex-col gap-6">
              
              {/* Theme Mode */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-0.5">Theme Mode</label>
                <div className="text-xs text-gray-400 mb-3">This setting ONLY affects UI colors (background, text, cards).</div>
                <div className="flex gap-3">
                  {[
                    { mode: "Light Mode", icon: "☀️" },
                    { mode: "Dark Mode", icon: "🌙" }
                  ].map((t) => (
                    <button
                      key={t.mode}
                      onClick={() => setAppearance({ ...appearance, theme: t.mode })}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-semibold text-sm transition ${
                        appearance.theme === t.mode 
                          ? "bg-[#101312] text-[#BAF91A] border-[#101312]" 
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span>{t.icon}</span> <span className="hidden sm:inline">{t.mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">Language</label>
                <div className="text-xs text-gray-400 mb-2">This setting ONLY affects UI text and labels.</div>
                <select 
                  value={appearance.language} 
                  onChange={(e) => setAppearance({ ...appearance, language: e.target.value })} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]"
                >
                  <option>English</option>
                  <option>Sinhala</option>
                  <option>Tamil</option>
                  <option>Spanish</option>
                </select>
              </div>

              {/* Time Format */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">Time Format</label>
                <div className="text-xs text-gray-400 mb-2">This setting ONLY affects how time is displayed.</div>
                <div className="flex gap-2">
                  {["12-hour (AM/PM)", "24-hour"].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setAppearance({ ...appearance, timeFormat: fmt })}
                      className={`flex-1 flex items-center justify-center py-2.5 rounded-xl border font-semibold text-sm transition ${
                        appearance.timeFormat === fmt 
                          ? "bg-[#101312] text-white border-[#101312]" 
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Region / Locale */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">Region / Locale</label>
                <div className="text-xs text-gray-400 mb-2">Used for date format, timezone, and regional preferences.</div>
                <select 
                  value={appearance.region} 
                  onChange={(e) => setAppearance({ ...appearance, region: e.target.value })} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAF91A]"
                >
                  <option>Sri Lanka</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Australia</option>
                </select>
              </div>
              
              <button 
                onClick={() => toast("Appearance settings saved!")} 
                className="mt-2 self-start bg-[#BAF91A] hover:bg-[#a6e60b] text-[#101312] px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition"
              >
                Save Preferences
              </button>
            </div>
          </SectionCard>

          {/* Activity Pulse */}
          <div className="bg-[#E2FF99] rounded-[32px] p-7 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-lg transition">
            <div className="absolute top-[-20%] right-[-10%] w-[140px] h-[140px] bg-white/40 blur-[40px] rounded-full pointer-events-none group-hover:bg-white/60 transition duration-500" />
            <h2 className="text-lg font-bold text-gray-900 mb-5 relative z-10 flex items-center gap-2">
              <span>📊</span> Account Summary
            </h2>
            <div className="flex flex-col gap-3 relative z-10">
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-gray-700 font-semibold text-sm">Role</span>
                <span className="font-bold text-[#101312] text-sm">{roleLabel()}</span>
              </div>
              <div className="bg-[#101312] border border-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <span className="text-gray-300 font-semibold text-sm">2FA Status</span>
                <span className={`text-sm font-bold ${twoFA ? "text-[#BAF91A]" : "text-gray-400"}`}>{twoFA ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-gray-700 font-semibold text-sm">Profile Visibility</span>
                <span className="font-bold text-[#101312] text-sm">{privacy.showEmail ? "Visible" : "Hidden"}</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#101312] rounded-[32px] p-7 shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[80%] h-full bg-[radial-gradient(ellipse_at_top_right,rgba(186,249,26,0.1),transparent_70%)] pointer-events-none" />
            <h2 className="text-lg font-bold text-white mb-2 relative z-10">System Status</h2>
            <p className="text-gray-400 text-xs mb-5 relative z-10">Live platform health overview</p>
            <div className="flex flex-col gap-3 relative z-10">
              {[
                { label: "API Server", status: "Operational", ok: true },
                { label: "Ride Service", status: "Operational", ok: true },
                { label: "Notifications", status: "Degraded", ok: false },
                { label: "Payments", status: "Operational", ok: true },
              ].map(({ label, status, ok }) => (
                <div key={label} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-white text-xs font-medium">{label}</span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${ok ? "text-[#BAF91A]" : "text-yellow-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-[#BAF91A]" : "bg-yellow-400"} inline-block`} />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🕓</span> Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {[
                { action: "Password changed", time: "2 days ago", icon: "🔑" },
                { action: "Profile updated", time: "5 days ago", icon: "✏️" },
                { action: "Logged in from new device", time: "1 week ago", icon: "💻" },
                { action: "Email verified", time: "2 weeks ago", icon: "✅" },
              ].map(({ action, time, icon }) => (
                <div key={action} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{action}</div>
                    <div className="text-xs text-gray-400">{time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Deactivate Modal ── */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            className="bg-white rounded-[28px] p-8 shadow-2xl w-full max-w-sm mx-4"
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-3xl mb-3">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Deactivate Account?</h3>
            <p className="text-sm text-gray-500 mb-6">Your account will be suspended. You can reactivate it by contacting support.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeactivateModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm transition">Cancel</button>
              <button onClick={() => { setShowDeactivateModal(false); toast("Account deactivated."); }} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-bold text-sm transition">Deactivate</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            className="bg-white rounded-[28px] p-8 shadow-2xl w-full max-w-sm mx-4"
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h3>
            <p className="text-sm text-gray-500 mb-6">This action is <strong>permanent</strong>. All your data will be deleted and cannot be recovered.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm transition">Cancel</button>
              <button onClick={() => { setShowDeleteModal(false); toast("Account deletion requested."); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm transition">Delete Forever</button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
