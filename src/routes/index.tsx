import { Title } from 'solid-start'
import Counter from '~/components/Counter'
import { DragAndDrop } from '~/components/dragndrop'

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            printName: (a: string) => any
        }
    }
}
export default function Home() {
    function printName(el: Element, accessor: () => any): void {
        console.log(accessor()?.('a'))
    }
    let name: string = 'App'
    function test(a: string) {
        return 3
    }
    return (
        <main>
            <Title>Hello World</Title>
            <h1 use:printName={test}>Hello world!</h1>
            <Counter />
            <p>
                Visit{' '}
                <a href="https://start.solidjs.com" target="_blank">
                    start.solidjs.com
                </a>{' '}
                to learn how to build SolidStart apps.
            </p>
            <DragAndDrop />
        </main>
    )
}
