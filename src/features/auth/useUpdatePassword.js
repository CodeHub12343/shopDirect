import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword as updatePasswordService } from "../../services/apiAuth";
import { useToast } from "../../contexts/ToastContext";

export function useUpdatePassword() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const { mutate: changePassword, isLoading } = useMutation({
    mutationFn: updatePasswordService,

    onSuccess: () => {
      success("Password updated successfully!");
      // Invalidate user cache so any stale auth info refreshes
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Optional: force logout so they must re-login with new password
      // logoutUser().then(() => window.location.assign("/login"));
    },

    onError: (err) => {
      showError(err.message);
    },
  });

  return { changePassword, isLoading };
}
