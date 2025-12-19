import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  // In-memory user store for demonstration
  private users: Map<string, User & { password: string }> = new Map();

  constructor(private jwtService: JwtService) {
    // Create a demo user
    this.createDemoUser();
  }

  private async createDemoUser() {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    this.users.set('demo@collabspace.com', {
      id: '1',
      email: 'demo@collabspace.com',
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      password: hashedPassword,
      isOnline: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.get(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    if (this.users.has(registerDto.email)) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = {
      id: String(this.users.size + 1),
      email: registerDto.email,
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: hashedPassword,
      isOnline: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(registerDto.email, newUser);

    const { password: _, ...user } = newUser;
    return this.login({ email: user.email, password: registerDto.password });
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = Array.from(this.users.values()).find(
        (u) => u.id === payload.sub,
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        username: user.username,
      };
      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      const { password: _, ...userWithoutPassword } = user;
      return {
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find((u) => u.id === id);
    if (!user) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }
}
