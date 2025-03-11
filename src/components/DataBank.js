import { useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Card, Container, Dropdown, Menu, Header, Grid, Icon, Modal, Segment, List } from "semantic-ui-react"
import { useCreateFolderMutation, useDeleteFileMutation, useDeleteFolderMutation, useGetfoldersQuery, useGetUploadFiletoFolderQuery, useUploadFiletoFolderMutation } from "../features/api/apiSlice"

const initialState = {
    size: undefined,
    open: false,
    size_upload: undefined,
    open_upload: false,
    open_file: false,
    size_file: undefined,
    open_delete: false,
    size_delete: undefined,
    open_delete_fold: false,
    size_delete_fold: undefined
}

function uploadReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}
        case 'open_upload':
            return {open_upload: true, size_upload: action.size_upload}
        case 'open_file':
            return {open_file: true, size_file: action.size_file}
        case 'open_delete':
            return {open_delete: true, size_delete: action.size_delete}
        case 'open_delete_fold':
            return {open_delete_fold: true, size_delete_fold: action.size_delete_fold}
        case 'close':
            return {open: false, open_upload: false, open_file: false, open_delete: false, open_delete_fold: false}
        default:
            return new Error('An error has occurred')
    }

}

export const DataBank = ({mobile}) => {

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(uploadReducer, initialState)
    const {
            open, size, 
            open_upload, size_upload, 
            open_file, size_file,
            open_delete, size_delete,
            open_delete_fold, size_delete_fold
          } = state
    

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

    const [folder_id, setfolder_id] = useState()
    
    const [folder_name, setfolder_name] = useState("")

    const [folder_owner, setfolder_owner] = useState(sessionStorage.getItem("email"))

    const upload_open = (id, foldername) => {
        setfolder_id(id)
        setfolder_name(foldername)
        dispatch({type: 'open_upload', size_upload: 'mini'})
    }

    const {data:folders, isSuccess} = useGetfoldersQuery()

    const [createfolder_open, setcreatefolder_open] = useState(false)

    let folderList
    let folder = []
    if(isSuccess){
        folder = folders.filter(f => f.f_owner === sessionStorage.getItem("email"))
        folderList = folder.map(f => (
                <Grid.Column>
                    <Card fluid>
                        <Card.Content>
                        <Dropdown simple style={{float: 'right'}}>
                            <Dropdown.Menu>
                                <Dropdown.Item text="upload" icon="upload"
                                    onClick={() => upload_open(f.id, f.f_name)}
                                />
                                <Dropdown.Item text="open" icon="folder"
                                    onClick={() => open_folder(f.id, f.f_name)}
                                />
                                <Dropdown.Item text="delete" icon="trash"
                                    onClick={() => open_delete_folder(f.id, f.f_name)}
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                            <Icon name="folder" size="big" inverted color="green" />
                            <Header as="h4">
                                {f.f_name}
                            </Header>
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

    const [delete_folder_check, set_delete_folder_check] = useState("")
    const [ removeFolder ] = useDeleteFolderMutation()

    const delete_folder = async (id) => {
        try{
            setloading(true)
            await removeFolder(id).unwrap()
            setloading(false)
            set_delete_folder_check("check")
        }catch(error){
            console.log("An error has occurred " + error)
        }
    }

    const [file_id, setfile_id] = useState()

    const [file_name, setfile_name] = useState("")

    const [file_size, setfile_size] = useState()

    const [file_link, setfile_link] = useState("")

    const open_file_btn = (fid, fname, fsize, flink) => {
        setfile_id(fid) 
        setfile_name(fname)
        setfile_size(fsize)
        setfile_link(flink)
    
        dispatch({type: 'open_file', size_file: 'mini'})
    }

    const [fold_name, setfold_name] = useState("")
    const [fold_id, setfold_id] = useState()

    const open_delete_btn = (id, fname) => {
        setfile_id(id)
        setfile_name(fname)
        dispatch({type: 'open_delete', size_delete: "mini"})
    }

    const open_delete_folder = (id, fname) => {
        setfold_id(id)
        setfold_name(fname)
        dispatch({type: 'open_delete_fold', size_delete_fold: "mini"})
    }

    if(isSuccess){
        const fileToFolder = folder_files.filter(f => f.folder_id === folder_id)
        fileToFolderList = fileToFolder.map(f => (
            <List.Item>
                <List.Content floated="right">
                    <Dropdown simple icon="ellipsis vertical" style={{float: 'right'}}>
                        <Dropdown.Menu>
                            <Dropdown.Item text="Download" icon="save"
                                onClick={() => saveFileBtn(f.id, f.uploaded_link)}
                            />
                            <Dropdown.Item text="Delete" icon="trash"
                                onClick={() => open_delete_btn(f.id, f.fileName)}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </List.Content>
                <List.Icon name="file" size="large" verticalAlign="middle" color="green" />
                {
                    (f.fileName.length <= 18) ?
                        <List.Content>
                            <List.Header>{f.fileName}</List.Header>
                            <List.Description> {f.fileSize/1000} mb</List.Description>
                        </List.Content>
                    :
                        <List.Content>
                            <List.Header>{f.fileName.substr(0, 18)}...</List.Header>
                            <List.Description> {f.fileSize/1000} mb</List.Description>
                        </List.Content>
                }
            </List.Item>   
        ))
    }

    const [delete_btn_check, set_delete_btn_check] = useState("")
    const [ removeFile ] = useDeleteFileMutation()

    const delete_file = async (id) => {
        try{
            setloading(true)
            await removeFile(id).unwrap()
            setloading(false)
            set_delete_btn_check("check")
        }catch(error){
            console.log("An error has occurred " + error)
        }
    }
    
    
    //const [activeItem, setactiveItem] = useState("Home")
    //const handleItemClick = (e, {name}) => setactiveItem(name.value)

    const [file, setFile] = useState(null)

    const [fileName, setfileName] = useState("")

    const [fileSize, setfileSize] = useState(0)

    const [fileType, setfileType] = useState("")

    const [lastModifiedDate, setlastModifiedDate] = useState("")

    const [check, setcheck]  = useState("")

    const [fileError, setfileError] = useState(false)

    let uploaded_link
    const [uploadFile] = useUploadFiletoFolderMutation()
    const uploadSave = [folder_id, folder_name, folder_owner, fileName, fileSize, fileType, lastModifiedDate].every(Boolean) && !isLoading

    const handlefileupload = (e) => {
        const f = e.target.files[0]
        setFile(f)
        setfileName(f.name);
        setfileSize(f.size)
        setfileType(f.type)
        setlastModifiedDate(f.lastModifiedDate)
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
                        await uploadFile({folder_id, folder_name, folder_owner, uploaded_link, fileName, fileSize, fileType, lastModifiedDate}).unwrap()
                        setFile(null)
                        setloading(false)
                        setcheck("check")
                }
            }catch(Error){

            }
        }

    }

    let substr = "fl_attachment/"
    const saveFileBtn = (id, link_text) => {
        let file_string = link_text.substring(link_text.lastIndexOf(".")+1)
        if(file_string === 'jpg'){
            let pos = 49
            window.open([link_text.slice(0, pos),substr, link_text.slice(pos)].join(''))
        }else if(file_string === 'jpeg'){
            let pos = 49
            window.open([link_text.slice(0, pos),substr, link_text.slice(pos)].join(''))
        }else if(file_string === 'txt'){
            let pos = 47
            window.open([link_text.slice(0, pos),substr, link_text.slice(pos)].join(''))
        }else if(file_string === 'png'){
            let pos = 49
            window.open([link_text.slice(0, pos),substr, link_text.slice(pos)].join(''))
        }else if(file_string === 'pdf'){
            let pos = 49
            window.open([link_text.slice(0, pos),substr, link_text.slice(pos)].join(''))
        }
       /*if(link_text.match("image")){
            let pos = 49
            window.open([link_text.slice(0, pos),substr, link_text.slice(pos)].join(''))
       }else if(!link_text.match("image")){
            let pos = 47
            window.open([link_text.slice(0, pos),substr, link_text.slice(pos)].join(''))
       }*/
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
                                <Segment vertical style={{padding: 20, borderRadius: 10, backgroundColor: '#fff'}}>
                                <Grid divided>
                                    <Grid.Row>
                                        <Grid.Column width={mobile ? 4 : 3}>
                                            <Header dividing as={mobile ? "h4" : "h2"} content="Media" />
                                            <Menu size={mobile ? "mini" : ''} secondary vertical>
                                                <Menu.Item 
                                                    name="Home" 
                                                    as="h4"
                                                    header
                                                    onClick={() => setcreatefolder_open(false)}
                                                />
                                                <Menu.Item 
                                                    name= {mobile ? "Folder" : "Create Folder"}
                                                    as="h4" 
                                                    header
                                                    onClick={() => setcreatefolder_open(true)}       
                                                />

                                            </Menu>
                                           
                                        </Grid.Column>
                                        <Grid.Column width={mobile ? 12 : 8}>
                                            <Grid>
                                               <Grid.Row>
                                                <Grid.Column>
                                                    <Header dividing textAlign="center" as={mobile ? "h4" : "h2"} content="Data Folders" />
                                                </Grid.Column>
                                                </Grid.Row>
                                                {
                                                    createfolder_open ?
                                                    <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column>
                                                            <Header as={mobile ? "h5" : "h4"}>
                                                                <Icon name="folder" />
                                                                <Header.Content>
                                                                    Create Folder
                                                                </Header.Content>
                                                            </Header>
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
                                                    <Grid.Column>
                                                        <Header as={mobile ? "h5" : "h4"}>
                                                            <Icon name="folder" /> 
                                                            <Header.Content>
                                                                All Folders ({folder.length})
                                                            </Header.Content>
                                                        </Header>
                                                    </Grid.Column>
                                                    {/*<Grid.Column width={6}>
                                                        <Icon name="refresh" />
                                                            Refresh
                                                    </Grid.Column>*/}
                                                </Grid.Row>
                                                <Grid.Row columns={mobile ? 2 : 4}>
                                                    {folderList}
                                                </Grid.Row>
                                                </Grid>
                                                }
                                            </Grid> 
                                        </Grid.Column>
                                        <Grid.Column style={{marginTop: mobile ? 20 : 0}} width={mobile ? 16 : 5}>
                                            <Header dividing as={mobile ? "h4" : "h2"} textAlign="center" content={mobile ? "Folder Assets" : "Folder Assets"} />
                                                {assets ?        
                                                    <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column>
                                                            <Header as="h4">
                                                                <Icon name="folder open" />
                                                                <Header.Content>
                                                                    {folder_name}/
                                                                </Header.Content>
                                                            </Header>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row>
                                                        <Grid.Column>          
                                                            <List selection relaxed="very" divided verticalAlign="middle">
                                                                {fileToFolderList}
                                                            </List>  
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    </Grid>
                                                
                                                    : <Grid.Column>
                                                        <Header as={mobile ? "h5" : "h4"}>
                                                            <Icon name="folder" />
                                                            <Header.Content>
                                                                No Folder Opened
                                                            </Header.Content>
                                                        </Header>
                                                      </Grid.Column>
                                
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
                            size="small"
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
                            size="small"
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
                <Modal
                    size={size_file}
                    open={open_file}
                >
                    <Modal.Header >
                       File options
                       <Icon 
                            onClick={() => dispatch({type: 'close'})}
                            link name="close" 
                            size="small"
                            style={{float: 'right'}} 
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Header>
                            <Icon size="large" name="file" />
                            <Header.Content>
                                {file_name}
                            </Header.Content>
                        </Header>
                    </Modal.Content>
                    <Modal.Content>
                            <Button 
                                icon="save"
                                compact 
                                content="Save"
                                as="a" 
                                onClick={saveFileBtn(file_id, file_link)}
                            />
                            
                            <Button 
                                icon="share"
                                compact
                                content="Share"
                            />
                            <Button
                                icon="trash"
                                compact
                                content="Delete"
                                loading={loading}
                                onClick={() => delete_file(file_id)}
                            />
                    </Modal.Content>
                </Modal>
                <Modal
                    open={open_delete}
                    size={size_delete}
                >
                    <Modal.Header>
                        Delete File
                        <Icon 
                            style={{float: 'right'}} 
                            name="close" 
                            size="small" 
                            link={true}
                            onClick={() => dispatch({type: 'close'})}
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Header>
                            Delete File {file_name} ?
                        </Header>
                    </Modal.Content>
                    <Modal.Content>
                        <Button 
                            positive 
                            content="Yes" 
                            onClick={() => delete_file(file_id)}
                            loading={loading}
                            icon={delete_btn_check}
                        />
                        <Button 
                            negative 
                            content="No" 
                            onClick={() => dispatch({type: 'close'})}
                        />
                    </Modal.Content>
                </Modal>
                <Modal
                    open={open_delete_fold}
                    size={size_delete_fold}
                >
                    <Modal.Header>
                        Delete Folder
                        <Icon 
                            style={{float: 'right'}} 
                            name="close" 
                            size="small" 
                            onClick={() => dispatch({type: 'close'}) }
                            link={true}
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Header>
                            Delete Folder {fold_name} ?
                        </Header>
                    </Modal.Content>
                    <Modal.Content>
                        <Button 
                            positive 
                            content="Yes" 
                            loading={loading}
                            icon={delete_folder_check}
                            onClick={() => delete_folder(fold_id)}
                        />
                        <Button 
                            negative 
                            content="No" 
                            onClick={() => dispatch({type: 'close'})}
                        />
                    </Modal.Content>
                </Modal>
        </Segment>
        </Container>
    )
}