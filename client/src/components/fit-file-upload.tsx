import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function FitFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('fitFile', file);
      
      // Simulate progress for better UX
      setUploadProgress(10);
      
      const response = await fetch('/api/sessions/upload-fit', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(80);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      setUploadProgress(100);
      return response.json();
    },
    onSuccess: (data) => {
        toast({
          title: "FIT File Uploaded Successfully!",
          description: `Your Garmin session has been imported with ${data.distance.toFixed(2)}km distance and ${data.duration} minutes duration.`,
        });
      
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/recent"] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process FIT file. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.name.toLowerCase().endsWith('.fit')) {
      uploadMutation.mutate(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select a .fit file from your Garmin device.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Upload className="w-5 h-5 text-ocean-blue" />
          <span>Upload Garmin FIT File</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Import your kayaking session data directly from Garmin Connect. Download your session as a .fit file and upload it here.
          </p>
          
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {uploadProgress < 100 ? "Processing FIT file..." : "Upload complete!"}
                </span>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-ocean-blue bg-water-light"
                : "border-gray-300 hover:border-ocean-blue"
            } ${uploadMutation.isPending ? "opacity-50 pointer-events-none" : ""}`}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".fit"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={uploadMutation.isPending}
            />
            
            <div className="space-y-3">
              {uploadProgress === 100 ? (
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              ) : (
                <FileText className="w-12 h-12 text-gray-400 mx-auto" />
              )}
              
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {uploadProgress === 100 ? "Session Imported!" : "Drop your .fit file here"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {uploadProgress === 100 
                    ? "Your Garmin session data has been successfully imported."
                    : "Or click to browse and select your Garmin FIT file"
                  }
                </p>
              </div>
              
              {uploadProgress === 0 && (
                <Button
                  variant="outline"
                  className="text-ocean-blue border-ocean-blue hover:bg-water-light"
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Processing..." : "Choose File"}
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>How to get your FIT file:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Open Garmin Connect on your computer or phone</li>
              <li>Find your kayaking session</li>
              <li>Click the gear icon and select "Export to FIT"</li>
              <li>Upload the downloaded .fit file here</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}