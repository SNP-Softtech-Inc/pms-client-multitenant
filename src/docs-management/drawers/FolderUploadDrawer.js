


// // import React, { useState, useEffect,useRef } from "react";
// // import {
// //   Drawer,
// //   Box,
// //   Typography,
// //   TextField,
// //   Button,
// //   List,
// //   ListItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Collapse,
// // } from "@mui/material";
// // import FolderIcon from "@mui/icons-material/Folder";
// // import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// // import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// // import ExpandLess from "@mui/icons-material/ExpandLess";
// // import ExpandMore from "@mui/icons-material/ExpandMore";
// // import { toast } from "material-react-toastify";
// // import JSZip from "jszip";
// // import axios from "axios";
// // import { accountDocsAPI } from "../../services/api";
// // const FolderUploadDrawer = ({
// //   isOpen,
// //   onClose,
// //   folderTree,
// //   fetchFolderTree,
// //   selectedFolderForMenu,
// // }) => {
// //   const [selectedFolder, setSelectedFolder] = useState("");
// //   const [message, setMessage] = useState("");
// //   const [folderName, setFolderName] = useState("my-uploaded-folder");
// //   const [files, setFiles] = useState([]);
// //  const hiddenFileInput = useRef(null);
// //   // open hidden input
// //   const handleClick = () => {
// //     hiddenFileInput.current.click();
// //   };

// //   useEffect(() => {
// //     if (isOpen && selectedFolderForMenu) {
// //       setSelectedFolder(selectedFolderForMenu.path);
// //       setFolderName("");
// //     } else if (!isOpen) {
// //       setSelectedFolder("");
// //       setFolderName("");
// //       setFiles([]);
// //       setMessage("");
// //     }
// //   }, [isOpen, selectedFolderForMenu]);

// //   const handleFolderSelect = (path) => setSelectedFolder(path);

  
// //  const handleUploadFolderSelect = (e) => {
// //     const selectedFiles = Array.from(e.target.files);
// //     setFiles(selectedFiles);

// //     if (selectedFiles.length > 0) {
// //       const firstPath = selectedFiles[0].webkitRelativePath;
// //       const topLevelFolder = firstPath.split("/")[0];
// //       setFolderName(topLevelFolder);
// //     }
// //   };
// //   const handleUpload = async () => {
// //   if (!files.length) {
// //     alert("Please select a folder first!");
// //     return;
// //   }

// //   if (!selectedFolder || selectedFolder.trim() === "") {
// //     alert("Please select target path first!");
// //     return;
// //   }

// //   let targetFolderPath = selectedFolder
// //     ? `${selectedFolder}/${folderName}`
// //     : folderName;

// //   targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

// //   console.log("Target Folder Path:", targetFolderPath);

// //   setMessage("Zipping folder...");

// //   const zip = new JSZip();

// //   files.forEach((file) => {
// //     zip.file(file.webkitRelativePath, file);
// //   });

// //   const zipBlob = await zip.generateAsync({ type: "blob" });

// //   const formData = new FormData();
// //   formData.append("folderZip", zipBlob, `${folderName}.zip`);
// //   formData.append("folderName", folderName);
// //   formData.append("folderPath", targetFolderPath);

// //   setMessage("Uploading...");

// //   try {
// //     const res = await accountDocsAPI.uploadFolderZip(formData);

// //     const data = res.data;

// //     setMessage(data.message || "Uploaded successfully!");

// //     console.log(data.message);

// //     toast.success("Folder uploaded successfully");

// //     await fetchFolderTree();
// //     onClose();
// //   } catch (err) {
// //     console.error(err);

// //     setMessage("Upload failed!");
// //     toast.error("Upload failed!");
// //   }
// // };
// // // const handleUpload = async () => {
// // //     if (!files.length) {
// // //       alert("Please select a folder first!");
// // //       return;
// // //     }
// // //     // ⭐ Check target folder not selected
// // //     if (!selectedFolder || selectedFolder.trim() === "") {
// // //       alert("Please select target path first!");
// // //       return;
// // //     }

// // //     // ------------------------------
// // //     // ⭐ Use targetFolderPath logic
// // //     // ------------------------------
// // //     let targetFolderPath = selectedFolder
// // //       ? `${selectedFolder}/${folderName}`
// // //       : folderName;

// // //     targetFolderPath = targetFolderPath.replace(/\/+/g, "/");
// // //     console.log("Target Folder Path:", targetFolderPath);
// // //     setMessage("Zipping folder...");

// // //     const zip = new JSZip();
// // //     files.forEach((file) => {
// // //       zip.file(file.webkitRelativePath, file);
// // //     });

// // //     const zipBlob = await zip.generateAsync({ type: "blob" });

// // //     const formData = new FormData();
// // //     formData.append("folderZip", zipBlob, `${folderName}.zip`);
// // //     formData.append("folderName", folderName);
// // //     formData.append("folderPath", targetFolderPath);

// // //     setMessage("Uploading...");

// // //     try {
// // //       const res = await axios.post(
// // //         "https://snptaxes.com/api/accountsdoc/upload-folder",
// // //         formData,
// // //         {
// // //           headers: { "Content-Type": "multipart/form-data" },
// // //         }
// // //       );
// // //       setMessage(res.data.message || "Uploaded successfully!");
// // //       console.log(res.data.message);
// // //       toast.success(`Folder uploaded successfully`);
// // //       fetchFolderTree();
// // //       onClose();
// // //     } catch (err) {
// // //       console.error(err);
// // //       setMessage("Upload failed!");
// // //     }
// // //   };
// //   return (
// //     <Drawer anchor="right" open={isOpen} onClose={onClose}>
// //       <Box sx={{ width: 400, p: 3,  height: "100%" }}>
// //         <Typography variant="h6" gutterBottom>
// //           📁 Upload Folder
// //         </Typography>

// //         <Button
// //           variant="outlined"
// //           color="primary"
// //           onClick={handleClick}
// //           sx={{ mb: 2 }}
// //         >
// //           Select Folder
// //         </Button>

// //         {/* Hidden File Input */}
// //         <input
// //           type="file"
// //           ref={hiddenFileInput}
// //           onChange={handleUploadFolderSelect}
// //           style={{ display: "none" }}
// //           webkitdirectory="true"
// //           directory="true"
// //           multiple
// //         />
// //         <Button
// //           // variant="contained"
// //           color="primary"
// //           fullWidth
// //           onClick={handleUpload}
// //            sx={{
// //               backgroundColor: 'text.menu',
// //               color: 'primary.contrastText',
// //               '&:hover': {
// //                 backgroundColor: 'menu.dark',
// //                 boxShadow: 1,
// //               },
// //               transition: 'background-color 0.2s ease'
// //             }}
// //         >
// //           🚀 Upload
// //         </Button>

// //         {message && (
// //           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
// //         )}

// //         <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
// //           Close
// //         </Button>

// //         <Box sx={{ mt: 3 }}>
// //           <Typography variant="subtitle1" gutterBottom>
// //             Select Parent Folder from Tree
// //           </Typography>
// //           <FolderTreeSelector
// //             items={folderTree}
// //             onSelect={handleFolderSelect}
// //             selectedFolder={selectedFolder}
// //           />
// //         </Box>
// //       </Box>
// //     </Drawer>
// //   );
// // };


// // const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
// //   const [expanded, setExpanded] = useState({});

// //   const toggleExpand = (path) => {
// //     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
// //   };

// //   return (
// //     <List disablePadding>
// //       {items?.map((item) => {
// //         if (item.type !== "folder") return null;

// //         // ⛔ Skip displaying this folder completely
// //         if (item.name?.toLowerCase() === "firm documents shared with client") return null;

// //         const isSelected = selectedFolder === item.path;
// //         const isExpanded = expanded[item.path];

// //         return (
// //           <React.Fragment key={item.path}>
            
// //             <ListItem
// //   sx={{
// //     pl: 2 + level * 2,
// //     bgcolor: isSelected ? "#b2d8ff" : "transparent",
// //     borderRadius: 1,
// //     mb: 0.5,

// //     cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
// //     opacity: item.meta?.readOnly ? 0.6 : 1,
// //     pointerEvents: item.meta?.readOnly ? "none" : "auto",

// //     "&:hover": {
// //       bgcolor: item.meta?.readOnly ? "transparent" : "#dbefff",
// //       color: "black",
// //     },
// //   }}
// //   onClick={() => {
// //     if (!item.meta?.readOnly) {
// //       onSelect(item.path);
// //     }
// //   }}
// // >

// //               <ListItemIcon
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   toggleExpand(item.path);
// //                 }}
// //               >
// //                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
// //               </ListItemIcon>

// //               <ListItemText
// //                 primary={item.name}
// //                 sx={{
// //                   fontWeight: isSelected ? "bold" : "normal",
// //                   color: isSelected ? "#0056b3" : "inherit",
// //                 }}
// //               />

// //               {item.children?.length > 0 &&
// //                 (isExpanded ? (
// //                   <ExpandLess
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       toggleExpand(item.path);
// //                     }}
// //                   />
// //                 ) : (
// //                   <ExpandMore
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       toggleExpand(item.path);
// //                     }}
// //                   />
// //                 ))}
// //             </ListItem>

// //             {item.children?.length > 0 && (
// //               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
// //                 <FolderTreeSelector
// //                   items={item.children}
// //                   onSelect={onSelect}
// //                   selectedFolder={selectedFolder}
// //                   level={level + 1}
// //                 />
// //               </Collapse>
// //             )}
// //           </React.Fragment>
// //         );
// //       })}
// //     </List>
// //   );
// // };


// // export default FolderUploadDrawer;


// import React, { useState, useEffect, useRef } from "react";
// // import { toast } from "material-react-toastify";
// import JSZip from "jszip";
// import { accountDocsAPI } from "../../services/api";
// import { useToast } from "../../hooks/useToast";

// const FolderUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [folderName, setFolderName] = useState("my-uploaded-folder");
//   const [files, setFiles] = useState([]);
//   const hiddenFileInput = useRef(null);
// const toast=useToast()
//   // open hidden input
//   const handleClick = () => {
//     hiddenFileInput.current.click();
//   };

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//       setFolderName("");
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setFolderName("");
//       setFiles([]);
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   const handleUploadFolderSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);

//     if (selectedFiles.length > 0) {
//       const firstPath = selectedFiles[0].webkitRelativePath;
//       const topLevelFolder = firstPath.split("/")[0];
//       setFolderName(topLevelFolder);
//     }
//   };

//   const handleUpload = async () => {
//     if (!files.length) {
//       alert("Please select a folder first!");
//       return;
//     }

//     if (!selectedFolder || selectedFolder.trim() === "") {
//       alert("Please select target path first!");
//       return;
//     }

//     let targetFolderPath = selectedFolder
//       ? `${selectedFolder}/${folderName}`
//       : folderName;

//     targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

//     console.log("Target Folder Path:", targetFolderPath);

//     setMessage("Zipping folder...");

//     const zip = new JSZip();

//     files.forEach((file) => {
//       zip.file(file.webkitRelativePath, file);
//     });

//     const zipBlob = await zip.generateAsync({ type: "blob" });

//     const formData = new FormData();
//     formData.append("folderZip", zipBlob, `${folderName}.zip`);
//     formData.append("folderName", folderName);
//     formData.append("folderPath", targetFolderPath);

//     setMessage("Uploading...");

//     try {
//       const res = await accountDocsAPI.uploadFolderZip(formData);

//       const data = res.data;

//       setMessage(data.message || "Uploaded successfully!");

//       console.log(data.message);

//       toast.success("Folder uploaded successfully");

//       await fetchFolderTree();
//       onClose();
//     } catch (err) {
//       console.error(err);

//       setMessage("Upload failed!");
//       toast.error("Upload failed!");
//     }
//   };

//   return (
//     <>
//       {/* BACKDROP */}
//       {isOpen && (
//         <div
//           onClick={onClose}
//           className="
//             fixed inset-0 z-40
//             bg-black/50 backdrop-blur-sm
//             transition-opacity duration-200
//           "
//         />
//       )}

//       {/* DRAWER */}
//       <div
//         className={`
//           fixed top-0 right-0 z-50 h-full
//           w-full sm:w-[640px] md:w-[520px]
//           bg-white text-gray-900
//           border-l border-gray-200
//           shadow-lg
//           flex flex-col
//           transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
//           ${isOpen ? "translate-x-0" : "translate-x-full"}
//         `}
//       >
//         {/* HEADER */}
//         <div className="
//           flex items-center justify-between
//           px-6 py-4
//           border-b border-gray-200
//         ">
//           <div className="flex flex-col">
//             <h2 className="text-sm font-semibold text-gray-900">
//               📁 Upload Folder
//             </h2>
//             <p className="text-xs text-gray-500">
//               Upload an entire folder structure to your selected location
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="
//               p-1.5 rounded-md
//               text-gray-500
//               hover:bg-gray-100 hover:text-gray-900
//               transition
//             "
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
//           {/* FOLDER SELECTION BUTTON */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Select Folder to Upload
//             </label>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleClick}
//                 className="
//                   inline-flex items-center justify-center
//                   rounded-md px-4 py-2 text-sm font-medium
//                   border border-gray-300 bg-white text-gray-700
//                   hover:bg-gray-50 hover:border-gray-400
//                   transition
//                 "
//               >
//                 📁 Choose Folder
//               </button>

//               {/* Hidden File Input */}
//               <input
//                 type="file"
//                 ref={hiddenFileInput}
//                 onChange={handleUploadFolderSelect}
//                 style={{ display: "none" }}
//                 webkitdirectory="true"
//                 directory="true"
//                 multiple
//               />
//             </div>

//             {/* Selected folder info */}
//             {files.length > 0 && (
//               <div className="mt-2 space-y-1">
//                 <div className="text-sm text-gray-600 flex items-center gap-2">
//                   <span className="text-blue-600">📂</span>
//                   <span className="font-medium">{folderName}</span>
//                   <span className="text-gray-400">({files.length} files)</span>
//                 </div>
//                 <div className="text-xs text-gray-400">
//                   Total size: {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* MESSAGE DISPLAY */}
//           {message && (
//             <div className={`
//               text-sm p-3 rounded-md
//               ${message.includes("Uploaded successfully") || message.includes("successful") 
//                 ? "bg-green-50 text-green-700 border border-green-200" 
//                 : message.includes("failed") || message.includes("Failed")
//                 ? "bg-red-50 text-red-700 border border-red-200"
//                 : "bg-blue-50 text-blue-700 border border-blue-200"}
//             `}>
//               {message.includes("Zipping") || message.includes("Uploading") ? (
//                 <div className="flex items-center gap-2">
//                   <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   {message}
//                 </div>
//               ) : (
//                 message
//               )}
//             </div>
//           )}

//           {/* FOLDER TREE SELECTION */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//               Select Parent Folder from Tree
//             </label>
            
//             <div className="
//               rounded-md border border-gray-200
//               bg-gray-50
//               max-h-96 overflow-y-auto
//               p-2
//             ">
//               <FolderTreeSelector
//                 items={folderTree}
//                 onSelect={handleFolderSelect}
//                 selectedFolder={selectedFolder}
//               />
//             </div>
            
//             {selectedFolder && (
//               <p className="text-xs text-blue-600 mt-1">
//                 Target location: {selectedFolder}/{folderName || "new-folder"}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="
//           border-t border-gray-200
//           px-6 py-4
//           flex items-center justify-end gap-3
//           bg-white
//         ">
//           <button
//             onClick={onClose}
//             className="
//               text-sm font-medium
//               text-gray-600
//               hover:text-gray-900
//               transition
//               px-3 py-1.5 rounded-md
//               hover:bg-gray-100
//             "
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleUpload}
//             className="
//               inline-flex items-center justify-center
//               rounded-md px-4 py-1.5 text-sm font-medium
//               bg-blue-600 text-white
//               hover:bg-blue-700
//               transition
//               shadow-sm
//               disabled:opacity-50 disabled:cursor-not-allowed
//             "
//             disabled={files.length === 0 || !selectedFolder}
//           >
//             🚀 Upload Folder
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <ul className="list-none m-0 p-0 space-y-0.5">
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         // ⛔ Skip displaying this folder completely
//         if (item.name?.toLowerCase() === "firm documents shared with client")
//           return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];
//         const hasChildren = item.children?.length > 0;
//         const isReadOnly = item.meta?.readOnly;

//         return (
//           <React.Fragment key={item.path}>
//             <li>
//               <div
//                 className={`
//                   rounded-md transition-all duration-200
//                   ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
//                   ${isSelected && !isReadOnly ? 'bg-blue-100' : !isReadOnly ? 'hover:bg-gray-100' : ''}
//                 `}
//                 style={{ paddingLeft: `${level * 12}px` }}
//                 onClick={() => {
//                   if (!isReadOnly) {
//                     onSelect(item.path);
//                   }
//                 }}
//               >
//                 <div className="flex items-center py-1.5 px-2 gap-1">
//                   {/* Expand/Collapse Button */}
//                   {hasChildren && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleExpand(item.path);
//                       }}
//                       className="p-0.5 rounded hover:bg-gray-200 transition"
//                       disabled={isReadOnly}
//                     >
//                       {isExpanded ? (
//                         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       ) : (
//                         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       )}
//                     </button>
//                   )}

//                   {/* Spacer if no children */}
//                   {!hasChildren && <div className="w-5" />}

//                   {/* Folder Icon */}
//                   <svg className={`w-4 h-4 flex-shrink-0 ${isReadOnly ? 'text-gray-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
//                   </svg>

//                   {/* Folder Name */}
//                   <span className={`
//                     text-sm flex-1
//                     ${isSelected && !isReadOnly ? 'font-semibold text-blue-700' : isReadOnly ? 'text-gray-400' : 'text-gray-700'}
//                   `}>
//                     {item.name}
//                   </span>

//                   {/* Read-only badge */}
//                   {isReadOnly && (
//                     <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
//                       Read Only
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Children */}
//               {hasChildren && isExpanded && (
//                 <div className="mt-0.5">
//                   <FolderTreeSelector
//                     items={item.children}
//                     onSelect={onSelect}
//                     selectedFolder={selectedFolder}
//                     level={level + 1}
//                   />
//                 </div>
//               )}
//             </li>
//           </React.Fragment>
//         );
//       })}
//     </ul>
//   );
// };

// export default FolderUploadDrawer;

import React, { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import { useDropzone } from "react-dropzone";
import { accountDocsAPI } from "../../services/api";
import { useToast } from "../../hooks/useToast";

const FolderUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const hiddenFileInput = useRef(null);
  const toast = useToast();

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFiles([]);
      setMessage("");
      setUploading(false);
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  // Staged entries are { file, relativePath }. Dropped files carry their path
  // in the directory entry rather than in webkitRelativePath, which is
  // read-only and empty for drops, so the path is tracked alongside the file.
  const folderGroups = files.reduce((groups, item) => {
    const root = item.relativePath.split("/")[0];
    (groups[root] = groups[root] || []).push(item);
    return groups;
  }, {});

  const folderNames = Object.keys(folderGroups);

  // Add to what is already staged rather than replacing it - picking a second
  // folder used to discard the first - and never stage the same file twice.
  const stageItems = (incoming) => {
    setFiles((prev) => {
      const seen = new Set(prev.map((i) => i.relativePath));
      return [...prev, ...incoming.filter((i) => !seen.has(i.relativePath))];
    });
  };

  const removeFolder = (name) => {
    setFiles((prev) =>
      prev.filter((i) => i.relativePath.split("/")[0] !== name),
    );
  };

  const handleUploadFolderSelect = (e) => {
    const picked = Array.from(e.target.files);
    if (picked.length === 0) return;

    stageItems(
      picked.map((file) => ({ file, relativePath: file.webkitRelativePath })),
    );

    // Let the same folder be re-picked later; without this the input keeps
    // its value and firing change again for it is not guaranteed.
    e.target.value = "";
  };

  // react-dropzone's file-selector walks dropped directories for us, and
  // gives each file a `path` such as "/Reports/2025/q1.pdf". A file dialog can
  // only ever return one folder, so dropping is the only way to select several
  // at once - and it avoids the browser's directory-picker confirmation.
  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      if (uploading) return;

      const staged = accepted
        .map((file) => ({
          file,
          relativePath: (file.path || file.name).replace(/^\/+/, ""),
        }))
        // Only items inside a folder - a loose file has nothing to group
        // under and this drawer uploads folders.
        .filter((item) => item.relativePath.includes("/"));

      if (staged.length === 0) {
        toast.error("Drop folders here, not individual files");
        return;
      }

      stageItems(staged);
    },
    noClick: true,
    noKeyboard: true,
    disabled: uploading,
  });

  // Up to 500MB per selection, but not in one request: the service buffers
  // uploads wholly in memory, and nginx caps the body size - one archive of
  // several folders came back 413. The total is spread over requests of this
  // size instead. Raw file bytes are the estimate, since a zip of documents
  // is rarely larger than its input.
  const MAX_BATCH_BYTES = 40 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 500 * 1024 * 1024;

  const totalBytes = files.reduce((sum, i) => sum + (i.file.size || 0), 0);

  const formatBytes = (bytes) =>
    bytes >= 1024 * 1024
      ? `${Math.round(bytes / 1024 / 1024)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;

  const buildBatches = () => {
    const batches = [];
    let current = [];
    let currentBytes = 0;

    for (const name of folderNames) {
      const bytes = folderGroups[name].reduce(
        (sum, i) => sum + (i.file.size || 0),
        0,
      );

      if (current.length > 0 && currentBytes + bytes > MAX_BATCH_BYTES) {
        batches.push(current);
        current = [];
        currentBytes = 0;
      }

      current.push(name);
      currentBytes += bytes;
    }

    if (current.length > 0) batches.push(current);
    return batches;
  };

  const handleUpload = async () => {
    if (uploading) return;

    if (!files.length) {
      toast.error("Please select a folder first!");
      return;
    }

    if (!selectedFolder || selectedFolder.trim() === "") {
      toast.error("Please select target path first!");
      return;
    }

    if (totalBytes > MAX_TOTAL_BYTES) {
      toast.error(
        `Selection is ${formatBytes(totalBytes)} - the limit is ${formatBytes(
          MAX_TOTAL_BYTES,
        )}. Remove some folders and upload the rest separately.`,
      );
      return;
    }

    setUploading(true);

    const destination = selectedFolder.replace(/\/+$/, "");
    const batches = buildBatches();
    const failed = [];
    let tooLarge = false;

    try {
      for (let b = 0; b < batches.length; b++) {
        const batch = batches[b];
        const label =
          batches.length > 1 ? ` (part ${b + 1} of ${batches.length})` : "";

        // Both callbacks fire far more often than once per percent, and a
        // setState per call would make re-rendering its own bottleneck.
        let lastShown = -1;
        const report = (verb, percent) => {
          const whole = Math.round(percent);
          if (whole === lastShown) return;
          lastShown = whole;
          setMessage(`${verb} ${batch.join(", ")}${label} - ${whole}%`);
        };

        const zip = new JSZip();
        batch.forEach((name) => {
          folderGroups[name].forEach((item) => {
            zip.file(item.relativePath, item.file);
          });
        });

        // JSZip defaults to STORE - no compression - so archives went over
        // the wire at the full size of the files. Level 3 gives most of the
        // saving on documents for a fraction of the default level 6's time.
        const zipBlob = await zip.generateAsync(
          {
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 3 },
          },
          (meta) => report("Compressing", meta.percent),
        );

        lastShown = -1;
        const onUploadProgress = (evt) => {
          if (!evt.total) return;
          report("Uploading", (evt.loaded / evt.total) * 100);
        };

        const formData = new FormData();
        formData.append("folderZip", zipBlob, `${batch[0]}.zip`);

        try {
          if (batch.length === 1) {
            // One folder keeps using the original endpoint so its behaviour
            // stays exactly as it has always been.
            formData.append("folderName", batch[0]);
            formData.append(
              "folderPath",
              `${destination}/${batch[0]}`.replace(/\/+/g, "/"),
            );
            await accountDocsAPI.uploadFolderZip(formData, onUploadProgress);
          } else {
            // Several folders in one archive: this endpoint keeps each
            // entry's root rather than stripping it.
            formData.append("folderPath", destination);
            await accountDocsAPI.uploadMultiFolderZip(
              formData,
              onUploadProgress,
            );
          }
        } catch (err) {
          console.error(`Upload failed for ${batch.join(", ")}:`, err);
          if (err?.response?.status === 413) tooLarge = true;
          failed.push(...batch);
        }
      }

      const uploaded = folderNames.length - failed.length;

      if (failed.length > 0) {
        toast.error(
          tooLarge
            ? `Server rejected the upload as too large. ${uploaded} of ${folderNames.length} folder(s) uploaded.`
            : `${uploaded} of ${folderNames.length} folder(s) uploaded. Failed: ${failed.join(", ")}`,
        );
        setMessage(`Failed: ${failed.join(", ")}`);
      } else {
        toast.success(
          `${uploaded} folder${uploaded === 1 ? "" : "s"} uploaded successfully`,
        );
        setMessage("Uploaded successfully!");
      }

      await fetchFolderTree();

      // Only close when everything landed - otherwise leave the drawer open
      // with the folders that failed still staged, so they can be retried.
      if (failed.length === 0) {
        onClose();
      } else {
        setFiles((prev) =>
          prev.filter((i) => failed.includes(i.relativePath.split("/")[0])),
        );
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        />
      )}

      {/* DRAWER - the whole panel is the drop target, not just the dashed box:
          a small target is easy to miss, and a folder released elsewhere
          either does nothing or makes the browser navigate away. */}
      <div
        {...getRootProps()}
        className={`
          fixed top-0 right-0 z-50 h-full
          w-full sm:w-[640px] md:w-[520px]
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          border-l border-gray-200 dark:border-gray-700
          shadow-lg flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {isDragActive && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-blue-500 bg-blue-500/10">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Drop folders to add them
            </p>
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              📁 Upload Folder
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload an entire folder structure to your selected location
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* SELECT FOLDER */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Select Folder to Upload
            </label>

            <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-blue-400/50 bg-blue-50 dark:bg-blue-900/10 px-4 py-6 text-center">
              <span className="text-xl">📁</span>

              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Drag folders here
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Drop as many as you like anywhere in this panel - no browser
                prompt.
              </p>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-xs text-gray-400">Can't drag?</span>
              <button
                onClick={handleClick}
                disabled={uploading}
                className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-700 disabled:opacity-50"
              >
                {folderNames.length > 0
                  ? "Browse for another folder"
                  : "Browse for one folder"}
              </button>
            </div>

            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleUploadFolderSelect}
              style={{ display: "none" }}
              webkitdirectory="true"
              directory="true"
              multiple
            />

            {folderNames.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div
                  className={`text-xs font-medium ${
                    totalBytes > MAX_TOTAL_BYTES
                      ? "text-red-600"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {folderNames.length} folder
                  {folderNames.length === 1 ? "" : "s"} to upload -{" "}
                  {formatBytes(totalBytes)}
                  {totalBytes > MAX_TOTAL_BYTES &&
                    ` (over the ${formatBytes(MAX_TOTAL_BYTES)} limit)`}
                </div>

                {folderNames.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                        {name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {folderGroups[name].length} file(s)
                      </div>
                    </div>

                    <button
                      onClick={() => removeFolder(name)}
                      disabled={uploading}
                      aria-label={`Remove ${name}`}
                      className="shrink-0 rounded px-2 text-gray-400 hover:text-gray-700 disabled:opacity-40"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`
                text-sm p-3 rounded-md
                ${
                  message.includes("success")
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : message.includes("fail")
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                    : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                }
              `}
            >
              {message.includes("Zipping") || message.includes("Uploading") ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                  </svg>
                  {message}
                </div>
              ) : (
                message
              )}
            </div>
          )}

          {/* TREE */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Select Parent Folder
            </label>

            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto p-2">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>

            {selectedFolder && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Target: {selectedFolder}/
                {folderNames.length === 1
                  ? folderNames[0]
                  : `${folderNames.length || "no"} folder(s)`}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={files.length === 0 || !selectedFolder}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            🚀 Upload Folder
          </button>
        </div>
      </div>
    </>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className="list-none m-0 p-0 space-y-0.5">
      {items?.map((item) => {
        if (item.type !== "folder") return null;
        if (item.name?.toLowerCase() === "firm documents shared with client")
          return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const hasChildren = item.children?.length > 0;
        const isReadOnly = item.meta?.readOnly;

        return (
          <li key={item.path}>
            <div
              className={`
                rounded-md
                ${isSelected ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                ${isReadOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              `}
              style={{ paddingLeft: `${level * 12}px` }}
              onClick={() => !isReadOnly && onSelect(item.path)}
            >
              <div className="flex items-center gap-2 px-2 py-1.5">
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                    className="text-xs"
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                )}
                📁
                <span
                  className={`${
                    isSelected
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </div>

            {hasChildren && isExpanded && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FolderUploadDrawer;