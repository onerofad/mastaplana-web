import { useState } from "react"
import { useGetTextFileQuery } from "../features/api/apiSlice"
import { List, Header, Icon } from "semantic-ui-react"
import { Link } from "react-router-dom"

    const ReceivedFiles = () => {

        const [source, setSource] = useState('')

        const {data:uploadedTextFiles, isSuccess} = useGetTextFileQuery()

                let files_uploaded
                let pos = 47
                let substr = "fl_attachment/"
                if(isSuccess){
                    files_uploaded = uploadedTextFiles.map(m => {
                        if(m.fileowner === sessionStorage.getItem("email")){
                            return(
                                    <List.Item>
                                        <List.Icon name="file outline" />
                                        <List.Content>
                                            <List.Header>{m.filesender}</List.Header>
                                            <List.Description style={{wordWrap: 'break-word'}}>
                                                {m.uploaded_text.substring(78)}
                                                <Header as="h4" content={m.file_date} />
                                                <Link to={[m.uploaded_text.slice(0, pos),substr, m.uploaded_text.slice(pos)].join('')}>  
                                                    <Icon name="download" />download
                                                </Link>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                
                            )
                        }
                })
            }

            return(
                    <List size="small" icon relaxed celled style={{maxHeight: 300, overflowY: 'auto'}}>
                        {files_uploaded}
                    </List>
                
               
            )
    }
export default ReceivedFiles