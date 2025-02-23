import axios from 'axios'

export default function getUsers(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/users",
            headers: {
                'Content-type': 'application/json',  
                Accept: 'application/json' 
            }
        })
    )
}

export function getUserMembers(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/members",
            headers: {
                'Content-type': 'application/json',  
                Accept: 'application/json' 
            }
        })
    )
}

export function getAlarms(){
    return(
        axios.create({
            baseURL: "https://backend-app-pied.vercel.app/api/alarms",
            headers: {
                'Content-type': 'application/json',  
                Accept: 'application/json' 
            }
        })
    )
}

export const  mastaplana_file  =  '..//..//src//mastaplana_logo.jpg'
