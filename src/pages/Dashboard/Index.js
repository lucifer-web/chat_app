import React, {useEffect} from 'react'
import './Index.css'
import { Link } from 'react-router-dom';
import Img from '../../images/images.jpg'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {AiOutlineSend} from 'react-icons/ai'
import styled from 'styled-components';
import axios from 'axios';
import { API_URLs } from '../../Utils/ApiUrls';
import { useState } from 'react';
const Input = styled.input`
width: 95%;
border: none;
outline: none;
border-radius: 20px;
margin: 5px;
padding: 3px 10px;
&:placeholder{
    color: lightgrey;
}
`
const Div = styled.div`
height: 83vh;
overflow:scroll;
overflow-x:hidden;
&::-webkit-scrollbar {
    display: none;
}
`
const Div1 = styled.div`
height: 89vh;
overflow:scroll;
overflow-x:hidden;
&::-webkit-scrollbar {
    display: none;
}
`

const Chat = [
    {
        name: 'gaurav',
        chat: 'hi',
        date: '10/07/23 02:43'
    },
    {
        name: 'krishna',
        chat: 'hello',
        date: '10/07/23 02:44'
    },
    {
        name: 'gaurav',
        chat: 'hru?',
        date: '10/07/23 03:05'
    },
    {
        name: 'krishna',
        chat: 'fine!',
        date: '10/07/23 03:06'
    },
    {
        name: 'krishna',
        chat: 'you?',
        date: '10/07/23 03:06'
    },
    {
        name: 'gaurav',
        chat: 'fine too.!!',
        date: '10/07/23 03:07'
    },
    {
        name: 'krishna',
        chat: 'ok',
        date: '10/07/23 03:09'
    },
    {
        name: 'gaurav',
        chat: 'bye',
        date: '10/07/23 03:10'
    },
]
export default function Index(){
    const[arr,setArr]=useState([])
    const[msg,setmsg]=useState('')
    const[profile,setProfile]=useState([]);
    const[chat,setChat]=useState([])
    const msgHandle=(e)=>{
        setmsg(e.target.value)
    }
    useEffect(()=>{
        axios.get(API_URLs.getProfile,{
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res)=>{
            // console.log(res);
            setProfile(res.data.userd)
        })
        .catch((error)=>{
            console.log(error);
        })
    },[])
    console.log('prrofile', profile);
    const sendChat=()=>{
        axios.post(API_URLs.sendChat(localStorage.getItem('key')),{
            msg: msg
        },{
            headers:{
                'Content-type': 'application/json',
                'Authorization':`Bearer ${localStorage.getItem('jwt')}` 
            }
        })
        .then((res)=>{
            console.log(res);
            getChat(localStorage.getItem('key'));
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    const getChat= async(id)=>{
        axios.get(API_URLs.getChat(id),{
            headers:{
                'Content-type': 'application/json',
                'Authorization':`Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res)=>{
            console.log(res);
            setChat(res?.data?.chats);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    // useEffect(()=>{
    //     getChat();
    // },[])
    console.log('chat',chat)
    const handleInitiate = async(id)=>{
        axios.post(API_URLs.initializeChat(id),{},{
            headers:{
                'Content-type': 'application/json',
                'Authorization':`Bearer ${localStorage.getItem('jwt')}` 
            }
        })
        .then(async(res)=>{
            console.log(res);
            localStorage.setItem('key',res?.data?.txn_id)
           await getChat(res?.data?.txn_id);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    useEffect(()=>{
        axios.get(API_URLs.userList,{
            headers:{
                'accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then((res)=>{
            // console.log(res);
            var data =[];
            for(var key in res?.data?.users){
                var rowdata = res?.data?.users[key]
                data.push({
                    logo: Img,
                    name: rowdata.name,
                    id: rowdata._id
                })
                setArr(data);
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])
    return(
        <div className="row m-0 p-3 d-flex justify-content-center " style={{height: '100vh'}}>
            <div className="card col-md-3 p-0">
                <div className='bg-secondary d-flex justify-content-between p-1 align-items-center'>
                    <div className='d-flex gap-2 align-items-center'>
                        <img src={profile?.image_url} alt='' className='rounded-circle' width='45px' height="45px"/>
                        <div>
                            <p className='mb-0 text-white fs-6 fw-bold'>{profile?.user?.name}</p>
                            <p className='status text-white mb-0'>No Status!!</p>

                        </div>
                    </div>
                    <div className="dropdown">
                        <button className='menu-button'type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <BsThreeDotsVertical size={18} color='white'/>    
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <p as={Link} className='mb-0' to='/profile'>Profile</p >
                            <hr/>
                            <p as={Link} className='mb-0'>Logout</p >
                        </div>
                    </div>
                </div>
                <Div1>
                    {
                        arr.map((val)=>{
                            return(
                                <div className='p-2 d-flex gap-2 border-bottom align-items-center' onClick={()=>handleInitiate(val.id)}>
                                    <img src={val?.logo} alt='' className='rounded-circle' width='35px' height="35px"/> 
                                    <div>
                                        <p className='mb-0'>{val?.name}</p>
                                        {/* <p className='mb-0 status'>{val.status}</p> */}
                                    </div>
                                </div>
                            );
                        })
                    }
                </Div1>
            </div>
            <div className="card col-md-9 p-0">
                <div className='bg-secondary d-flex justify-content-between p-1 align-items-center'>
                    <div className='d-flex gap-2 align-items-center'>
                        <img src={Img} alt='' className='rounded-circle' width='45px' height="45px"/>
                        <div>
                            <p className='mb-0 text-white fs-6 fw-bold'>Krishna</p>
                            <p className='status text-white mb-0'>can't Talk, G-Chat only</p>

                        </div>
                    </div>
                    <div className="dropdown">
                        <button className='menu-button'type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <BsThreeDotsVertical size={18} color='white'/>    
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <p as={Link} className='mb-0' to='/profile'>Profile</p >
                            <hr/>
                            <p as={Link} className='mb-0'>Logout</p >
                        </div>
                    </div>
                </div>
                <Div className='p-3'>
                {
                   chat && chat.length>0 && chat.map((val)=>{
                        return(
                            <div>
                                <div>
                                    { val?.sender?.name!==profile?.user?.name ? 
                                    <div>
                                        <p className='text-start mb-0'>{val?.msg}</p>
                                    </div>
                                    : 
                                    <div>
                                        <p className='text-end mb-0'>{val?.msg}</p>
                                    </div>}
                                </div>
                            </div>
                        );
                    })
                }
                </Div>
                <div className='bg-secondary d-flex align-items-center gap-3'>
                    <Input
                    value={msg}
                    onChange={msgHandle}
                    placeholder='Enter Your Message Here'
                    />
                    <AiOutlineSend onClick={()=>sendChat()} size={25} color='white'/>
                </div>
            </div>
        </div>
    );
}