
import React, { useState, useEffect } from "react";
import Header from '../Components/header';
import Footer from '../Components/footer';

// SVG icon components
const CheckIcon = () => (
  <svg
    className="w-7 h-7 text-[#A4FF4F]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CircleCheckIcon = () => (
  <svg
    className="w-7 h-7 text-[#A4FF4F]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

const TicketIcon = () => (
  <svg
    className="w-7 h-7 text-[#A4FF4F]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8" />
  </svg>
);

// Feature cards data
const features = [
  { icon: <CheckIcon />, text: "Secure, university-verified sign up" },
  { icon: <CircleCheckIcon />, text: "Find rides & roommates easily" },
  { icon: <TicketIcon />, text: "24/7 support for all users" },
];

// Role options
const roles = [
  { value: "", label: "Select Role" },
  { value: "student", label: "Student" },
  { value: "driver", label: "Driver" },
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
];

// Dynamic Student Form
function StudentForm({ values, onChange }) {
  return (
    <>
      <label className="block font-semibold mb-1 mt-4">Full name</label>
      <input
        name="name"
        placeholder="Enter your full name"
        value={values.name || ""}
        onChange={onChange}
        className="input w-full mb-2"
      />
      <label className="block font-semibold mb-1">University email</label>
      <input
        name="email"
        placeholder="name@university.edu"
        value={values.email || ""}
        onChange={onChange}
        className="input w-full mb-2"
      />
      <label className="block font-semibold mb-1">Address</label>
      <input
        name="address"
        placeholder="Address"
        value={values.address || ""}
        onChange={onChange}
        className="input w-full mb-2"
      />
      <label className="block font-semibold mb-1">Age</label>
      <input
        name="age"
        type="number"
        placeholder="Age"
        value={values.age || ""}
        onChange={onChange}
        className="input w-full mb-2"
      />
      <label className="block mt-2 mb-2">
        <input
          type="checkbox"
          name="hasVehicle"
          checked={values.hasVehicle || false}
          onChange={(e) =>
            onChange({ target: { name: "hasVehicle", value: e.target.checked, type: "checkbox" } })
          }
        />{" "}
        Has Vehicle?
      </label>
      {values.hasVehicle && (
        <>
          <label className="block font-semibold mb-1">Vehicle Type</label>
          <input
            name="vehicleType"
            placeholder="Vehicle Type"
            value={values.vehicleType || ""}
            onChange={onChange}
            className="input w-full mb-2"
          />
          <label className="block font-semibold mb-1">Vehicle Number</label>
          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={values.vehicleNumber || ""}
            onChange={onChange}
            className="input w-full mb-2"
          />
          <label className="block font-semibold mb-1">License Number</label>
          <input
            name="licenseNumber"
            placeholder="License Number"
            value={values.licenseNumber || ""}
            onChange={onChange}
            className="input w-full mb-2"
          />
        </>
      )}
    </>
  );
}

// Main Register Component
export default function Register() {
  const [form, setForm] = useState({
    role: "",
    name: "",
    email: "",
    address: "",
    age: "",
    hasVehicle: false,
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
  });

  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration submitted!");
    console.log(form);
  };

  return (
    <div className="min-h-screen font-[Inter,sans-serif] bg-linear-to-br from-[#e8ffe0] to-[#f8fafc] flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start py-12">
        <div
          className={`w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden transition-all duration-700 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left Panel */}
          <div className="relative md:w-1/2 bg-[#111111] flex flex-col justify-center items-center px-8 py-12 md:py-0">
            <div
              className="hidden md:block absolute right-0 top-0 h-full w-16 bg-[#111111] z-10"
              style={{
                clipPath: "ellipse(60% 100% at 100% 50%)",
                boxShadow: "8px 0 24px 0 #111111",
              }}
            />
            <div className="relative z-20 w-full">
              <h2 className="text-white font-bold text-3xl md:text-5xl mb-4 leading-tight">
                Create your <span className="text-[#A4FF4F]">STAY & GO</span> account in a trusted flow.
              </h2>
              <p className="text-[#CCCCCC] text-base md:text-lg mb-8">
                Join a secure, student-first platform for rides, roommates, and more.
              </p>
              <div className="space-y-5">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-[#181818] rounded-xl p-4 shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    <span>{f.icon}</span>
                    <span className="text-white text-base">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="md:w-1/2 bg-white flex flex-col justify-center px-8 py-12">
            <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit} autoComplete="off">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Register to <span className="text-[#A4FF4F]">STAY & GO</span>
              </h3>
              <p className="text-gray-500 mb-6 text-base">Fill in your details to get started.</p>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4FF4F] focus:border-[#A4FF4F] transition"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>


              {/* Admin-specific Form */}
              {form.role === "admin" && (
                <>
                  <label className="block font-semibold mb-1 mt-4">Username</label>
                  <input
                    name="username"
                    placeholder="Enter username"
                    value={form.username || ""}
                    onChange={handleChange}
                    className="input w-full mb-2"
                  />
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={form.email || ""}
                    onChange={handleChange}
                    className="input w-full mb-2"
                  />
                  <label className="block font-semibold mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={form.password || ""}
                    onChange={handleChange}
                    className="input w-full mb-2"
                  />
                  <label className="block font-semibold mb-1">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={form.confirmPassword || ""}
                    onChange={handleChange}
                    className="input w-full mb-2"
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full bg-[#A4FF4F] text-[#111111] font-bold py-3 rounded-lg shadow-md hover:bg-[#8be63b] transition text-lg mt-4"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}