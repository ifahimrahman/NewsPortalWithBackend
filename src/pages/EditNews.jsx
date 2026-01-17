import {useEffect,useState} from 'react';import {useParams,useNavigate} from 'react-router-dom';
const API='http://localhost:4000/api';
export default function EditNews(){
 const {id}=useParams();const nav=useNavigate();
 const [title,setTitle]=useState('');const [body,setBody]=useState('');
 const auth=JSON.parse(localStorage.getItem('auth'));
 const user=auth?.user;const token=auth?.token;

 useEffect(()=>{
  fetch(API+'/news/'+id).then(r=>r.json()).then(n=>{
   if(n.author && String(n.author._id)!==String(user?.id)){alert('Unauthorized');nav('/news');}
   setTitle(n.title);setBody(n.content);
  });
 },[id]);

 const handleKeyPress=(e)=>{
  if(e.ctrlKey && e.key==='Enter') save();
 };

 const save=async()=>{
  if(!title.trim()) return alert('Title required');
  if(body.trim().length<20) return alert('Body must be at least 20 chars');
  const res=await fetch(API+'/news/'+id,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
   body:JSON.stringify({title,content:body})
  });
  if(!res.ok) return alert('Update failed');
  nav('/news');
 };

 return(
 <div className="p-6 max-w-xl mx-auto">
  <div className="flex justify-between mb-2">
   <h1 className="font-bold text-xl">Edit News</h1>
   <button onClick={()=>nav('/news')} className="text-blue-600">Back to List</button>
  </div>
  <input className="border w-full p-2 mt-2" value={title} onChange={e=>setTitle(e.target.value)} onKeyPress={handleKeyPress}/>
  <textarea className="border w-full p-2 mt-2" value={body} onChange={e=>setBody(e.target.value)} onKeyPress={handleKeyPress}/>
  <button onClick={save} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded">Update</button>
 </div>
 )
}