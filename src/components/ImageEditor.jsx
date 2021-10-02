import React, { useEffect, useRef, useState } from "react" 
import Draggable from "react-draggable"
import { v4 } from 'uuid'
import { useScreenshot, createFileName } from 'use-react-screenshot'


const initialLabel = () => ({
    id: v4(),
    label: "",
    size: 14,
    left: 0,
    top: 0,
    color: "white"
})

export const ImageEditor = ({ imageUrl }) => {
    const imageRef = useRef();
    const [showAddLabelDialog, setShowAddLabelDialog] = useState(false)
    const [editingLabel, setEditingLabel] = useState(false)
    const [label, setLabel] = useState(initialLabel())
    const [labels, setLabels] = useState([])
    const [image, takeScreenshot] = useScreenshot()

    const getImage = () => takeScreenshot(imageRef.current)

    const download = (image, { name = 'img', extension = 'png' } = {}) => {
        const a = document.createElement('a')
        a.href = image
        a.download = createFileName(extension, name)
        a.click()
    }

    useEffect(() => {
        if (image) {
            download(image, { name: 'lorem-ipsum', extension: 'png' })
        }
    }, [image])

    const addLabel = () => {
        setLabel(initialLabel())
        setShowAddLabelDialog(true)
    }

    const updateDrawLabel = () => {
        const filteredLabel = labels.find(lab => lab.id === label.id)

        if (filteredLabel)
            labels.splice(filteredLabel, 1)

        labels.push(label)
        setLabels([...labels])
    }

    const saveLabel = () => {
        updateDrawLabel()
        setLabel(initialLabel())
        setShowAddLabelDialog(false)
    }

    const markLabelForChange = (savedLabel) => {
        setEditingLabel(true)
        setLabel(savedLabel)
    }

    const changeLabels = ({ target }) => {
        label.label = target.value
        setLabel({ ...label })
    }

    const up = () => {
        label.top--;
        setLabel({ ...label })
        updateDrawLabel()
    }

    const down = () => {
        label.top++;
        setLabel({ ...label })
        updateDrawLabel()
    }

    const left = () => {
        label.left--;
        setLabel({ ...label })
        updateDrawLabel()
    }

    const right = () => {
        label.left++;
        setLabel({ ...label })
        updateDrawLabel()
    }

    const increaseSize = () => {
        label.size++;
        setLabel({ ...label })
        updateDrawLabel()
    }

    const decreaseSize = () => {
        label.size--;
        setLabel({ ...label })
        updateDrawLabel()
    }

    const finishEditingLabel = () => {
        setEditingLabel(false);
        setLabel(initialLabel())
    }

    return <>

        <Image ref={imageRef}
            labels={labels}
            imageUrl={imageUrl}
            markLabelForChange={markLabelForChange}
        />

        {editingLabel || <div className='actions'>
            <button onClick={() => addLabel()}>Adicionar Texto</button>
            <button onClick={() => getImage()}>Export</button>
        </div>}

        {editingLabel && <>
            <button onClick={() => up()}>Up</button>
            <button onClick={() => down()}>Down</button>
            <button onClick={() => left()}>Left</button>
            <button onClick={() => right()}>Right</button>
            <button onClick={() => increaseSize()}>Increase Size</button>
            <button onClick={() => decreaseSize()}>Decrease Size</button>
            <button onClick={() => finishEditingLabel()}>Finish</button>
        </>}

        {showAddLabelDialog && <>
            <label>Digite o texto</label>
            <input name='label' onChange={e => changeLabels(e)} />
            <button onClick={() => saveLabel()} >Salvar</button>
        </>}
    </>
}


const Image = React.forwardRef((props, ref) => (
    <div id='image-for-export' ref={ref} >
        <img src={props.imageUrl} />
        {props.labels.map(savedLabel => <>
            <Draggable>
                <label style={{ left: savedLabel.left, top: savedLabel.top, position: "absolute", color: savedLabel.color, fontSize: savedLabel.size }} onClick={() => props.markLabelForChange(savedLabel)} >{savedLabel.label}</label>
            </Draggable>
        </>)}
    </div>
))