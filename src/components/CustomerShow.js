import { useParams } from "react-router"
import { useContext } from "react"
import CustomerContext from "./contexts/CustomerContext"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import InvoiceTable from "./InvoiceTable"
export default function CustomerShow() {
    const { id } = useParams()
    const { customers } = useContext(CustomerContext)
    const customer = customers.data.find(ele => ele._id === id)
    const invoices = useSelector((state) => {
        return state.invoices
    })
    const customerInvoices = invoices.data.filter(ele => ele.customer._id === customer._id)
    console.log(customer, customerInvoices)

    
    
    return (
        <div>
            <h2>Customer Show</h2>
            {customer && (
                <p>{customer.name}- {customer.contact.email} - {customer.contact.mobile}</p>
            )}
            {customerInvoices.length > 0 ? (
                <InvoiceTable customerInvoices= {customerInvoices}/>
            ) : (
                <p>No Invoices found for the customer. Add a new Invoice <Link to="/invoices/new">Add Invoice</Link></p>
            )}
        </div>
    )
}