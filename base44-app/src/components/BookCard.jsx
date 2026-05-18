import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BookStatusButton from "./BookStatusButton";

const languageFlags = {
  english: "🇺🇸",
  spanish: "🇪🇸",
  french: "🇫🇷"
};

export default function BookCard({ book, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border-0">
        <div 
          className="h-48 flex items-center justify-center text-7xl bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400"
        >
          {book.cover_emoji || "📚"}
        </div>
        <CardHeader className="space-y-3">
          <Badge className="w-fit bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-0">
            {book.age_range}
          </Badge>
          <div className="flex gap-2">
            {book.languages?.map((lang) => (
              <span key={lang} className="text-xl">
                {languageFlags[lang]}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {book.title}
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {book.description}
          </p>
          <Button 
            onClick={onClick}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold rounded-full shadow-md"
          >
            Discover More ✨
          </Button>
          <BookStatusButton book={book} />
        </CardContent>
      </Card>
    </motion.div>
  );
}