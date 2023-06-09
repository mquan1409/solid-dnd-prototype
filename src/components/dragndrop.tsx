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
import {
    Component,
    createSignal,
    For,
    JSXElement,
    onMount,
    Show,
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
            Droppable
        </div>
    )
}
export const DragAndDrop: Component = () => {
    var count = 2
    let ref: HTMLDivElement
    onMount(() => {
        console.log(ref)
    })
    const [where, setWhere] = createSignal('outside')
    const [items, setItems] = createStore({
        list: [
            { id: 0, outside: true },
            { id: 1, outside: true },
        ],
    })
    const dragEnd: DragEventHandler = ({ draggable, droppable }) => {
        console.log(ref)
        if (droppable) {
            droppable.node.append(draggable.node)
        } else {
            ref.append(draggable.node)
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
                    console.log(ref)
                }}
            >
                Add Item
            </button>
            <DragDropProvider onDragEnd={dragEnd}>
                <DragDropSensors />
                <div ref={ref!}>
                    <For each={items.list}>
                        {(item, i) => <Draggable id={item.id} />}
                    </For>
                </div>
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
                    <Droppable id={0}></Droppable>
                </div>
            </DragDropProvider>
        </>
    )
}
