"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type
} from "lucide-react";

export default function RichEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl shadow-lg border border-border/50 max-h-[500px] w-auto mx-auto',
        },
      }),
      Placeholder.configure({ placeholder: "Capture your editorial narrative..." }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all flex items-center justify-center min-w-[32px] h-8 ${
        active 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );

  const HeadingButton = ({ level }) => (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
      className={`px-2 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
        editor.isActive("heading", { level })
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border"
      }`}
    >
      H{level}
    </button>
  );

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="w-full border dark:border-gray-800 rounded-[2rem] overflow-hidden bg-white dark:bg-[#0b1220] focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-800">
        <div className="flex items-center gap-1 bg-white dark:bg-[#0b1220] p-1 rounded-xl border dark:border-gray-800">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={14} /></ToolbarButton>
        </div>
        
        <div className="flex items-center gap-1 bg-white dark:bg-[#0b1220] p-1 rounded-xl border dark:border-gray-800">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Code"><Code size={14} /></ToolbarButton>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-[#0b1220] p-1 rounded-xl border dark:border-gray-800">
          {[1,2,3,4,5,6].map(lvl => <HeadingButton key={lvl} level={lvl} />)}
          <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraph"><Type size={14} /></ToolbarButton>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-[#0b1220] p-1 rounded-xl border dark:border-gray-800">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List"><ListOrdered size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote size={14} /></ToolbarButton>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-[#0b1220] p-1 rounded-xl border dark:border-gray-800">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left"><AlignLeft size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center"><AlignCenter size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right"><AlignRight size={14} /></ToolbarButton>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-[#0b1220] p-1 rounded-xl border dark:border-gray-800">
          <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Link"><LinkIcon size={14} /></ToolbarButton>
          <ToolbarButton onClick={addImage} title="Image"><ImageIcon size={14} /></ToolbarButton>
        </div>
      </div>

      {/* EDITOR CONTENT */}
      <div className="p-8 md:p-12 min-h-[500px]">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none focus:outline-none 
          prose-headings:font-black prose-headings:tracking-tight prose-p:font-medium prose-p:text-muted-foreground"
        />
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror { min-height: 480px; }
        .ProseMirror:focus { outline: none; }
      `}</style>
    </div>
  );
}