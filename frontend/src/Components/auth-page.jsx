import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { FaUser, FaLock, FaEnvelope, FaUserShield, FaCheckCircle, FaCar, FaWrench, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const AuthPage = ({ mode = "login" }) => {
  const [isRegister, setIsRegister] = useState(mode === "register");
  const [formData, setFormData] = useState({
    username: "",
    name: "", // Used for Tech/Rider where they might prompt 'Name' instead of 'Username'
    email: "",
    address: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    role: "", // "student", "technician", "rider", "admin"
    hasVehicle: false,
    vehicleNumber: "",
    vehicleType: "",
    workType: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNavigateToAuth = (newMode) => {
    setIsRegister(newMode === "register");
    setError("");
  };

  const handleNavigateToPage = (page) => {
    if (page === 'privacy') navigate('/info');
    else if (page === 'home') navigate('/');
    else if (page === 'register') setIsRegister(true);
    else if (page === 'login') setIsRegister(false);
    else navigate('/');
  };

  const actionItems = [
    { label: 'Login', type: 'button', variant: 'button-ghost', onClick: () => handleNavigateToAuth('login') },
    { label: 'Register', type: 'button', variant: 'button-primary', onClick: () => handleNavigateToAuth('register') },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isRegister) {
      if (!formData.role) {
        setError("Please select a platform role to register.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      // Specific validation if needed...

      // Registration logic here
      navigate("/dashboard");
      } else {
      // Login logic here
      if (!formData.role) {
        setError("Please select your platform role to login.");
        return;
      }
      
      const role = formData.role;
      if (role === "admin" || (formData.username && formData.username.toLowerCase().includes("admin"))) {
        navigate("/admin");
      } else if (role === "technician") {
        navigate("/technitian");
      } else if (role === "student") {
        navigate("/student");
      } else if (role === "rider") {
        navigate("/rider");
      } else {
        navigate("/dashboard");
      }
    }
  };

  // Helper to render role-specific inputs
  const renderRegisterFields = () => {
    // If no role selected, just show the role selector
    if (!formData.role) {
      return (
        <div className="text-center py-6 text-gray-500">
          Please select a role above to view registration fields.
        </div>
      );
    }

    switch (formData.role) {
      case "admin":
        return (
          <>
            <div className="auth-field">
              <span>Username</span>
              <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} placeholder="admin_user" />
            </div>
            <div className="auth-field">
              <span>Email</span>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="admin@university.edu" />
            </div>
            <div className="auth-field">
              <span>Password</span>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            <div className="auth-field">
              <span>Confirm Password</span>
              <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
            </div>
          </>
        );

      case "student":
        return (
          <>
            <div className="auth-field">
              <span>Username</span>
              <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} placeholder="student_name" />
            </div>
            <div className="auth-field">
              <span>Email Address</span>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="student@university.edu" />
            </div>
            <div className="auth-field">
              <span>Address / Hostel Number</span>
              <input id="address" name="address" type="text" required value={formData.address} onChange={handleChange} placeholder="Block A, Room 302" />
            </div>
            <div className="auth-field">
              <span>Contact Number</span>
              <input id="contactNumber" name="contactNumber" type="tel" required value={formData.contactNumber} onChange={handleChange} placeholder="+1 234 567 8900" />
            </div>
            
            {/* Student Vehicle Section */}
            <div className="auth-field mt-2 bg-black/5 p-4 rounded-xl border border-black/5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasVehicle"
                  checked={formData.hasVehicle}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <span className="font-bold text-[#39413d]">I have a vehicle for campus rides</span>
              </label>
              
              {formData.hasVehicle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative animate-fade-in">
                  <div className="auth-field">
                    <span>Vehicle Number</span>
                    <input id="vehicleNumber" name="vehicleNumber" type="text" required value={formData.vehicleNumber} onChange={handleChange} placeholder="ABC-1234" />
                  </div>
                  <div className="auth-field">
                    <span>Vehicle Type</span>
                    <select id="vehicleType" name="vehicleType" required value={formData.vehicleType} onChange={handleChange}>
                      <option value="" disabled>Select type...</option>
                      <option value="car">Car (4 seats)</option>
                      <option value="suv">SUV (6 seats)</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="auth-field">
                <span>Password</span>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
              </div>
              <div className="auth-field">
                <span>Confirm Password</span>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
              </div>
            </div>
          </>
        );

      case "technician":
        return (
          <>
            <div className="auth-field">
              <span>Full Name</span>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="John Builder" />
            </div>
            <div className="auth-field">
              <span>Work Type / Specialization</span>
              <select id="workType" name="workType" required value={formData.workType} onChange={handleChange}>
                <option value="" disabled>Select Specialization...</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="carpentry">Carpentry</option>
                <option value="it_support">IT / Network Support</option>
                <option value="cleaning">Cleaning & Janitorial</option>
                <option value="hvac">HVAC / AC Maintenance</option>
                <option value="other">Other Maintenance</option>
              </select>
            </div>
            <div className="auth-field">
              <span>Password</span>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
            </div>
            <div className="auth-field">
              <span>Confirm Password</span>
              <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
            </div>
          </>
        );

      case "rider":
        return (
          <>
            <div className="auth-field">
              <span>Username / Full Name</span>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Alex Rider" />
            </div>
            <div className="auth-field">
              <span>Email Address</span>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="rider@university.edu" />
            </div>
            <div className="auth-field">
              <span>Contact Number</span>
              <input id="contactNumber" name="contactNumber" type="tel" required value={formData.contactNumber} onChange={handleChange} placeholder="+1 234 567 8900" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="auth-field">
                <span>Vehicle Number</span>
                <input id="vehicleNumber" name="vehicleNumber" type="text" required value={formData.vehicleNumber} onChange={handleChange} placeholder="RIDE-001" />
              </div>
              <div className="auth-field">
                <span>Vehicle Type</span>
                <select id="vehicleType" name="vehicleType" required value={formData.vehicleType} onChange={handleChange}>
                  <option value="" disabled>Select type...</option>
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="van">Van</option>
                  <option value="bus">Shuttle Bus</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="auth-field">
                <span>Password</span>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
              </div>
              <div className="auth-field">
                <span>Confirm Password</span>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <Header navItems={[]} actionItems={actionItems} brandHref="/" />

      <main className="auth-shell">
        <div className="auth-layout">
          {/* Left Side: Features & Trust */}
          <div className="auth-intro-card">
            <p className="eyebrow">Welcome to</p>
            <h1>STAY &amp; GO</h1>
            <p className="mt-4 text-white/80">
              A smarter way to live, move, and resolve issues on campus. Access roommates, verified rides, and maintenance tickets in one place.
            </p>

            <div className="auth-signal-list">
              <div className="auth-signal-row">
                <FaCheckCircle className="text-[var(--color-accent)] mt-1 text-xl flex-shrink-0" />
                <div>
                  <p><strong>University-verified access</strong></p>
                  <p><small className="text-white/60">Strictly double opt-in trusted platform</small></p>
                </div>
              </div>
              <div className="auth-signal-row">
                <FaUserShield className="text-[var(--color-accent)] mt-1 text-xl flex-shrink-0" />
                <div>
                  <p><strong>Safer student community</strong></p>
                  <p><small className="text-white/60">Find compatible roommates securely</small></p>
                </div>
              </div>
              <div className="auth-signal-row">
                <FaLock className="text-[var(--color-accent)] mt-1 text-xl flex-shrink-0" />
                <div>
                  <p><strong>Live route tracking & privacy</strong></p>
                  <p><small className="text-white/60">Shared campus rides with 256-bit SSL</small></p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
              <p>
                {isRegister
                  ? "Join the network by filling out your role-specific details."
                  : "Sign in to access your dashboard, rides, and tickets."
                }
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
              {isRegister ? (
                <>
                  <div className="auth-field" style={{ marginBottom: formData.role ? '8px' : '0' }}>
                    <span>Select Platform Role</span>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role || ""}
                      onChange={(e) => {
                        // Reset forms when switching roles
                        const newRole = e.target.value;
                        setFormData({
                          username: "", name: "", email: "", address: "", contactNumber: "",
                          password: "", confirmPassword: "", role: newRole,
                          hasVehicle: false, vehicleNumber: "", vehicleType: "", workType: ""
                        });
                        setError("");
                      }}
                      className="border-2 border-[var(--color-accent)] shadow-sm bg-[var(--color-accent)]/5"
                    >
                      <option value="" disabled>Choose your role...</option>
                      <option value="student">🎓 Student</option>
                      <option value="technician">🔧 Technician / Maintenance</option>
                      <option value="rider">🚗 Dedicated Rider</option>
                      <option value="admin">🛡️ Administrator</option>
                    </select>
                  </div>

                  {/* Render the specific fields dynamically based on the role */}
                  {renderRegisterFields()}
                </>
              ) : (
                <>
                  <div className="auth-field" style={{ marginBottom: '8px' }}>
                    <span>Login As...</span>
                    <select
                      id="loginRole"
                      name="role"
                      required
                      value={formData.role || ""}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setFormData({ ...formData, role: newRole });
                        setError("");
                      }}
                      className="border-2 border-[var(--color-accent)] shadow-sm bg-[var(--color-accent)]/5"
                    >
                      <option value="" disabled>Choose your role...</option>
                      <option value="student">🎓 Student</option>
                      <option value="technician">🔧 Technician / Maintenance</option>
                      <option value="rider">🚗 Dedicated Rider</option>
                      <option value="admin">🛡️ Administrator</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <span>Username / Email</span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username || ""}
                      onChange={handleChange}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="auth-field">
                    <span>Password</span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  </div>
                </>
              )}

              {error && <div className="text-red-500 font-bold text-sm bg-red-50 p-3 rounded-lg border border-red-100 mt-2">{error}</div>}

              <div className="auth-form-actions">
                <button 
                  type="submit" 
                  className="button button-primary" 
                  style={{ width: '100%', marginTop: '8px' }}
                  disabled={isRegister && !formData.role}
                >
                  {isRegister ? "Register Account" : "Sign In"}
                </button>
              </div>

              <div className="auth-switch-row">
                <p>{isRegister ? "Already part of the network?" : "Don't have an account yet?"}</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError("");
                  }}
                  className="button button-ghost"
                >
                  {isRegister ? "Login instead" : "Register now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer onNavigateToPage={handleNavigateToPage} />
    </div>
  );
};

export default AuthPage;
