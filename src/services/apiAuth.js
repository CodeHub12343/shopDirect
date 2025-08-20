import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://shopdirect-api.onrender.com/api/v4",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function signup({ email, password, passwordConfirm, name }) {
  try {
    const res = await api.post("/users/sign-up", {
      email,
      password,
      passwordConfirm,
      name,
    });

    console.log("Signup response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || err.message || "Error during signup"
    );
  }
}

export async function login({ email, password }) {
  try {
    const res = await api.post("/users/login", {
      email,
      password,
    });

    console.log("Login response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || err.message || "Error during login"
    );
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.get("/users/me");
    const data = res.data.data.data;
    console.log("Current user data:", data);
    return data;
  } catch (err) {
    console.error("Get current user error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || "Error getting current user"
    );
  }
}

export async function logoutUser() {
  try {
    const res = await api.get("/users/logout");
    console.log("Logout response:", res.data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error during logout");
  }
}

export async function updateMeWithAvatar({ email, fullName, avatar }) {
  const formData = new FormData();
  if (email) formData.append("email", email);
  if (fullName) formData.append("fullName", fullName);
  if (avatar) formData.append("avatar", avatar); // match Multer field

  try {
    const res = await api.patch("/users/updateMe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error updating profile");
  }
}

export async function updatePassword({
  passwordCurrent,
  password,
  passwordConfirm,
}) {
  try {
    const res = await api.patch("/users/updateMyPassword", {
      passwordCurrent,
      password,
      passwordConfirm,
    });

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error updating password");
  }
}
