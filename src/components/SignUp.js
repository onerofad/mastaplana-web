import { useReducer, useState } from "react"
import { Link } from "react-router-dom"
import { Grid, Header, Segment, Button, Icon, Container, Form, Modal } from "semantic-ui-react"
import { useAddUsersMutation, useGetUsersQuery } from "../features/api/apiSlice"
import emailjs from '@emailjs/browser'

const initialState = {
    open: false,
    size: undefined
}

function registerReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}

        case 'close':
            return {open: false}

        default:
            return new Error('An error occurred')
    }
}
const SignUp = ({mobile}) => {

    const [state, dispatch] = useReducer(registerReducer, initialState)

    const {open, size} = state

    const {data:users, isSuccess} = useGetUsersQuery()

    const [loading, setloading] = useState(false)

    const [fname, setfname] = useState('')
    const [mname, setmname] = useState('')
    const [lname, setlname] = useState('')
    const [email, setemail] = useState('')
    const [phone, setphone] = useState('')
    const [password, setpassword] =useState('')

    const [fnameError, setfnameError] = useState(false)
    const [mnameError, setmnameError] = useState(false)
    const [lnameError, setlnameError] = useState(false)
    const [phoneError, setphoneError] = useState(false)
    const [emailError, setemailError] = useState(false)
    const [passwordError, setpasswordError] = useState(false)


    const handleFname = (e) => setfname(e.target.value)
    const handleMname = (e) => setmname(e.target.value)
    const handleLname = (e) => setlname(e.target.value)
    const handleEmail = (e) => setemail(e.target.value)
    const handlePhone = (e) => setphone(e.target.value)
    const handlepassword = (e) => setpassword(e.target.value)

    const [insertUser, {isLoading}] = useAddUsersMutation()
    const saveuser = [fname, mname, lname, phone, email, password].every(Boolean) && !isLoading

    const signupBtn = async () => {

        if(fname === ''){
            setfnameError({content: 'Please enter your first name', pointing: 'above'})
        }/*else if(mname === ''){
            setmnameError({content: 'Please enter your middle name', pointing: 'above'})
        }*/
        else if(lname === ''){
            setlnameError({content: 'Please enter your last name', pointing: 'above'})
        }else if(phone === ''){
            setphoneError({content: 'Please enter your phone number', pointing: 'above'})
        }else if(email === ''){
            setemailError({content: 'Please enter your email address', pointing: 'above'})
        }else if(password === ''){
            setpasswordError({content: 'Please enter your password', pointing: 'above'})
        }else{
            const user = users.filter(u => u.email === email)[0]
            if(user){
                setemailError({content: 'Email address already exist', pointing: 'above'})
            }else{
                setloading(true)
                if(saveuser){
                    try{
                        await insertUser({fname, mname, lname, phone, email, password}).unwrap()
                        emailjs.send("service_k0d80hp","template_uap3dit",{
                            to_name: fname,
                            message: `https://masta-plana.vercel.app/verifyemail/${email}`,
                            to_email: email,
                        },  {publicKey: 'A3D4HSPHNJ8f_odij'});
                        setfname('')
                        setmname('')
                        setlname('')
                        setphone('')
                        setemail('')
                        setpassword('')
                        setloading(false)
                        dispatch({type: 'open', size: "mini"})
                    }catch(error){
                    console.log('An error has occurred ' + error)
                    }
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
                        <Grid.Column width={10} textAlign="left" verticalAlign="middle">
                            <Link style={{ fontSize: 20, color: '#fff'}} to="/signin">
                                <Icon inverted name="angle left" color="green" size={mobile ? 'large' : 'big'} />
                                Sign in
                            </Link>
                        </Grid.Column>
                        <Grid.Column textAlign="right" width={6} verticalAlign="middle">
                            <Header inverted content={ mobile ? 'Sign up' : 'Member Sign up'} color="#fff" />

                        </Grid.Column>
    
                    </Grid.Row>   
                    <Grid.Row>
                        <Grid.Column>
                            <Segment vertical style={{backgroundColor: '#fff', borderRadius: 10, borderWidth: '5px', borderStyle: 'solid', borderColor: '#7c5353'}}>
                                <Header 
                                    textAlign="center" 
                                    content="MASTA PLANA" 
                                    as="h1" 
                                    style={{
                                        fontFamily: 'Spicy Rice',
                                        fontWeight: 400,
                                        fontStyle: 'normal'
                                    }}
                                />
                            </Segment>
                        </Grid.Column>
                       
                    </Grid.Row>  
                    <Grid.Row>
                        <Grid.Column>
                            <Segment vertical style={{backgroundColor: '#fff', borderRadius: 10, borderWidth: '5px', borderStyle: 'solid', borderColor: '#fff'}}>
                                <Form size="big" style={{padding: mobile ? '10px 20px' : '20px 40px'}}>
                                    <Grid>                                
                                        <Grid.Row >
                                            <Grid.Column>
                                                <Form.Group widths="equal">
                                                    <Form.Input 
                                                        placeholder="First name" 
                                                        value={fname}
                                                        onChange={handleFname}
                                                        error={fnameError}
                                                        onClick={() => setfnameError(false)}
                                                        
                                                    />
                                                    <Form.Input 
                                                        placeholder="Middle name" 
                                                        value={mname}
                                                        onChange={handleMname}

                                                    />
                                                    <Form.Input 
                                                        placeholder="Last name" 
                                                        value={lname}
                                                        onChange={handleLname}
                                                        error={lnameError}
                                                        onClick={() => setlnameError(false)}

                                                    />
                                                </Form.Group>
                                            </Grid.Column>       
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Form.Group widths="equal">
                                                    <Form.Input 
                                                        placeholder="Phone number"
                                                        value={phone}
                                                        onChange={handlePhone}
                                                        error={phoneError}
                                                        onClick={() => setphoneError(false)}
                                                        
                                                    />
                                                    <Form.Input
                                                        placeholder="Email address" 
                                                        value={email}
                                                        onChange={handleEmail}
                                                        error={emailError}
                                                        onClick={() => setemailError(false)}

                                                    />
                                                    <Form.Input 
                                                        type = "password"
                                                        placeholder="Password" 
                                                        value={password}
                                                        onChange={handlepassword}
                                                        error={passwordError}
                                                        onClick={() => setpasswordError(false)}

                                                    />
                                                </Form.Group>
                                            </Grid.Column>       
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column style={{textAlign: 'center'}}>
                                                <Button 
                                                    loading={loading} 
                                                    size="large" 
                                                    color="green" 
                                                    onClick={signupBtn}
                                                >
                                                    Sign up
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>      
                </Grid>
                <Modal
                    open={open}
                    size={size}
                >
                        <Modal.Header>
                            Success
                        
                        <Icon
                            onClick={() => dispatch({type: 'close'})}
                            link
                            name="close"
                            style={{
                                float: 'right'
                            }}
                       />
                       </Modal.Header>
                       <Modal.Content>
                            <Header textAlign="center"  icon>
                                <Icon inverted circular size={20} name="checkmark" color="green" />
                                Verify Email From Inbox
                            </Header>
                       </Modal.Content>
                </Modal>
        </Segment>
        </Container>
    )

}
export default SignUp