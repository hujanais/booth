//import { MouseEvent } from "react"; 

import { useState } from "react";

interface ListGroupProps {
    items: string[];
    heading: string;
    onSelectItem: (item: string) => void;
} 

function ListGroup({items, heading, onSelectItem }: ListGroupProps) {

    // hook
    const [selectedIndex, setSelectedIndex] = useState(-1);


    //const message = items.length === 0 ? <p>No item found</p> : null;
    //const getMessage = () => {
    //    return message;
   // }

   // event handler
    //const handleClick = (event: MouseEvent) => console.log(event);

    items.map(item => <li>{item}</li>)
    return (
        <>
            <h1>{heading}</h1>
            {items.length === 0 && <p>No item found</p> }
            <ul className="list-group">
                {items.map(((item, index) =>
                    <li className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'}
                        key={item}
                        onClick={() => {
                            setSelectedIndex(index);
                            onSelectItem(item);
                        }}
                    >
                        {item}
                    </li>))}
            </ul>;
        </>
    );
}

export default ListGroup;