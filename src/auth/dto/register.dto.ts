export class RegisterDto {
  email: string;
  password: string;
}

export class CreateUserDto {
  email: string;
  password: string;
  roleId: number;
  companyName: string;
  contactEmail: string;
}
