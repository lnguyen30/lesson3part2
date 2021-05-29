//top menu buttons
export const menuSignIn = document.getElementById('menu-signin');
export const menuHome = document.getElementById('menu-home');
export const menuPurchases = document.getElementById('menu-purchases');
export const menuSignOut = document.getElementById('menu-signout');
export const menuCart = document.getElementById('menu-cart');
export const menuProfile = document.getElementById('menu-profile');
export const shoppingCartCount = document.getElementById('shoppingcart-count'); 


//forms
export const formSignin = document.getElementById('form-signin');
export const formSignupPasswordError = document.getElementById('form-signup-password-error');
export const formSignup = document.getElementById('form-signup');

export const buttonSignup = document.getElementById('button-signup')

//modal
export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'), {backdrop: 'static'});
export const modalInfo = new bootstrap.Modal(document.getElementById('modal-info'), {backdrop: 'static'});
export const modalInfoTitle = document.getElementById('modal-info-title');
export const modalInfoBody = document.getElementById('modal-info-body');
export const modalTransactionView = new bootstrap.Modal(document.getElementById('modal-transaction-view'), {backdrop: 'static'});
export const modalTransactionTitle = document.getElementById('modal-transaction-title');
export const modalTransactionBody = document.getElementById('modal-transaction-body');
export const modalSignup = new bootstrap.Modal(document.getElementById('modal-signup'), {backdrop: 'static'});

//root element
export const root = document.getElementById('root');