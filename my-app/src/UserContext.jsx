
import { createContext, useState,useEffect } from "react";
import axios from "axios";
export const UserContext=createContext({});

export function UserContextProvider({children}){
    const [user,setUser]=useState(null)
    const [ready,setReady]=useState(false)
    useEffect(()=>{
        if(!user){
            axios.get('http://localhost:5000/api/users/me').then(({data})=>{
                setUser(data);
                setReady(true)
            })
        }           
      },[])

    return(
        <UserContext.Provider value={{user,setUser,ready}}>
            <div>{children}</div>
        </UserContext.Provider>
    )
}
