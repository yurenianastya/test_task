function OrderSalesArray(sales, isAscending) {
    salesWithTotal = sales.map((x) => ({ ...x, Total: x.amount * x.quantity}));
    isAscending ? salesWithTotal.sort((a, b) => a.Total - b.Total) : salesWithTotal.sort((a, b) => b.Total - a.Total);
    return salesWithTotal;
}


// test values
arr = [{amount: 50000, quantity: 10}, {amount: 100, quantity: 10}, {amount: 10000, quantity: 10}];
console.log(OrderSalesArray(arr, false));
console.log(arr);