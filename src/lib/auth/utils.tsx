import { getItem, removeItem, setItem } from '@/lib/storage';

const TOKEN = 'token';
const USER = 'user_data';

export type TokenType = {
  access: string;
  refresh: string;
};

export type UserType = {
  dni: string;
  name?: string;
  email?: string;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export function removeToken() {
  removeItem(TOKEN);
  removeItem(USER);
}
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);

export const getUser = () => getItem<UserType>(USER);
export const setUser = (value: UserType) => setItem<UserType>(USER, value);
