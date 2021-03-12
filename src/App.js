import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdLabelOutline, MdInfoOutline } from "react-icons/md";
import "./App.css";
import { Card, Container, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
require('dotenv').config()

const StyledTree = styled.div`
  line-height: 1.5;
  font-size: 24px;
`;
const StyledFile = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  span {
    margin-left: 5px;
  }
`;
const StyledFolder = styled.div`
  padding-left: 20px;

  .folder--label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }
`;
const Collapsible = styled.div`
  height: ${p => (p.isOpen ? "auto" : "0")};
  overflow: hidden;
`;

//File Component 
const File = ({ name, type, id, selectedElement, setSelectedElement }) => {
  return (
    <StyledFile style={{ color: id === selectedElement? '#007bff': 'black'}} 
      onClick={()=> { if (type === "Info"){ setSelectedElement(`${id}`);}}}>
      {/* render the extension or fallback to generic file icon  */}
      <MdInfoOutline style={{fontSize: '19px'}}/>
      <span>{name}</span>
    </StyledFile>
  );
};

//Folder component 
const Folder = ({ name, id, children, selectedElement, setSelectedElement }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledFolder style={{ color: id === selectedElement? '#007bff': 'black'}} >
      <div className="folder--label" onClick={e => {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                  setSelectedElement(`${id}`)
                }}>
        <MdLabelOutline style={{fontSize: '19px'}}/>
        <span>{name}</span>
      </div>
      <Collapsible isOpen={isOpen}>{children}</Collapsible>
    </StyledFolder>
  );
};

//TreeRecursive Component 
const TreeRecursive = ({ data, id, selectedElement, setSelectedElement }) => {
  // loop through the data
  // eslint-disable-next-line array-callback-return
  return data.map(item => {
    // if its a file render <File />
    if (item.type === "Info") {
      return <File name={item.name} type={item.type} id={item._id} key={item._id} selectedElement={selectedElement} setSelectedElement={setSelectedElement}/>;
    }
    // if its a folder render <Folder />
    if (item.type === "Menu") {
      return (
        <Folder name={item.name} type={item.type} id={item._id} key={item._id} selectedElement={selectedElement} setSelectedElement={setSelectedElement}>
          {/* Call the <TreeRecursive /> component with the current item.childrens */}
          <TreeRecursive data={item.suboptions} id={item._id} selectedElement={selectedElement} setSelectedElement={setSelectedElement}/>
        </Folder>
      );
    }
  });
};
//Tree Component
const Tree = ({ data, children, selectedElement, setSelectedElement }) => {
  const isImparative = data && !children;
  return (
    <StyledTree>
      {isImparative ? <TreeRecursive data={data} selectedElement={selectedElement} setSelectedElement={setSelectedElement}/> : children}
    </StyledTree>
  );
};

//Add Info Modal Component
const AddInfoModal = (props)=> {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [value, setUpdatedValue] = useState(0)
  useEffect(()=> {
  },[value, setUpdatedValue])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(props.selectedElement)
  const addInfo = async ()=> {
    await axios
      .post(`${process.env.REACT_APP_DOMAIN}/suboption/`, 
      {
        name: name,
        text: text, 
        type: "Info",
        parent: props.selectedElement
      })
      
    handleClose();    
    props.fct();    
    setUpdatedValue(value + 1);
  }

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow} style={{marginBottom: '10px'}}>+ Info</Button>{' '}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default"><b>Name</b></InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
           onChange={(event=>{ setName(event.target.value);})}/>
          </InputGroup>

          <InputGroup>
    <InputGroup.Prepend>
      <InputGroup.Text><b>Text&nbsp;&nbsp;&nbsp;</b></InputGroup.Text>
    </InputGroup.Prepend>
    <FormControl as="textarea" aria-label="With textarea" onChange={(event=>{ setText(event.target.value);})}/>
  </InputGroup>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addInfo}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function AddMenuModal(props) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const addMenu = async ()=> {
    await axios
      .post(`${process.env.REACT_APP_DOMAIN}/suboption/`, 
      {
        name: name,
        type: "Menu",
        parent: props.selectedElement
      })
    handleClose();
    props.fct();
  }
  return (
    <>
      <Button variant="outline-primary" onClick={handleShow} style={{marginBottom: '10px'}}>+ Menu</Button>{' '}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body><InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default"><b>Name</b></InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={(event)=> setName(event.target.value)}
          />
          </InputGroup>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addMenu}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function EditModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("")
  const [text, setText] = useState("")

  useEffect(()=>{
    const fetchData = async ()=> {
      axios
          .get(`${process.env.REACT_APP_DOMAIN}/element/${props.selectedElement}/`)
          .then(response => {
            if (props.elementTypes[response.data._id] === "Menu"){
              setName(response.data.name);
            } else {
              setName(response.data.name);
              setText(response.data.text);
            }
            
          })
          .then(()=>{ props.fct(); })
      
    }
    fetchData();
  },[props.selectedElement])
  let body;
  if(props.elementTypes[props.selectedElement] === "Menu"){
    body = <InputGroup className="mb-3">
    <InputGroup.Prepend>
      <InputGroup.Text id="inputGroup-sizing-default"><b>Name</b></InputGroup.Text>
    </InputGroup.Prepend>
    <FormControl
      aria-label="Default"
      aria-describedby="inputGroup-sizing-default"
      onChange={(event)=> setName(event.target.value)}
      value={name}
    />
    </InputGroup>
  } else {
    body = 
    <div>
    <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default"><b>Name</b></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              defaultValue={name}
            onChange={(event=>{ setName(event.target.value);})}/>
            </InputGroup>

            <InputGroup>
        <InputGroup.Prepend>
        <InputGroup.Text><b>Text&nbsp;&nbsp;&nbsp;</b></InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl as="textarea" aria-label="With textarea"
        defaultValue={text} onChange={(event=>{ setText(event.target.value);})}/>
        </InputGroup>
    </div>
  }
  const updateElement = async()=> {
    if (props.elementTypes[props.selectedElement] === "Menu"){
      await axios
        .patch(`${process.env.REACT_APP_DOMAIN}/element/${props.selectedElement}`, 
          {
            name: name
          }
        )
    } else {
      await axios
        .patch(`${process.env.REACT_APP_DOMAIN}/element/${props.selectedElement}`, 
          {
            name: name,
            text: text
          }
        )
    }
    
    
      handleClose();
      props.fct();
  }


  return (
    <>
      <Button variant="outline-success" onClick={handleShow} style={{marginBottom: '10px'}}>Edit</Button>{' '}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateElement}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

//Main Function
export default function App() {
  const [selectedElement, setSelectedElement] = useState("NO SELECTED ELEMENT");
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(0);
  const [elementTypes, setElementTypes] = useState({})
  console.log(selectedElement)
  console.log(update)
  useEffect(() => {
    const fetchData = ()=> {
      axios
        .get(`${process.env.REACT_APP_DOMAIN}/root/`)
        .then(response => setData(response.data))

      axios
          .get(`${process.env.REACT_APP_DOMAIN}/element/`)
          .then(response => { 
            const dict = {}
            response.data.forEach(el => {
              dict[String(el._id)] = el.type
            })
            setElementTypes(dict)
          })
    }
    
    console.log("Rerendered")
    fetchData();
    
  }, [update, selectedElement]);
  const DeleteElement = ()=> {
    axios
      .delete(`${process.env.REACT_APP_DOMAIN}/element/${selectedElement}`)
      .then(response => console.log(response))
      .then(()=>{ updateComp(); })

  }

  const updateComp = () => {
    setUpdate(update + 1);
  }

  console.log(process.env.REACT_APP_DOMAIN)
   

  return (
    <Container style={{marginTop: '200px'}}>
      {elementTypes[selectedElement] === "Menu" && 
      <>
        <AddInfoModal selectedElement={selectedElement} fct={updateComp}/>
        <AddMenuModal selectedElement={selectedElement} fct={updateComp}/>
      </>
      
      }
      
      <EditModal selectedElement={selectedElement} fct={updateComp} elementTypes={elementTypes}/>
      <Button variant="outline-danger" style={{marginBottom: '10px'}} onClick={DeleteElement}>Delete</Button>{' '}
      
      <Card>
      <Card.Body>
      <Tree data={data} selectedElement={selectedElement} setSelectedElement={setSelectedElement}/>
      </Card.Body>
    </Card>
    </Container>
    
  );
}
