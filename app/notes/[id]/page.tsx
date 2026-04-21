
import NotePreviewClient from "@/app/@modal/(.)notes/[id]/NotePreview.client";
import { Metadata } from "next";

export async function getNoteById(id: string) {
  const res = await fetch(`https://your-api-url.com/notes/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const note = await getNoteById(params.id); 

  const title = note ? `${note.title} | NoteHub` : "Нотатка";
  const description = note ? note.content.substring(0, 150) : "Деталі нотатки";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://your-app-url.com/notes/${params.id}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

 
export default function InterceptedNotePage() {
  return <NotePreviewClient />;
}