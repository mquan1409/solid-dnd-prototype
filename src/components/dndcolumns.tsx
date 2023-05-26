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
            <For each={props.items}>{(item) => <Draggable id={item} />}</For>
        </div>
    )
}

export const MultiContainer: Component = () => {
    let count = 3
    const [columns, setColumns] = createStore<Record<string, number[]>>({
        A: [0, 1],
        B: [2],
    })
    const findContainer = (id: number): string | 'X' => {
        for (const [key, values] of Object.entries(columns)) {
            if (values.includes(id)) {
                return key
            }
        }
        return 'X'
    }
    const dragEnd: DragEventHandler = ({ draggable, droppable }) => {
        if (droppable) {
            const startContainer = findContainer(draggable.id as number)
            const stopContainer = droppable.id as string
            batch(() => {
                setColumns(startContainer, (items) =>
                    items.filter((item) => item !== (draggable.id as number))
                )
                setColumns(stopContainer, (items) => [
                    ...items,
                    draggable.id as number,
                ])
            })
        } else {
        }
    }
    const containers = () => Object.entries(columns)
    return (
        <>
            <button
                onClick={(e) => {
                    setColumns('A', (items) => [...items, count++])
                }}
            >
                Add Item
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
                    <For each={containers()}>
                        {(container) => (
                            <Column id={container[0]} items={container[1]} />
                        )}
                    </For>
                </div>
            </DragDropProvider>
        </>
    )
}
