import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
    FiTrash2,
    FiUploadCloud,
    FiEye,
    FiDownload,
} from "react-icons/fi";
import {
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaFileAlt,
} from "react-icons/fa";

const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedTab, setSelectedTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchFiles();
        const storedHistory = JSON.parse(localStorage.getItem("viewHistory") || "[]");
        setHistory(storedHistory);
    }, [success]);

    const fetchFiles = async () => {
        const { data, error } = await supabase.storage.from("user-files").list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
        });

        if (error) {
            console.error("Error fetching files:", error.message);
        } else {
            setFiles(data);
        }
    };

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
            .upload(file.name, file, { cacheControl: "3600", upsert: true });

        setUploading(false);
        if (error) {
            alert("Upload failed: " + error.message);
        } else {
            setFile(null);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    const handleFileSelect = (e) => {
        setFile(e.target.files[0]);
    };

    const addToHistory = (fileName) => {
        const time = new Date().toISOString();
        const newEntry = { fileName, time };

        const updated = [newEntry, ...history.filter(h => h.fileName !== fileName)];
        const limited = updated.slice(0, 5);
        setHistory(limited);
        localStorage.setItem("viewHistory", JSON.stringify(limited));
    };

    const downloadFile = async (fileName) => {
        const { data, error } = await supabase.storage.from("user-files").download(fileName);
        if (error) return console.error("Download error:", error.message);

        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const previewFile = async (fileName) => {
        const ext = fileName.split(".").pop().toLowerCase();
        const { data, error } = await supabase.storage.from("user-files").getPublicUrl(fileName);
        if (error) return console.error("Error getting public URL:", error.message);

        const publicUrl = data.publicUrl;
        addToHistory(fileName);

        if (["pdf", "jpg", "jpeg", "png", "gif", "txt", "html"].includes(ext)) {
            window.open(publicUrl, "_blank");
        } else if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) {
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(publicUrl)}&embedded=true`;
            window.open(viewerUrl, "_blank");
        } else {
            alert("Preview not supported. Downloading instead.");
            downloadFile(fileName);
        }
    };

    const deleteFile = async (fileName) => {
        const confirmDelete = window.confirm(`Delete "${fileName}"?`);
        if (!confirmDelete) return;

        const { error } = await supabase.storage.from("user-files").remove([fileName]);
        if (!error) {
            setFiles((prev) => prev.filter((f) => f.name !== fileName));
        }
    };

    const getFileIcon = (ext) => {
        switch (ext) {
            case "pdf": return <FaFilePdf className="text-red-600 text-lg" />;
            case "doc":
            case "docx": return <FaFileWord className="text-blue-600 text-lg" />;
            case "xls":
            case "xlsx": return <FaFileExcel className="text-green-600 text-lg" />;
            default: return <FaFileAlt className="text-gray-600 text-lg" />;
        }
    };

    const filteredFiles = files
        .filter((file) => {
            const ext = file.name.split(".").pop().toLowerCase();
            if (selectedTab === "PDF") return ext === "pdf";
            if (selectedTab === "Docs") return ["doc", "docx"].includes(ext);
            if (selectedTab === "Excel") return ["xls", "xlsx"].includes(ext);
            return true;
        })
        .filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-lime-100 via-lime-200 to-lime-100">
            {/* Sidebar */}
            <div className="w-full md:w-80 border-r bg-gradient-to-r from-lime-100 via-lime-200 to-lime-100 p-4 md:p-6 space-y-6">
                {/* Upload Area */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gradient-to-r from-amber-50 to-amber-100 cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById("fileInput").click()}
                >
                    <FiUploadCloud className="mx-auto text-4xl text-gray-500 mb-2" />
                    <p className="text-gray-600">Drag & drop or click to upload</p>
                    <input type="file" id="fileInput" className="hidden" onChange={handleFileSelect} />
                    {file && <p className="text-sm mt-2 text-gray-700 font-medium">📄 {file.name}</p>}
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`w-full bg-black text-white font-semibold py-2 rounded-lg shadow hover:bg-gray-800 transition-all duration-200 ${uploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </button>

                {success && (
                    <p className="text-green-600 text-sm font-semibold text-center animate-bounce">
                        ✅ File uploaded!
                    </p>
                )}

                {/* History Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800"><b>Recent view files</b></h3>
                    <ul className="space-y-2 pr-2 max-h-60 overflow-y-auto">
                        {history.length === 0 ? (
                            <p className="text-sm text-gray-500">No recently viewed files.</p>
                        ) : (
                            history.map((h, idx) => (
                                <li key={idx} className="flex items-start gap-2 p-2 bg-white rounded-md shadow-sm">
                                    <div className="mt-1">
                                        {getFileIcon(h.fileName.split(".").pop().toLowerCase())}
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-800 font-medium truncate max-w-[160px]">{h.fileName}</p>
                                        <p className="text-xs text-gray-500">Viewed: {new Date(h.time).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {["All", "PDF", "Docs", "Excel"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${selectedTab === tab
                                    ? "bg-black text-white border-black"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* File Grid */}
                {filteredFiles.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No matching files.</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto">
                        {filteredFiles.map((file) => (
                            <li
                                key={file.name}
                                className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition transform hover:scale-[1.02]"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        {getFileIcon(file.name.split(".").pop().toLowerCase())}
                                        <p className="text-gray-800 font-semibold truncate max-w-[140px]">{file.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FiEye className="cursor-pointer" onClick={() => previewFile(file.name)} />
                                        <FiDownload className="cursor-pointer" onClick={() => downloadFile(file.name)} />
                                        <FiTrash2 className="cursor-pointer text-red-500" onClick={() => deleteFile(file.name)} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
export default FileManager;
