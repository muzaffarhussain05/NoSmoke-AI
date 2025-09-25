import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = "http://localhost:8000";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  // ---------- STATE ----------
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // ---------- LOCALSTORAGE: REGISTERED USERS ----------
 useEffect(() => {
  const savedUser = localStorage.getItem('ainosmoke_current_user');
  if (savedUser) {
    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      localStorage.removeItem('ainosmoke_current_user');
    }
  }
  setAuthLoading(false);  // ✅ finished checking
}, []);

  useEffect(() => {
    localStorage.setItem('ainosmoke_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // ---------- LOCALSTORAGE: CURRENT USER ----------
  useEffect(() => {
    const savedUser = localStorage.getItem('ainosmoke_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('ainosmoke_current_user');
      }
    }
  }, []);

  // ---------- FETCH INITIAL DATA ----------
  useEffect(() => {
    fetch(`${API_BASE_URL}/students`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error fetching students:", err));

    fetch(`${API_BASE_URL}/database`)
      .then(res => res.json())
      .then(data => setDetections(data))
      .catch(err => console.error("Error fetching detections:", err));
  }, []);

  // ---------- CALCULATE STATS ----------
  useEffect(() => {
    if (students.length && detections.length) {
      const totalDetections = detections.length;
      const smokingDetections = detections.filter(d => d.smokingDetected).length;
      const facesIdentified = detections.filter(d => d.faceDetected).length;
      const totalStudents = students.length;

      setStats({
        totalDetections,
        smokingDetections,
        facesIdentified,
        totalStudents,
        uptime: "99.8%",
        activeCameras: 8,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [students, detections]);

  // ---------- AUTH ----------
 const signUp = async (email, password, name) => {
  setIsLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Backend returns 400 for email already exists
      throw new Error(data.detail || "Signup failed");
    }

    // Success: set user
    setUser(data);
    localStorage.setItem("ainosmoke_current_user", JSON.stringify(data));
    setIsLoading(false);

    return { success: true, user: data };
  } catch (err) {
    setIsLoading(false);
    // Return error to the UI
    return { success: false, error: err.message };
  }
};


  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      setUser(data);
      localStorage.setItem("ainosmoke_current_user", JSON.stringify(data));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("ainosmoke_current_user");
  };

  // ---------- STUDENTS ----------
  const addStudent = async (student) => {
    try {
      const newStudent = {
        ...student,
        enrollmentDate: new Date().toISOString().split("T")[0],
        status: "Active",
      };

      const res = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (!res.ok) throw new Error("Failed to add student");

      const data = await res.json();
      setStudents(prev => [...prev, data]); // use backend response
      return true;
    } catch (err) {
      console.error("Error adding student:", err);
      return false;
    }
  };

  const updateStudent = async (_id, studentData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      if (!res.ok) throw new Error("Failed to update student");

      setStudents(prev => prev.map(s => (s._id === _id ? { ...s, ...studentData } : s)));
      return true;
    } catch (err) {
      console.error("Error updating student:", err);
      return false;
    }
  };

  const deleteStudent = async (_id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      setStudents(prev => prev.filter(s => s._id !== _id));
      return true;
    } catch (err) {
      console.error("Error deleting student:", err);
      return false;
    }
  };

  // ---------- DETECTIONS ----------
  const addDetection = async (detection) => {
    try {
      const newDetection = { ...detection, timestamp: new Date().toISOString() };

      const res = await fetch(`${API_BASE_URL}/database`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDetection),
      });

      if (!res.ok) throw new Error("Failed to add detection");

      const data = await res.json();
      setDetections(prev => [data, ...prev]); // trust backend response
      return true;
    } catch (err) {
      console.error("Error adding detection:", err);
      return false;
    }
  };

  // ---------- CONTEXT VALUE ----------
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
    authLoading,
    stats,
    registeredUsers: registeredUsers.length,
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
