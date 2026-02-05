"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (never expose secrets in frontend!)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadedFile = {
  url: string;
  type: "image" | "video";
  name: string;
};

export default function UploadMedia() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setUploading(true);

    const uploaded: UploadedFile[] = [];

    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = (await res.json()) as {
          secure_url: string;
          resource_type: "image" | "video";
        };

        uploaded.push({
          url: data.secure_url,
          type: data.resource_type,
          name: file.name,
        });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setFiles(prev => [...prev, ...uploaded]);
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* File Input */}
      <div>
        <label className="cursor-pointer inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
          {uploading ? "Uploading..." : "Upload Media"}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Media Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {files.map(file => (
          <div key={file.url} className="border rounded-lg overflow-hidden bg-light shadow-sm">
            {file.type === "image" ? (
              <Image
                src={file.url}
                alt={file.name}
                width={400}
                height={300}
                className="object-cover w-full h-48"
                quality={75}
              />
            ) : (
              <video
                src={file.url}
                className="w-full h-48 object-cover"
                controls
              />
            )}
            <div className="p-2 text-center text-sm font-medium text-dark">{file.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
