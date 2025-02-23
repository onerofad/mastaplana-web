import { useNavigate } from "react-router-dom"
import { Grid, Header, Segment, Icon, Container, Dropdown, TextArea, Button, Modal, Form, Image, List, Placeholder } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { useReducer, useState, useEffect } from "react"
import { useGetUploadFilesQuery, useUploadFileMutation } from "../features/api/apiSlice";
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
const Photos = ({mobile}) => {

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


    const [state, dispatch] = useReducer(uploadReducer, initialState)
    const {open, size} = state

    const navigate = useNavigate()

    const {data:uploads, isSuccess} = useGetUploadFilesQuery()

    let files_uploaded
    let pos = 49
    let substr = "fl_attachment/"
    if(isSuccess){
        files_uploaded = uploads.map(m => {
            if(m.fileowner === sessionStorage.getItem("email")){
                return(
                        <List.Item>
                            <List.Icon name="file image outline" />
                            <List.Content>
                                <List.Header>{m.filesender}</List.Header>
                                <List.Description style={{wordWrap: 'break-word'}}>
                                    {m.uploaded_file.substring(72)}
                                    <Header as="h4" content={m.file_date} />
                                    <Link onClick={() => setPreview(m.uploaded_file)}>
                                        <Icon name="eye" /> view &nbsp;
                                    </Link>

                                    <Link to={[m.uploaded_file.slice(0, pos), substr, m.uploaded_file.slice(pos)].join('')}>  
                                        <Icon name="download" /> download
                                    </Link>
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    
                )
            }
    })
    }

    let members_options = []
            const current_community = members.filter(c => c.memberEmail === sessionStorage.getItem("email"))[0]
            if(current_community){
                members.map(c => (
                    (c.community === current_community.community && c.memberEmail !== current_community.memberEmail)  ?                   
                    members_options.push({key: c.id, text: c.memberEmail, value: c.memberEmail})
                    : '<></>'
                ))
            }
    

    const fileUpload = () => {
        dispatch({type: 'open', size: 'mini'})
    }

    const [image, setImage] = useState(null);
    let uploaded_file
    let filesender = sessionStorage.getItem("email")

    const [preview, setPreview] = useState(null);

    const [loading, setloading] = useState(false)
    const [fileowner, setfileowner] = useState('')

    const [fileownerError, setfileownerError] = useState(false)
    const [upload_fileError, setupload_fileError] = useState(false)

    const handlefileowner = (e, {value}) => {
        setfileowner(value)
    }

    const handleFile = (e) => {
        const file = e.target.files[0]
        setImage(file)

        const reader = new FileReader();
        reader.readAsDataURL(file)
    

        reader.onload = () => {
            setPreview(reader.result)
        }
    }


    const [uploadFile, {isLoading}] = useUploadFileMutation()
    const saveFile = [fileowner, filesender].every(Boolean) && !isLoading

    const sendFile = async () => {
        if(usertype === '' && fileowner === ''){
            setmsgerror("You must Enter a member email or non-member email")
        }else if(usertype !== '' && fileowner !== ''){
            setmsgerror("You must choose a member email or non-member email")
        }else if(image === null){
            setupload_fileError({content: 'Select a file', pointing: 'above'})
        }else{
            try{
                if(saveFile){
                    setloading(true);
                    let imageURL
                    const data = new FormData();
                    data.append("file", image);
                    data.append("upload_preset", "slakw5ml");
                    data.append("cloud_name", "du3ck2joa");
                    data.append("transformations", "fl_attachment")
                    data.append("folder", "mastaplana");

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/du3ck2joa/image/upload/`,
                        {
                          method: "POST",
                          body: data,
                        }
                      );
                      const res = await response.json();
                      imageURL = res.url.toString()
                      //alert(imageURL)
                      uploaded_file = imageURL
                      //setUrl(res.url.toString());

                      await uploadFile({fileowner, uploaded_file, filesender}).unwrap()
                      setfileowner('')
                      setPreview(null)
                      setImage(null)
                      //setUrl('')
                      setloading(false)
                      dispatch({type: 'open', size: 'mini'})
                }else if(usertype !== ''){
                    setloading(true);
                    let imageURL
                    const data = new FormData();
                    data.append("file", image);
                    data.append("upload_preset", "slakw5ml");
                    data.append("cloud_name", "du3ck2joa");
                    data.append("transformations", "fl_attachment")
                    data.append("folder", "mastaplana");

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/du3ck2joa/image/upload/`,
                        {
                          method: "POST",
                          body: data,
                        }
                      );
                      const res = await response.json();
                      imageURL = res.url.toString()
                      //alert(imageURL)
                      uploaded_file = imageURL
                      //setUrl(res.url.toString());
                      emailjs.send("service_k0d80hp","template_mp8ld0f",{
                        to_name: usertype,
                        message: `${uploaded_file}`,
                        to_email: usertype,
                        from_email: filesender
                    },  {publicKey: 'A3D4HSPHNJ8f_odij'});
                   
                      //await uploadFile({fileowner, uploaded_file, filesender}).unwrap()
                      //setfileowner('')
                      setPreview(null)
                      setImage(null)
                      //setUrl('')
                      setloading(false)
                      dispatch({type: 'open', size: 'mini'})
                }


            }catch(error){
                console.log('An error has occurred ' + error)
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
                                content="PHOTOS" 
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
                                            <Header textAlign="center" as="h2" content="PHOTOS" />
                                        </Grid.Column>
                                    </Grid.Row>*/}
                                    <Grid.Row>
                                        <Grid.Column width={ mobile ? 16 : 5} style={{marginTop: 10}}>
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
                                                <Form.Dropdown
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
                                                accept="image/*"
                                                error={upload_fileError}
                                                onChange={handleFile}
                                                onClick={() => setupload_fileError(false)}
                                            />
                                            </Form.Field>
                                            <Button 
                                                loading={loading} 
                                                onClick={sendFile} 
                                                size="large" 
                                                color="green"
                                                content="Send Photo"
                                                icon={check}
                                            />                                          
                                        </Form>
                                        </Grid.Column>
                                        <Grid.Column width={ mobile ? 16 : 6} style={{marginTop: 0}}>
                                          <Segment vertical style={{ padding: 10, height: 300, borderRadius: 10}}>
                                            {preview ? 
                                                <Image 
                                                    src={preview} 
                                                    alt="preview" 
                                                    style={{width: '100%', height: '100%'}} 
                                                     centered
                                                     inline
                                                /> :
                                                <Placeholder fluid style={{width: '100%', height: '100%'}}>
                                                    <Placeholder.Image />
                                                </Placeholder>
                                            }
                                           

                                          </Segment>
                                        </Grid.Column>
                                        <Grid.Column width={ mobile ? 16 : 5} style={{marginTop: 0}}>
                                            <Header as="h4" content="RECEIVED PHOTOS" />
                                          <List size="small" icon divided style={{maxHeight: 300, overflowY: 'auto'}}>

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
                        Photo upload complete
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
                            Photo upload successfull
                        </Header>
                    </Modal.Content>
                </Modal>
        </Segment>
        </Container>

    )

}
export default Photos