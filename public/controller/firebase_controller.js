import { AccountInfo } from '../model/account_info.js';
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

//creates new users on firebase
export async function createUser(email, password){
    await firebase.auth().createUserWithEmailAndPassword(email, password);
}

//get account info for users
export async function getAccountInfo(uid){
    const doc = await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
                        .doc(uid).get();
    // if account exists
    if(doc.exists){
        return new AccountInfo(doc.data())
    }else{//if account hasnt been made yet
        const defaultInfo = AccountInfo.instance();
        //stores new account to firebase with uid, creates new document id with uid
        await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
                    .doc(uid).set(defaultInfo.serialize());
        return defaultInfo;

    }
}


