import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ActivityStatusButton({ activity }) {
  const [completed, setCompleted] = useState(false);
  const [progressId, setProgressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) loadStatus(u.email);
    }).catch(() => {});
  }, [activity.id]);

  const loadStatus = async (email) => {
    try {
      const records = await base44.entities.UserProgress.filter({
        user_email: email,
        item_id: activity.id,
        item_type: "activity"
      });
      if (records.length > 0) {
        setCompleted(records[0].status === "completed");
        setProgressId(records[0].id);
      }
    } catch {}
  };

  const toggleCompleted = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (progressId) {
        await base44.entities.UserProgress.delete(progressId);
        setCompleted(false);
        setProgressId(null);
      } else {
        const record = await base44.entities.UserProgress.create({
          user_email: user.email,
          item_id: activity.id,
          item_type: "activity",
          status: "completed",
          item_title: activity.title,
          item_emoji: activity.icon_emoji || "🎨"
        });
        setCompleted(true);
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
    <Button
      size="sm"
      disabled={loading}
      onClick={toggleCompleted}
      className={`rounded-full text-xs px-3 py-1 h-auto transition-all ${
        completed
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-gray-100 hover:bg-green-100 text-gray-600"
      }`}
    >
      <CheckCircle2 className="w-3 h-3 mr-1" />
      {completed ? "Completed!" : "Mark Complete"}
    </Button>
  );
}