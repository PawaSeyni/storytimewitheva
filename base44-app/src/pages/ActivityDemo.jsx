
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "@/entities/Activity";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import Breadcrumb from "../components/Breadcrumb";
import ColoringDemo from "../components/ColoringDemo";
import StoryBuilderDemo from "../components/StoryBuilderDemo";
import CharacterWorkshopDemo from "../components/CharacterWorkshopDemo";
import PuzzleAdventuresDemo from "../components/PuzzleAdventuresDemo";
import CraftCornerDemo from "../components/CraftCornerDemo";
import AdventureJournalDemo from "../components/AdventureJournalDemo";
import BingoDemo from "../components/BingoDemo";

export default function ActivityDemo() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLanguage = () => {
      if (window.currentLanguage) {
        setLanguage(window.currentLanguage);
      }
    };
    
    checkLanguage();
    window.addEventListener('languagechange', checkLanguage);
    
    return () => window.removeEventListener('languagechange', checkLanguage);
  }, []);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    setLoading(true);
    setError(null);
    
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');
    
    if (!activityId) {
      setError("No activity ID provided");
      setLoading(false);
      return;
    }
    
    try {
      const activities = await Activity.list();
      const foundActivity = activities.find(a => a.id === activityId);
      
      if (!foundActivity) {
        setError("Activity not found");
      } else {
        setActivity(foundActivity);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
      setError("Failed to load activity");
    }
    
    setLoading(false);
  };

  const getDemoContent = () => {
    if (!activity) return null;

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
        if (activity.title?.toLowerCase().includes('bingo')) {
          return <BingoDemo language={language} />;
        }
        return <AdventureJournalDemo language={language} />;
      default:
        return (
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4" aria-hidden="true">{activity.icon_emoji}</div>
            <p className="text-lg">{activity.description}</p>
          </div>
        );
    }
  };

  const goBack = () => {
    navigate(createPageUrl("Activities"));
  };

  const breadcrumbItems = [
    { label: "Activities", href: createPageUrl("Activities") },
    { label: activity?.title || "Loading...", href: "#" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center" role="status" aria-live="polite">
          <div className="text-6xl mb-4 animate-bounce" aria-hidden="true">✨</div>
          <p className="text-xl text-gray-600">Loading activity...</p>
          <span className="sr-only">Loading activity content</span>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center max-w-md" role="alert">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Activity Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">{error || "The activity you're looking for doesn't exist."}</p>
          <Button 
            onClick={goBack} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Compact Header */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Button
            onClick={goBack}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-3 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-500"
            aria-label="Back to all activities"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Activities
          </Button>
          
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="text-center mt-4">
            <div className="text-5xl mb-3" aria-hidden="true">{activity.icon_emoji}</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{activity.title}</h1>
            <p className="text-sm md:text-base opacity-90 max-w-2xl mx-auto leading-relaxed">{activity.description}</p>
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getDemoContent()}
      </div>
    </div>
  );
}
