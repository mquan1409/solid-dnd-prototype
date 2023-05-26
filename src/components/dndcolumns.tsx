import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    useDragDropContext,
    createDraggable,
    createDroppable,
} from '@thisbeyond/solid-dnd'
import { pbkdf2 } from 'crypto'
import {
    Component,
    createSignal,
    For,
    JSXElement,
    onMount,
    batch,
} from 'solid-js'
import { createStore } from 'solid-js/store'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            draggable: boolean
            droppable: boolean
        }
    }
}

type Column = {
    id: string
    name: string
    list: number[]
}

const Draggable: Component<{ id: number }> = (props) => {
    const draggable = createDraggable(props.id)
    return (
        <div use:draggable class="draggable">
            Draggable {props.id}
        </div>
    )
}

const Column: Component<{
    id: string
    items: number[]
}> = (props) => {
    const droppable = createDroppable(props.id)
    return (
        <div
            use:droppable
            class="droppable"
            style={{ height: '30vh', width: '30vh', border: '1px solid blue' }}
        >
            Droppable {props.id}
            <For each={props.items}>
                {(item) => {
                    console.log(item)
                    return <Draggable id={item} />
                }}
            </For>
        </div>
    )
}

export const MultiContainer: Component = () => {
    let count = 3
    const [columns, setColumns] = createStore<{ num: number; cols: Column[] }>({
        num: 2,
        cols: [
            { id: 'A', name: 'A', list: [0, 1] },
            { id: 'B', name: 'B', list: [2] },
        ],
    })
    const findContainerIndex = (id: number): number | -1 => {
        for (const [index, column] of columns.cols.entries()) {
            if (column.list.includes(id)) {
                return index
            }
        }
        return -1
    }

    const convertContainerIDtoIndex = (id: string): number | -1 => {
        for (const [index, column] of columns.cols.entries()) {
            if (column.id == id) {
                return index
            }
        }
        return -1
    }
    const dragEnd: DragEventHandler = ({ draggable, droppable }) => {
        if (droppable) {
            const startContainerIndex = findContainerIndex(
                draggable.id as number
            )
            const stopContainerIndex = convertContainerIDtoIndex(
                droppable.id as string
            )
            batch(() => {
                setColumns('cols', startContainerIndex, 'list', (items) =>
                    items.filter((item) => item !== (draggable.id as number))
                )
                setColumns('cols', stopContainerIndex, 'list', (items) => [
                    ...items,
                    draggable.id as number,
                ])
            })
        } else {
        }
    }
    const containers = () => Object.entries(columns)
    const containerIndexes = (): number[] => {
        console.log('calc indexes')
        const indexes: number[] = []
        for (let i = 0; i < columns.num; i++) {
            indexes.push(i)
        }
        return indexes
    }
    return (
        <>
            <button
                onClick={(e) => {
                    setColumns('cols', 0, 'list', (items) => [
                        ...items,
                        count++,
                    ])
                }}
            >
                Add Item
            </button>
            <button
                onClick={(e) => {
                    batch(() => {
                        setColumns('num', (num) => num + 1)
                        setColumns('cols', (cols) => [
                            ...cols,
                            {
                                id: String.fromCharCode(64 + columns.num),
                                name: String.fromCharCode(64 + columns.num),
                                list: [],
                            },
                        ])
                    })
                }}
            >
                Add Column
            </button>
            <DragDropProvider onDragEnd={dragEnd}>
                <DragDropSensors />
                <div
                    style={{
                        height: '100vh',
                        width: '100vw',
                        display: 'flex',
                        'justify-content': 'center',
                        'align-items': 'center',
                        border: '1px dashed red',
                    }}
                >
                    <For each={containerIndexes()}>
                        {(index) => {
                            console.log('col' + index.toString())
                            return (
                                <Column
                                    id={columns.cols[index].id}
                                    items={columns.cols[index].list}
                                />
                            )
                        }}
                    </For>
                </div>
            </DragDropProvider>
        </>
    )
}
