"use client";

import { Download, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadButtonProps {
  apiEndpoint: string; // API endpoint to fetch data from
  filename: string; // Name of the exported file
  label?: string;
}

export const DownloadButton = ({
  apiEndpoint,
  filename,
  label,
}: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Fetch data from the API
      const response = await fetch(apiEndpoint);
      const data = await response.json();

      // Convert the fetched data to JSON format
      const jsonData = JSON.stringify(data, null, 2);

      // Create a Blob from the JSON data
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the Object URL
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Error fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant={"cyan"}
      size={"sm"}
    >
      {loading ? (
        <>
          <Loader className="h-4 w-4 mr-2 animate-spin" /> Downloading...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" /> {label || "Export"}
        </>
      )}
    </Button>
  );
};
