import { Button, Container, Grid, Header, Segment, Modal, Icon } from "semantic-ui-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useGetUsersQuery, useVerify_emailMutation } from "../features/api/apiSlice"
import { useReducer, useState } from "react"

const initialState = {
    open: false,
    size: undefined
}

function verifyReducer(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}

        case 'close':
            return {open: false}

        default:
            return new Error('An error occurred')
    }
}

const VerifyEmail = ({mobile}) => {

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(verifyReducer, initialState)

    const {open, size} = state

    let verifyemail = 1

    const param = useParams()

    let emailId = param.email 

    const [loading, setloading] = useState(false)

    const {data:users, isSuccess} = useGetUsersQuery()
    let current_user
    if(isSuccess){
        current_user = users.filter(u => u.email === emailId)[0]
    }

    const [updateEmail, {isLoading}] = useVerify_emailMutation()

    const saveEmail = [verifyemail].every(Boolean) && !isLoading

    const verifyBtn = async () => {
        try{
            if(saveEmail){
                setloading(true)
                await updateEmail({id: current_user.id, verifyemail}).unwrap()
                setloading(false) 
                dispatch({type: 'open', size: 'mini'})

            }
        }catch(error){
            console.log('An error has occurred ' + error)
        }     
    }

    return(
        <Container>
            <Segment vertical style={{margin: mobile ? 20 : 40, padding: 30, borderRadius: 10, backgroundColor: '#fff'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header
                                content="Verify Email Address"
                                as="h1"  
                                textAlign="center"                   
                            />

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header textAlign="center" as="h4" content={param.email} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign="center">
                            <Button 
                                color="green"
                                size="large"
                                onClick={verifyBtn}
                                loading={loading}
                            >
                                Verify your email
                            </Button>                  
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Modal
                    open={open}
                    size={size}
                >
                        <Modal.Header>
                            Success
                        </Modal.Header>
                       <Modal.Content>
                            <Header textAlign="center"  icon>
                                <Icon inverted circular size={20} name="checkmark" color="green" />
                                Email Verified
                            </Header>
                            <Button
                                 size="mini" 
                                 color="green"
                                 onClick={() => {
                                    navigate("/signin")
                                    dispatch({type: 'close'})
                                 }
                                }
                            >
                                ok
                            </Button>
                       </Modal.Content>
                   
                </Modal>
            </Segment>
        </Container>
    )

}
export default VerifyEmail