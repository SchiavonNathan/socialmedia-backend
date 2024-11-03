import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      name: 'john',
      email: '123',
      pass: 'changeme',
    },
  ];

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find(user => user.name === name);
  }
}
