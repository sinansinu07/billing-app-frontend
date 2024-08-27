import { useContext } from "react"
import CustomerContext from "./contexts/CustomerContext"
import CustomerTable from "./CutomerTable"
import CustomerForm from "./CustomerForm";

export default function CustomerContainer() {
    const { customers } =  useContext(CustomerContext)
    console.log(customers);

    return (
        <div className="row">
        <h2>Listing Customer - { customers.data.length }</h2>
        <div className="col-md-8">
            <CustomerTable />
        </div>
        <div className="col-md-4">
            <CustomerForm />
        </div>
        </div>
    )
}