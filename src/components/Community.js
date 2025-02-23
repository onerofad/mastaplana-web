import { useNavigate } from "react-router-dom"
import { useEffect, useReducer, useState } from "react"
import { Container, Segment, Grid, Dropdown, Header, Modal, Icon, Button, Table, Form, Select } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { useGetCommunitiesQuery, useAddCommunityMutation, useAddMemberMutation, useGetMembersQuery, useRemoveMemberMutation, useGetUsersQuery } from '../features/api/apiSlice'
import SearchCommunity from "./SearchCommunity"
import getUsers, { getUserMembers } from "../API"

const initialState = {
    size: undefined,
    open: false,
    size_member: undefined,
    open_member: false,
    open_delete: false,
    size_delete: undefined
}

function openMember(state, action){
    switch(action.type){
        case 'open':
            return {open: true, size: action.size}

        case 'open_member':
            return {open_member: true, size_member: action.size_member}

        case 'open_delete':
            return {open_delete: true, size_delete: action.size_delete}

        case 'close':
            return {open: false, open_member: false, open_delete: false}

        default:
            return new Error('An error has occurred')
    }
}

const Community = ({mobile}) => {

    useEffect(() => {
        getUAvailableUsers()
        getAlluserMembers()
    }, [])

    const options = [
        {key: 'o', text: 'owner', value: 'owner'},
    ]

    const [users, setusers] = useState([])
    const [userMembers, setusermembers] = useState([])

    const getUAvailableUsers = () => {
        getUsers().get("/")
        .then(res => setusers(res.data))
        .catch(error => console.log('An error has occurred' + error))
    }
    const getAlluserMembers = () => {
        getUserMembers().get("/")
        .then(res => setusermembers(res.data))
        .catch(error => console.log('An error has occurred' + error))

    }

    const emailId = sessionStorage.getItem("email")

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(openMember, initialState)
    const {open, size, open_member, size_member, open_delete, size_delete} = state

    const [communityname, setcommunityname] = useState("")
    const [communitynameError, setcommunitynameError] = useState(false)
    
    const [role, setRole] = useState("")
    const [roleError, setRoleError] = useState(false)

    const [community_owner, setcommunity_owner] = useState(emailId)
   
    const [loading, setloading] = useState(false)

    const [community, setcommunity] = useState("")

    const [memberEmail, setmemberEmail] = useState("")
    const [memberEmailError, setmemberEmailError] = useState(false)

    const [memberRole, setmemberRole] = useState("")
    const [memberRoleError, setmemberRoleError] =  useState(false)

    const [isMembers, setIsMembers] = useState(false)

    const [showMsg, setshowMsg] = useState(false)

    const handlecommunityname = (e) => {
        setcommunityname(e.target.value)
    }

    const handlememberEmail = (e, {value}) => {
        setmemberEmail(value)
    }

    const handlememberRole = (e) => setmemberRole(e.target.value)

    const {data:communities, isSuccess} = useGetCommunitiesQuery()

    const {data:members} = useGetMembersQuery()

    let communities_options
    let count_communities
    if(isSuccess){
        const current_communities = communities.filter(c => c.community_owner === emailId)
        communities_options = current_communities.map(c => (
            {key: c.id, text: c.communityname, value: c.communityname}
        ))

        count_communities = current_communities.length
    }

    /*let email_options = []
    if(isSuccess){
        users.map(u => {
            const member_email = userMembers.find(um => um.memberEmail === u.email)
            if(!member_email){
                email_options.push({key: u.id, text: u.email, value: u.email})
            }

        })    
    }*/
   let count_useremail = 0
   let count_memberemail = 0
   if(isSuccess){
      users.map(u => {
        if(u.email === memberEmail){
            ++count_useremail
        }
      })

      userMembers.map(um => {
        if(um.memberEmail === memberEmail){
            ++count_memberemail
        }
      })
   }

    const [getCommunity, {isLoading}] = useAddCommunityMutation()
    const saveCommunity = [communityname, role, community_owner].every(Boolean) && !isLoading

    const [check2, setcheck2] = useState("")
    const addCommunity = async () => {
        if(communityname === ''){
            setcommunitynameError({content: 'Enter community name;', pointer: 'above'})
        }else if(role === ''){
            setRoleError({content: 'Enter a role', pointer: 'above'})
        }else{
            
                try{
                    if(saveCommunity){
                        let community = communityname
                        let memberEmail = community_owner
                        let memberRole = role
                        let status = "accept"
                        setloading(true)
                        await getCommunity({communityname, role, community_owner}).unwrap()
                        
                        await addMember({community, memberEmail, memberRole, community_owner, status}).unwrap()
                        setloading(false)
                        setcommunityname("")
                        setcheck2("check")
                    }
                }catch(error){
                    console.log('An error has occurred ' + error)
                }
            
        }
    }

    const handlecommunity = (e, {value}) => {
        let member_details = members.find(m => m.community === value)
        if(member_details){
            setcommunity(value)
            setIsMembers(true)
            setshowMsg(false)
        }else{
            setcommunity(value)
            setIsMembers(false)
            setshowMsg(true)
        }
    }

    const [check, setcheck] = useState("")
    const [addMember] = useAddMemberMutation()
    const saveMember = [community, memberEmail, memberRole, community_owner].every(Boolean)  && !isLoading
    const memberBtn = async () => {
        if(memberEmail === ''){
            setmemberEmailError({content: 'Enter member email', pointer: 'above'})
        }else if(count_useremail === 0){
            setmemberEmailError({content: 'Email not signed up', pointer: 'above'})
        }else if(count_memberemail > 0){
            setmemberEmailError({content: 'Email Alresdy used as a member', pointer: 'above'})
        }else if(memberRole === ''){
            setmemberRoleError({content: 'Enter member role', pointer: 'above'})
        }else{
            try{
                if(saveMember){
                    setloading(true)
                    await addMember({community, memberEmail, memberRole, community_owner}).unwrap()
                    setloading(false)
                    setmemberEmail("")
                    setmemberRole("")
                    setcheck("check")
                }

            }catch(error){
                console.log('An error has occurred ' + error)
            }           
        }
    }

    const [id, setId] = useState("")
    const [ removeMember ] = useRemoveMemberMutation()
    const deleteMember = async () => {
        try{
            setloading(true)
            await removeMember(id).unwrap()
            setloading(false)
            dispatch({type: 'close'})
        }catch(error){
            console.log("An error has occurred " + error)
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
                        <Grid.Column width={ mobile ? 4 : 6} verticalAlign="middle">
                            <Header 
                                as={ mobile ? 'h4' : 'h1'} 
                                inverted 
                                content="COMMUNITY" 
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
                            <Segment vertical style={{padding: mobile ? 20 : 30, borderRadius: 10, backgroundColor: '#fff'}}>
                                <Grid stackable>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Header textAlign="center" as="h4" content="Create a community and add users to send documents, audios and videos now." />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column textAlign="center" width={5}>
                                            <SearchCommunity  
                                                
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <Select
                                                placeholder="Select community"
                                                options={communities_options}
                                                value={community}
                                                onChange={handlecommunity}
                                                fluid
                                            />
                                        </Grid.Column>
  
                                        <Grid.Column width={5}>
                                            <Button
                                                size="large"
                                                fluid
                                                icon
                                                disabled = {count_communities > 0 ? true : false}
                                                labelPosition="left"
                                                onClick={() => dispatch({type: 'open', size: "mini"})}
                                                style={{
                                                    borderRadius: 10,
                                                    color: "green"
                                                }}
                                            >
                                                <Icon name="user" />
                                                Create community
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column style={{overflowX: 'auto'}}>
                                            {isMembers &&
                                                <Table size={mobile ? "small" : "large"}  unstackable  >
                                                    <Table.Header>
                                                        <Table.HeaderCell>Community Name</Table.HeaderCell>
                                                        <Table.HeaderCell>Member Email</Table.HeaderCell>
                                                        <Table.HeaderCell>Member Role</Table.HeaderCell>
                                                        <Table.HeaderCell>Access Number</Table.HeaderCell>
                                                        <Table.HeaderCell>Status</Table.HeaderCell>
                                                        <Table.HeaderCell>Action</Table.HeaderCell>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {
                                                            members.map(m => {
                                                                if(m.community === community){
                                                                    return(
                                                                        <>
                                                                            <Table.Row>
                                                                                <Table.Cell>{m.community}</Table.Cell>
                                                                                <Table.Cell>{m.memberEmail}</Table.Cell>
                                                                                <Table.Cell>{m.memberRole}</Table.Cell>
                                                                                <Table.Cell>{m.accessnumber}</Table.Cell>
                                                                                <Table.Cell>{m.status}</Table.Cell>
                                                                                <Table.Cell>
                                                                                    <Button color="youtube" icon onClick={() =>
                                                                                                            {
                                                                                                                setId(m.id)
                                                                                                                dispatch({
                                                                                                                    type: 'open_delete', 
                                                                                                                    size_delete: 'mini'
                                                                                                                })
                                                                                                            }
                                                                                                        }
                                                                                    >
                                                                                        <Icon name="trash" size="small" />
                                                                                    </Button>
                                                                                </Table.Cell>
                                                                            </Table.Row> 
                                                                           
                                                                        </>
                                                                       
                                                                    ) 
                                                                }
                                                                    
                                                            })
                                                        }
                                                    </Table.Body>
                                                    <Table.Footer>
                                                        <Table.Row>
                                                            <Table.Cell colspan="5">
                                                                <Button floated="left" color="green" size="small"
                                                                    onClick={() => 
                                                                        dispatch({
                                                                            type: 'open_member', 
                                                                            size_member: 'mini'
                                                                        })
                                                                    }
                                                                >
                                                                    Add Member
                                                                </Button> 
                                                            </Table.Cell>

                                                        </Table.Row>
                                                       
                                                    </Table.Footer>
                                                </Table>                
                                            }
                                            {showMsg &&
                                            <>
                                                No members added yet to {community + '  '}   
                                                <Button 
                                                 onClick={() => dispatch({type: 'open_member', size_member: 'mini'})} 
                                                 color="green" 
                                                 size="tiny"
                                                >
                                                    Add Member
                                                </Button>
                                            </> 
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>                                
                </Grid>
                <Modal
                    open={open}
                    size={size}
                >
                    <Modal.Header>
                        Create Community
                        <Icon
                            onClick = {() => dispatch({type: 'close'})}
                            link
                            name="close"
                            style={{
                                float: 'right'
                            }}
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Community Name</label>
                                <Form.Input
                                    placeholder="Community Name"
                                    value={communityname}
                                    onChange={handlecommunityname}
                                    error={communitynameError}
                                    onClick={() => setcommunitynameError(false)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Role</label>
                                <Form.Select
                                    placeholder="Role"
                                    options={options}
                                    error={roleError}
                                    value={role}
                                    onChange={(e, {value}) => setRole(value.toString())}
                                    onClick={() => setRoleError(false)}
                                />
                            </Form.Field>
                            <Form.Field style={{textAlign: 'right'}}>
                                <Button
                                    loading = {loading}
                                    color="green"
                                    size="large" 
                                    onClick={addCommunity}
                                    icon={check2}
                                    content="Create"
                                />
                                    
                            </Form.Field>
                           
                        </Form>

                    </Modal.Content>
                </Modal>
                <Modal
                    open={open_member}
                    size={size_member}
                >
                    <Modal.Header>
                     Add Member
                        <Icon
                            onClick = {() => dispatch({type: 'close'})}
                            link
                            name="close"
                            style={{
                                float: 'right'
                            }}
                        />
                    </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Community</label>
                                <Form.Input
                                    value={community}
                                    editable={false}
                                    
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Member Email</label>
                                {/*<Form.Select
                                    placeholder="Member Email"
                                    value={memberEmail}
                                    error={memberEmailError}
                                    onChange={handlememberEmail}
                                    onClick={() => setmemberEmailError(false)}
                                    options={email_options}
                                />*/}
                                <Form.Input
                                    placeholder="Member Email"
                                    value={memberEmail}
                                    error={memberEmailError}
                                    onChange={handlememberEmail}
                                    onClick={() => setmemberEmailError(false)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Member Role </label>
                                <Form.Input
                                    placeholder="Enter member role"
                                    value={memberRole}
                                    error={memberRoleError}
                                    onChange={handlememberRole}
                                    onClick={() => setmemberRoleError(false)}
                                />
                            </Form.Field>
                            <Form.Field style={{textAlign: "right"}}>
                                <Button
                                    color="green"
                                    size="large"
                                    onClick={memberBtn}
                                    loading={loading}
                                    icon={check}
                                    content="Send Invite"
                                />
    
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                </Modal>
                <Modal 
                    open={open_delete}
                    size={size_delete}
        
                >
                    <Modal.Content>              
                        <Header textAlign="center" icon as="h4">
                            <Icon 
                                color="green" 
                                name="close" 
                                size="large" 
                                circular
                            />
                            Delete Member?
                        </Header>
                        <Modal.Actions style={{ textAlign: 'center' }}>
                            <Button 
                                color="positive"
                                loading={loading}
                                onClick={deleteMember}
                            >
                                Yes
                            </Button>
                            <Button 
                                color="negative"
                                onClick={() => dispatch({type: 'close'})}
                            >
                                No
                            </Button>
                        </Modal.Actions>
                    </Modal.Content>
                
                </Modal>
        </Segment>
        </Container>

    )
}
export default Community