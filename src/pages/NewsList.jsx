import {useEffect,useState} from 'react';import {Link,useNavigate} from 'react-router-dom';
const API='http://localhost:4000/api';
export default function NewsList(){
 const auth=JSON.parse(localStorage.getItem('auth'));
 const user=auth?.user;
 const token=auth?.token;
 const [news,setNews]=useState([]);const [users,setUsers]=useState([]);
 const [q,setQ]=useState('');const [page,setPage]=useState(1);
 const perPage=9;const nav=useNavigate();

 useEffect(()=>{
  if(!user){nav('/')}
  fetch(API+'/news').then(r=>r.json()).then(setNews);
  // users endpoint not implemented on backend; author is populated in news
 },[]);

 const logout=()=>{localStorage.removeItem('auth');nav('/');}
 const authorName=n=>n?.author?.name || 'Unknown';
 const filtered=news.filter(n=>n.title.toLowerCase().includes(q.toLowerCase()));
 const pages=Math.ceil(filtered.length/perPage);
 const view=filtered.slice((page-1)*perPage,page*perPage);

 const del=async id=>{
  if(!window.confirm('Delete this post?')) return;
  const res=await fetch(API+'/news/'+id,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
  if(!res.ok){
   const err=await res.json();
   return alert(err.message || 'Delete failed');
  }
  setNews(news.filter(n=>n._id!==id));
 };

 return(
 <div className="p-6">
  <div className="flex justify-between mb-4">
   <p>Logged in as <b>{user?.name}</b></p>
   <div className="space-x-2">
    <button onClick={()=>nav('/create')} className="bg-green-500 text-white px-3 py-1 rounded">Create</button>
    <button onClick={logout} className="bg-gray-500 text-white px-3 py-1 rounded">Logout</button>
   </div>
  </div>

  <input className="border p-2 mb-4 w-full" placeholder="Search by title..." onChange={e=>setQ(e.target.value)}/>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {view.map(n=>(
   <div key={n._id} className="border p-4 rounded shadow">
    <h2 className="font-bold text-lg">{n.title}</h2>
    <p className="text-sm text-gray-600">By {authorName(n)}</p>
    <div className="space-x-2 mt-2">
    <Link to={'/news/'+n._id} className="text-blue-600">View</Link>
    {user && (String(user.id)===String(n.author?._id) || user.role==='admin') && <>
     <Link to={'/edit/'+n._id} className="text-yellow-600">Edit</Link>
     <button onClick={()=>del(n._id)} className="text-red-600">Delete</button>
    </>}
    </div>
   </div>
  ))}
  </div>

  <div className="mt-6 flex justify-center space-x-2">
   {Array.from({length:pages},(_,i)=>
    <button key={i} onClick={()=>setPage(i+1)} className="px-3 py-1 border rounded">{i+1}</button>
   )}
  </div>
 </div>
 )
}