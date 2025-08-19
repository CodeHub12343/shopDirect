import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/apiProduct";

const useGetCategories = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return { categories, isLoading, error };
};

export default useGetCategories;
