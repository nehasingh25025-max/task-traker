import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  LayoutDashboard,
  User,
  Mail,
  Shield,
  Lock,
  ArrowRight,
} from "lucide-react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("Sign In");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tasker",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_URL = "https://task-manager-app-production-8089.up.railway.app/api/auth";

    try {
      if (activeTab === "Register") {

        await axios.post(
          `${API_URL}/register`,
          formData
        );

        alert(
          "Registration Successful"
        );

        setActiveTab("Sign In");

      } else {

        const res = await axios.post(
          `${API_URL}/login`,
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "tasktrack_active_user",
          JSON.stringify(res.data.user)
        );

        navigate("/dashboard");
      }

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Backend Server Error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-6 font-sans">

      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl">

        <div className="flex items-center gap-4 mb-8 justify-center">

          <div className="bg-[#00d2d3] p-2.5 rounded-xl">
            <LayoutDashboard
              size={24}
              className="text-black"
            />
          </div>

          <div className="text-left">
            <h1 className="text-2xl font-black text-white italic">
              Task Track
            </h1>

            <p className="text-[8px] text-[#00d2d3] font-black uppercase tracking-[0.2em] mt-1">
              ETHARA.AI PLATFORM
            </p>
          </div>
        </div>

        <div className="flex bg-[#0b0e14] p-1.5 rounded-xl border border-gray-800 mb-8">

          <button
            type="button"
            onClick={() => setActiveTab("Sign In")}
            className={`flex-1 py-3 rounded-lg text-sm font-bold border-none cursor-pointer ${
              activeTab === "Sign In"
                ? "bg-[#00d2d3] text-black"
                : "bg-transparent text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("Register")}
            className={`flex-1 py-3 rounded-lg text-sm font-bold border-none cursor-pointer ${
              activeTab === "Register"
                ? "bg-[#00d2d3] text-black"
                : "bg-transparent text-gray-500"
            }`}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 text-left"
        >

          {activeTab === "Register" && (

            <div className="space-y-2">

              <label className="text-[10px] font-bold text-gray-400 uppercase">
                FULL NAME
              </label>

              <div className="relative flex items-center">

                <User
                  size={18}
                  className="absolute left-4 text-gray-500"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Ankur"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#00d2d3]"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">

            <label className="text-[10px] font-bold text-gray-400 uppercase">
              EMAIL ADDRESS
            </label>

            <div className="relative flex items-center">

              <Mail
                size={18}
                className="absolute left-4 text-gray-500"
              />

              <input
                type="email"
                name="email"
                placeholder="ankur@ethara.ai"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#00d2d3]"
              />
            </div>
          </div>

          {activeTab === "Register" && (

            <div className="space-y-2">

              <label className="text-[10px] font-bold text-[#00d2d3] uppercase">
                SYSTEM ROLE
              </label>

              <div className="relative flex items-center">

                <Shield
                  size={18}
                  className="absolute left-4 text-[#00d2d3]"
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#00d2d3] appearance-none cursor-pointer font-bold"
                >
                  <option value="tasker">
                    Member (Tasker)
                  </option>

                  <option value="admin">
                    Admin (Lead/QA)
                  </option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-2">

            <label className="text-[10px] font-bold text-gray-400 uppercase">
              PASSWORD
            </label>

            <div className="relative flex items-center">

              <Lock
                size={18}
                className="absolute left-4 text-gray-500"
              />

              <input
                type="password"
                name="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#00d2d3]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00d2d3] text-black font-black py-4 rounded-xl border-none hover:scale-[1.02] cursor-pointer text-sm uppercase tracking-widest"
          >
            {activeTab === "Register"
              ? "CREATE ACCOUNT"
              : "SECURE SIGN IN"}

            <ArrowRight
              size={18}
              className="inline ml-2"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;