import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { FiTrash2 } from "react-icons/fi"; // bin icon

const FileList = ({ refresh }) => {
    const [files, setFiles] = useState([]);
    const [selectedTab, setSelectedTab] = useState("All");

    useEffect(() => {
        fetchFiles();
    }, [refresh]);

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

    const downloadFile = async (fileName) => {
        const { data, error } = await supabase.storage.from("user-files").download(fileName);
        if (error) {
            console.error("Download error:", error.message);
        } else {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    const previewFile = async (fileName) => {
        const ext = fileName.split(".").pop().toLowerCase();

        const { data, error } = await supabase.storage.from("user-files").getPublicUrl(fileName);
        if (error) {
            console.error("Error getting public URL:", error.message);
            return;
        }

        const publicUrl = data.publicUrl;

        if (["pdf", "jpg", "jpeg", "png", "gif", "txt", "html"].includes(ext)) {
            window.open(publicUrl, "_blank");
        } else if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) {
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(publicUrl)}&embedded=true`;
            window.open(viewerUrl, "_blank");
        } else {
            alert("Preview not supported for this file type. File will be downloaded.");
            downloadFile(fileName);
        }
    };

    const deleteFile = async (fileName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${fileName}"?`);
        if (!confirmDelete) return;

        const { error } = await supabase.storage.from("user-files").remove([fileName]);
        if (error) {
            console.error("Delete error:", error.message);
        } else {
            setFiles((prev) => prev.filter((file) => file.name !== fileName));
        }
    };

    const filteredFiles = files.filter((file) => {
        if (selectedTab === "All") return true;
        const ext = file.name.split(".").pop().toLowerCase();
        if (selectedTab === "PDF") return ext === "pdf";
        if (selectedTab === "Docs") return ["doc", "docx"].includes(ext);
        if (selectedTab === "Excel") return ["xls", "xlsx"].includes(ext);
        return false;
    });

    return (
        <div className="w-full max-w-3xl mx-auto mt-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📁 Your Files</h2>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-4">
                {["All", "PDF", "Docs", "Excel"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${selectedTab === tab
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Files */}
            {filteredFiles.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                    No {selectedTab.toLowerCase()} files uploaded yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {filteredFiles.map((file) => (
                        <li
                            key={file.name}
                            className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full text-gray-600 text-lg">
                                    📄
                                </div>
                                <span className="text-gray-800 text-sm font-medium">{file.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => previewFile(file.name)}
                                    className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200 transition"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => downloadFile(file.name)}
                                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
                                >
                                    Download
                                </button>
                                <button
                                    onClick={() => deleteFile(file.name)}
                                    title="Delete"
                                    className="text-red-500 hover:text-red-700 text-xl p-1"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileList;
