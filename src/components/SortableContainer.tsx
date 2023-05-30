import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    useDragDropContext,
    createDraggable,
    createDroppable,
    DragOverlay,
    createSortable,
    closestCenter,
    SortableProvider,
} from '@thisbeyond/solid-dnd'

import { Component, For, batch, Show, createSignal } from 'solid-js'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            draggable: boolean
            droppable: boolean
            sortable: boolean
        }
    }
}

const Sortable: Component<{ id: number }> = (props) => {
    const sortable = createSortable(props.id)
    return (
        <div use:sortable class="draggable">
            Draggable {props.id}
        </div>
    )
}

export const SortableList: Component = () => {
    const [items, setItems] = createSignal([1, 2, 3])
    const [activeItem, setActiveItem] = createSignal<number>(null)
    const dragStart: DragEventHandler = ({ draggable }) =>
        setActiveItem(draggable.id as number)
    const dragEnd: DragEventHandler = ({ draggable, droppable }) => {
        if (draggable && droppable) {
            const currentItems = items()
            const startIndex = currentItems.indexOf(draggable.id as number)
            const stopIndex = currentItems.indexOf(droppable.id as number)
            if (startIndex !== stopIndex) {
                currentItems.splice(
                    stopIndex,
                    0,
                    ...currentItems.splice(startIndex, 1)
                )
                setItems(currentItems)
            }
        }
    }
    return (
        <DragDropProvider
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            collisionDetector={closestCenter}
        >
            <DragDropSensors />
            <div class="column self-stretch">
                <SortableProvider ids={items()}>
                    <For each={items()}>{(item) => <Sortable id={item} />}</For>
                </SortableProvider>
            </div>
            <DragOverlay>
                <div style={{ 'text-align': 'center' }}>{activeItem()}</div>{' '}
            </DragOverlay>
        </DragDropProvider>
    )
}
