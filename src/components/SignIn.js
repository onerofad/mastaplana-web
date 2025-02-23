import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Grid, Header, Segment, Button, Container, Form, Image } from "semantic-ui-react"
import { useGetUsersQuery } from "../features/api/apiSlice"
 
const SignIn = ({mobile}) => {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [loading, setloading] = useState(false)

    const [emailerror, setemailerror] = useState(false)
    const [passworderror, setpassworderror] = useState(false)
    const navigate = useNavigate()

    const handleEmail = (e) => setemail(e.target.value)
    const handlepassword = (e) => setpassword(e.target.value)

    const {data:users, isSuccess} = useGetUsersQuery()

    const loginBtn = () => {

        if(email === ''){
            setemailerror({content: 'Enter email address', pointing: 'below'})
        }else if(password === ''){
            setpassworderror({content: 'Enter password', pointing: 'below'})
        }else{
            const user = users.filter(u => u.email === email)[0]
            if(!user){
                setemailerror({content: 'Email does not exist', pointing: 'below'})
            }else if(user.verifyemail !== 1){
                setemailerror({content: 'Email is not verified', pointing: 'below'})
            }else{
                if(user.password !== password){
                    setpassworderror({content: 'password does not exist', pointing: 'below'})
                }else{
                    setloading(true)
                    setTimeout(() => {
                        setloading(false)
                        sessionStorage.setItem("fname", user.fname)
                        sessionStorage.setItem("lname", user.lname)
                        sessionStorage.setItem("email", user.email)
                        navigate("/dashboard")
                    }, 3000)  
                }   
            }

        }
        
    }
    return(
        <Container>
        <Segment vertical style={{backgroundColor: '#133467', margin: mobile ? 20 : 40}}>
                <Grid textAlign="center" style={{height: mobile ? '60vh' : '75vh'}} verticalAlign="middle">
                    <Grid.Row >
                        <Grid.Column style={{ maxWidth: 450}}>
                            <Form size="big">
                                <Form.Field>
                                    <Form.Input placeholder="Email Address" 
                                        value={email}
                                        onChange={handleEmail}
                                        error={emailerror}
                                        type="text"
                                        onClick={() => setemailerror(false)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input placeholder="Password"
                                        value={password} 
                                        onChange={handlepassword}
                                        error={passworderror}
                                        type="password"
                                        onClick={() => setpassworderror(false)}
                                    />
                                </Form.Field> 
                                <Form.Field>
                                <Button
                                    size="large"
                                    style={{ color: '#fff', backgroundColor: "#3E72C0"}}
                                    onClick={() => loginBtn()}
                                    loading={loading}
                                >
                                    LOGIN
                                </Button>
                                <Link to="/signup" 
                                    style={{ marginLeft: 10, color: '#fff'}}>
                                    Sign up
                                </Link>
                                </Form.Field>      
                            </Form>
                        </Grid.Column>
                     
                    </Grid.Row>                
                </Grid>
        </Segment>
        </Container>

    )

}
export default SignIn