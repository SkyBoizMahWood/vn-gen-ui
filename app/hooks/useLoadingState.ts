import { useNavigation } from "@remix-run/react";

export function useLoadingState(excludePaths: string[] = []) {
  const navigation = useNavigation();
  
  const isLoading = navigation.state === "loading" && 
    !excludePaths.some(path => navigation.formAction === path);

  return isLoading;
} 