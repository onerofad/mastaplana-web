import { useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Container, Divider, Dropdown, Form, Grid, Header, Icon, Modal, Segment } from "semantic-ui-react"
import { useCreateFolderMutation, useGetfoldersQuery } from "../features/api/apiSlice"
import { mastaplana_file } from "../API"
import { GradientDirection } from "@cloudinary/url-gen/qualifiers"

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

export const DataBank = ({mobile}) => {

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(uploadReducer, initialState)
    const {open, size} = state
    

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

    const {data:folders, isSuccess} = useGetfoldersQuery()
    let folderList
    if(isSuccess){
        folderList = folders.map(f => (
                <Grid.Column width={4}>
                    <Card>
                        <Card.Header >
                            <Icon disabled style={{float: 'right'}} size="small" name="ellipsis vertical" />
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
                                        <Grid.Column width={5}>
                                            <Segment vertical >
                                                <Grid>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Header color="green" textAlign="">
                                                            <Icon loading={loading} color="green" name="folder" size="big" />
                                                            Create Folder
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
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Divider />
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Header color="green">
                                                            <Icon size="big" color="green" name="file" />
                                                            Upload File
                                                        </Header>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Form>
                                                            <Form.Field>
                                                                <Form.Select
                                                                placeholder="Select folder"
                                                                    options={""}
                                                                />
                                                            </Form.Field>
                                                        </Form>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column textAlign="right">
                                                        <Icon size="large" link inverted color="green" circular name="upload" />
                                                    </Grid.Column>
                                                </Grid.Row>
                                                
                                                </Grid>
                                            </Segment>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Grid>
                                               <Grid.Row>
                                                <Grid.Column>
                                                    <Header  color="green" textAlign="center" as="h4" attached content="Data Folders" />
                                                </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    {folderList}
                                                </Grid.Row>
                                            </Grid> 
                                        </Grid.Column>
                                        <Grid.Column width={3}>

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
        </Segment>
        </Container>
    )
}