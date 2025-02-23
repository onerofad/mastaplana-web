import { useEffect, useState } from "react"
import { Grid, Header, Segment, Container, Loader } from "semantic-ui-react"
import { useNavigate } from "react-router-dom"
 
const LaunchPage = ({mobile}) => {

    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    useEffect(() => {
      setTimeout(() => {
        setloading(true)
      }, 10000);
    },[])


    if(loading){
        return navigate('/signin')
    }else{
    return(
        <Container>
        <Segment  vertical style={{ backgroundColor: '#133467'}}>
                {/*<Grid textAlign='center' style={{ height: '75vh' }} verticalAlign='middle'>
                    <Grid.Column style ={{maxWidth: 400}}>
                    <Segment vertical style={{backgroundColor: '#3A54AF', borderWidth: '1px', borderStyle: 'none', borderRadius: 10}}>     
                        <Segment vertical style={{backgroundColor: '#3E72C0', borderRadius: 10, margin: mobile ? 30 : 60}}>
                        */}
                            <Grid textAlign="center" style={{ height: '75vh' }} verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column>
                                        <Header 
                                            textAlign="center" 
                                            as="h1" 
                                            content="MASTA PLANA" 
                                            inverted  
                                            style={{
                                                margin: 10,
                                                fontFamily: 'Spicy Rice',
                                                fontWeight: 400,
                                                fontStyle: 'normal'
                                            }}
                                        />
                                        <Loader inverted active inline size="big">
                                            Loading,,,
                                        </Loader>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                       {/* </Segment>
                </Segment>
                </Grid.Column>
                </Grid> */}
                
        </Segment>
        </Container>

    )
}
}
export default LaunchPage