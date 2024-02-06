const readlineSync = require('readline-sync');

let products = [
    {
        name: "Product A",
        price: 20
    },
    {
        name: "Product B",
        price: 40
    },
    {
        name: "Product C",
        price: 50
    },
]

const Shop = (() => {
    const getQuantity = (products) => {
        products.forEach((item, i) => {
            let value = readlineSync.question(`Enter quantity of ${item.name}: `)
            if (isNaN(value)) throw new Error("Invalid Quantity")
            if (value < 0) throw new Error("Quantity must not be negative")
            let gift = readlineSync.question(`Is ${item.name} wrapped as gift(yes/no): `)
            if (!(gift === 'yes' || gift === 'no')) throw new Error("Invalid value")
            products[i].quantity = Number(value)
            products[i].gift = gift === 'yes' ? true : false
        })
        return products
    }

    function getTotal(products) {
        let value = 0;
        products.forEach(item => {
            value += item.quantity * item.price
        })
        return value
    }

    function flat10Discount(products) {
        let total = getTotal(products)
        if (total > 200) {
            return { coupen: "flat_10_discount", value: total - 10 }
        }
        return null
    }

    function bulk5discount(products) {
        let flag = false
        let temp = products.map(item => {
            let value = item.price * item.quantity;
            if (item.quantity > 10) {
                flag = true
                return (value - (value * 0.05))
            } else {
                return value
            }
        })
        let value = 0
        temp.forEach(num => value += num)
        return flag ? { coupen: "bulk_5_discount", value: value } : null
    }

    function bulk10discount(products) {
        let temp = 0
        products.forEach(item => temp += item.quantity)
        let total = getTotal(products)
        if (temp > 20) {
            return { coupen: "bulk_10_discount", value: (total - (total * 0.1)) }
        } else {
            return null
        }
    }

    function tiered50discount(products) {
        let toalQuantity = 0
        let flag = false
        let value = 0
        products.forEach(item => toalQuantity += item.quantity)
        if (toalQuantity > 30) {
            products.forEach(item => {
                if (item.quantity > 15) {
                    flag = true
                    value += item.price * 15
                    value += (item.price - (item.price * .5)) * (item.quantity - 15)
                } else {
                    value += item.quantity * item.price
                }
            })
        } else {
            return null
        }
        if (!flag) return null
        return { coupen: "tiered_50_discount", value: value }
    }

    function getDiscounts(productsWithQuantity) {
        let flat10 = flat10Discount(productsWithQuantity)
        let bulk5 = bulk5discount(productsWithQuantity)
        let bulk10 = bulk10discount(productsWithQuantity)
        let tiered50 = tiered50discount(productsWithQuantity)
        let small = { value: getTotal(productsWithQuantity) }
        let arr = [flat10, bulk10, bulk5, tiered50]
        arr.forEach(item => {
            if (small.value > item?.value) small = item
        })
        return small
    }

    function getGift(productsWithQuantity) {
        let gift = 0
        productsWithQuantity.forEach(item => {
            if (item.gift) gift += item.quantity
        })
        return gift
    }

    function getShippping(productsWithQuantity) {
        let quantity = 0
        productsWithQuantity.forEach(item => quantity += item.quantity)
        if (quantity % 10 === 0) {
            let pack = quantity / 10
            return pack * 5
        } else {
            let temp = quantity % 10
            let pack = (quantity - temp) / 10
            pack++
            return pack * 5
        }
    }

    function display(productsWithQuantity, discount) {
        console.log("==============================================");
        productsWithQuantity.forEach(item => {
            console.log(`${item.name}: \$${item.price} x ${item.quantity} = \$${item.price * item.quantity} `);
        })
        let cartTotal = getTotal(productsWithQuantity)
        console.log("==============================================");
        console.log(`Subtotal: \$${cartTotal}`);
        console.log(`Coupen Applied : ${discount.coupen ? discount.coupen : "N/A"}`);
        console.log(`Discount Amount : \$${discount.coupen ? discount.value : "N/A"}`);
        console.log("==============================================");
        console.log(`Shipping Fee: \$${getShippping(productsWithQuantity)}`);
        console.log(`Gift Fee: \$${getGift(productsWithQuantity)}`);
        console.log(`Total: \$${discount.value + getShippping(productsWithQuantity) + getGift(productsWithQuantity)}`);
    }

    function run(products) {
        let productsWithQuantity = getQuantity(products)
        let discount = getDiscounts(productsWithQuantity)
        display(productsWithQuantity, discount)
    }

    return { run }
})()

Shop.run(products)