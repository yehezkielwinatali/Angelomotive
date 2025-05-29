"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Loader2, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { processCarImageWithAI } from "@/actions/cars";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import carFormSchema from "@/lib/schema";

interface AIFormProps {
  setUploadedImages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const AIForm: React.FC<AIFormProps> = ({ setUploadedImages, setActiveTab }) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [uploadedAiImage, setUploadedAiImage] = useState<File | null>(null);

  const onAiDrop = useCallback((acceptedFiles: File[]) => {
    const file: File | undefined = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadedAiImage(file);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target && (e.target as FileReader).result;
      if (typeof result === "string") {
        setImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
      maxFiles: 1,
      multiple: false,
    });

  const {
    isLoading: processImageLoading,
    fn: processImageFn,
    data: processImageResult,
    error: processImageError,
  } = useFetch(processCarImageWithAI);

  const processWithAI = async () => {
    if (!uploadedAiImage) {
      toast.error("Please upload an image first");
      return;
    }
    try {
      const result = await processImageFn(uploadedAiImage);
      console.log("AI result", result);
      if (result.success) {
        toast.success("Car details extracted successfully!");
      } else {
        toast.error(result.error || "Failed to extract car details");
      }
    } catch (error) {
      console.error("Error processing image with AI:", error);
      toast.error("An error occurred while processing the image");
    }
  };
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });
  useEffect(() => {
    if (processImageResult?.success) {
      const carDetails = processImageResult.data;

      // Update form with AI results
      setValue("make", carDetails.make);
      setValue("model", carDetails.model);
      setValue("year", carDetails.year.toString());
      setValue("color", carDetails.color);
      setValue("bodyType", carDetails.bodyType);
      setValue("fuelType", carDetails.fuelType);
      setValue("price", carDetails.price);
      setValue("mileage", carDetails.mileage);
      setValue("transmission", carDetails.transmission);
      setValue("description", carDetails.description);

      // Add the image to the uploaded images
      if (uploadedAiImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const target = e.target as FileReader | null;
          if (target && target.result) {
            setUploadedImages((prev) => [...prev, target.result]);
          }
        };
        reader.readAsDataURL(uploadedAiImage);
      }

      toast.success("Successfully extracted car details", {
        description: `Detected ${carDetails.year} ${carDetails.make} ${
          carDetails.model
        } with ${Math.round(carDetails.confidence * 100)}% confidence`,
      });

      // Switch to manual tab for the user to review and fill in missing details
      setActiveTab("manual");
    }
  }, [processImageResult, setValue, uploadedAiImage]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Car Details Extraction</CardTitle>
          <CardDescription>
            Upload an image of a car and let AI extract its details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Car preview"
                    className="max-h-56 mt-4 max-w-full object-contain mb-4"
                  />
                  <div className="flex gap-4 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null);
                        setUploadedAiImage(null);
                      }}
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={processWithAI}
                      disabled={processImageLoading}
                      size="sm"
                    >
                      {false ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Extract Details
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  {...getAiRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition mt-2 ${
                    imageError ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <input {...getAiInputProps()} />
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Drag & drop or click to upload multiple images
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      (JPG, PNG, WebP, max 5MB each)
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">How it Works</h3>
              <ol className="space-y-1 text-sm text-gray-600 list-decimal pl-4">
                <li>Upload a clear photo of the vehicle.</li>
                <li>
                  Click "Extract Details" to analyze the image using Gemini AI.
                </li>
                <li>Review the extracted information carefully.</li>
                <li>Manually fill in any missing or incorrect details.</li>
                <li>Submit the form to add the car to your inventory.</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-medium text-amber-800 mb-1">
                Tips for Best Results
              </h3>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• Use high-quality, well-lit images.</li>
                <li>• Ensure the full vehicle is visible in the photo.</li>
                <li>• Include multiple angles for better accuracy.</li>
                <li>
                  • Always double-check the AI-extracted data before submission.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AIForm;
