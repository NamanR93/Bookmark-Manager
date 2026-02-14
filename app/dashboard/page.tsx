"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bookmark } from "@/types/bookmark";
import { Tabs } from "@/components/ui/tabs";
import { WavyBackground } from "@/components/ui/wavy-background";



export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user first
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        return user.id;
      }
      return null;
    };

    const initializeRealtime = async () => {
      const currentUserId = await getCurrentUser();
      if (!currentUserId) return;

      // Fetch initial bookmarks
      await fetchBookmarks();

      // Set up real-time subscription with user_id filter
      const channel = supabase
        .channel(`user-bookmarks-${currentUserId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${currentUserId}`,
          },
          (payload) => {
            const newBookmark = payload.new as Bookmark;
            setBookmarks((prev) => {
              // Avoid duplicates
              if (prev.some((b) => b.id === newBookmark.id)) {
                return prev;
              }
              return [newBookmark, ...prev];
            });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${currentUserId}`,
          },
          (payload) => {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${currentUserId}`,
          },
          (payload) => {
            const updatedBookmark = payload.new as Bookmark;
            setBookmarks((prev) =>
              prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
            );
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initializeRealtime();
  }, []);

  const fetchBookmarks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data as Bookmark[]);
    }
  };

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) {
      alert("Please fill in both Title and URL.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title: title.trim(),
        url: url.trim(),
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    // Clear inputs - the real-time subscription will handle adding to the list
    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    // Optimistic delete - remove from state immediately
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Delete error:", error);
      // Revert the deletion if there's an error
      await fetchBookmarks();
    }
  };

  const tabs = [
    {
      title: "My Bookmarks",
      value: "bookmarks",
      content: (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No bookmarks yet. Add one to get started!</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm font-medium hover:text-blue-400 transition-colors truncate block"
                    title={bookmark.title}
                  >
                    {bookmark.title}
                  </a>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {bookmark.url}
                  </p>
                </div>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="flex-shrink-0 px-3 py-2 bg-red-600/80 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      title: "Add Bookmark",
      value: "add",
      content: (
        <div className="space-y-3">
          <input
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addBookmark()}
          />

          <input
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="URL (https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addBookmark()}
          />

          <button
            onClick={addBookmark}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Add Bookmark
          </button>
        </div>
      ),
    },
  ];

  return (
    <WavyBackground className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Bookmark Manager
          </h1>
          <p className="text-gray-300 text-sm">Save and organize your favorite links</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-1 shadow-2xl">
          <Tabs
            tabs={tabs}
            containerClassName="justify-center bg-white/5 rounded-t-xl p-4 border-b border-white/10"
            tabClassName="px-4 py-2 rounded-lg bg-white/0 hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
            activeTabClassName="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            contentClassName="bg-white/5 p-6 rounded-b-xl"
          />
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Changes sync across all your open tabs in real-time</p>
        </div>
      </div>
    </WavyBackground>
  );
}
