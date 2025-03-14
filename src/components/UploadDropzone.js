import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Icon, Button, Header, Segment } from 'semantic-ui-react'

export function UploadDropzone({onDrop}){
    const onDropcallback = useCallback((acceptedFiles, rejectedFiles) => {
        onDrop(acceptedFiles)

        rejectedFiles.forEach(rejectedFile => {
            alert(`${rejectedFile.file.name} is rejected`)
        })
    }, [onDrop])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: onDropcallback, 
        accept: {
            'image/': [],
        },
        maxSize: 1024 * 100,
        multiple: false
    })

    return(  
        <Segment style={{maxHeight: 100}} placeholder {...getRootProps()}>
            <Header icon>
                <input {...getInputProps()} />
                <Icon name="pdf file outline" />
                {isDragActive ?
                    <p>Drag the files here</p>:
                    <p>Drag and drop the files here or click to select file</p>
                }
            </Header>
            <Button positive>
                Add Document
            </Button>
        </Segment>
        
    )

    
}