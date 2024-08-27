import { useContext } from "react"
import { Link } from "react-router-dom"
import CustomerContext from "./contexts/CustomerContext"

export default function CustomerTable() {

    const { customers } = useContext(CustomerContext)

    // const handleDelete = (id) => {
    //     customerDispatch({
    //         type : "DELETE_CUSTOMER",
    //         payload : id
    //     })
    // }
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { customers.data.map((ele) => {
                        return (
                            <tr key={ele._id}>
                                <Link to={`/customers/show/${ele._id}`}><td>{ ele.name }</td></Link>
                                <td>{ ele.contact.email }</td>
                                <td>{ ele.contact.mobile }</td>
                                <td>
                                        <button>Show Details</button>
                                </td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
        </>
    )
}