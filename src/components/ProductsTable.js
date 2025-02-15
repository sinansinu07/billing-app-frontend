import { useState } from "react";
import { useDispatch } from "react-redux";
import { setServerErrors, startDeleteProduct } from "../actions/productsAction";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ProductForm from "./ProductForm";

export default function ProductsTable(props) {
    const {data} = props.products
    const dispatch = useDispatch()
    const [editId, setEditId] = useState('')
    const [modal, setModal] = useState(false);
 

    const toggle = () => {
        setModal(!modal)
        dispatch(setServerErrors([]))
    }

    const handleDelete = (id) => {
        const confirmation = window.confirm("Are you sure to delete the field")
        if(confirmation) {
            dispatch(startDeleteProduct(id))
        }
    }
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Stock Level</th>
                        <th>Reorder Level</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { data.map((ele) => {
                        return (
                            <tr key={ele._id}>
                                <td>{ ele.name }</td>
                                <td>{ ele.price }</td>
                                <td>{ ele.description }</td>
                                <td>{ ele.stockLevel }</td>
                                <td>{ ele.reorderLevel }</td>
                                <td>
                                        <button>show</button>
                                        <button onClick={() => {
                                            setEditId(ele._id)
                                            toggle()
                                        }}>edit</button>
                                        <button onClick={() => {
                                            handleDelete(ele._id)
                                        }}>remove</button>
                                </td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
             <Modal isOpen={modal} toggle={toggle}>
             <ModalHeader toggle={toggle}> Edit Product</ModalHeader>
             <ModalBody>
                 <ProductForm editId={editId} toggle={toggle} />
             </ModalBody>
             <ModalFooter>
               <Button color="primary" onClick={toggle}>
                 Do Something
               </Button>{' '}
               <Button color="secondary" onClick={toggle}>
                 Cancel
               </Button>
             </ModalFooter>
           </Modal>
        </>
    )
}