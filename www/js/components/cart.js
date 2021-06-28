class Cart {

  /**
   * @type {HTMLElement}
   */
  DOM;

  /**
   * contient tous les éléments du panier
   * @type {Array}
   */
  content = [];

  /**
   * constructeur du composant panier
   *
   * @param   {HTMLElement}  domTarget  cible où afficher
   *
   * @constructor
   */
  constructor(domTarget) {
    this.content = orinoco.dataManager.getCart();
    this.DOM = document.createElement("cart");
    domTarget.appendChild(this.DOM);
    this.render();
  }

  render() {
    this.DOM.innerHTML = /*html*/ `
      <a href="./panier.html" class="iconCart">
        <span>Mon panier</span>
        <i class="fas fa-shopping-cart">${this.content.length}</i>
      </a>
    `;
  }

  /**
   * ajoute à la fin du tableau l'id en 1er paramètre, le nombre de fois spécifié dans le 2ème paramètre
   * ensuite, actualise le rendu du composant panier et sauvegarde le nouveau contenu dans localStorage
   */
  add(productId, qty = 1) {
    for (let i = 1; i <= qty; i++) {
      this.content.push(productId);
    }
    this.render();
    orinoco.dataManager.saveCart(this.content);
  }

  /**
   * Recherche la valeur du paramètre dans l'array et l'enlève
   * ensuite, réactualise l'affichage et sauvegarde l'array modifié dans localStorage
   */
  remove(productId) {
    const id = this.content.indexOf(productId);
    this.content.splice(id, 1);
    this.render();
    orinoco.dataManager.saveCart(this.content);
  }

  /**
   * filtre l'id spécifié en paramètre en retournant un tableau où seuls les id n'étant pas celle spécifiée sont rajoutées
   * Ensuite, réactualise l'affichage et sauvegarde l'array modifié dans localStorage
   */
  delete(productId) {
    const newContent = [];
    for (let i = 0, size=this.content.length; i <size; i++) {
      if (this.content[i] !== productId) newContent.push(this.content[i]);
    }
    this.content = newContent;
    this.render();
    orinoco.dataManager.saveCart(this.content);
  }

  /**
   * renvoie un tableau vide comme dans le constructeur, actualise l'affichage et sauvegarde l'array dans localStorage
   *
   */
  deleteAll() {
    this.content = [];
    this.render();
    orinoco.dataManager.saveCart(this.content);
  }
}
