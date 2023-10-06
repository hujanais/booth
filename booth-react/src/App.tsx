//import ListGroup from "./components/ListGroup";
import { useState } from "react";
import Alert from "./components/Alert"
import Button from "./components/Button";

function App() {

    //let items = [
     //   'NY',
      //  'Paris',
      //  'Tokyo',
      //  'London',
      //  'Boston'
    //];

    //const handleSelectItem = (item: string) => {
      //  console.log(item);
    //}


    // inside div below
    //  <ListGroup items={items} heading="Cities" onSelectItem={handleSelectItem}></ListGroup>

    const [alertVisible, setAlertVisibility] = useState(false);
    let messageAlert = "Stock market is crashing!!"
    return (
        <div>
            {alertVisible && < Alert onClose={() => setAlertVisibility(false)}> { messageAlert}</Alert>}
            <Button color='danger' onClick={() => setAlertVisibility(true)}>Market Alert</Button>
        </div>
    );
}

export default App;