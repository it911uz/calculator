import { useMutation } from "@tanstack/react-query";
import { loginAction } from "@/api/actions/auth-action/auth.action";
import { LoginPayload } from "@/types";



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
