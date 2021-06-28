const orinoco = {
  dataManager: new DataManager("https://orinounours.herokuapp.com/api/teddies")
};
orinoco.cart = new Cart(document.querySelector("nav"));
orinoco.page = definePage();

/**
 * définit le script à utiliser sur la page courante
 *
 * @return  {Home|Product|Panier|Confirmation}  retourne une page
 */
function definePage() {
  let params = (new URL(document.location)).searchParams; 
  var url = window.location.pathname;
  
  switch (url) {
    case "/produit.html":
      return new Product(document.querySelector("div.singleCardWrapper"), params.get("_id"));
    case "/panier.html":
      return new Panier(document.querySelector("tbody.cartSummaryBody"));
    case "/confirmation.html":
      return new Confirmation(document.querySelector("main.mainConfirmation"));
    default:
      return new Home(document.querySelector("div.cardsWrapper"));
  }
}
