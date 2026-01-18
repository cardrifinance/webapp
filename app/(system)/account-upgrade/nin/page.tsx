"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload, CheckCircle, IdCard } from "lucide-react";

export default function NINVerificationPage() {
  const router = useRouter();

  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);

  const [ninImage, setNinImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setNinImage(file);
    setUploading(true);
    setUploadProgress(0);

    // 🔁 Simulated upload progress (replace with real API upload)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = async () => {
    if (nin.length !== 11 || uploadProgress !== 100) return;

    setLoading(true);

    // 🔗 Call backend NIN verification API
    // send `nin` + uploaded image reference
    await new Promise((res) => setTimeout(res, 1500));

    router.push("/account/upgrade/level-1");
  };

  return (
    <div className="min-h-screen bg-[#F6F4FA] mt-8">
      <div className="flex flex-col items-center px-4 mt-10">
        <h1 className="text-2xl md:text-3xl font-bold text-[#07052A] font-sora">
          NIN Verification
        </h1>

        <p className="text-center text-[#474256] max-w-md mt-3 font-inter">
          Your provided details helps us provide you with our personalized bank
          account for wallet funding.
        </p>

        {/* Card */}
        <div className="bg-white rounded-[30px] lg:px-[72px] md:px-8 mt-8 w-full max-w-[640px] h-screen lg:pt-[72px]">
          <label className="text-sm font-medium text-[#07052A]">
            National Identification Number (NIN)
          </label>

          <Input
            value={nin}
            onChange={(e) =>
              setNin(e.target.value.replace(/\D/g, "").slice(0, 11))
            }
            placeholder="Input your 11 digit NIN"
            className="mt-2 h-12"
          />

          {/* Info */}
          <div className="flex items-start gap-3 bg-[#FA92321A] p-4 rounded-xl mt-6">
            <AlertCircle className="h-5 w-5 text-[#FA9232] mt-0.5" />
            <p className="text-sm text-[#474256]">
              Dial <span className="font-semibold text-[##FA9232]">*346#</span>{" "}
              on your registered phone number to retrieve your NIN.
            </p>
          </div>

          {/* Clear NIN Picture */}
          <div className="mt-8">
            <div className="flex items-center gap-3 bg-[#E9F3FF] p-4 rounded-xl">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <IdCard />
              </div>
              <span className="font-medium text-[#07052A]">
                Clear NIN Picture
              </span>
            </div>

            {/* Upload Area */}
            <label className="mt-4 block cursor-pointer">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition">
                {uploadProgress === 100 ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm text-green-600">
                      Image uploaded successfully
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {ninImage
                        ? "Uploading image..."
                        : "Tap to upload the required image"}
                    </span>
                  </>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
            </label>

            {/* Progress Bar */}
            {uploading && (
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-100 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploading… {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            disabled={nin.length !== 11 || uploadProgress !== 100 || loading}
            onClick={handleSubmit}
            className="w-full h-14 mt-10 bg-primary-100 text-white rounded-xl"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
