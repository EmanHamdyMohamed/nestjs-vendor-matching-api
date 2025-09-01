class UserDto {
  id: number;
  email: string;
  role?: string;
  clientId: number | null;
}

export class LoginResponseDto {
  token: string;
  user: UserDto;
  role: number;
  clientId: number | null;
  tokenType: string;
}
