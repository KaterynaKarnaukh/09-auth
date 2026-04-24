"use client";
 
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import type { CreateNoteData, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";
 
export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
 
  const mutation = useMutation({
    mutationFn: (newNote: CreateNoteData) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
    onError: (error) => {
      console.error("Error creating note:", error);
    },
  });
 
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };
 
  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as NoteTag;
    mutation.mutate({ title, content, tag });
  };
 
  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          placeholder="Title"
        />
      </div>
 
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          rows={8}
          value={draft.content}
          onChange={handleChange}
          placeholder="Content"
        />
      </div>
 
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>
 
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
 