import React from "react";
import { Link } from "react-router-dom";
import { Camera, Users, AlertTriangle, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useEffect } from "react";
const Home = () => {
  const { stats, refreshStats } = useApp();
  useEffect(() => {
    refreshStats();
  }, []);
  const displayStats = [
    {
      title: "Total Detections",
      value: stats?.totalDetections?.toString() || "0",
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      title: "Faces Identified",
      value: stats?.facesIdentified?.toString() || "0",
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Active Cameras",
      value: stats?.activeCameras?.toString() || "8",
      icon: Camera,
      color: "text-green-400",
    },
    {
      title: "Uptime",
      value: stats?.uptime || "99.9%",
      icon: Clock,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-5xl lg:text-4xl mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-bold">
            NoSmoke AI
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto">
            AI-Powered Smoking Violation Detection System
          </p>
          <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Advanced computer vision technology that automatically detects
            smoking violations in real-time, identifies individuals, and
            maintains comprehensive logs for security and compliance purposes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link to="/detection" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto cursor-pointer flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3">
                <Camera className="mr-2 h-5 w-5" />
                Start Detection
              </button>
            </Link>
            <Link to="/history" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white rounded-xl cursor-pointer border-gray-600 text-black-300 hover:bg-gray-800 hover:text-white px-6 sm:px-8 py-3">
                View Logs
              </button>
            </Link>
          </div>
        </div>
        <div className="mb-12 sm:mb-16">
          <h2 className="md:text-3xl sm:text-2xl mb-6 sm:mb-8 text-center text-gray-200">
            Live System Statistics
          </h2>
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ">
            {displayStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors rounded-xl px-4 py-4"
              >
                <div className="flex flex-row items-center justify-between space-y-0  mb-4 pb-2">
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors py-5 px-4 rounded-3xl">
            <div>
              <div className="flex items-center text-green-400 text-lg">
              <Camera className="mr-2 h-5 w-5" />
              Real-time Detection
              </div>
              <div className="mt-3">
              <p className="text-gray-300 text-sm sm:text-base">
              Advanced AI algorithms continuously monitor camera feeds to detect smoking violations instantly.
            </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800  border-gray-700 border hover:bg-gray-700 transition-colors py-5 px-4 rounded-3xl">
            <div>
              <div className="flex items-center  text-blue-400 text-lg">
              <Users className="mr-2 h-5 w-5" />
                Face Recognition
              </div>
              <div className="mt-3">
              <p className="text-gray-300 text-sm sm:text-base">
              Identify individuals from a database of registered faces to track violations and ensure accountability.
            </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border-gray-700 border hover:bg-gray-700 transition-colors py-5 px-4 rounded-3xl">
            <div>
              <div className="flex items-center text-red-400 text-lg">
              <AlertTriangle className="mr-2 h-5 w-5" />
                Automated Alerts
              </div>
              <div className="mt-3">
              <p className="text-gray-300 text-sm sm:text-base">
              A Automatic notifications via email or SMS when violations are detected, enabling rapid response.
            </p>
              </div>
            </div>
          </div>
          </div>
          

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-green-400 text-lg">
              <Camera className="mr-2 h-5 w-5" />
              Real-time Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm sm:text-base">
              Advanced AI algorithms continuously monitor camera feeds to detect smoking violations instantly.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-400 text-lg">
              <Users className="mr-2 h-5 w-5" />
              Face Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm sm:text-base">
              Identify individuals from a database of registered faces to track violations and ensure accountability.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400 text-lg">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Automated Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm sm:text-base">
              Automatic notifications via email or SMS when violations are detected, enabling rapid response.
            </p>
          </CardContent>
        </Card>
      </div> */}
      </div>
    </div>
  );
};
export default Home;
