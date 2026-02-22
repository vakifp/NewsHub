"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function ImageUploader({value,onChange}){

  const [progress,setProgress]=useState(0);
  const [drag,setDrag]=useState(false);

  function upload(file){
    const storageRef = ref(storage,"posts/"+Date.now()+"-"+file.name);
    const task = uploadBytesResumable(storageRef,file);

    task.on("state_changed",
      snap=>{
        const percent=(snap.bytesTransferred/snap.totalBytes)*100;
        setProgress(percent);
      },
      err=>alert(err.message),
      async()=>{
        const url=await getDownloadURL(task.snapshot.ref);
        onChange(url);
      }
    );
  }

  function handleDrop(e){
    e.preventDefault();
    setDrag(false);
    if(e.dataTransfer.files[0]){
      upload(e.dataTransfer.files[0]);
    }
  }

  return(
    <div className="space-y-3">

      {/* DROP ZONE */}
      <div
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
        ${drag ? "border-blue-500 bg-blue-50":"border-gray-300"}`}
      >
        <input
          type="file"
          className="hidden"
          id="file"
          onChange={e=>upload(e.target.files[0])}
        />

        <label htmlFor="file" className="cursor-pointer text-sm text-gray-600">
          Drag image here or click to upload
        </label>
      </div>

      {/* PROGRESS */}
      {progress>0 && progress<100 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            style={{width:progress+"%"}}
            className="bg-blue-600 h-2 rounded-full"
          />
        </div>
      )}

      {/* PREVIEW */}
      {value && (
        <div className="relative w-40">
          <img src={value} className="rounded-lg border"/>

          <button
            onClick={()=>onChange("")}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      )}

    </div>
  );
}