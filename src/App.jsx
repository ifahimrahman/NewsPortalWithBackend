import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NewsList from './pages/NewsList.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import CreateNews from './pages/CreateNews.jsx'
import EditNews from './pages/EditNews.jsx'

export default function App(){
 return(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/news" element={<NewsList/>}/>
    <Route path="/news/:id" element={<NewsDetail/>}/>
    <Route path="/create" element={<CreateNews/>}/>
    <Route path="/edit/:id" element={<EditNews/>}/>
   </Routes>
  </BrowserRouter>
 )
}