import { createContext, useContext, useReducer, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logoutUser } from "../services/apiAuth";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const actionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  RESET_ERROR: "RESET_ERROR",
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case actionTypes.RESET_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function checkAuth() {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      try {
        console.log("Checking authentication...");
        const user = await getCurrentUser();
        console.log("Current user data:", user);
        dispatch({ type: actionTypes.LOGIN, payload: user });
      } catch (error) {
        console.log('Auth check failed:', error);
        console.log('Error details:', error.message, error.response?.status);
        dispatch({ type: actionTypes.LOGOUT });
        // Don't show error toast for initial auth check failures
      }
    }
    checkAuth();
  }, []);

  const login = (user) => {
    dispatch({ type: actionTypes.LOGIN, payload: user });
  };

  const logout = async () => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      await logoutUser();
      dispatch({ type: actionTypes.LOGOUT });

      // Force refetch of current user to confirm logout and clear stale data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Also clear all other cached queries
      queryClient.clear();
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  const resetError = () => dispatch({ type: actionTypes.RESET_ERROR });

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login,
        logout,
        resetError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
} 