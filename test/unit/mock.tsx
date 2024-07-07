import { Product } from "../../src/common/types";

export const mock_first_product: Product = {
    id: 1,
    name: 'Practical kogtetochka',
    price: 685,
    description: 'Really Unbranded kogtetochka for Snowshoe', 
    material: 'Wooden', 
    color: 'Ivory'
};

export const mock_second_product: Product = {
    id: 2,
    name: 'Unbranded kogtetochka',
    price: 548,
    description: 'Really Unbranded kogtetochka for Snowshoe', 
    material: 'Wooden', 
    color: 'Ivory'
};

export const mock_cart = [
    {id: 1, name: 'Practical kogtetochka', count: 3, price: 685},
    {id: 2, name: 'Unbranded kogtetochka', count: 1, price: 548}
];