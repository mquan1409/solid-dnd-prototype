import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    useDragDropContext,
    createDraggable,
    createDroppable,
} from '@thisbeyond/solid-dnd'
import { Component, createSignal, JSXElement, Show } from 'solid-js'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            draggable: boolean
            droppable: boolean
        }
    }
}

const Draggable: Component = () => {
    const draggable = createDraggable(1)
    return (
        <div use:draggable class="draggable">
            Draggable
        </div>
    )
}
const Droppable: Component<{ children: string | JSXElement | JSXElement[] }> = (
    props
) => {
    const droppable = createDroppable(1)
    return (
        <div
            use:droppable
            class="droppable"
            classList={{ '!droppable-accept': droppable.isActiveDroppable }}
        >
            Droppable
            {props.children}
        </div>
    )
}
export const DragAndDrop: Component = () => {
    const [where, setWhere] = createSignal('outside')
    const dragEnd: DragEventHandler = ({ droppable }) => {
        if (droppable) {
            setWhere('inside')
        } else {
            setWhere('outside')
        }
    }
    return (
        <DragDropProvider onDragEnd={dragEnd}>
            <DragDropSensors />
            <div class="min-h-15">
                <Show when={where() === 'outside'}>
                    <Draggable />
                </Show>
            </div>
            <Droppable>
                <Show when={where() === 'inside'}>
                    <Draggable />
                </Show>
            </Droppable>
        </DragDropProvider>
    )
}
