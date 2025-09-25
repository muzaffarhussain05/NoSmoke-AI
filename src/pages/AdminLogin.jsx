import { useState } from "react";
import { Shield, Eye, EyeOff, UserPlus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signOut, signUp, stats } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signIn(credentials.email, credentials.password);
      if (success) {
        toast.success("Successfully logged in as administrator");
        navigate("/");
      } else {
        toast.error(
          "Invalid credentials. Please try admin@ainosmoke.com / admin123"
        );
      }
    } catch (e) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const result = await signUp(
      credentials.email,
      credentials.password,
      name
    );

    if (result.success) {
      toast.success("Account created successfully! Welcome to AinoSmoke.");
      navigate("/");
    } else {
      // Show backend-provided error (e.g., Email already exists)
      toast.error(result.error || "Failed to create account. Please try again.");
    }
  } catch (error) {
    toast.error(error.message || "Sign up failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully logged out");
    navigate("/");
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-green-400">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Administrative controls and system management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* System Status */}
            <div className="bg-gray-800 border-gray-700 hover:border-gray-500 px-4 py-5 rounded-2xl border">
              <div className="mb-4">
                <div className="text-green-400 text-lg sm:text-xl">
                  System Status
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Detection Service
                  </span>
                  <span className="text-green-400 text-sm sm:text-base">
                    🟢 Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Database
                  </span>
                  <span className="text-green-400 text-sm sm:text-base">
                    🟢 Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Total Detections
                  </span>
                  <span className="text-blue-400 text-sm sm:text-base font-semibold">
                    {stats?.totalDetections || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">
                    Total Students
                  </span>
                  <span className="text-green-400 text-sm sm:text-base font-semibold">
                    {stats?.totalStudents || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 border-gray-700 hover:border-gray-500 px-4 py-5 rounded-2xl border">
              <div className="mb-4">
                <div className="text-blue-400 text-lg sm:text-xl">
                  Quick Actions
                </div>
              </div>
              <div className="space-y-3 text-white">
                <button className="w-full rounded-lg py-1 hover:border hover:border-gray-600 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base cursor-pointer">
                  Clear All Logs
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-sm  sm:text-base rounded-lg py-1 hover:border hover:border-gray-600 cursor-pointer ">
                  Export Database
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base rounded-lg py-1 hover:border hover:border-gray-600 cursor-pointer ">
                  System Backup
                </button>
                <button className="w-full rounded-lg py-1 hover:border hover:border-gray-600  bg-orange-600 hover:bg-orange-700 text-sm sm:text-base cursor-pointer">
                  Update Settings
                </button>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-gray-800 border-gray-700 hover:border-gray-500 px-4 py-5 rounded-2xl border">
              <div className="mb-4">
                <div className="text-red-400 text-lg sm:text-xl">
                  Recent Alerts
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs sm:text-sm">
                  <div className="text-red-400 font-medium">
                    High violation rate detected
                  </div>
                  <div className="text-gray-400">Camera 3 - 2 hours ago</div>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="text-yellow-400 font-medium">
                    Camera maintenance required
                  </div>
                  <div className="text-gray-400">Camera 1 - 1 day ago</div>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="text-blue-400 font-medium">
                    New face registered
                  </div>
                  <div className="text-gray-400">Database - 2 days ago</div>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-gray-800 border-gray-700 md:col-span-2 xl:col-span-2 hover:border-gray-500 px-4 py-5 rounded-2xl border">
              <div className="mb-4">
                <div className="text-white text-lg sm:text-xl">
                  System Configuration
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="">
                    <label className="text-gray-300 text-sm mr-3">
                      Detection Sensitivity
                    </label>
                    <input
                      value="85%"
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white text-sm px-2 py-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mr-3">
                      Alert Threshold
                    </label>
                    <input
                      value="3 violations/hour"
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white text-sm  px-2 py-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mr-3">
                      Auto-cleanup Period
                    </label>
                    <input
                      value="30 days"
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white text-sm  px-2 py-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mr-3">
                      Backup Frequency
                    </label>
                    <input
                      value="Daily at 2:00 AM"
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white text-sm  px-2 py-1 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-gray-800 border-gray-700 hover:border-gray-500 px-4 py-5 rounded-2xl border  ">
              <div className="mb-4">
                <div className="text-white text-lg sm:text-xl">Account</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm sm:text-base font-medium truncate">
                      {user.user_metadata?.name || "Administrator"}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full text-sm sm:text-base bg-red-800 text-white cursor-pointer  py-1 rounded-lg hover:bg-red-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md ">
        <div className="bg-gray-800 border-gray-700 flex flex-col items-center py-6 rounded-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" />
            </div>
            <div className="text-xl sm:text-2xl text-white">
              {isSignUp ? "Create Admin Account" : "Admin Login"}
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              {isSignUp
                ? "Register as system administrator"
                : "Access administrative controls"}
            </p>
            {!isSignUp && (
              <p className="text-xs text-green-400 mt-2">
                Demo: admin@ainosmoke.com / admin123
              </p>
            )}
          </div>
          <div className="w-[320px]">
            <form
              onSubmit={isSignUp ? handleSignUp : handleLogin}
              className="space-y-4  mt-4  "
            >
              {isSignUp && (
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-gray-300 text-sm mr-3">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white text-sm px-2 py-1 rounded-md "
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="flex flex-col gap-1 justify-center">
                <label htmlFor="email" className="text-gray-300 text-sm">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white text-sm px-2 py-1 rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="">
                <label htmlFor="password" className="text-gray-300 text-sm ">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white pr-10 text-sm w-full px-2 py-1 rounded-md mt-1 "
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base flex items-center justify-center py-1 rounded-2xl text-black cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    {isSignUp ? (
                      <UserPlus className="mr-2 h-4 w-4" />
                    ) : (
                      <Shield className="mr-2 h-4 w-4" />
                    )}
                    {isSignUp ? "Create Account" : "Login"}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
