import { Container, Grid, Segment, Image, Header, Dropdown, Icon, Form, Button, Modal, List } from "semantic-ui-react"
import { Link, useNavigate } from "react-router-dom"
import { useReducer, useState, useEffect } from "react"
import { useGetUploadAudiosQuery, useUploadAudioMutation } from "../features/api/apiSlice"
import H5AudioPlayer from "react-h5-audio-player"
import 'react-h5-audio-player/lib/styles.css'
import '../audio.webp'
import emailjs from '@emailjs/browser'
import { getUserMembers } from "../API";


const initialState = {
    size: undefined,
    open: false
}

function uploadReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}
        case 'close':
            return {open: false}
        default:
            return new Error('An error has occurred')
    }

}

const Audio = ({mobile}) => {

    const [members, setmembers] = useState([])
    useEffect(() => {
        getAllMembers()
    })

    const getAllMembers = () => {
        getUserMembers().get("/")
        .then(res => setmembers(res.data))
        .catch(error => console.log('An error has occurred ' + error))
    }

    const [check, setcheck] = useState(false)

        const [usertype, setusertype] = useState("")

        const [msgerror, setmsgerror] = useState("")

        const handleusertype = (e) => {
            setusertype(e.target.value)
        }

    const navigate = useNavigate()

    const [source, setSource] = useState('')

    const [state, dispatch] = useReducer(uploadReducer, initialState)
    const {open, size} = state

    const [loading, setloading] = useState(false)

    const [audio, setAudio] = useState(null);

    let members_options = []
            const current_community = members.filter(c => c.memberEmail === sessionStorage.getItem("email"))[0]
            if(current_community){
                members.map(c => (
                    (c.community === current_community.community && c.memberEmail !== current_community.memberEmail)  ?                   
                    members_options.push({key: c.id, text: c.memberEmail, value: c.memberEmail})
                    : '<></>'
                ))
            }
    
    let uploaded_audio
    let filesender = sessionStorage.getItem("email")
    const [fileowner, setfileowner] = useState('')

    const [fileownerError, setfileownerError] = useState(false)
    const [upload_audioError, setupload_audioError] = useState(false)

    const handlefileowner = (e, {value}) => {
        setfileowner(value)
    }

    const handleAudio = (e) => {
        const file = e.target.files[0]
        setAudio(file)

        const reader = new FileReader();
        reader.readAsDataURL(file)
    }

    const {data:uploads, isSuccess} = useGetUploadAudiosQuery()

    let files_uploaded
    let pos = 49
    let substr = "fl_attachment/"
    if(isSuccess){
        files_uploaded = uploads.map(m => {
            if(m.fileowner === sessionStorage.getItem("email")){
                return(
                        <List.Item>
                            <List.Icon name="file audio outline" />
                            <List.Content>
                                <List.Header>{m.filesender}</List.Header>
                                <List.Description style={{wordWrap: 'break-word'}}>
                                    {m.uploaded_audio.substring(78)}
                                    <Header as="h4" content={m.file_date} />
                                    <Link onClick={() => setSource(m.uploaded_audio)}>
                                        <Icon name="play" /> play &nbsp;
                                    </Link>
                                    <Link to={[m.uploaded_audio.slice(0, pos), substr, m.uploaded_audio.slice(pos)].join('')}>  
                                        <Icon name="download" />download
                                    </Link>
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    
                )
            }
    })
    }

    const [uploadAudio, {isLoading}] = useUploadAudioMutation()
    const saveAudio = [fileowner, filesender].every(Boolean) && !isLoading

    const sendAudio = async () => {
        if(usertype === '' && fileowner === ''){
            setmsgerror("You must Enter a member email or non-member email")
        }else if(usertype !== '' && fileowner !== ''){
            setmsgerror("You must choose a member email or non-member email")
        }else if(audio === null){
            setupload_audioError({content: 'Select a file', pointing: 'above'})
        }else{
            try{
                if(saveAudio){
                    setloading(true)
                    let audioURL
                    const data = new FormData();
                    data.append("file", audio);
                    data.append("upload_preset", "slakw5ml");
                    data.append("cloud_name", "du3ck2joa");
                    data.append("resource_type", "video")
                    data.append("folder", "mastaplana_audio");

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/du3ck2joa/upload/`,
                        {
                          method: "POST",
                          body: data,
                        }
                      );
                      const res = await response.json();
                      audioURL = res.url.toString()
                      uploaded_audio = audioURL

                      await uploadAudio({fileowner, uploaded_audio, filesender}).unwrap()
                      setloading(false)
                      dispatch({type: 'open', size: 'mini'})

                }else if(usertype !== ''){
                    setloading(true)
                    let audioURL
                    const data = new FormData();
                    data.append("file", audio);
                    data.append("upload_preset", "slakw5ml");
                    data.append("cloud_name", "du3ck2joa");
                    data.append("resource_type", "video")
                    data.append("folder", "mastaplana_audio");

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/du3ck2joa/upload/`,
                        {
                          method: "POST",
                          body: data,
                        }
                      );
                      const res = await response.json();
                      audioURL = res.url.toString()
                      uploaded_audio = audioURL
                      emailjs.send("service_k0d80hp","template_mp8ld0f",{
                        to_name: usertype,
                        message: `${uploaded_audio}`,
                        to_email: usertype,
                        from_email: filesender
                    },  {publicKey: 'A3D4HSPHNJ8f_odij'});
                      //await uploadAudio({fileowner, uploaded_audio, filesender}).unwrap()
                      setloading(false)
                      dispatch({type: 'open', size: 'mini'})

                }
            }catch(error){

            }
        }
    }

    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 20 : 40}}>
                <Grid>
                    {/*<Grid.Row>
                        <Grid.Column width={2}>
                            <Image
                                src="../mastaplana_logo.jpg"
                            />
                        </Grid.Column>
                        <Grid.Column verticalAlign="middle" width={14}>
                            <Header 
                                content="MASTA PLANA" 
                                as="h1" 
                                inverted
                                style={{
                                    fontFamily: 'Spicy Rice',
                                    fontWeight: 400,
                                    fontStyle: 'normal'
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>*/}
                    <Grid.Row>
                        <Grid.Column width={ mobile ? 4 : 6} verticalAlign="middle">
                            <Link style={{ fontSize: 20, color: '#fff'}} to="/dashboard">
                                <Icon inverted name="angle left" color="green" size='big' />
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={ mobile ? 4 : 6} verticalAlign="middle">
                            <Header 
                                as={ mobile ? 'h4' : 'h1'} 
                                inverted 
                                content="AUDIO" 
                                color="#fff" 
                                style={{
                                    fontFamily: 'Spicy Rice',
                                    fontWeight: 400,
                                    fontStyle: 'normal'
                                }}
                            />
                        </Grid.Column>
                        <Grid.Column width={ mobile ? 4 : 2} verticalAlign="middle">
                            <Icon name="calendar alternate outline" inverted color="#fff" size="big" />
                        </Grid.Column>
                        <Grid.Column width={ mobile ? 4 : 2} style={{textAlign: 'center'}}>
                            <Segment floated="right" vertical style={{ 
                                alignSelf: 'right', 
                                alignContent: 'center',
                                textAlign: 'center',
                                width: 50, 
                                height: 50, 
                                borderRadius: 100,
                                backgroundColor: '#fff'
                            }}>
                                <Dropdown 
                                    text={
                                        sessionStorage.getItem("fname").charAt(0).toUpperCase()
                                        + " " +
                                        sessionStorage.getItem("lname").charAt(0).toUpperCase()
                                    } 
                                    inline
                                >
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => navigate("/signin")}>
                                        Log out
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row> 
                    <Grid.Row>
                        <Grid.Column>
                            <Segment vertical style={{padding: 20, borderRadius: 10, backgroundColor: '#fff'}}>
                                <Grid>
                                    {/*<Grid.Row>
                                        <Grid.Column>
                                            <Header textAlign="center" as="h2" content="AUDIO" />
                                        </Grid.Column>
                                    </Grid.Row>*/}
                                    <Grid.Row>
                                        <Grid.Column width={mobile ? 16 : 5} style={{marginTop: 10}}>
                                        <Form>
                                        {msgerror}

                                            <Form.Field>
                                                <Form.Input
                                                    placeholder="Enter Email (For none members)"
                                                    value={usertype}
                                                    onChange={handleusertype}
                                                    onClick={() => setmsgerror("")}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Dropdown
                                                    placeholder="Members"
                                                    selection
                                                    clearable
                                                    value={fileowner}
                                                    onChange={handlefileowner}
                                                    options={members_options}
                                                    onClick={() => setmsgerror("")}

                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Form.Input
                                                    type="file"
                                                    placeholder="Select a file"
                                                    error={upload_audioError}
                                                    onChange={handleAudio}
                                                    onClick={() => setupload_audioError(false)}
                                                />
                                            </Form.Field>
                                            <Button 
                                                onClick={sendAudio}  
                                                size="large" color="green"
                                                loading={loading}
                                            >
                                            Send Audio
                                            </Button>
                                          
                                        </Form>
                                        </Grid.Column>
                                       
                                        <Grid.Column width={ mobile ? 16 : 6} style={{marginTop: 0}}>
                                          <Segment vertical style={{ padding: 10, borderRadius: 10}}>
                                              <Image
                                                src="../audio.webp"
                                                fluid
                                              />
                                                <H5AudioPlayer
                                                    autoPlay
                                                    src={source}
                                                    style={{backgroundColor: 'ThreeDFace'}}
                                                />
                                              
                                          </Segment>
                                        </Grid.Column>
                                        <Grid.Column width={ mobile ? 16 : 5} style={{marginTop: 0}}>
                                            <Header as="h4" content="RECEIVED AUDIOS" />

                                         <List size="small" icon relaxed celled style={{maxHeight: 300, overflowY: 'auto'}}>
                                        

                                                {files_uploaded}
                                          </List>
                                                   
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>

                            </Segment>
                        </Grid.Column>
                    </Grid.Row>     
                </Grid>
                <Modal
                    size={size}
                    open={open}
                >
                    <Modal.Header >
                        Audio upload complete
                       <Icon 
                            onClick={() => dispatch({type: 'close'})}
                            link name="close" 
                            size="tiny"
                            style={{float: 'right'}} 
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Header textAlign="center"  icon>
                            <Icon inverted circular size={20} name="checkmark" color="green" />
                            Audio upload successfull
                        </Header>
                    </Modal.Content>
                </Modal>
        </Segment>
        </Container>

    )
}
export default Audio