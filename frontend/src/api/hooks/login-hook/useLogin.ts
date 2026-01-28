import { useMutation } from "@tanstack/react-query";
import { LoginPayload } from "@/types";
import { loginAction } from "@/api/auth/login.api";



export function useLogin() {
  return useMutation<void, Error, LoginPayload>({
    mutationFn: async ({ username, password }) => {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      await loginAction(formData);
    },
  });
}
