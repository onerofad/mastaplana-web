import { Grid, Segment, Container, Icon, Header, Form, Button, Message, Modal, List } from "semantic-ui-react"
import { Link, useNavigate } from "react-router-dom"
import React, { useReducer, useState } from "react"

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const initialState = {
    open: false,
    size: undefined,
    open_error: false,
    size_error: undefined,
 
}

const initialState2 = {
    open_signup: false,
    size_signup: undefined
}

function dropReducer2(state, action){
    switch(action.type){
        case 'open_signup':
            return {open_signup: true, size_signup: action.size_signup}
        case 'close':
            return {open_signup: false}
        default:
            return new Error('An error has occured')
    }
}
function dropReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}
        case 'open_error':
            return {open_error: true, size_error: action.size_error}
        case 'close':
            return {open: false, open_error: false}
        default:
            return new Error("An error has occurred")
    }
}

function UploadDropzone({onDrop}){

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(dropReducer2, initialState2)
    
    const {open_signup, size_signup} = state

    const onDropcallback = useCallback((acceptedFiles, rejectedFiles) => {
        onDrop(acceptedFiles)

        rejectedFiles.forEach(rejectedFile => {
            //alert(`${rejectedFile.file.name} is rejected`)
            dispatch({type: 'open_signup', size_signup: 'mini'})
        })
    }, [onDrop])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: onDropcallback, 
        accept: {
            'image/': [],
            'audio/': [],
            'video/': []
        },
        maxSize: 1024 * 1000 * 20,
        multiple: false
    })
    return(
        <Segment style={{maxHeight: 100}} placeholder {...getRootProps()}>
            <Header icon>
             <input {...getInputProps()} />
             <Icon name="file outline" />
             {isDragActive ?
                <p>Drag the files here</p>:
                <p>Drag and drop the files here or click to select file</p>
             }
            </Header>
            <Button positive>
                Add Document
            </Button>
            <Modal
                    open={open_signup}
                    size={size_signup}
                >
                    <Modal.Header>
                        Sign up
                    </Modal.Header>
                    <Modal.Content>
                        <Message color="green">
                            Your upload exceeds 20MB.
                            You need to sign up to send 
                            files above 20MB

                        </Message>
                    </Modal.Content>
                    <Modal.Actions style={{textAlign: 'center'}}>
                        <Button positive onClick={() => navigate("/signup")}>
                            Sign up
                        </Button>
                        <Button 
                            negative 
                            onClick={() => dispatch({type: 'close'})}
                        >
                            close
                        </Button>
                    </Modal.Actions>
                </Modal>
        </Segment>
    )
    
}

export const SendFile = ({mobile}) => {

    const [state, dispatch] = useReducer(dropReducer, initialState)

    const navigate = useNavigate()

    const {
            open, size, 
            open_error, size_error,
        } 
        = state

    const [imgFiles, setimgFiles] =  useState([])

    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [emailError, setemailError] = useState(false)

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const [uploadedImgFiles, setUploadedImgFiles] = useState([])

    function handleFileDrop(acceptedFiles){
        const imgFilesTmp = [...imgFiles]
        acceptedFiles.forEach(file => 
            imgFilesTmp.push(Object.assign(file, {preview: URL.createObjectURL(file)}))
        )
        setimgFiles(imgFiles => imgFilesTmp)
    }

    async function handleSubmit(e){
        e.preventDefault()

        if(email === ''){
            setemailError({content: 'Recepient email is empty', pointing: 'below'})
        }else if(imgFiles.length === 0){
            dispatch({type: 'open_error', size_error: "mini"})
        }else{
        setLoading(true)
        const uploadedImages = []
        const cloudName = "du3ck2joa"
        for(const file of imgFiles){
            const publicId = file.name.split('.').slice(0, -1).join('.')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'slakw5ml') 
            formData.append('public_id', publicId)
            formData.append("folder", "mastaplana_free");


            try{
                const response = 
                     await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload/`, {
                        method: 'POST',
                        body: formData
                     });

                     const data = await response.json()
                     uploadedImages.push(data.secure_url)
                     setLoading(false)
                     dispatch({type: 'open', size: "mini"})

            }catch(error){
                console.log('Cloudinary Image Error', error)
            }
        }
        setimgFiles(imgFiles => [])
        setUploadedImgFiles(uploadedImgFiles => [...uploadedImgFiles, ...uploadedImages])
    }
    }

    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 10 : 40}}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={mobile ? 5 : 6} textAlign="left" verticalAlign="middle">
                        <Link style={{ fontSize: 20, color: '#fff'}} to="/signin">
                            <Icon inverted name="angle left" color="green" size={mobile ? 'large' : 'big'} />
                                Sign in
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={ mobile ? 6 : 6} verticalAlign="middle">
                        <Header 
                            as={ mobile ? 'h4' : 'h1'} 
                            inverted 
                            content="SEND FILE" 
                            color="#fff" 
                            style={{
                                fontFamily: 'Spicy Rice',
                                fontWeight: 400,
                                fontStyle: 'normal'
                            }}
                    />
                    </Grid.Column>
                    <Grid.Column textAlign="right" width={mobile ? 5 : 4} verticalAlign="middle">
                        <Header inverted content={ mobile ? 'Sign up' : 'Member Sign up'} color="#fff" />
                    </Grid.Column>
                    </Grid.Row>   
                    <Grid.Row>
                        <Grid.Column>
                            <Grid textAlign="center">
                                <Grid.Column>
                                    <Segment vertical style={{padding: 20, borderRadius: 10, backgroundColor: '#fff'}}>
                                        <Grid textAlign="center" verticalAlign="middle">
                                            <Grid.Row>
                                                <Grid.Column style={{ maxWidth: 450}}>
                                                    <Message color="green">
                                                        <Message.Header>
                                                            Important Notice!
                                                        </Message.Header>
                                                        <Message.Content>
                                                            You can now send files to friends,
                                                            colleagues and others with
                                                            mastaplana. For files larger than 50mb,
                                                            you will have to join the mastaplana community.
                                                        </Message.Content>
                                                    </Message>
                                                    <Form>
                                                        <Form.Field>
                                                            <Form.Input
                                                                fluid
                                                                value={email}
                                                                error={emailError}
                                                                onChange={handleEmail}
                                                                onClick={() => setemailError(false)}
                                                                placeholder="Your Recepient Email"
                                                            />
                                                        </Form.Field>
                                                    </Form>
                                                    {
                                                        imgFiles.length === 0 ?
                                                            <UploadDropzone  onDrop={handleFileDrop} /> :
                                                            <Segment>
                                                                <List>
                                                            {
                                                                
                                                                imgFiles.map((file, i) => 
                                                                    <List.Item key={i}>
                                                                        <List.Content floated="right">
                                                                            <Icon size="large" color="green" name="check" />
                                                                        </List.Content>
                                                                        <List.Content>
                                                                            <Header>
                                                                                {file.name}
                                                                            </Header>
                                                                        </List.Content>
                                                                    </List.Item>
                                                                )
                                                                
                                                            }
                                                                </List>
                                                            </Segment>


                                                    }
                                                    <Form onSubmit={handleSubmit}>
                                                        <Button loading={loading} positive type="submit">
                                                            Send File
                                                        </Button>
                                                        <Button 
                                                            negative 
                                                            onClick={() => setimgFiles(imgFiles => [])}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Form>
                                                       {/* uploadedImgFiles.map((file, i) => 
                                                            <img key={i} src={file}
                                                                alt="file" style={{width: '200px', height: '200px', objectFit: 'cover'}}
                                                        />
                                                        )*/}                                       
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>     
                </Grid>
                <Modal
                    open={open}
                    size={size}
                >
                    <Modal.Header>
                        Complete
                    </Modal.Header>
                    <Modal.Content>
                        <Header textAlign="center" icon>
                            <Icon color="green" circular name="file" />
                            File has been sent
                        </Header>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button 
                            negative 
                            onClick={() => dispatch({type: 'close'})}
                        >
                            close
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Modal
                    open={open_error}
                    size={size_error}
                >
                    <Modal.Header>
                        File Error
                    </Modal.Header>
                    <Modal.Content>
                        <Header textAlign="center" icon>
                            <Icon color="red" circular name="cancel" />
                            Select a file to send
                        </Header>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button 
                            negative 
                            onClick={() => dispatch({type: 'close'})}
                        >
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
        </Segment>
        </Container>
    )

}
