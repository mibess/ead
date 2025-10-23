export interface UserSignupRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  cpf: string;
  imageUrl: string;
}

export interface UserSignupResponse extends UserSignupRequest {
  userId: string;
}
