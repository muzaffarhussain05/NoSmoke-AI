import React from "react";
import {
  Mail,
  Github,
  Linkedin,
  Shield,
  Camera,
  Brain,
  Database,
  Globe,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Project Lead & AI Researcher",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=150&h=150&fit=crop&crop=face",
      email: "sarah.johnson@university.edu",
      linkedin: "sarah-johnson-ai",
    },
    {
      name: "Ahmed Hassan",
      role: "Computer Vision Engineer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      email: "ahmed.hassan@university.edu",
      github: "ahmed-cv-engineer",
    },
    {
      name: "Emily Chen",
      role: "Full-Stack Developer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      email: "emily.chen@university.edu",
      github: "emily-fullstack",
    },
    {
      name: "Marcus Rodriguez",
      role: "Security Systems Specialist",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      email: "marcus.rodriguez@university.edu",
      linkedin: "marcus-security",
    },
  ];

  const technologies = [
    {
      name: "YOLOv8",
      description: "Object detection for cigarette identification",
      icon: Camera,
    },
    {
      name: "OpenCV",
      description: "Computer vision and image processing",
      icon: Brain,
    },
    { name: "React", description: "Frontend user interface", icon: Globe },
    {
      name: "Local Storage",
      description: "Client-side data management",
      icon: Smartphone,
    },
    {
      name: "JavaScript",
      description: "Interactive web application logic",
      icon: Database,
    },
    {
      name: "Face Recognition",
      description: "Facial identification and matching",
      icon: Shield,
    },
  ];
  const features = [
    "Real-time smoking detection using advanced AI algorithms",
    "Facial recognition for individual identification",
    "Automated alert system with notifications",
    "Comprehensive logging and reporting system",
    "Administrative dashboard for system management",
    "Database management for student records",
    "Export capabilities for compliance reporting",
    "Multi-camera support for comprehensive coverage",
  ];
  return (
    <>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-bold">
              About AinoSmoke
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              An innovative AI-powered solution for detecting and preventing
              smoking violations in educational institutions and public spaces.
            </p>
          </div>

          {/* Project Vision */}

          <div className="bg-gray-800 border-gray-700 mb-8 sm:mb-12 px-3 py-5 rounded-2xl">
            <div className="mb-2">
               <div className="flex items-center text-green-400 text-lg sm:text-xl">
               <Shield className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Project Vision
               </div>
            </div>
            <div className="space-y-4"> <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                AinoSmoke represents the future of intelligent surveillance
                systems, combining cutting-edge artificial intelligence with
                practical security needs. Our mission is to create safer,
                smoke-free environments while maintaining privacy and ethical
                standards.
              </p>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                By leveraging advanced computer vision technologies and machine
                learning algorithms, AinoSmoke provides real-time detection
                capabilities that surpass traditional surveillance methods,
                offering both accuracy and efficiency in monitoring compliance
                with smoking policies.
              </p></div>
          </div>
          



          {/* Key Features */}
          <div className="bg-gray-800 border-gray-700 mb-8 sm:mb-12 px-3 py-5 rounded-2xl">
            <div className="mb-3">
                <div className="flex items-center text-blue-400 text-lg sm:text-xl">
                <AlertTriangle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Key Features
                </div>
            </div>
            <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400  mt-2  sm:mt-3  rounded-full flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm sm:text-base md:pt-1">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        

          {/* Technologies Used */}
          <div className="bg-gray-800 border-gray-700 mb-8 sm:mb-12  px-3 py-5 rounded-2xl">
            <div className="mb-6">
              <div className="flex items-center text-purple-400 text-lg sm:text-xl">
                <Brain className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Technologies Used
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-700 rounded-lg"
                  >
                    <tech.icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white mb-1 text-sm sm:text-base font-medium">
                        {tech.name}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-gray-800 border-gray-700 mb-8 sm:mb-12  px-3 py-5 rounded-2xl">
            <div className="mb-6"> 
              <div className="flex items-center text-yellow-400 text-lg sm:text-xl">
                <Shield className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Our Team
              </div>
            </div>
            <div>   
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="text-center flex flex-col items-center ">
                    
                    <div className="h-22 w-22  rounded-full center mb-5 mt-2" style={{ backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
> 
                        
                    </div>
                    <h3 className="text-white mb-1 text-sm sm:text-base font-medium">
                      {member.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3">
                      {member.role}
                    </p>
                    <div className="flex justify-center space-x-2">
                      <button
                        
                        className="border-gray-600 border bg-white text-black rounded-md hover:text-gray-300 hover:bg-gray-700 p-2"
                      >
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4   " />
                      </button>
                      {member.github && (
                        <button
                        
                          className="border-gray-600 border bg-white text-black rounded-md hover:text-gray-300 hover:bg-gray-700  p-2"
                        >
                          <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      )}
                      {member.linkedin && (
                        <button
                         
                          className="border-gray-600  border bg-white text-black rounded-md hover:text-gray-300 hover:bg-gray-700   p-2"
                        >
                          <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800 border-gray-700  px-3 py-5 rounded-2xl">
            <div className="mb-6">
              <div className="flex items-center text-green-400 text-lg sm:text-xl">
                <Mail className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Contact & Support
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-white mb-3 text-base sm:text-lg font-medium">
                    Project Information
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                    <p>
                      <strong>University:</strong> AI Research Institute
                    </p>
                    <p>
                      <strong>Department:</strong> Computer Science &
                      Engineering
                    </p>
                    <p>
                      <strong>Project Duration:</strong> 12 months
                    </p>
                  
                  </div>
                </div>
                <div>
                  <h3 className="text-white mb-3 text-base sm:text-lg font-medium">
                    Get in Touch
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                    <p>
                      <strong>Email:</strong> ainosmoke@university.edu
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p>
                      <strong>Office:</strong> CS Building, Room 304
                    </p>
                    <p>
                      <strong>Hours:</strong> Mon-Fri, 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-xs sm:text-sm">
                  This project is developed for educational and research
                  purposes. For commercial licensing or collaboration
                  opportunities, please contact our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
