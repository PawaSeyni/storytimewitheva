import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { BookOpen, BookMarked, Check } from "lucide-react";

export default function BookStatusButton({ book }) {
  const [status, setStatus] = useState(null);
  const [progressId, setProgressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) loadStatus(u.email);
    }).catch(() => {});
  }, [book.id]);

  const loadStatus = async (email) => {
    try {
      const records = await base44.entities.UserProgress.filter({
        user_email: email,
        item_id: book.id,
        item_type: "book"
      });
      if (records.length > 0) {
        setStatus(records[0].status);
        setProgressId(records[0].id);
      }
    } catch {}
  };

  const setBookStatus = async (newStatus) => {
    if (!user) return;
    setLoading(true);
    try {
      if (progressId) {
        if (status === newStatus) {
          // Toggle off
          await base44.entities.UserProgress.delete(progressId);
          setStatus(null);
          setProgressId(null);
        } else {
          await base44.entities.UserProgress.update(progressId, { status: newStatus });
          setStatus(newStatus);
        }
      } else {
        const record = await base44.entities.UserProgress.create({
          user_email: user.email,
          item_id: book.id,
          item_type: "book",
          status: newStatus,
          item_title: book.title,
          item_emoji: book.cover_emoji || "📖"
        });
        setStatus(newStatus);
        setProgressId(record.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex gap-2 mt-2">
      <Button
        size="sm"
        disabled={loading}
        onClick={() => setBookStatus("read")}
        className={`rounded-full text-xs px-3 py-1 h-auto transition-all ${
          status === "read"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-100 hover:bg-green-100 text-gray-600"
        }`}
      >
        <Check className="w-3 h-3 mr-1" />
        Read
      </Button>
      <Button
        size="sm"
        disabled={loading}
        onClick={() => setBookStatus("want_to_read")}
        className={`rounded-full text-xs px-3 py-1 h-auto transition-all ${
          status === "want_to_read"
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-100 hover:bg-blue-100 text-gray-600"
        }`}
      >
        <BookMarked className="w-3 h-3 mr-1" />
        Want to Read
      </Button>
    </div>
  );
}