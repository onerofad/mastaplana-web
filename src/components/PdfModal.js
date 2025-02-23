import { Modal, Icon, Form, Button, List, Header } from "semantic-ui-react"
import { useState } from "react"
import { useGetMembersQuery, useUploadPdfFileMutation } from "../features/api/apiSlice"
import emailjs from '@emailjs/browser'


    const PdfModal = ({openModalPdf, sizeModalPdf, closeModal}) => {

        const [check, setcheck] = useState(false)

        const [usertype, setusertype] = useState("")

        const [msgerror, setmsgerror] = useState("")

        const handleusertype = (e) => {
            setusertype(e.target.value)
        }

        const [fileowner, setfileowner] = useState("")
        const [fileownerError, setfileownerError] = useState(false)
   
        const [msg, setmsg] = useState("")

        let uploaded_pdf
        const filesender = sessionStorage.getItem("email")

        const [loading, setloading] = useState(false)

        const [file, setFile] = useState(null)
        const [fileError, setfileError] = useState(false)

        const handlefileowner = (e, {value}) => {
            setfileowner(value)
        }

        const handlefile = (e) => {
            const f = e.target.files[0]
            setFile(f)

            const reader = new FileReader();
            reader.readAsDataURL(f)


        }

        const {data:members, isSuccess} = useGetMembersQuery()

        let members_options = []
        if(isSuccess){
            const current_community = members.filter(c => c.memberEmail === sessionStorage.getItem("email"))[0]
            if(current_community){
                members.map(c => (
                    (c.community === current_community.community && c.memberEmail !== current_community.memberEmail)  ?                   
                    members_options.push({key: c.id, text: c.memberEmail, value: c.memberEmail})
                    : '<></>'
                ))
            }
            
        }

        const [uploadFile, {isLoading}] = useUploadPdfFileMutation()
        const saveFile = [fileowner, filesender].every(Boolean) && !isLoading
        
        const onSend = async () => {
            if(usertype === '' && fileowner === ''){
                setmsgerror("You must Enter a member email or non-member email")
            }else if(usertype !== '' && fileowner !== ''){
                setmsgerror("You must choose a member email or non-member email")
            }else if(file === null){
                setfileError({content: 'Empty Field'})
            }else{
                try{
                    if(saveFile){
                        setloading(true)
                        let fileURL
                        const data = new FormData()
                        data.append('file', file)
                        data.append("upload_preset", "slakw5ml");
                        data.append("cloud_name", "du3ck2joa");
                        data.append("resource_type", "text")
                        data.append("folder", "mastaplana_pdf");

                        
                        const response = await fetch(
                            `https://api.cloudinary.com/v1_1/du3ck2joa/upload/`,
                            {
                            method: "POST",
                            body: data,
                            }
                        );
                        const res = await response.json();
                        fileURL = res.url.toString()
                        uploaded_pdf = fileURL
                            await uploadFile({fileowner, uploaded_pdf, filesender}).unwrap()
                            setfileowner("")
                            setmsg("File upload Success")
                            setFile(null)
                            setloading(false)
                            setcheck(true)
                    }else if(usertype !== ''){
                        setloading(true)
                        let fileURL
                        const data = new FormData()
                        data.append('file', file)
                        data.append("upload_preset", "slakw5ml");
                        data.append("cloud_name", "du3ck2joa");
                        data.append("resource_type", "text")
                        data.append("folder", "mastaplana_pdf");

                        
                        const response = await fetch(
                            `https://api.cloudinary.com/v1_1/du3ck2joa/upload/`,
                            {
                            method: "POST",
                            body: data,
                            }
                        );
                        const res = await response.json();
                        fileURL = res.url.toString()
                        uploaded_pdf = fileURL
                        emailjs.send("service_k0d80hp","template_mp8ld0f",{
                            to_name: usertype,
                            message: `${uploaded_pdf}`,
                            to_email: usertype,
                            from_email: filesender
                        },  {publicKey: 'A3D4HSPHNJ8f_odij'});
                        
                            //await uploadFile({fileowner, uploaded_pdf, filesender}).unwrap()
                            //setfileowner("")
                           // setmsg("File upload Success")
                            setFile(null)
                            setloading(false)
                            setcheck(true)

                    }
                }catch(error){
                    console.log('An error has occurred')
                }
            }
        }

        return(
            <Modal
                open={openModalPdf}
                size={sizeModalPdf}
                style={{maxHeight: 400, overflowY: 'auto'}}
            >
                <Modal.Header>
                    File Templates
                    <Icon link={true} style={{float: 'right'}} name="close" onClick={() => closeModal()} />

                </Modal.Header>
                    <Modal.Content>
                    {msgerror}
                        <Form>
                        <Form.Field>
                                <Form.Input
                                    placeholder="Enter Email (For none members)"
                                    value={usertype}
                                    onChange={handleusertype}
                                    onClick={() => setmsgerror("")}
                                />
                            </Form.Field>
                            <Form.Field>
                            <Form.Dropdown
                                placeholder="Members"
                                selection
                                clearable
                                value={fileowner}
                                onChange={handlefileowner}
                                options={members_options}
                                onClick={() => setmsgerror("")}
                            />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    type="file"
                                    placeholder="Select File"
                                    onChange={handlefile}
                                    error={fileError}
                                    onClick={() => setfileError(false)}
                                />
                                <span style={{color: 'red'}}>
                                    file type (.pdf)
                                </span>
                            </Form.Field>
                            <Button 
                                color="green"
                                loading={loading}
                                onClick={onSend}
                                size="large"
                                icon={check}
                                content="Send Pdf"
                            />
                                
                           
                        </Form>
                       
                    </Modal.Content>
            </Modal>
        )

    }
    export default PdfModal
