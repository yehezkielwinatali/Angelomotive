"use client";
import React from "react";
import { Input } from "./ui/input";
import { Camera, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isImageSearchActive, setIsImageSearchActive] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<any | "">("");
  const [searchImage, setSearchImage] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const router = useRouter();

  const handleTextSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };
  const handleImageSearch = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first.");
      return;
    }
  };
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB.");
        return;
      }
      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully!");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Error uploading image. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };
  const { isDragReject, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
      maxFiles: 1,
    });

  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Enter your desired brand, model, or use our advanced AI Image tool..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm"
          />
          <div className="absolute right-[100px]">
            <Camera
              size={35}
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className="cursor-pointer rounded-xl p-1.5"
              style={{
                background: isImageSearchActive
                  ? "linear-gradient(135deg, #f0f0f0, #d0d0d0)"
                  : "linear-gradient(135deg, #ffffff, #e0e0e0)",
                color: isImageSearchActive ? "#000" : "#666",
              }}
            />
          </div>
          <Button
            className="absolute right-2 rounded-full cursor-pointer"
            type="submit"
          >
            Search
          </Button>
        </div>
      </form>
      {isImageSearchActive && (
        <div className="mt-6">
          <form onSubmit={handleImageSearch}>
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Car Preview"
                    className="h-40 object-contain mb-4"
                  />
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setImagePreview("");
                      setSearchImage(null);
                      toast.info("Image removed successfully!");
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500 mb-2">
                      {isDragActive && !isDragReject
                        ? "Leave the file here to upload"
                        : "Drag and drop an image here, or click to select"}
                    </p>
                    {isDragReject && (
                      <p className="text-red-500">
                        Unsupported file type. Please upload an image.
                      </p>
                    )}
                    <p className="text-gray-400 text-sm">
                      Supports: JPG, PNG (max : 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {imagePreview && (
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isUploading}
              >
                {isUploading ? "Uploading" : "Search with this image"}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
