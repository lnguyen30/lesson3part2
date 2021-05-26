import * as Constant from '../model/constant.js'
import { Product } from '../model/Product.js';
import { ShoppingCart } from '../model/ShoppingCart.js';

// calls firebase to sign in user 
export async function signIn(email, password){
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

//call firebase to sign out user
export async function signOut(){
    await firebase.auth().signOut();
}

export async function getProductList(){
    const products = [];
    //fetches all the products information in firebase that are labeled under products label
    const snapshot = await firebase.firestore().collection(Constant.collectionNames.PRODUCTS)
        .orderBy('name')
        .get();

    snapshot.forEach( doc =>{
        //constructs each product with doc.data
        const p = new Product(doc.data())
        //assign the firestore id to product 
        p.docId = doc.id;
        products.push(p);
    })
    return products;
}

// adds cart to firestore database, into purchase history collection
export async function checkOut(cart){
    const data = cart.serialize(Date.now());
    await firebase.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY)
                    .add(data);
}

//grabs the purchase from firebase to webpage
export async function getPurchaseHistory(uid){
    // retrieves purchase history from firebase based on the uid, then orders the history by timestamp, 
    //then get() retrieves the info
    const snapShot = await firebase.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY)
                    .where('uid', '==', uid)
                    .orderBy('timestamp', 'desc')
                    .get();
    //empty cart array to store each product
    const carts = [];
    snapShot.forEach(doc =>{
        //creates shopping cart object with product items
        const sc = ShoppingCart.deserialize(doc.data());
        //sc pushed to carts array
        carts.push(sc)
    });

    return carts;
}