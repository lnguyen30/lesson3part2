import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import { ShoppingCart } from '../model/ShoppingCart.js'

//event listeners for home page
export function addEventListeners(){
    Element.menuHome.addEventListener('click', async ()=>{
        history.pushState(null, null, Route.routePathnames.HOME);
        const label = Util.disableButton(Element.menuHome);
        await home_page();
        Util.enableButton(Element.menuHome, label)
    })
}

//global variable
export let cart;

export async function home_page(){
    
    let html = '<h1>Enjoy Shopping</h1>'
    let products;
    try{
        products = await FirebaseController.getProductList();
        //if cart isn't empty
        if(cart){
            cart.items.forEach(item =>{
                //parses through each item and finds the specific product
                const product = products.find(p=> item.docId == p.docId)
                //updates label
                product.qty = item.qty;
            })
        }
    }catch(e){
        if(Constant.DEV) console.log(e);
        Util.info('Cannot get product info', JSON.stringify(e));
    }
    //each product is rendered
    for(let i = 0; i<products.length; i++){
        html+= buildProductView(products[i], i)
    }

    Element.root.innerHTML = html;

    const decForms = document.getElementsByClassName('form-dec-qty');
    for(let i =0; i< decForms.length; i++){
        decForms[i].addEventListener('submit', e=>{
            e.preventDefault();
            //index of the products array from form
            const p = products[e.target.index.value]
            //dec p from cart
            cart.removeItem(p);
            //updates label amount
            document.getElementById('qty-' + p.docId).innerHTML = (p.qty == 0 || p.qty == null) ? 'Add' : p.qty;
            //upates shopping cart count
            Element.shoppingCartCount.innerHTML = cart.getTotalQty();
        })
    }


    const incForms = document.getElementsByClassName('form-inc-qty');
    for(let i =0; i< incForms.length; i++){
        incForms[i].addEventListener('submit', e=>{
            e.preventDefault();
            //index of the products array from form
            const p = products[e.target.index.value]
            //inc p to cart
            cart.addItem(p);
            // updates label amount
            document.getElementById('qty-' + p.docId).innerHTML = p.qty;
            Element.shoppingCartCount.innerHTML = cart.getTotalQty();


        })
    }
}

function buildProductView(product, index){
    return `
    <div class="card" style="width: 18rem; display: inline-block">
     <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">
                ${Util.currency(product.price)}<br>
                ${product.summary}
            </p>
            <div class="container pt-3 bg-light ${Auth.currentUser ? 'd-block' : 'd-none'}">
                <form method="post" class="d-inline form-dec-qty">
                    <input type="hidden" name="index" value="${index}">
                    <button class="btn btn-outline-danger" type="submit">&minus;</button>
                </form>
                <div id="qty-${product.docId}" class="container rounded text-center text-white bg-primary d-inline-block w-50">
                    ${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
                </div>
                <form method="post" class="d-inline form-inc-qty">
                    <input type="hidden" name="index" value="${index}">
                    <button class="btn btn-outline-primary" type="submit">&plus;</button>
                </form>
            </div>
        </div>
    </div>
    `;

 }



//user calls cart object when signed in
export function initShoppingCart(){

    //creates or recreates cart after browser refreshes or user signs out/in
    const cartString = window.localStorage.getItem('cart-' + Auth.currentUser.uid);
    //cart will be new 
    cart = ShoppingCart.parse(cartString);
    if(!cart || !cart.isValid() || cart.uid != Auth.currentUser.uid){
        //if invalid, then remove item
        window.localStorage.removeItem('cart-' + Auth.currentUser.uid);
        //create new shopping cart
        cart = new ShoppingCart(Auth.currentUser.uid);
    }

    //cart = new ShoppingCart(Auth.currentUser.uid);

    //update cart count

    Element.shoppingCartCount.innerHTML = cart.getTotalQty();
}
