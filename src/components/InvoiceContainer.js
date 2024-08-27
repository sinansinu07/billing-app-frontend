import { useSelector } from "react-redux"
import InvoiceTable from "./InvoiceTable"

export default function InvoiceContainer() {
    const invoices = useSelector((state) => {
        return state.invoices
    })
    return (
        <div>
            <h2>Listing Invoices - { invoices.data.length }</h2>
            <InvoiceTable />
        </div>
    )
}