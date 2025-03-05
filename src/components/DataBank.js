import { useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Label, Card, Container, Dropdown, Menu, Header, Grid, Icon, Modal, Segment, Divider } from "semantic-ui-react"
import { useCreateFolderMutation, useGetfoldersQuery, useGetUploadFiletoFolderQuery, useUploadFiletoFolderMutation } from "../features/api/apiSlice"
import { mastaplana_file } from "../API"
import { GradientDirection } from "@cloudinary/url-gen/qualifiers"
import { justify } from "@cloudinary/url-gen/qualifiers/textAlignment"

const initialState = {
    size: undefined,
    open: false,
    size_upload: undefined,
    open_upload: false
}

function uploadReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}
        case 'open_upload':
            return {open_upload: true, size_upload: action.size_upload}
        case 'close':
            return {open: false, open_upload: false}
        default:
            return new Error('An error has occurred')
    }

}

export const DataBank = ({mobile}) => {

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(uploadReducer, initialState)
    const {open, size, open_upload, size_upload} = state
    

    const [loading, setloading] = useState(false)

    const [f_name, setfoldername] = useState("")
    const [foldernameError, setfoldernameError] = useState(false)
    
    const [dummy_file, setdummy_file] = useState(null)
    let f_link
    let f_owner = sessionStorage.getItem("email")

    const handleFolderName = (e) => {
        setfoldername(e.target.value)
        //let file = new File([mastaplana_file], {type: 'text/plain',})
        let file = new File(["Welcome to mastaplana"], "welcome.txt", {type: "text/plain"})
    
        setdummy_file(file)
        //const reader = new FileReader()
        //reader.readAsDataURL(myBlob)
    }

    const [createFolder, {isLoading}] = useCreateFolderMutation()
    const saveFolder = [f_name].every(Boolean) && !isLoading

    const clickFolder = async () => {
        if(f_name === ""){
            setfoldernameError({content: 'Enter folder name', pointing: 'below'})
        }else{
            try{
               // if(saveFolder){
                    setloading(true)
                    let folderURL
                    const data = new FormData();
                    data.append("file", dummy_file);
                    data.append("upload_preset", "slakw5ml");
                    data.append("cloud_name", "du3ck2joa");
                    data.append("resource_type", "text")
                    data.append("folder", "mastaplana/" + f_name);

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/du3ck2joa/upload/`,
                        {
                          method: "POST",
                          body: data,
                        }
                      );
                      const res = await response.json();
                      folderURL = res.url.toString()
                      f_link = folderURL

                      await createFolder({f_name, f_owner, f_link}).unwrap()
                      setdummy_file(null)
                      setloading(false)
                      dispatch({type: 'open', size: 'mini'})

                //}
            }catch(error){
                console.log("An error has occurred" + error)
            }
        }

    }

    const [open_portal, setopen_portal] = useState(false)

    const handleopenPortal = () => setopen_portal(true)

    const handleclosePortal = () => setopen_portal(false)

    const [folder_id, setfolder_id] = useState()
    
    const [folder_name, setfolder_name] = useState("")

    const [folder_owner, setfolder_owner] = useState(sessionStorage.getItem("email"))

    const upload_open = (id, foldername) => {
        setfolder_id(id)
        setfolder_name(foldername)
        dispatch({type: 'open_upload', size_upload: 'mini'})
    }

    const [folder_count, setfolder_count] = useState(0)

    const {data:folders, isSuccess} = useGetfoldersQuery()

    const [createfolder_open, setcreatefolder_open] = useState(false)

    let folderList
    let folder = []
    if(isSuccess){
        folder = folders.filter(f => f.f_owner === sessionStorage.getItem("email"))
        folderList = folder.map(f => (
                <Grid.Column>
                    <Card fluid>
                        <Card.Header style={{border: 0}} > 
                            <Dropdown simple style={{float: 'right'}} icon="ellipsis vertical">
                                <Dropdown.Menu>
                                    <Dropdown.Item text="upload" icon="upload"
                                        onClick={() => upload_open(f.id, f.f_name)}

                                    />
                                    <Dropdown.Item text="open" icon="folder"
                                        onClick={() => open_folder(f.id, f.f_name)}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>       
                        </Card.Header>
                        <Card.Content>
                            <Icon name="folder" size="big" inverted color="green" />
                            {f.f_name}
                        </Card.Content>
                    </Card>
                    <br/>
                </Grid.Column>
        ))
    }

    const {data:folder_files} = useGetUploadFiletoFolderQuery()

    let fileToFolderList
    const [assets, setAssets] = useState(false)

    const open_folder = (folderId, foldername) => {
        setfolder_id(folderId)
        setfolder_name(foldername)
        setAssets(true)
    }

    if(isSuccess){
        const fileToFolder = folder_files.filter(f => f.folder_id === folder_id)
        fileToFolderList = fileToFolder.map(f => (
            <Grid.Row>
                <Grid.Column>
                    <Card>
                        <Card.Content>
                            <Icon name="file" size="big" inverted color="green" />
                            {f.folder_name}
                        </Card.Content>
                    </Card>
                  
                </Grid.Column>
                <br/>

            </Grid.Row>
           
        ))
    }
    

    const [activeItem, setactiveItem] = useState("Home")
    const handleItemClick = (e, {name}) => setactiveItem(name.value)

    const [file, setFile] = useState(null)

    const [check, setcheck]  = useState("")

    const [fileError, setfileError] = useState(false)

    let uploaded_link
    const [uploadFile] = useUploadFiletoFolderMutation()
    const uploadSave = [folder_id, folder_name, folder_owner].every(Boolean) && !isLoading


    const handlefileupload = (e) => {
        const f = e.target.files[0]
        setFile(f)
        const fr = new FileReader();
    }

    const uploadBtn = async () => {
        if(file === null){
            setfileError({content: 'No File Chosen', pointing: 'down'})
        }else{
            try{
                if(uploadSave){
                    setloading(true)
                    let fileURL
                    const data = new FormData()
                    data.append('file', file)
                    data.append("upload_preset", "slakw5ml");
                    data.append("cloud_name", "du3ck2joa");
                    data.append("resource_type", "text")
                    data.append("folder", "mastaplana/" + folder_name);

                    
                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/du3ck2joa/upload/`,
                        {
                        method: "POST",
                        body: data,
                        }
                    );
                    const res = await response.json();
                    fileURL = res.url.toString()
                    uploaded_link = fileURL
                        await uploadFile({folder_id, folder_name, folder_owner, uploaded_link}).unwrap()
                        setFile(null)
                        setloading(false)
                        setcheck("check")
                }
            }catch(Error){

            }
        }

    }

    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 20 : 40}}>
                <Grid>
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
                                content="DATA BANK" 
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
                            <Segment vertical floated="right" style={{ 
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
                                <Segment vertical style={{maxHeight: 500, padding: 20, borderRadius: 10, backgroundColor: '#fff'}}>
                                <Grid divided>
                                    <Grid.Row>
                                        <Grid.Column width={4}>
                                            <Header dividing as="h4" content="Media Assets" />
                                            <Menu size="small" secondary vertical>
                                                <Menu.Item 
                                                    name="Home" 
                                                    icon="home"
                                                    onClick={() => setcreatefolder_open(false)}
                                                />
                                                <Menu.Item 
                                                    name="Create Folders" 
                                                    icon="folder"
                                                    onClick={() => setcreatefolder_open(true)}       
                                                />

                                            </Menu>
                                           
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Grid>
                                               <Grid.Row>
                                                <Grid.Column>
                                                    <Header dividing textAlign="center" as="h4" content="Data Folders" />
                                                </Grid.Column>
                                                </Grid.Row>
                                                {
                                                    createfolder_open ?
                                                    <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column>
                                                            <Icon name="folder" />
                                                            Create Folder
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row>
                                                        <Grid.Column>
                                                            <Form>
                                                                <Form.Field>
                                                                    <Form.Input
                                                                        placeholder="Enter Name"
                                                                        value={f_name}
                                                                        onChange={handleFolderName}
                                                                        error={foldernameError}
                                                                        onClick={() => setfoldernameError(false)}
                                                                    />
                                                                </Form.Field>
                                                            </Form>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row>
                                                        <Grid.Column>
                                                            <Button
                                                                onClick={() => clickFolder()} 
                                                                size="big" 
                                                                color="green" 
                                                                circular 
                                                                icon="plus"
                                                                floated="right" 
                                                                loading={loading}
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid> 
                                                :
                                                <Grid>
                                                <Grid.Row>
                                                    <Divider />
                                                        <Grid.Column width={6}>
                                                            <Icon name="folder" />
                                                            All Folders ({folder.length})
                                                        </Grid.Column>
                                                        <Grid.Column width={6}>
                                                            <Icon name="refresh" />
                                                            Refresh
                                                        </Grid.Column>
                                                    <Divider />
                                                </Grid.Row>
                                                <Grid.Row columns={4}>
                                                    {folderList}
                                                </Grid.Row>
                                                </Grid>
                                                }
                                            </Grid> 
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            
                                            <Header dividing as="h4" textAlign="center" content="Folder Assets" />
                                                {assets ?
                                                    fileToFolderList
                                                    : 'No Folder Opened'
                                                }
                                              
                                           
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
                       Complete
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
                            Folder Created
                        </Header>
                    </Modal.Content>
                </Modal>

                <Modal
                    size={size_upload}
                    open={open_upload}
                >
                    <Modal.Header >
                       Upload File
                       <Icon 
                            onClick={() => dispatch({type: 'close'})}
                            link name="close" 
                            size="mini"
                            style={{float: 'right'}} 
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Icon size="large" name="folder open" />
                        {folder_name}
                        <Form size="large">
                            <Form.Field>
                                <Form.Input
                                    type="file"
                                    onChange={handlefileupload}
                                    placeholder="Upload File"
                                    error={fileError}
                                    onClick={() => setfileError(false)}
                                />
                            </Form.Field>
                            <Button icon
                                 onClick={uploadBtn} 
                                 color="green"
                                 loading={loading}
                            >
                                <Icon name={check} />
                                Upload
                            </Button>
                        </Form>
                    </Modal.Content>
                </Modal>
        </Segment>
        </Container>
    )
}