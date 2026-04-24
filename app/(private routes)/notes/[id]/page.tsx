import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
 
interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}
 
export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data: note } = await fetchNoteById(id);
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 150),
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.slice(0, 150),
        url: `https://your-app-url.com/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note | NoteHub",
      description: "Note details page.",
    };
  }
}
 
export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
 
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id).then((res) => res.data),
  });
 
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
 