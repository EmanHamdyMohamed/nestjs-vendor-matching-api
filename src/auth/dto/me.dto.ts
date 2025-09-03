import { ClientDto } from 'src/client/dto/client.dto';

export class MeDtoResponse {
  id: number;
  email: string;
  role?: string;
  client?: ClientDto | null;
}
