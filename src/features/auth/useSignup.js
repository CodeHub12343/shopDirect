import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { signup } from "../../services/apiAuth";
import { useToast } from "../../contexts/ToastContext";

function useSignup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { mutate: signupUser, isLoading } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // Update authentication context with user data
      queryClient.setQueryData(["user"], data.data.user);
      login(data.data.user);
      console.log(data.data.user);

      // Show success message
      success("Account created successfully! Welcome aboard!");

      // Navigate to dashboard
      navigate("/dashboard");
    },
    onError: (err) => {
      showError(err.message || "Failed to create account");
      console.error("Signup error:", err);
    },
  });

  return { signupUser, isLoading };
}

export default useSignup;
