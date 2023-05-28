import { Component, batch, onMount, onCleanup } from 'solid-js'
import { useDialogueContext } from '../contexts/DialogueContext'
import { useDataContext } from '../contexts/DataContext'

export const ItemDialogue: Component = () => {
    let form: HTMLFormElement
    const createItemContext = useDialogueContext().createItemContext
    const containersContext = useDataContext().containersContext
    const { columns, setColumns } = containersContext
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        let node = e.target
        if (node instanceof HTMLFormElement) {
            console.log(node)
            const formData = new FormData(node as HTMLFormElement)
            const containerIndex = parseInt(formData.get('index') as string)
            const itemID = parseInt(formData.get('id') as string)
            const itemName = formData.get('name') as string
            const translate_x = createItemContext.x
            const translate_y = createItemContext.y
            batch(() => {
                setColumns('cols', containerIndex, 'list', (l) => [
                    ...l,
                    { id: itemID, top: translate_y, left: 0 },
                ])
                createItemContext.set(false)
            })
            console.log('submit')
        }
    }

    onMount(() => {
        form.addEventListener('submit', onSubmit)
    })
    onCleanup(() => {
        form.removeEventListener('submit', onSubmit)
    })
    return (
        <div
            style={{
                background: 'lightblue',
                width: '20vw',
                height: '10vh',
                position: 'fixed',
                top: '45vh',
                left: '40vw',
                display: 'flex',
                'justify-content': 'center',
                'align-items': 'center',
            }}
        >
            <form ref={form!}>
                <label for="container">Index:</label>
                <br />
                <input type="text" id="container_index" name="index" />
                <br />
                <label for="container">Item ID:</label>
                <br />
                <input type="text" id="item_id" name="id" />
                <br />
                <label for="container">Name:</label>
                <br />
                <input type="text" id="item_name" name="name" />
                <br />
                <input type="submit" value="Submit" /> <br />
            </form>
        </div>
    )
}
