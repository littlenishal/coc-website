
'use client';

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={shareEvent}>
      <Share2 className="h-4 w-4 mr-2" />
      Share Event
    </Button>
  );
}
