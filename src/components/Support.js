import { Grid, Segment, Container, Dropdown, Icon, Header, Form, Button, Message } from "semantic-ui-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSubmitMessageMutation } from "../features/api/apiSlice"
import emailjs from '@emailjs/browser'

export const Support = ({mobile}) => {
    
    const navigate = useNavigate()

    const [email, setemail] = useState("")
    const [emailError, setemailError] = useState(false)

    const [check, setcheck] = useState("")

    const [message, setmessage] = useState("")
    const [messageError, setmessageError] = useState(false)

    const [loading, setLoading] = useState(false)

    const handleEmail = (e) => {
        setemail(e.target.value)
    }

    const handleMessage = (e) => {
        setmessage(e.target.value)
    }

    const [submitMessage, {isLoading}] = useSubmitMessageMutation()

    const sendMessage = [email, message].every(Boolean) && !isLoading

    const sendMessageBtn = async() => {
        if(email === ''){
            setemailError({content: 'Email field is empty', pointing: 'below'})
        }else if(message === ''){
            setmessageError({content: 'Message is Empty', pointing: 'below'})
        }else{
            if(sendMessage){
                try{
                    setLoading(true)
                    await submitMessage({email, message}).unwrap()
                    emailjs.send("service_k0d80hp","template_uap3dit",{
                            to_name: 'mastaplana',
                            message: message,
                                to_email: 'imafidonfrank2015@gmail.com',
                            },  {publicKey: 'A3D4HSPHNJ8f_odij'});
                            setemail('')
                            setmessage('')
                            setLoading(false)
                            setcheck("check")

                }catch(error){
                    console.log("An error has occurred " + error)
                }
            }

        }
    }

    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 10 : 40}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ mobile ? 4 : 6} verticalAlign="middle">
                            <Link style={{ fontSize: 20, color: '#fff'}} to="/dashboard">
                                <Icon inverted name="angle left" color="green" size='big' />
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={ mobile ? 8 : 8} verticalAlign="middle">
                            <Header 
                                as={ mobile ? 'h4' : 'h1'} 
                                inverted 
                                content="SUPPORT CENTER" 
                                color="#fff" 
                                style={{
                                    fontFamily: 'Spicy Rice',
                                    fontWeight: 400,
                                    fontStyle: 'normal'
                                }}
                            />
                        </Grid.Column>
                        {/*<Grid.Column width={ mobile ? 4 : 2} verticalAlign="middle">
                            <Icon name="calendar alternate outline" inverted color="#fff" size="big" />
                        </Grid.Column>*/}
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
                            <Grid textAlign="center">
                                <Grid.Column>
                                    <Segment vertical style={{padding: 20, borderRadius: 10, backgroundColor: '#fff'}}>
                                        <Grid textAlign="center" verticalAlign="middle" style={{height: mobile ? '75vh' : '100vh'}}>
                                            <Grid.Row>
                                                <Grid.Column style={{ maxWidth: 450}}>
                                                    <Message>
                                                        <Message.Header>
                                                            Support Center
                                                        </Message.Header>
                                                        <Message.Content>
                                                            Use the form below to submit
                                                            any complaints that you may have and
                                                            we will get back to you as soon 
                                                            as possible.
                                                        </Message.Content>
                                                    </Message>
                                                    <Form size="big">
                                                        <Form.Field>
                                                            <Form.Input
                                                                placeholder="Your Email"
                                                                value={email}
                                                                error={emailError}
                                                                onChange={handleEmail}
                                                                onClick={() => setemailError(false)}
                                                            />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Form.TextArea
                                                                placeholder="Message"
                                                                value={message}
                                                                error={messageError}
                                                                onChange={handleMessage}
                                                                onClick={() => setmessageError(false)}
                                                            />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Button 
                                                                size="large" 
                                                                color="green"
                                                                onClick={() => sendMessageBtn()}
                                                                loading={loading}
                                                                icon
                                                            >
                                                                <Icon name={check} />
                                                                SEND
                                                            </Button>
                                                        </Form.Field>
                                                    </Form>
                                            
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>     
                </Grid>
        </Segment>
        </Container>
    )

}
