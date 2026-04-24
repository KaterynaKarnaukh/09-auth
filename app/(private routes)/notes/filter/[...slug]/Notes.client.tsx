"use client";
 
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";
 
interface NotesClientProps {
  tag: string;
}
 
export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
 
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: search || undefined,
        tag: tag !== "All" ? tag : undefined,
      }),
    placeholderData: keepPreviousData,
  });
 
  const debouncedSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, 500);
 
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            debouncedSearch(e.target.value)
          }
        />
 
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={(nextPage: number) => setPage(nextPage)}
          />
        )}
 
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
 
      {isLoading ? (
        <p>Loading, please wait...</p>
      ) : (
        <div
          style={{
            opacity: isPlaceholderData ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <NoteList notes={data?.notes ?? []} />
        </div>
      )}
    </div>
  );
}