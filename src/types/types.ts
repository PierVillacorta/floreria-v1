export type Product = {
    id:number
    name:string,
    img:string,
    stock:number,
    precio:number,
    descripcion:string,
    categoria:String
}



export type CartProduct = Product & {
    amount:number
}
