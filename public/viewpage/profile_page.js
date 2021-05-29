import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'


//event listeners for profile page
export function addEventListeners(){
    Element.menuProfile.addEventListener('click', async ()=>{
        history.pushState(null, null, Route.routePathnames.PROFILE);

        await profile_page();
    })
}

// profile page default state
export async function profile_page(){
    let html ='<h1>Profile Page</h1>'

    //if user hasn't signed in
    if(!Auth.currentUser){
        html +='<h2>Protected Page</h2>'
        Element.root.innerHTML = html;
        return;
    }
    // if account doesn't exist
    if(!accountInfo){
        html += `<h2>Failed to retrieve account info for ${Auth.currentUser.email} </h2>`
        Element.root.innerHTML = html;
        return;
    }
    //displays account info's email
    html += `
        <div class="alert alert-primary">
            Email: ${Auth.currentUser.email} (cannot change email as login name)
        </div>
    `;

    html +=`
        <form class"form-profile" method="post">
            <table class="table table-sm">
            <tr>
                <td width="15%">Name:</td>
                <td width="60%">
                    <input type="text" name="name" value="${accountInfo.name}"
                        placeholder="firstname lastname" disabled required
                        pattern="^[A-Za-z][A-Za-z|'|-| ]">
                </td>
                <td>${actionButtons()}</td>
            </tr>
            </table>
        </form>
    `;

    html +=`
    <form class"form-profile" method="post">
        <table class="table table-sm">
        <tr>
            <td width="15%">Address:</td>
            <td width="60%">
                <input type="text" name="address" value="${accountInfo.address}"
                    placeholder="Address" disabled required
                    minlength="2">
            </td>
            <td>${actionButtons()}</td>
        </tr>
        </table>
    </form>
`;

html +=`
<form class"form-profile" method="post">
    <table class="table table-sm">
    <tr>
        <td width="15%">City:</td>
        <td width="60%">
            <input type="text" name="city" value="${accountInfo.city}"
                placeholder="City" disabled required
                minlength="2">
        </td>
        <td>${actionButtons()}</td>
    </tr>
    </table>
</form>
`;

html +=`
<form class"form-profile" method="post">
    <table class="table table-sm">
    <tr>
        <td width="15%">State:</td>
        <td width="60%">
            <input type="text" name="state" value="${accountInfo.state}"
                placeholder="State (uppercase 2 letter state code)" disabled required
                pattern ="[A-Z]+"
                minlength="2">
        </td>
        <td>${actionButtons()}</td>
    </tr>
    </table>
</form>
`;

html +=`
<form class"form-profile" method="post">
    <table class="table table-sm">
    <tr>
        <td width="15%">Zip:</td>
        <td width="60%">
            <input type="text" name="zip" value="${accountInfo.zip}"
                placeholder="5 digit zip code" disabled required
                pattern ="[0-9]+"
                minlength="5" maxlength="5">
        </td>
        <td>${actionButtons()}</td>
    </tr>
    </table>
</form>
`;


html +=`
<form class"form-profile" method="post">
    <table class="table table-sm">
    <tr>
        <td width="15%">Credit Card #:</td>
        <td width="60%">
            <input type="text" name="creditNo" value="${accountInfo.creditNo}"
                placeholder="credit card number 16 digits" disabled required
                pattern ="[0-9]+"
                minlength="16" maxlength="16">
        </td>
        <td>${actionButtons()}</td>
    </tr>
    </table>
</form>
`;


    Element.root.innerHTML = html;
}

function actionButtons(){
    return`
    <button type="submit" class="btn btn-outline-primary">Edit</button>
    <button type="submit" class="btn btn-outline-danger" style="display: none;">Update</button>
    <button type="submit" class="btn btn-outline-secondary" style="display: none;">Cancel</button>

    `;
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