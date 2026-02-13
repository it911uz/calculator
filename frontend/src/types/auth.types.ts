export type LoginFormData = {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
};
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
}

export interface LoginPayload {
  username: string;
  password: string;
}
export interface IUserMe {
  username: string;
}