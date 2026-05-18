import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivityCard({ activity }) {
  const handleDownload = () => {
    if (activity.file_url) {
      window.open(activity.file_url, '_blank');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" />
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{activity.icon_emoji || "🎨"}</div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {activity.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            {activity.description}
          </p>
          {activity.age_range && (
            <p className="text-sm text-center text-gray-500 font-medium">
              Ages: {activity.age_range}
            </p>
          )}
          <Button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white font-semibold rounded-full shadow-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Activity
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}