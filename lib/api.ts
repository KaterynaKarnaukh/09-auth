import axios from "axios";
import type { CreateNoteData, Note } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
 
const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});
 
export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };
   if (search) params.search = search;
  if (tag && tag !== "all") params.tag = tag;

   const response = await instance.get<FetchNotesResponse>("/notes", {
    params,
   });
  return response.data;
};
 
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await instance.get<Note>(`/notes/${id}`);
  return response.data;
};
 
export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const response = await instance.post<Note>("/notes", note);
  return response.data;
};
 
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
};