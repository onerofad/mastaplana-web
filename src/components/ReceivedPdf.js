import { useState } from "react"
import { useGetUploadPdfQuery } from "../features/api/apiSlice"
import { List, Header, Icon } from "semantic-ui-react"
import { Link } from "react-router-dom"

    const ReceivedPdf = () => {

        const openPdf = (link) => {
            return(
                <iframe
                    src={link}
                />
            )
           
        }

        const [source, setSource] = useState('')

        const {data:uploadedPdfFiles, isSuccess} = useGetUploadPdfQuery()

                let files_uploaded
                let pos = 49
                let substr = "fl_attachment/"
                if(isSuccess){
                    files_uploaded = uploadedPdfFiles.map(m => {
                        if(m.fileowner === sessionStorage.getItem("email")){
                            return(
                                    <List.Item>
                                        <List.Icon name="file outline" />
                                        <List.Content>
                                            <List.Header>{m.filesender}</List.Header>
                                            <List.Description style={{wordWrap: 'break-word'}}>
                                                {m.uploaded_pdf.substring(78)}
                                                <Header as="h4" content={m.file_date} />
                                                {/*<Link to={[m.uploaded_pdf.slice(0, pos),substr, m.uploaded_pdf.slice(pos)].join('')}> */} 
                                                <Link target="_blank" to={m.uploaded_pdf.replace(".pdf", ".jpg")}>  
                                                    <Icon name="download" />download
                                                </Link>
                                                {/*<Link to={m.uploaded_pdf}>  
                                                    <Icon name="download" />download
                                                </Link>*/}
                                                {/*<Icon link onClick={() => openPdf(m.uploaded_pdf)} name="download" />*/}
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
export default ReceivedPdf