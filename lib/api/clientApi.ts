import { api } from "./api";
import type { User } from "@/types/user";
import type { Note, CreateNoteData } from "@/types/note";
 
interface AuthCredentials {
  email: string;
  password: string;
}
 
interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}
 
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
 
// Auth
export const register = (data: AuthCredentials) =>
  api.post<User>("/auth/register", data);
 
export const login = (data: AuthCredentials) =>
  api.post<User>("/auth/login", data);
 
export const logout = () => api.post("/auth/logout");
 
export const checkSession = () =>
  api.get<{ success: boolean }>("/auth/session");
 
// Users
export const getMe = () => api.get<User>("/users/me");
 
export const updateMe = (data: Partial<Pick<User, "username">>) =>
  api.patch<User>("/users/me", data);
 
// Notes — returns data directly (not AxiosResponse)
export const fetchNotes = async (params?: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};
 
export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};
 
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
};
 
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};