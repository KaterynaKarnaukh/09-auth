import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
 
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
 
async function getCookieHeader() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}
 
export const getMe = async () => {
  const headers = await getCookieHeader();
  return api.get<User>("/users/me", { headers });
};
 
export const checkSession = async () => {
  const headers = await getCookieHeader();
  return api.get<{ success: boolean }>("/auth/session", { headers });
};
 
export const fetchNotes = async (params?: FetchNotesParams) => {
  const headers = await getCookieHeader();
  return api.get<FetchNotesResponse>("/notes", { params, headers });
};
 
export const fetchNoteById = async (id: string) => {
  const headers = await getCookieHeader();
  return api.get<Note>(`/notes/${id}`, { headers });
};
 
// Alias used in @modal page.tsx — returns data directly for prefetchQuery
export const fetchServerNoteById = async (id: string): Promise<Note> => {
  const headers = await getCookieHeader();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
};