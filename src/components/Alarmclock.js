import {useState, useEffect} from 'react'
import {Segment, Header, Button, Grid, Input, Form, Icon} from 'semantic-ui-react'
import DateTimePicker from 'react-datetime-picker'

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { useSetAlarmMutation, useGetAlarmsQuery } from '../features/api/apiSlice';

export const Alarmclock = () => {
  const [clockTime, setClockTime] = useState("00:00:00");
  const [yearformat, setyearformat] = useState("00/00/00")

  // ^const [alarmTime, setAlarmTime] = useState("0");
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [aTime, setaTime] = useState("00:00:00");
  const [dcal, setdcal] = useState("00/00/00");

  const [status, setStatus] = useState(false);
  const [color, setColor] = useState("positive");
  const [play, setPlay] = useState('')

  const [description, setDescription] = useState("")
  const [descriptionError, setDescriptionError] = useState(false)

  const [loading, setLoading] = useState(false)
  const [check, setCheck] = useState("")

  const {data:all_alarms, isSuccess} = useGetAlarmsQuery()

    let count = 0
    if(isSuccess){
      const currentAlarms = all_alarms.filter(e => e.email === sessionStorage.getItem("email"))
        currentAlarms.map(alarm => (              
          ++count
        ))
      }
    
  useEffect(() => {
    let h = alarmTime.getHours();
    let m = alarmTime.getMinutes();
    let s = alarmTime.getSeconds();

    let dy = alarmTime.getDate();
    let mn = alarmTime.getMonth() + 1;
    let yr = alarmTime.getFullYear();

    if (h.toString().length === 1) h = "0" + h;
    if (m.toString().length === 1) m = "0" + m;
    if (s.toString().length === 1) s = "0" + s;

    if (dy.toString().length === 1) dy = "0" + dy;
    if (mn.toString().length === 1) mn = "0" + mn;
    if (yr.toString().length === 1) yr = "0" + yr;

    let atime = `${h}:${m}:${s}`;
    setaTime(atime)

    let dformat = `${mn}/${dy}/${yr}`;
    setdcal(dformat)
   
   // alert(clockTime)
    if (status && clockTime === aTime && yearformat === dcal) 
    {
      console.log("get up", clockTime, alarmTime);
      setPlay('https://res.cloudinary.com/du3ck2joa/video/upload/v1734954643/alarm_mastaplana/alarm2_cktu8c.wav')
      setStatus(false);
      alert(description)
      //setColor("positive")
    }
  }, [clockTime, alarmTime, status]);

  const updateClockTime = () => {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();

    let day = currentTime.getDate();
    let month = currentTime.getMonth() + 1;
    let year = currentTime.getFullYear();

    if (hours.toString().length === 1) hours = "0" + hours;
    if (minutes.toString().length === 1) minutes = "0" + minutes;
    if (seconds.toString().length === 1) seconds = "0" + seconds;

    let clockFormat = `${hours}:${minutes}:${seconds}`;
    setClockTime(clockFormat);

    if (day.toString().length === 1) day = "0" + day;
    if (month.toString().length === 1) month = "0" + month;
    if (year.toString().length === 1) year = "0" + year;

    let dateFormat = `${month}/${day}/${year}`;
    setyearformat(dateFormat)

  };

  const handleAlarmTimeChange = (value) => {
    setAlarmTime(value);
  };

  const [setAlarm, {isLoading}] = useSetAlarmMutation()
  const saveAlarm = [clockTime, aTime, yearformat, dcal, description].every(Boolean) && !isLoading
  
  const handleToggle = async () => {
    if(description === ""){
      setDescriptionError({content: "Enter Event", pointing: 'below'})
    }else{
      try{
        if(saveAlarm){
          setLoading(true)
          setStatus(!status);
          let email = sessionStorage.getItem("email")
          await setAlarm({email, clockTime, aTime, yearformat, dcal, description}).unwrap()
          setLoading(false)
          setCheck("check")
          //setDescription("")
        }
      }catch(error){
        console.log(error)
      }
      
    }
  };

  /*const handleReset = () => {
    setAlarmTime(new Date());
    setStatus(false);
    setPlay('')
  };*/

  useEffect(() => {
    setInterval(updateClockTime, 1000);
  }, []);

  const handleDescription = (e) => setDescription(e.target.value)

  return (
    <Segment vertical>
        <Grid textAlign="center">
            <Grid.Row>
                <Grid.Column>
                    <Header content="Current Time" />
                    {clockTime}

                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <DateTimePicker
                        calendarIcon={null}
                        clearIcon={null} 
                        value={alarmTime}
                        onChange={(value) => handleAlarmTimeChange(value)}
                    />
                  
                </Grid.Column>
               
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form>
                      <Form.Input
                        value={description}
                        error={descriptionError}
                        placeholder="Enter Event"
                        onChange={handleDescription}
                        onClick = {() => setDescriptionError(false)}
                      />
                    </Form>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                <audio src={play} autoPlay/>
                <Button color={color} onClick={handleToggle}>
                  <Icon loading={loading} name={check} />
                    {status ? "Stop Alarm" : "Set Alarm"}
                </Button>
                {/*<Button secondary onClick={handleReset}>
                    Reset Alarm
                </Button>*/}
                </Grid.Column>
            </Grid.Row>
        </Grid>

    </Segment>
    
    );
};