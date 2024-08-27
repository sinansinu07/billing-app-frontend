import { useSelector } from "react-redux";

export default function LineItemShow(props) {
    const invoices = useSelector((state) => {
        return state.invoices
    })
    const id = props.showId
    const invoice = invoices.data.find(ele => ele._id === id)
    console.log(invoice)
    const lineItems = invoice.lineItems
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { lineItems?.map((ele) => {
                        return (
                            <tr key={ele._id}>
                                <td>{ ele.product.name }</td>
                                <td>{ ele.price }</td>
                                <td>{ ele.quantity }</td>
                                <td>
                                        <button>Delete LineItems</button>
                                </td>
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
        </div>
    )
}