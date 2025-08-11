import React, { use, useEffect, useState } from "react";






function App() {
  interface todoList{
    id:number;
    details:string;
    mark:boolean;
    time:string;
  }
  const [author, setAuthor]=useState('')
  const [quote, setQuote]=useState('')
  const [input, setInput]=useState<todoList>({
    id:0,
    details:'',
    mark:false,
    time:''
  });
  const [submit, setSubmit]=useState<todoList[]>(()=>{
    const save=localStorage.getItem('submit');
    return save?JSON.parse(save):[]
  })

  useEffect(()=>{
   localStorage.setItem('submit', JSON.stringify(submit))
  },[submit])


  const updateinput=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name, type, checked, value}=e.target;
    setInput(prev=>({...prev, [name]:type==='checkbox' ? checked:value }))
  }

  const updateSubmit=(e:React.FormEvent)=>{
    e.preventDefault();
    const time=new Date();
    const updatetime=time.toLocaleString("en-US",{
      year:'numeric',
      month:"short",
      day:"numeric",
      hour:'2-digit',
      minute:'2-digit',
      second:'2-digit'
    })
    setSubmit( prev=>([...prev,{...input,id:Date.now(), time:updatetime }]))
    setInput({id:0,
    details:'',
    mark:false,
    time:''})
  }
  const updateMask = (id:number)=>{
    setSubmit(prev=>prev.map(item=>item.id===id ?{...item, mark:!item.mark}:item))
  }

  const del=(id:number)=>{
    setSubmit(prev=>prev.filter(item=>item.id!==id))
  }

  const setapi=async()=>{
    try {
      const res=await fetch( "https://api.allorigins.win/get?url=https://zenquotes.io/api/random")
    const result=await res.json();
    const json=JSON.parse(result.contents)
    console.log(json);
    const quotq=json[0].q
    const quota=json[0].a
    setQuote(quotq);
    setAuthor(quota)

    } catch (error) {
      console.log('error', error);
      
    }
      }

      useEffect(()=>{
          setapi()
      },[])
 
  return(
    <div className="min-h-screen py-6 flex justify-center items-center">
     <div className="bg-[#669bbc] w-[95%] md:w-[90%] lg:w-[60%] p-4 h-auto flex-col  items-center rounded-md">
      <form onSubmit={updateSubmit} className="flex justify-center gap-4 items-center mt-4">
        <input name="details" value={input.details} onChange={updateinput} type="text" className="bg-white p-4 w-40 md:w-[450px] h-15 md:h-20 rounded-md"/>
        <input name="mark" checked={input.mark} onChange={updateinput} type="checkbox" className="appearance-none w-4 h-4 rounded-md bg-white checked:bg-[#003049] "/>
        <button onClick={()=>updateMask(input.id)} className="bg-[#003049] font-bold md:text-2xl rounded-md transform hover:bg-[#ffd900] duration-100 hover:scale-110 text-white w-auto p-2 md:p-6 ">Submit</button>
      </form>

      {submit.map((ite)=>
      <div key={ite.id}>
       <div className="flex flex-col rounded-md mx-auto mt-4 md:w-2/3 h-auto  bg-[#ffd900] w-65 p-4 ">
        <div className="hidden md:flex justify-between w-full items-center gap-1">
          <p onChange={()=>updateMask(ite.id)} style={{textDecoration:ite.mark?'line-through':'none'}} className="text-white  bg-[#003049] p-4 rounded-md text-xl">{ite.details}</p>
          <p className="text-white  w-auto nowrap text-xl">{ite.time}</p>
          <div className="flex gap-2">
          <button onClick={()=>updateMask(ite.id)} style={{background:ite.mark?'red':'indigo'}}  className="w-30  text-white rounded-md p-4  transform duration-100 hover:bg-[#ffd900] hover:scale-110">{ite.mark ? 'unmark':'mark'}</button>
          <button onClick={()=>del(ite.id)} className="w-30 bg-[#003049] text-white rounded-md p-4  transform duration-100 hover:bg-[#ffd900] hover:scale-110">Delete</button>
        </div>
        </div>
        <div className="flex gap-2">
        <div className="sm:hidden flex justify-between w-[300px] items-center gap-2">
          <p className="text-white  w-auto p-2  bg-[#003049] ">{ite.details}</p>
         <p className="text-white ">{ite.time}</p>
           <div className="flex flex-col justify-between items-center gap-2">
          <button onClick={()=>updateMask(ite.id)} style={{background:ite.mark?'red':'indigo'}}  className="w-20  text-white rounded-md p-4  transform duration-100 hover:bg-[#ffd900] hover:scale-110">{ite.mark ? 'unmark':'mark'}</button>
          <button onClick={()=>del(ite.id)} className="w-20 bg-[#003049] text-white rounded-md p-4  transform duration-100 hover:bg-[#ffd900] hover:scale-110">Delete</button>
          </div>
        </div>
        </div>
      </div>
      </div>
      )}
        <div className="flex flex-col rounded-md mx-auto mt-4 md:w-2/3 h-auto  bg-[#003049] w-65 p-4">
        {quote.length>0 ?(
        <div>
         <h1 className="text-white font-bold">{author}</h1>
        <p className="text-white">{quote}</p>
           </div>):(<h1 className="text-center text-white">Quote not available</h1>)}    
           </div>   
      </div>
    </div>
  )
}
export default App