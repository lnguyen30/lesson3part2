import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'


//event listeners for profile page
export function addEventListeners(){
    Element.menuProfile.addEventListener('click', async ()=>{
        history.pushState(null, null, Route.routePathnames.PROFILE);

        await profile_page();
    })
}

export async function profile_page(){
    Element.root.innerHTML ='<h1>Profile Page</h1>'
}

//global variable for account info
let accountInfo;
// client side retrieving 
export async function getAccountInfo(user){
    
    try{
        // firebase fetches the user's info with the user's uid
        accountInfo = await FirebaseController.getAccountInfo(user.uid)
    }catch(e){
        if(Constant.DEV) console.log(e);
        Util.info(`Failed to retrieve account info for ${user.email}`, JSON.stringify(e));
        accountInfo = null;
        return;
    }
    //updates user's profile pic
    Element.menuProfile.innerHTML = `
        <img src=${accountInfo.photoURL} class="rounded-circle" height="30px">
    `;

}