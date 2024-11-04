import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      name: 'nathan',
      email: '123@gmail.com',
      password: '123',
    },
  ];

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find(user => user.name === name);
  }
}
