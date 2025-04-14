import { useState } from "react";
import { supabase } from "./supabaseClient";

const UploadFile = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setFile(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setSuccess(false);

        const { error } = await supabase.storage
            .from("user-files")
            .upload(file.name, file, {
                cacheControl: "3600",
                upsert: true,
            });

        setUploading(false);
        if (error) {
            alert("Upload failed: " + error.message);
        } else {
            setFile(null);
            setSuccess(true);
            if (onUploadSuccess) onUploadSuccess(); // 🔥 Notify parent to refresh file list
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    const handleFileSelect = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="w-full max-w-xl mx-auto mt-10">
            <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition hover:border-black cursor-pointer bg-gray-50"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("fileInput").click()}
            >
                <p className="text-gray-600 mb-2">Drag & drop your file here or click to browse</p>
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileSelect}
                />
                {file && (
                    <p className="text-sm text-gray-800 mt-2 font-medium">📄 {file.name}</p>
                )}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`px-6 py-2 rounded-full text-white transition ${uploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                        }`}
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </button>
            </div>

            {success && (
                <p className="text-green-600 text-center mt-4 font-medium">
                    ✅ File uploaded successfully!
                </p>
            )}
        </div>
    );
};

export default UploadFile;
