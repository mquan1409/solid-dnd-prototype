import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    useDragDropContext,
    DragOverlay,
    createDraggable,
    createDroppable,
} from '@thisbeyond/solid-dnd'
import { Component, createSignal, JSXElement, Show} from 'solid-js'
import { createStore } from 'solid-js/store'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            draggable: boolean
            droppable: boolean
        }
    }
} 
const Draggable: Component<{id: number }> = (props) => {
    const draggable = createDraggable(props.id)
    return (
        <div use:draggable class="draggable" classList={{"opacity-25": draggable.isActiveDraggable}}>
            Draggable
        </div>
    )
}
const Droppable: Component<{ children: string | JSXElement | JSXElement[], id: number }> = (
    props
) => {
    const droppable = createDroppable(props.id)
    return (
        <div
            use:droppable
            class="droppable"
            style={{'height': '50%','width':'50%','border':'1px solid blue'}}
            classList={{ '!droppable-accept': droppable.isActiveDroppable }}
        >
            {props.children}
        </div>
    )
}
export const DragAndDrop: Component = () => {
    const [where, setWhere] = createSignal('outside')
    const [items, setItems] = createStore({
        list: [
            {id: 0, outside: true},
            {id: 1, outside: true},
        ]
        }
    )
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
                    <Draggable id={1} />
                </Show>
            </div>
            <div class="min-h-15">
                <Show when={where() === 'outside'}>
                    <Draggable id={2}/>
                </Show>
            </div>
            <div style={{'height':'100vh','width':'100vw','display':'flex','justify-content':'center','align-items':'center','border':'1px dashed red'}}>
                <Droppable id={1}>
                    <Show when={where() === 'inside'}>
                        <Draggable id={1}/>
                        <Draggable id={2}/>
                    </Show>
                </Droppable>
            </div>
        </DragDropProvider>
    )
}
