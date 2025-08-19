import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMeWithAvatar } from "../../services/apiAuth";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { login: setAuthUser } = useAuth();
  const { success, error: showError } = useToast();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateMeWithAvatar,

    // optimistic update (optional)
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const previous = queryClient.getQueryData(["user"]);
      queryClient.setQueryData(["user"], (old) => ({ ...old, ...newData }));
      return { previous };
    },

    onError: (err, _newData, context) => {
      showError(err.response?.data?.message || err.message);
      if (context?.previous) {
        queryClient.setQueryData(["user"], context.previous);
      }
    },

    onSuccess: ({ data: { user } }) => {
      success("Profile updated successfully");

      // 1️⃣ Update React Query cache so any useQuery(['user']) sees it immediately
      queryClient.setQueryData(["user"], user);

      // 2️⃣ Also update your AuthContext so any context-driven UI re-renders
      setAuthUser(user);

      // 3️⃣ (Optional) refetch if you want to ensure fresh data
      // queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return { updateUser, isUpdating };
}
