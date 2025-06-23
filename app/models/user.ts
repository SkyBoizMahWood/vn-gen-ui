import { db } from "~/db/neo4j";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Will be hashed
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

interface UserValidation {
  username: string;
  email: string;
  password: string;
}

export class UserModel {
  static async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const session = db.session();
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await session.run(
        `
        CREATE (u:User {
          id: apoc.create.uuid(),
          username: $username,
          email: $email,
          password: $password,
          role: $role,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN u
        `,
        { ...user, password: hashedPassword }
      );
      
      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const session = db.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {email: $email})
        RETURN u
        `,
        { email }
      );
      
      if (result.records.length === 0) {
        return null;
      }
      
      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  }

  static async findById(id: string): Promise<User | null> {
    const session = db.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $id})
        RETURN u
        `,
        { id }
      );
      
      if (result.records.length === 0) {
        return null;
      }
      
      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const session = db.session();
    try {
      const setClause = Object.keys(data)
        .map(key => `u.${key} = $${key}`)
        .join(', ');
      
      const result = await session.run(
        `
        MATCH (u:User {id: $id})
        SET ${setClause}, u.updatedAt = datetime()
        RETURN u
        `,
        { id, ...data }
      );
      
      if (result.records.length === 0) {
        return null;
      }
      
      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  }

  static async delete(id: string): Promise<boolean> {
    const session = db.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $id})
        DELETE u
        RETURN count(u) as deleted
        `,
        { id }
      );
      
      return result.records[0].get('deleted').toNumber() > 0;
    } finally {
      await session.close();
    }
  }
  
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static validateUserData(data: UserValidation): string[] {
    const errors: string[] = [];
    
    if (!data.username || data.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    
    if (!data.email || !data.email.includes('@')) {
      errors.push('Invalid email format');
    }
    
    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    return errors;
  }
} 