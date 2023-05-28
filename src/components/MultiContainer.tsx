import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    useDragDropContext,
    createDraggable,
    createDroppable,
    DragOverlay,
} from '@thisbeyond/solid-dnd'
import { pbkdf2 } from 'crypto'
import {
    Component,
    createSignal,
    For,
    onMount,
    batch,
    Show,
    Setter,
    onCleanup,
    useContext,
} from 'solid-js'
import type { JSX, JSXElement } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Portal } from 'solid-js/web'
import { DialogueContextProvider, useDialogueContext } from '../contexts/DialogueContext'
import { DataContextProvider, useDataContext } from '../contexts/DataContext'
import { ItemDialogue } from '../dialogues/ItemDialogue'
import type { Containers, Container, Item } from '../contexts/DataContext'
import { on } from 'events'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            draggable: boolean
            droppable: boolean
        }
    }
}

const Draggable: Component<{ id: number; top: number; left: number }> = (
    props
) => {
    const draggable = createDraggable(props.id)
    return (
        <div
            use:draggable
            class="draggable "
            style={{
                position: 'absolute',
                top: `${props.top}px`,
                left: `${props.left}px`,
            }}
        >
            Draggable {props.id}
        </div>
    )
}

const createItem = (e: MouseEvent) => {
    const createItemContext = useDialogueContext().createItemContext
    if (e.target instanceof HTMLElement) {
        const node = e.target as HTMLElement
        const translate_x = Math.round(
            e.clientX - node.getBoundingClientRect().left
        )
        const translate_y = Math.round(
            e.clientY - node.getBoundingClientRect().top
        )
        console.log(translate_x, translate_y)
        batch(() => {
            createItemContext.x = translate_x
            createItemContext.y = translate_y
            createItemContext.set(true)
        })
    }
}

const Column: Component<{
    id: string
    items: Item[]
}> = (props) => {
    const droppable = createDroppable(props.id)
    return (
        <div
            use:droppable
            class="droppable"
            style={{
                height: '30vh',
                width: '30vh',
                border: '1px solid blue',
                position: 'relative',
            }}
            onClick={(e) => {
                createItem(e)
            }}
        >
            <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
                Droppable {props.id}
            </div>
            <For each={props.items}>
                {(item) => {
                    //console.log(item)
                    return (
                        <Draggable
                            id={item.id}
                            top={item.top}
                            left={item.left}
                        />
                    )
                }}
            </For>
        </div>
    )
}

export const MultiContainer: Component = () => {
    let count = 3
    let top = 35
    let transform = { x: 0, y: 0 }
    const { columns, setColumns } = useDataContext().containersContext
    const findContainerIndex = (id: number): number | -1 => {
        for (const [index, column] of columns.cols.entries()) {
            if (column.list.map((e) => e.id).includes(id)) {
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
    const dragMove: DragEventHandler = ({ overlay }) => {
        if (overlay) {
            transform = { ...overlay.transform }
        }
    }
    const dragEnd: DragEventHandler = ({ draggable, droppable }) => {
        if (droppable) {
            const startContainerIndex = findContainerIndex(
                draggable.id as number
            )
            const stopContainerIndex = convertContainerIDtoIndex(
                droppable.id as string
            )
            if (startContainerIndex === stopContainerIndex) {
                console.log('same container')
                setColumns(
                    'cols',
                    startContainerIndex,
                    'list',
                    (item) => item.id === (draggable.id as number),
                    'top',
                    (top) => top + transform.y
                )
            } else if (startContainerIndex !== stopContainerIndex) {
                batch(() => {
                    let start_top = 0
                    setColumns('cols', startContainerIndex, 'list', (items) =>
                        items.filter((item) => {
                            if (item.id === (draggable.id as number)) {
                                start_top = item.top
                            }
                            return item.id !== (draggable.id as number)
                        })
                    )
                    setColumns('cols', stopContainerIndex, 'list', (items) => [
                        ...items,
                        {
                            id: draggable.id as number,
                            top: start_top + transform.y,
                            left: 0,
                        },
                    ])
                    top += 10
                })
            }
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
        <DialogueContextProvider>
        <DataContextProvider>
            <button
                onClick={(e) => {
                    setColumns('cols', 0, 'list', (items) => [
                        ...items,
                        { id: count++, top: top, left: 0 },
                    ])
                    top += 10
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
            <DragDropProvider onDragEnd={dragEnd} onDragMove={dragMove}>
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
                    <DragOverlay>
                        <div
                            class="draggable"
                            style={{ 'text-align': 'center' }}
                        >
                            Drag Overlay
                        </div>
                    </DragOverlay>
                </div>
            </DragDropProvider>
            <Show when={useDialogueContext().createItemContext.get()}>
                <Portal mount={document.body}>
                    <ItemDialogue />
                </Portal>
            </Show>
        </DataContextProvider>
        </DialogueContextProvider>
    )
}
