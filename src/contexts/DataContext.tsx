import {
    createSignal,
    createContext,
    useContext,
    JSXElement,
    Component,
} from 'solid-js'
import { createStore } from 'solid-js/store'

export type Item = {
    id: number
    top: number
    left: number
}

export type Container = {
    id: string
    name: string
    list: Item[]
}

export type Containers = { num: number; cols: Container[] }

const [columns, setColumns] = createStore<Containers>({
    num: 2,
    cols: [
        {
            id: 'A',
            name: 'A',
            list: [
                { id: 0, top: 20, left: 0 },
                { id: 1, top: 56, left: 0 },
            ],
        },
        { id: 'B', name: 'B', list: [{ id: 2, top: 20, left: 0 }] },
    ],
})

const data_context = {
    containersContext: { columns, setColumns },
}

export const DataContext = createContext(data_context)

export const DataContextProvider: Component<{
    children: JSXElement | JSXElement[] | undefined
}> = (props) => {
    return (
        <DataContext.Provider value={data_context}>
            {props.children}
        </DataContext.Provider>
    )
}

export const useDataContext = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('cannot find data context')
    }
    return context
}
