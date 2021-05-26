import * as Constant from '../model/constant.js'
import { Product } from '../model/Product.js';

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