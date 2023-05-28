import {
    createSignal,
    createContext,
    useContext,
    JSXElement,
    Component,
} from 'solid-js'

const [createItemDialogue, setCreateItemDialogue] = createSignal(false)
const dialogue_context = {
    createItemContext: {
        x: 0,
        y: 0,
        get: () => {
            return createItemDialogue()
        },
        set: (value: boolean) => {
            setCreateItemDialogue(value)
        },
    },
}
export const DialogueContext = createContext(dialogue_context)

export const DialogueContextProvider: Component<{
    children: JSXElement | JSXElement[] | undefined
}> = (props) => {
    return (
        <DialogueContext.Provider value={dialogue_context}>
            {props.children}
        </DialogueContext.Provider>
    )
}

export const useDialogueContext = () => {
    const context = useContext(DialogueContext)
    if (!context || Object.keys(context).length === 0) {
        throw new Error('Cannot find dialogue context')
    }
    return context
}
