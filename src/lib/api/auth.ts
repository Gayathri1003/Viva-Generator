import { supabase } from '../supabase';
import { User } from '../../types';
import bcrypt from 'bcryptjs';

export async function login(username: string, password: string, role: 'admin' | 'teacher' | 'student'): Promise<User> {
  // Admin login
  if (role === 'admin') {
    if (username !== 'admin' || password !== 'admin123') {
      throw new Error('Invalid admin credentials');
    }
    return {
      id: '1',
      username: 'admin',
      role: 'admin',
      name: 'Administrator',
    };
  }

  // Teacher or Student login
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('role', role)
    .single();

  if (error || !user) {
    throw new Error('User not found');
  }

  if (!user.has_set_password) {
    return {
      id: user.id,
      username: user.username,
      role: role,
      name: user.name,
      requiresPasswordSetup: true,
    };
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id,
    username: user.username,
    role: role,
    name: user.name,
  };
}

export async function setPassword(username: string, newPassword: string, role: 'teacher' | 'student'): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from('users')
    .update({
      password_hash: hashedPassword,
      has_set_password: true,
    })
    .eq('username', username)
    .eq('role', role);

  if (error) {
    throw new Error('Failed to set password');
  }
}