import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
 
interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}
 
export async function generateMetadata({
  params,
}: FilteredNotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";
  const isAll = tag === "all";
 
  const title = isAll ? "All Notes | NoteHub" : `${tag} Notes | NoteHub`;
  const description = isAll
    ? "Browse all your personal notes in NoteHub."
    : `Browse your notes filtered by tag: ${tag}.`;
 
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://your-app-url.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}
 
export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const currentTag = slug?.[0] ?? "all";
 
  const queryClient = new QueryClient();
 
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", currentTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        tag: currentTag !== "all" ? currentTag : undefined,
      }).then((res) => res.data),
  });
 
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}