import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react"
import { setServerErrors } from "../actions/productsAction"

import ProductsTable from "./ProductsTable"
import ProductForm from "./ProductForm"

export default function ProductsContainer() {
    const dispatch = useDispatch()
    const products = useSelector((state) => {
        return state.products
    })

    useEffect(() => {
        return () => {
            dispatch(setServerErrors([]))
        }
    }, [dispatch])

    return (
        <div className="row">
            <h2>Total Products - { products.data.length }</h2>
            <div className="col-md-8">
                <ProductsTable products={products} />
            </div>
            <div className="col-md-4">
                <ProductForm />
            </div>
        </div>
    )
}