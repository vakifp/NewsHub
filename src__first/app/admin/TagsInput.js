"use client";
import { useState } from "react";

export default function TagsInput({value=[],onChange}){

  const [input,setInput]=useState("");

  function addTag(e){
    if(e.key==="Enter" && input.trim()){
      e.preventDefault();
      if(!value.includes(input.trim())){
        onChange([...value,input.trim()]);
      }
      setInput("");
    }
  }

  function remove(tag){
    onChange(value.filter(t=>t!==tag));
  }

  return(
    <div className="border rounded-lg p-2 flex flex-wrap gap-2">

      {value.map(tag=>(
        <span
          key={tag}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-1"
        >
          {tag}
          <button onClick={()=>remove(tag)}>✕</button>
        </span>
      ))}

      <input
        value={input}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={addTag}
        placeholder="Type tag and press Enter"
        className="outline-none text-sm flex-1 min-w-[120px]"
      />

    </div>
  );
}