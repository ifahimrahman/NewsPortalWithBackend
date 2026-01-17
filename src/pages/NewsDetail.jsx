import {useParams,useNavigate,Link} from 'react-router-dom';import {useEffect,useState} from 'react';
const API='http://localhost:4000/api';
export default function NewsDetail(){
 const {id}=useParams();const nav=useNavigate();
 const auth=JSON.parse(localStorage.getItem('auth'));
 const user=auth?.user;
 const token=auth?.token;
 const [news,setNews]=useState(null);
 const [comments,setComments]=useState([]);
 const [newComment,setNewComment]=useState('');
 const [editingId,setEditingId]=useState(null);
 const [editContent,setEditContent]=useState('');
 const [loading,setLoading]=useState(true);

 useEffect(()=>{
  fetch(API+'/news/'+id).then(r=>r.json()).then(n=>{
   setNews(n);
   setLoading(false);
  });
  fetch(API+'/comments/news/'+id).then(r=>r.json()).then(setComments);
 },[id]);

 const addComment=async()=>{
  if(!newComment.trim()) return alert('Comment cannot be empty');
  const res=await fetch(API+'/comments/news/'+id,{
   method:'POST',
   headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
   body:JSON.stringify({content:newComment})
  });
  if(!res.ok) return alert('Failed to add comment');
  const comment=await res.json();
  // Ensure author is set with proper _id
  comment.author = comment.author || { _id: user.id, name: user.name };
  setComments([comment,...comments]);
  setNewComment('');
 };

 const handleCommentKeyPress=(e)=>{
  if(e.ctrlKey && e.key==='Enter') addComment();
 };

 const startEdit=(cid,content)=>{
  setEditingId(cid);
  setEditContent(content);
 };

 const saveEdit=async(cid)=>{
  if(!editContent.trim()) return alert('Comment cannot be empty');
  const res=await fetch(API+'/comments/'+cid,{
   method:'PUT',
   headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
   body:JSON.stringify({content:editContent})
  });
  if(!res.ok) return alert('Failed to update comment');
  const updated=await res.json();
  setComments(comments.map(c=>c._id===cid?updated:c));
  setEditingId(null);
  setEditContent('');
 };

 const cancelEdit=()=>{
  setEditingId(null);
  setEditContent('');
 };

 const delComment=async(cid)=>{
  if(!window.confirm('Delete this comment?')) return;
  const res=await fetch(API+'/comments/'+cid,{
   method:'DELETE',
   headers:{Authorization:`Bearer ${token}`}
  });
  if(!res.ok) return alert('Failed to delete comment');
  setComments(comments.filter(c=>c._id!==cid));
 };

 if(loading) return null;
 if(!news) return null;

 return(
 <div className="p-6 max-w-2xl mx-auto">
  <div className="flex justify-between mb-2">
   <h1 className="text-2xl font-bold">{news.title}</h1>
   <button onClick={()=>nav('/news')} className="text-blue-600">Back</button>
  </div>
  <p className="mt-2">{news.content}</p>
  <p className="mt-4 text-sm text-gray-600">By {news.author?.name}</p>

  {user && String(user.id)===String(news.author?._id) && (
   <div className="mt-4 space-x-2">
    <Link to={'/edit/'+news._id} className="text-yellow-600">Edit</Link>
   </div>
  )}

  <hr className="my-6"/>
  
  <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
  
  {user && (
   <div className="mb-4 p-4 border rounded bg-gray-50">
    <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyPress={handleCommentKeyPress} placeholder="Add a comment... (Ctrl+Enter to submit)" className="border w-full p-2 rounded"/>
    <button onClick={addComment} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Post Comment</button>
   </div>
  )}

  <div className="space-y-4">
   {comments.map(c=>(
    <div key={c._id} className="border p-4 rounded bg-gray-50">
     <p className="font-bold text-sm">{c.author?.name}</p>
     {editingId===c._id?(
      <div className="mt-2">
       <textarea value={editContent} onChange={e=>setEditContent(e.target.value)} className="border w-full p-2 rounded"/>
       <div className="flex gap-2 mt-2">
        <button onClick={()=>saveEdit(c._id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Save</button>
        <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
       </div>
      </div>
     ):(
      <p className="mt-2">{c.content}</p>
     )}
     <div className="flex justify-between mt-2">
      <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
      {user && (String(user.id)===String(c.author?._id) || user.role==='admin') && (
       <div className="flex gap-2">
        {editingId!==c._id && <button onClick={()=>startEdit(c._id,c.content)} className="text-yellow-600 text-xs">Edit</button>}
        <button onClick={()=>delComment(c._id)} className="text-red-600 text-xs">Delete</button>
       </div>
      )}
     </div>
    </div>
   ))}
  </div>
 </div>
 )
}