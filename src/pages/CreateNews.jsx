import {useState} from 'react';import {useNavigate} from 'react-router-dom';
const API='http://localhost:4000/api';
export default function CreateNews(){
 const [title,setTitle]=useState('');const [body,setBody]=useState('');
 const auth=JSON.parse(localStorage.getItem('auth'));const token=auth?.token;const nav=useNavigate();

 const handleKeyPress=(e)=>{
  if(e.ctrlKey && e.key==='Enter') save();
 };

 const save=async()=>{
  if(!title.trim()) return alert('Title cannot be empty');
  if(body.trim().length<20) return alert('Body must be at least 20 characters');
  const res=await fetch(API+'/news',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
   body:JSON.stringify({title,content:body})
  });
  if(!res.ok) return alert('Create failed');
  nav('/news');
 };

 return(
 <div className="p-6 max-w-xl mx-auto">
  <div className="flex justify-between mb-2">
   <h1 className="font-bold text-xl">Create News</h1>
   <button onClick={()=>nav('/news')} className="text-blue-600">Back to List</button>
  </div>
  <input className="border w-full p-2 mt-2" placeholder="Title" onChange={e=>setTitle(e.target.value)} onKeyPress={handleKeyPress}/>
  <textarea className="border w-full p-2 mt-2" placeholder="Body (min 20 chars)" onChange={e=>setBody(e.target.value)} onKeyPress={handleKeyPress}/>
  <button onClick={save} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded">Save</button>
 </div>
 )
}