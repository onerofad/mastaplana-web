import { useEffect, useState } from "react"
import { getAlarms } from "../API"

export const AlarmRing = () => {

    const [dcal, setdcal] = useState("")  
    const [aTime, setaTime] = useState("")
    const [description, setDescription] = useState("")
    const [alarms, setalarms] = useState([])

    useEffect(() => {
        getAllAlarms()
    },[])

    const getAllAlarms = () => {
        getAlarms().get("/")
        .then(res => setalarms(res.data))
        .catch(error => console.log(error))
    }

    const getTheAlarm = () => {
        if(sessionStorage.getItem("email")){
            const alarm = alarms.filter(e => e.emal === sessionStorage.getItem("email"))
        }
    }

    useEffect(() => {
        setInterval(getTheAlarm, 1000)
    },[])
    

}