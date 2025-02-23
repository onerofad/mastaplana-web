import { useNavigate } from "react-router-dom"
import { Grid, Header, Segment, Icon, Container, Dropdown, TextArea, Button, Modal, Form, Image, SearchResult, Search, List, Input, Menu } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { useReducer, useState } from "react"
import { useAddNotesMutation, useEditNoteMutation, useGetFormTemplatesQuery, useGetNotesQuery, useUploadFileMutation } from "../features/api/apiSlice";
import SearchNote from "./SearchNote";
import FormTemplateModal from "./FormTemplateModal";
import TextModal from "./TextModal";
import ReceivedFiles from "./ReceivedFiles";
import ReceivedPdf from "./ReceivedPdf";
import PdfModal from "./PdfModal";
import TableModal from "./TableModal";

const iinitialState = {
    open: false,
    size: undefined,

    open_text: false,
    size_text: undefined,

    open_pdf: false,
    size_pdf: undefined,

    open_table: false,
    size_table: undefined
}

function formReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}

        case 'open_text':
            return {open_text: true, size_text: action.size_text}

        case 'open_pdf':
            return {open_pdf: true, size_pdf: action.size_pdf}

        case 'open_table':
            return {open_table: true, size_table: action.size_table}

        case 'close':
            return {open: false, open_text: false, open_pdf: false, open_table: false}

        default:
            return new Error('An error occurred')
    }
}

const Document = ({mobile}) => {

    const [state, dispatch] = useReducer(formReducer, iinitialState)
    const {open, size, open_text, size_text, open_pdf, size_pdf, open_table, size_table} = state

    const closeModal = () => {
        dispatch({type: 'close'})
    }


    const [addNote, setaddNote] = useState(false)
    const [allNotes, setallnotes] = useState(true)
    const [editnote, seteditNote] = useState(false)

    const navigate = useNavigate()

    const [editId, seteditId] = useState("")
    const [content, setcontent] = useState("")
    const [title, setTitle] = useState("")
    let noteowner = sessionStorage.getItem("email")

    const [contentError, setcontentError] = useState(false)
    const [titleError, setTitleError] = useState(false)

    const [loading, setLoading] = useState(false)

    const editNote = (id) => {
        const note = notes.filter(n => n.id === id)[0]
        seteditId(note.id)
        setTitle(note.title)
        setcontent(note.content)
        setaddNote(false)
        setallnotes(false)
        seteditNote(!editnote)
    }

    let notes_list
    let no_notes = 0
    const {data:notes, isSuccess, refetch} = useGetNotesQuery()
    if(isSuccess){
        notes_list = notes.map(n => {
            if(n.noteowner === sessionStorage.getItem("email")){
                ++no_notes
                return(
                    <List.Item onClick={() => {
                        editNote(n.id)}
                    }
                    >
                         <List.Header>
                                {n.title}
                            </List.Header>
                        <List.Content>                        
                                {n.content}
                        </List.Content>
                    </List.Item>
                )
            }
        })                                                                 
        
    }

    const openNote = () => {
        setallnotes(!allNotes)
        setaddNote(!addNote)
    }

    const [updateNote] = useEditNoteMutation()
    const saveupdateNote = [noteowner, title, content].every(Boolean)
    const editContent = async() => {
       
            if(saveupdateNote){
                setLoading(true)
                try{
                    await updateNote({id: editId, noteowner, title, content}).unwrap()
                    setLoading(false)
                    setaddNote(false)
                    setallnotes(true)
                    seteditNote(false)

                }catch(error){
                    console.log('An error has occurred ' + error)
                }

            }
    }

    const handlecontentChange = (e) => {
        setcontent(e.target.value)
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const [addText, {isLoading}] = useAddNotesMutation()

    const savecontent = [noteowner, title, content].every(Boolean) && !isLoading

    const addContent = async () => {
        if(title === ""){
            setTitleError({content: 'Enter Title', pointing: 'above'})
        }else if(content === ""){
            setcontentError({content: 'Enter Note', pointing: 'above'})
        }else{
            if(savecontent){
                setLoading(true)
                    try{
                        await addText({noteowner, title, content}).unwrap()
                        setTitle("")
                        setcontent("")
                        setLoading(false)
                        setaddNote(!addNote)
                        setallnotes(!allNotes)
                        refetch()
                    }catch(error){
                        console.log('An error has occurred ' + error)
                    }
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
                        <Grid.Column width={mobile ? 4 : 6} verticalAlign="middle">
                            <Link style={{ fontSize: 20, color: '#fff'}} to="/dashboard">
                                <Icon inverted name="angle left" color="green" size='big' />
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={mobile ? 4 : 6} verticalAlign="middle">
                            <Header 
                                as={mobile ? "h4" : "h1"} 
                                inverted 
                                content="DOCUMENTS" 
                                color="#fff" 
                                style={{
                                    fontFamily: 'Spicy Rice',
                                    fontWeight: 400,
                                    fontStyle: 'normal'
                                }}
                            />
                        </Grid.Column>
                        <Grid.Column width={mobile ? 4 : 2} verticalAlign="middle">
                            <Icon name="calendar alternate outline" inverted color="#fff" size="big" />
                        </Grid.Column>
                        <Grid.Column width={mobile ? 4 : 2} style={{textAlign: 'center'}}>
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
                                <Grid divided>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Header textAlign="center" as="h2" content="DOCUMENTS" />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={mobile ? 16 : 6} style={{marginTop: 0}}>
                                            <Grid>
                                                { addNote &&
                                                <>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Grid>
                                                            <Grid.Row>
                                                                <Grid.Column width={8}>
                                                                    <Icon size="large" link={true} 
                                                                    onClick={() => {setaddNote(!addNote); setallnotes(!allNotes)}} name="long arrow alternate left" />
                                                                    Notes
                                                                </Grid.Column>
                                                                
                                                                <Grid.Column textAlign="right" width={8}>
                                                                    {
                                                                        content ? <Icon loading={loading} onClick={addContent} size="large" aria-label="save" link={true} name="save" /> 
                                                                        : ''

                                                                    }

                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        </Grid>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Form>
                                                            <Form.Field>
                                                                <Form.Input
                                                                    placeholder="Title"
                                                                    onChange={handleTitleChange}
                                                                    error={titleError}
                                                                    onClick={() => setTitleError(false)}
                                                                />
                                                            </Form.Field>
                                                            <Form.Field>
                                                                    <TextArea 
                                                                    placeholder="Note something down"
                                                                    style={{width: '100%', height: 150}}
                                                                    onChange={handlecontentChange}
                                                                    error={contentError}
                                                                    onClick={() => setcontentError(false)}
                                                                >
        
                                                                </TextArea>
                                                            </Form.Field>
                                                            
                                                        </Form>
                                                       
                                                    </Grid.Column>
                                                </Grid.Row>
                                                </>
                                                }
                                                {
                                                     editnote &&
                                                        <>
                                                        <Grid.Row>
                                                            <Grid.Column>
                                                                <Grid>
                                                                    <Grid.Row>
                                                                        <Grid.Column width={8}>
                                                                            <Icon size="large" link={true} onClick={() => {setaddNote(false); setallnotes(true); seteditNote(false)}} name="long arrow alternate left" />
                                                                            Notes
                                                                        </Grid.Column>
                                                                        
                                                                        <Grid.Column textAlign="right" width={8}>
                                                                            {
                                                                                content ? <Icon loading={loading} onClick={editContent} size="large" aria-label="save" link={true} name="edit" /> 
                                                                                : ''
        
                                                                            }
        
                                                                        </Grid.Column>
                                                                    </Grid.Row>
                                                                </Grid>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                        <Grid.Row>
                                                            <Grid.Column>
                                                                <Form>
                                                                    <Form.Field>
                                                                        <Form.Input
                                                                            placeholder="Title"
                                                                            onChange={handleTitleChange}
                                                                            error={titleError}
                                                                            onClick={() => setTitleError(false)}
                                                                            value={title}
                                                                        />
                                                                    </Form.Field>
                                                                    <Form.Field>
                                                                            <TextArea 
                                                                            placeholder="Note something down"
                                                                            style={{width: '100%', height: 150}}
                                                                            onChange={handlecontentChange}
                                                                            error={contentError}
                                                                            onClick={() => setcontentError(false)}
                                                                            value={content}
                                                                        >
                
                                                                        </TextArea>
                                                                    </Form.Field>
                                                                    
                                                                </Form>
                                                               
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                        </>
                                                }
                                                { allNotes && 
                                                <>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                    <Dropdown inline text="All Notes">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>
                                                            <Icon name="file text" />
                                                            All Notes
                                                            <span> &nbsp;&nbsp;({no_notes})</span>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Icon name="trash" />
                                                            Recently Deleted
                                                            <span> &nbsp; &nbsp; (0)</span>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                    </Dropdown>
                                                    </Grid.Column>         
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <SearchNote />
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                       
                                                            <List 
                                                            style={{maxHeight: 120, overflowY: 'auto'}} 
                                                                relaxed 
                                                                verticalAlign="middle" 
                                                                size="tiny"  
                                                                divided 
                                                                selection
                                                            >
                                                                {notes_list}
                                                            </List> 
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Button 
                                                            onClick={() => openNote()} 
                                                            floated="right" 
                                                            color="green" 
                                                            size="big" 
                                                            circular 
                                                            icon="plus" 
                                                        />
                                                    </Grid.Column>        
                                                </Grid.Row>
                                                </>
                                                }
                                            </Grid>                                 
                                        </Grid.Column>
                                        <Grid.Column verticalAlign="middle"  width={mobile ? 16 : 4} style={{marginTop: 10}}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Button 
                                                            fluid size="large" 
                                                            color="green"
                                                            onClick={() => dispatch({type: 'open', size: 'mini'})}
                                                        >
                                                            Save Form Data
                                                        </Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                <Grid.Column>
                                                        <Button 
                                                            fluid 
                                                            size="large" 
                                                            color="green" 
                                                            onClick={() => dispatch({type: 'open_text', size_text: "mini"})}
                                                        >
                                                            Send Text File
                                                        </Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                <Grid.Column>
                                                        <Button 
                                                            fluid 
                                                            size="large" 
                                                            color="green"
                                                            onClick={() => dispatch({type: 'open_pdf', size_pdf: 'mini'})}
                                                        >
                                                            Send Pdf File
                                                        </Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                <Grid.Column>
                                                        <Button 
                                                            fluid 
                                                            size="large" 
                                                            color="green"
                                                            onClick={() => dispatch({type: 'open_table', size_table: 'small'})}

                                                        >
                                                            Save Tabular Data
                                                        </Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            
                                        </Grid.Column>
                                        <Grid.Column width={mobile ? 16 : 6} style={{marginTop: 10}}>
                                           {/*
                                            mobile ? '' : <Segment inverted secondary 
                                            color="teal"  vertical style={{
                                                height: 250,
                                            }}
                                            >

                                            </Segment>
                                           */}
                                            <Header as="h4" content="RECEIVED TEXT FILES" />
                                            <ReceivedFiles />

                                            <Header as="h4" content="RECEIVED PDF FILES" />
                                            <ReceivedPdf />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>

                            </Segment>
                        </Grid.Column>
                    </Grid.Row>           
                </Grid>
                <FormTemplateModal 
                    openModal={open} 
                    sizeModal={size}
                    closeModal={closeModal} 
                    
                />
                <TextModal
                    openModal={open_text}
                    sizeModal={size_text}
                    closeModal={closeModal}
                />
                <PdfModal
                    openModalPdf={open_pdf}
                    sizeModalPdf={size_pdf}
                    closeModal={closeModal}
                />
                <TableModal
                    openModalTable={open_table}
                    sizeModalTable={size_table}
                    closeModal={closeModal}
                />

        </Segment>
        </Container>

    )

}
export default Document