import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    useDragDropContext,
    DragOverlay,
    createDraggable,
    createDroppable,
} from '@thisbeyond/solid-dnd'
import { fail } from 'assert'
import { Component, createSignal, For, JSXElement, Show } from 'solid-js'
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
        <div
            use:draggable
            class="draggable"
            classList={{ 'opacity-25': draggable.isActiveDraggable }}
        >
            Draggable {props.id}
        </div>
    )
}
const Droppable: Component<{
    children: string | JSXElement | JSXElement[]
    id: number
}> = (props) => {
    const droppable = createDroppable(props.id)
    return (
        <div
            use:droppable
            class="droppable"
            style={{ height: '50%', width: '50%', border: '1px solid blue' }}
            classList={{ '!droppable-accept': droppable.isActiveDroppable }}
        >
            {props.children}
        </div>
    )
}
export const DragAndDrop: Component = () => {
    var count = 2
    const [where, setWhere] = createSignal('outside')
    const [items, setItems] = createStore({
        list: [
            { id: 0, outside: true },
            { id: 1, outside: true },
        ],
    })
    const dragEnd: DragEventHandler = ({ draggable, droppable }) => {
        if (droppable) {
            setItems('list', draggable.id as number, 'outside', false)
        } else {
            setItems('list', draggable.id as number, 'outside', true)
        }
    }
    return (
        <>
            <button
                onClick={(e) => {
                    setItems('list', (l) => [
                        ...l,
                        { id: count++, outside: true },
                    ])
                }}
            >
                Add Item
            </button>
            <DragDropProvider onDragEnd={dragEnd}>
                <DragDropSensors />
                <For each={items.list}>
                    {(item, i) => (
                        <div class="min-h-15">
                            <Show when={item.outside}>
                                <Draggable id={item.id} />
                            </Show>
                        </div>
                    )}
                </For>
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
                    <Droppable id={0}>
                        <For each={items.list}>
                            {(item, i) => (
                                <Show when={!item.outside}>
                                    <Draggable id={item.id} />
                                </Show>
                            )}
                        </For>
                    </Droppable>
                </div>
            </DragDropProvider>
        </>
    )
}
