import { useSelector } from 'react-redux'
import { useContext } from 'react'
import CustomerContext from './contexts/CustomerContext'
export default function Dashboard() {
    
    const { customers } = useContext(CustomerContext)

    const products = useSelector((state) => { 
        return state.products
    })
    const invoices = useSelector((state) => { 
        return state.invoices
    })
    
    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Total Products - { products.data.length } </h2>
            <h2>Total Customers - { customers.data.length}</h2>
            <h2>Total Invoices - { invoices.data.length}</h2>
        </div>
    )
}