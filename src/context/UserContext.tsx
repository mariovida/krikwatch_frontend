import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the shape of the user object
interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface UserContextType {
  user: User | null; // Null when no user is logged in
  setUser: (user: User | null) => void; // Function to update the user
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component to wrap your app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data from localStorage when the app loads
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the stored JSON and set the user
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the UserContext in other components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
