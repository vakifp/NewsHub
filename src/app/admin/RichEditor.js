"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichEditor({value,onChange}){

  const editor = useEditor({
    extensions:[StarterKit],
    content:value || "",
    immediatelyRender:false, // ⭐ prevents hydration mismatch
    onUpdate:({editor})=>{
      onChange(editor.getHTML());
    }
  });

  if(!editor) return null;

  return(
    <div className="border rounded-xl bg-white">

      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b">

        <button onClick={()=>editor.chain().focus().toggleBold().run()} className="btn">B</button>
        <button onClick={()=>editor.chain().focus().toggleItalic().run()} className="btn">I</button>
        <button onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()} className="btn">H2</button>
        <button onClick={()=>editor.chain().focus().toggleBulletList().run()} className="btn">List</button>

      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="p-4 min-h-[200px]"/>

      <style jsx>{`
        .btn{
          border:1px solid #e5e7eb;
          padding:4px 10px;
          border-radius:6px;
          font-size:14px;
        }
      `}</style>

    </div>
  );
}