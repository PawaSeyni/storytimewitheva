import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ColoringDemo from "./ColoringDemo";
import StoryBuilderDemo from "./StoryBuilderDemo";
import CharacterWorkshopDemo from "./CharacterWorkshopDemo";
import PuzzleAdventuresDemo from "./PuzzleAdventuresDemo";
import CraftCornerDemo from "./CraftCornerDemo";
import AdventureJournalDemo from "./AdventureJournalDemo";
import BingoDemo from "./BingoDemo";

export default function ActivityModal({ activity, open, onClose, language }) {
  if (!activity) return null;

  const getDemoContent = () => {
    switch (activity.activity_type) {
      case "coloring":
        return <ColoringDemo language={language} />;
      case "creative":
        return <StoryBuilderDemo language={language} />;
      case "puzzles":
        return <PuzzleAdventuresDemo language={language} />;
      case "worksheet":
        return <CharacterWorkshopDemo language={language} />;
      case "craft":
        return <CraftCornerDemo language={language} />;
      case "games":
        // Check activity title to determine which game to show
        if (activity.title?.toLowerCase().includes('bingo')) {
          return <BingoDemo language={language} />;
        }
        return <AdventureJournalDemo language={language} />;
      default:
        return (
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{activity.icon_emoji}</div>
            <p className="text-lg">{activity.description}</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white -m-6 mb-0 p-8 rounded-t-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="text-6xl mb-4 text-center">{activity.icon_emoji}</div>
          <DialogTitle className="text-3xl text-center">{activity.title}</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {getDemoContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}