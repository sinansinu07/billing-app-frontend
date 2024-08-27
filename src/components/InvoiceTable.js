import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { startDeleteInvoice } from "../actions/invoicesAction"
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useState } from "react";
import LineItemShow from "./LineItemShow";


export default function CustomerTable(props) {

    const { customerInvoices } = props
    const [modal, setModal] = useState(false);
    const [showId, setShowId] = useState('')
    const dispatch = useDispatch()
    
    const invoices = useSelector((state) => {
        return state.invoices
    })

    const toggle = () => {
        setModal(!modal)
    }

    const handleDelete = (id) => {
        const confirmation = window.confirm("Are You Sure?")
        if(confirmation) {
            dispatch(startDeleteInvoice(id))
        }
    }
    const handleShow = (id) => {
        toggle()
        setShowId(id)
    }

    return (
        <>
        {customerInvoices?.length > 0 ? (
            <div>
                <table className="table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Line Items</th>
                        <th>Discount</th>
                        <th>Taxes</th>
                        <th>Gross Total</th>
                        <th>Net Total</th>
                    </tr>
                </thead>
                <tbody>
                    { customerInvoices.map((ele) => {
                        return (
                            <tr key={ele._id}>
                               <td>{ ele.customer.name }</td>
                                <td><button onClick={() => {
                                    handleShow(ele._id)
                                }}> show { ele.lineItems.length }</button></td>
                                <td>{ ele.discount }</td>
                                <td>{ ele.taxes }</td>
                                <td>{ ele.grossTotal }</td>
                                <td>{ ele.netTotal }</td>
                                <td>
                                        <button>Show Details</button>
                                        <button onClick={() => {
                                            handleDelete(ele._id)
                                        }}>Delete</button>
                                </td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
            </div>
        ) : (
            <div>
                <table className="table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Line Items</th>
                        <th>Discount</th>
                        <th>Taxes</th>
                        <th>Gross Total</th>
                        <th>Net Total</th>
                    </tr>
                </thead>
                <tbody>
                    { invoices.data.map((ele) => {
                        return (
                            <tr key={ele._id}>
                               <td>{ ele.customer.name }</td>
                                <td><button onClick={() => {
                                    handleShow(ele._id)
                                }}> show { ele.lineItems.length }</button></td>
                                <td>{ ele.discount }</td>
                                <td>{ ele.taxes }</td>
                                <td>{ ele.grossTotal }</td>
                                <td>{ ele.netTotal }</td>
                                <td>
                                        <button>Show Details</button>
                                        <button onClick={() => {
                                            handleDelete(ele._id)
                                        }}>Delete</button>
                                </td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
            </div>
        )}
            <Modal isOpen={modal} toggle={toggle}>
             <ModalHeader toggle={toggle}> Line Items</ModalHeader>
             <ModalBody>
                 <LineItemShow showId = {showId}/>
             </ModalBody>
           </Modal>
        </>
    )
}