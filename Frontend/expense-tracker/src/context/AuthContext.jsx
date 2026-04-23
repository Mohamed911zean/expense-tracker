import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/pathApi';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, validate the stored token by hitting /user-info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axiosInstance
      .get(API_PATHS.AUTH.GET_USER_INFO)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('verdant_user', JSON.stringify(res.data));
      })
      .catch(() => {
        // Token invalid or expired — clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('verdant_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('verdant_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      fullName: name,
      email,
      password,
      profileImgUrl: '',
    });
    // Auto-login after successful registration
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('verdant_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
  <div className="flex flex-col items-center gap-6">
    
    {/* Logo / Spinner */}
    <div className="relative w-14 h-14">
  <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
</div>

    {/* Text */}
    <div className="text-center">
      <p className="text-on-surface font-semibold tracking-wide">
        Loading Verdant
      </p>

      {/* dots animation */}
      <div className="flex justify-center gap-1 mt-2">
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
      </div>
    </div>

  </div>
</div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
