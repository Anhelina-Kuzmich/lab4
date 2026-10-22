import { ServiceProvider, http } from "@/shared/api";
import type {
  Creatable,
  Deletable,
  Editable,
  Readable,
} from "@/shared/api";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UsersResponse,
} from "../model/types";

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll(params: {
    limit?: number;
    skip?: number;
    query?: string;
  } = {}): Promise<{ items: User[]; total: number }> {
    const { limit = 10, skip = 0, query = "" } = params;
    const search = query.trim();
    const endpoint = search
      ? `/users/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
      : `/users?limit=${limit}&skip=${skip}`;
    const response = await http<UsersResponse>(endpoint);
    return { items: response.users, total: response.total };
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`);
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>("/users/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: number): Promise<void> {
    await http<User>(`/users/${id}`, { method: "DELETE" });
  }
}

export function getUserService(): UserService {
  return ServiceProvider.get<UserService>("users");
}
