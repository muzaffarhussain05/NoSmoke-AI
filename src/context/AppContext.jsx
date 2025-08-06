import { createContext, useContext, useState, useEffect } from 'react';

// Mock data for students
const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    rollNo: "CS001",
    department: "Computer Science",
    email: "john.doe@university.edu",
    phone: "+1-555-0123",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    enrollmentDate: "2023-09-01",
    status: "Active"
  },
  {
    id: 2,
    name: "Jane Smith",
    rollNo: "CS002",
    department: "Computer Science",
    email: "jane.smith@university.edu",
    phone: "+1-555-0124",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face",
    enrollmentDate: "2023-09-01",
    status: "Active"
  },
  {
    id: 3,
    name: "Mike Johnson",
    rollNo: "EE001",
    department: "Electrical Engineering",
    email: "mike.johnson@university.edu",
    phone: "+1-555-0125",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    enrollmentDate: "2023-09-01",
    status: "Active"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    rollNo: "ME001",
    department: "Mechanical Engineering",
    email: "sarah.wilson@university.edu",
    phone: "+1-555-0126",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    enrollmentDate: "2023-09-01",
    status: "Active"
  }
];

// Mock data for detections
const mockDetections = [
  {
    id: 1,
    timestamp: "2024-08-02T10:30:00Z",
    name: "John Doe",
    rollNo: "CS001",
    department: "Electrical Engineering",
    email: "mike.johnson@university.edu",
    phone: "+1-555-0125",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    smokingDetected: true,
    faceDetected: true,
    confidence: 0.95,
    actionTaken: "Notification sent to admin"
  },
  {
    id: 2,
    timestamp: "2024-08-02T09:45:00Z",
    name: "Unknown",
    rollNo: "N/A",
    department:"Computr",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
    smokingDetected: true,
    faceDetected: false,
    confidence: 0.87,
    actionTaken: "Security alerted"
  },
  {
    id: 3,
    timestamp: "2024-08-02T08:20:00Z",
    name: "Jane Smith",
    rollNo: "CS002",
    department:"Computr",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face",
    smokingDetected: false,
    faceDetected: true,
    confidence: 0.92,
    actionTaken: "Logged for attendance"
  },
  {
    id: 4,
    timestamp: "2024-08-01T16:10:00Z",
    name: "Mike Johnson",
    rollNo: "EE001",
    department:"Computr",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    smokingDetected: true,
    faceDetected: true,
    confidence: 0.89,
    actionTaken: "Warning issued"
  },
  {
    id: 5,
    timestamp: "2024-08-01T14:35:00Z",
    name: "Unknown",
    rollNo: "N/A",
    department:"Computr",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    smokingDetected: true,
    faceDetected: false,
    confidence: 0.83,
    actionTaken: "Investigation pending"
  }
];

// Default admin user
const defaultAdmin = {
  id: "admin-1",
  email: "admin@ainosmoke.com",
  user_metadata: {
    name: "System Administrator",
    role: "admin"
  }
};

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState(mockStudents);
  const [detections, setDetections] = useState(mockDetections);
  const [stats, setStats] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([defaultAdmin]);

  // Load saved users from localStorage on init
  useEffect(() => {
    const savedUsers = localStorage.getItem('ainosmoke_users');
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        setRegisteredUsers(users);
      } catch (error) {
        console.warn('Failed to load saved users:', error);
      }
    }
  }, []);

  // Save users to localStorage whenever registeredUsers changes
  useEffect(() => {
    localStorage.setItem('ainosmoke_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Check for saved session on init
  useEffect(() => {
    const savedUser = localStorage.getItem('ainosmoke_current_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        localStorage.removeItem('ainosmoke_current_user');
      }
    }
  }, []);

  // Calculate stats from current data
  const calculateStats = () => {
    const now = new Date();
    const totalDetections = detections.length;
    const smokingDetections = detections.filter(d => d.smokingDetected).length;
    const facesIdentified = detections.filter(d => d.faceDetected).length;
    const totalStudents = students.length;
    
    return {
      totalDetections,
      smokingDetections,
      facesIdentified,
      totalStudents,
      uptime: "99.8%",
      activeCameras: 8,
      lastUpdated: now.toISOString()
    };
  };

  useEffect(() => {
    setStats(calculateStats());
  }, [students, detections]);

  const signIn = async (email, password) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in registered users
    const existingUser = registeredUsers.find(u => u.email === email);
    
    if (existingUser) {
      // For demo purposes, any password works for existing users
      // In a real app, you'd verify the password hash
      setUser(existingUser);
      localStorage.setItem('ainosmoke_current_user', JSON.stringify(existingUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('ainosmoke_current_user');
  };

  const signUp = async (email, password, name) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Validate input
      if (!email || !password || !name) {
        setIsLoading(false);
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        setIsLoading(false);
        throw new Error('Password must be at least 6 characters long');
      }

      // Check if user already exists
      const existingUser = registeredUsers.find(u => u.email === email);
      if (existingUser) {
        setIsLoading(false);
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase().trim(),
        user_metadata: {
          name: name.trim(),
          role: "admin"
        },
        created_at: new Date().toISOString()
      };
      
      // Add to registered users
      setRegisteredUsers(prev => [...prev, newUser]);
      
      // Log them in immediately
      setUser(newUser);
      localStorage.setItem('ainosmoke_current_user', JSON.stringify(newUser));
      
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const addStudent = async (student) => {
    const newStudent = {
      ...student,
      id: students.length + 1,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: "Active"
    };
    
    setStudents(prev => [...prev, newStudent]);
    return true;
  };

  const updateStudent = async (rollNo, studentData) => {
    setStudents(prev => prev.map(s => 
      s.rollNo === rollNo ? { ...s, ...studentData } : s
    ));
    return true;
  };

  const deleteStudent = async (rollNo) => {
    setStudents(prev => prev.filter(s => s.rollNo !== rollNo));
    return true;
  };

  const addDetection = async (detection) => {
    const newDetection = {
      ...detection,
      id: detections.length + 1,
      timestamp: new Date().toISOString()
    };
    
    setDetections(prev => [newDetection, ...prev]);
    return true;
  };

  const refreshStats = async () => {
    setStats(calculateStats());
  };

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
    signUp,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    detections,
    addDetection,
    stats,
    refreshStats,
    registeredUsers: registeredUsers.length
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};