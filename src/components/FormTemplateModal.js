import { Modal,Grid, Icon } from "semantic-ui-react"
import { useGetFormTemplatesQuery } from "../features/api/apiSlice"

    const FormTemplateModal = ({openModal, sizeModal, closeModal}) => {
        const {data:htmlFile, isSuccess} = useGetFormTemplatesQuery()

        let htmlFiles
        if(isSuccess){
            htmlFiles = htmlFile.map(forms => (
                <>
                <Grid.Column>
                    <Modal.Description>
                        {forms.form_name}
                    </Modal.Description>
                    <div 
                        dangerouslySetInnerHTML={{ __html: forms.form_content }}
                    />   
                </Grid.Column>  
                </>
            ))
        }
        return(
            <Modal
                open={openModal}
                size={sizeModal}
                style={{maxHeight: 400, overflowY: 'auto'}}
            >
                <Modal.Header>
                    Form Templates
                    <Icon link={true} style={{float: 'right'}} name="close" onClick={() => closeModal()} />

                </Modal.Header>
                    <Modal.Content>
                        <Grid divided> 
                                {htmlFiles}
                        </Grid>
                    </Modal.Content>
            </Modal>
        )

    }
    export default FormTemplateModal
