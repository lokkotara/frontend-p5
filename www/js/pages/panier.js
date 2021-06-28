class Panier {

  /**
   * le contenu du panier
   * @type {Object}
   */
  content = {};

  constructor(domTarget) {
    this.domTarget = domTarget;
    this.arrayToObject(orinoco.cart.content);
    this.displayForm();
    this.displayCart();
    this.watchClick();
  }

  /**
   * affiche le template correspondant à l'état du panier
   * templateProduct si objets dans le panier, templateEmptyCart si vide et template Error si erreur
   * transmet en paramètre la valeur totale de la ligne à la méthode qui affiche le total
   */
  async displayCart() {
    let html = "",
      i = 0,
      specs,
      total = 0;

    try {
      for (const [key, value] of Object.entries(this.content)) {
        i++;
        specs = await orinoco.dataManager.getProduct(key);
        html += this.templateProduct({
          ...value,
          ...specs,
          number: i
        });

        total += specs.price * value.qte / 100;
      }

      if (html === "") html = this.templateEmptyCart();

    } catch (err) {
      console.error(err);
      html = this.templateError();
    }
    
    this.domTarget.innerHTML = html;
    this.displayTotal(total);
  }

  /**
   * transforme un array en objet et definit sa propriété quantité avec une condition
   *
   * @param   {Array}  list  contenu du composant panier
   *
   * @return  {void}        met à jour le contenu du panier sous forme d'objet
   */
  arrayToObject(list) {
    this.content = {};

    for (let i = 0, size = list.length; i < size; i++) {
      if (this.content[list[i]] === undefined) this.content[list[i]] = {
        qte: 1
      };
      else this.content[list[i]].qte++;
    }
  }

  /**
   * template d'un produit 
   *
   * @param   {Object}  specs           Les propriétés d'un produit
   * @param   {String}  specs._id
   * @param   {String}  specs.imageUrl
   * @param   {Number}  specs.qte
   * @param   {String}  specs.name
   * @param   {Number}  specs.number
   * @param   {Number}  specs.price
   *
   * @return  {String}                  template HTML
   */
  templateProduct(specs) {
    return /*html*/ `
    <tr>
      <td>
        <img src="${specs.imageUrl}" alt="ours ${specs.number}">
      </td>
      <td>
        <h3>${specs.name}</h3>
      </td>
      <td>
        <div class="setQty">
          <div class="minusBtn" onclick="orinoco.page.decrement('${specs._id}')">
            <i class="fas fa-minus"></i>
          </div>
          <input type="text" class="field" value="${specs.qte}" aria-label="Champ affichant la quantité">
          <div class="plusBtn" onclick="orinoco.page.increment('${specs._id}')">
            <i class="fas fa-plus"></i>
          </div>
        </div>
      </td>
      <td>
        <p>total = ${specs.qte * specs.price / 100},00€</p>
      </td>
      <td>
        <i class="fas fa-trash-alt trashIcon" onclick="orinoco.page.deleteLine('${specs._id}')"></i>
      </td>
    </tr>
  `;
  }

  /**
   * template à retourner si le composant panier est vide
   */
  templateEmptyCart() {
    return /*html*/ `
      <p class="contentText">Votre panier est vide, pensez à ajouter des articles</p>
    `;
  }

  /**
   * template à retourner si une erreur empêche l'affichage du panier
   */
  templateError() {
    return /*html*/ `
      <p class="contentText">Oups, il semble qu'une erreur soit survenue.</p>
    `;
  }

  /**
   * affiche la ligne du total panier
   * lance ensuite la méthode de surveillance de la validation du formulaire
   * @param   {number}  sum  total obtenu dans la méthode displayCart
   *
   * @return  {HTMLElement}       retourne la ligne "total"
   */
  displayTotal(sum) {
    document.getElementById('displayTotal').innerHTML = /*html*/ `
      <tr>
        <td class="totalCart" >
          <p>Total du panier = <span id="total">${sum}</span>,00€</p>
        </td>
      </tr>
    `;
    this.watchClick(sum);
  }

  /**
   * Ajoute un id passé en paramètre au composant panier
   * ajoute un aussi à la propriété quantité du produit
   * puis actualise l'affichage du panier
   */
  increment(id) {
    orinoco.cart.add(id);
    this.content[id].qte++;
    this.displayCart();
  }

  /**
   * retire un id du composant panier
   * retire aussi 1 à la quantité du produit sélectionné
   * si la quantité arrive à 0, lance la méthode pour supprimer la ligne
   */
  decrement(id) {
    orinoco.cart.remove(id);
    this.content[id].qte--;
    if (this.content[id].qte === 0) this.deleteLine(id);
    else this.displayCart();
  }

  /**
   * ouvre un modal pour confirmer le choix utilisateur
   * si oui, supprime tous les id qui correspondent au paramètre du composant panier
   * supprime aussi la ligne du produit du panier. Sinon, actualise son affichage
   */
  deleteLine(id) {
    Swal.fire({
      position: "top",
      showDenyButton: true,
      icon: "warning",
      title: "Attention",
      text: "Voulez-vous vraiment supprimer cette ligne ?",
      confirmButtonText: "Oui, je le veux",
      denyButtonText: "En fait, non"
    }).then((result) => {
      if (result.isConfirmed) {
        orinoco.cart.delete(id);
        delete this.content[id];
        this.displayCart();
      }
    });
  }

  /**
   * vérifie si le champ requis respecte le regex
   * si oui, n'affiche rien. Sinon, affiche le message en paramètre
   *
   * @param   {HTMLElement}  domElm  [domElm description]
   * @param   {String}  msg     message de ce qui est attendu dans l'input
   *
   */
  checkField(domElm, msg) {
    document.getElementById(domElm.id + "Msg").innerHTML = (domElm.validity.valid) ? "" : msg;
  }

  /**
   * vérifie si un objet "contact" existe dans le localStorage
   * si oui, affiche les infos enregistrées dans les champs correspondants
   */
  isAlreadyCustomer() {
    let contact = JSON.parse(localStorage.getItem("contact"));
    if(contact != null){
      document.getElementById("firstName").value = contact.firstName;
      document.getElementById("lastName").value = contact.lastName;
      document.getElementById("address").value = contact.address;
      document.getElementById("city").value = contact.city;
      document.getElementById("email").value = contact.email;
    }
  }

  /**
   * au clic, supprime l'objet "contact" du localStorage et actualise l'affichage du formulaire
   */
  resetInputs() {
    document.getElementById("resetInputs").addEventListener("click", function(){
      localStorage.removeItem("contact");
      orinoco.page.displayForm();
    })
  }

  /**
   * affiche le formulaire
   */
  displayForm() {
    document.getElementById('form').innerHTML = /*html*/ `
      <span id="resetInputs">Ce n'est pas vous ?</span>
      <label for="firstName">Prénom<span>*</span></label>
      <input type="text" name="firstName" id="firstName" placeholder="Jean" pattern="^[a-zA-Z]{1}[a-zA-Z'À-ÿ -]+$" required oninput="orinoco.page.checkField(this,'Ne doit contenir que des lettres (au moins 2)')">
      <div id="firstNameMsg"></div>

      <label for="lastName">Nom de famille<span>*</span></label>
      <input type="text" name="lastName" id="lastName" placeholder="Dupont"   pattern="^[a-zA-Z]{1}[a-zA-Z'À-ÿ -]+$" required oninput="orinoco.page.checkField(this,'Ne doit contenir que des lettres (au moins 2)')">
      <div id="lastNameMsg"></div>

      <label for="address">Adresse<span>*</span></label>
      <input type="text" name="address" id="address" placeholder="5 rue du pont Napoléon" pattern="[a-zA-Z0-9À-ÿ '-]{2,}" required oninput="orinoco.page.checkField(this,'Ne doit contenir que des lettres et des chiffres (au moins 2)')">
      <div id="addressMsg"></div>

      <label for="city">Ville<span>*</span></label>
      <input type="text" name="city" id="city" placeholder="Paris"   pattern="^[a-zA-Z]{1}[a-zA-Z'À-ÿ -]+$" required oninput="orinoco.page.checkField(this,'Ne doit contenir que des lettres (au moins 2)')">
      <div id="cityMsg"></div>

      <label for="email">Adresse de messagerie<span>*</span></label>
      <input type="email" name="email" id="email"  placeholder="JeanDupont@gmail.com" pattern="^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})" required oninput="orinoco.page.checkField(this,'Doit respecter le format email')">
      <div id="emailMsg" class="lastInput"></div>

      <button class="formBtn" type="submit">Passer commande</button>
      <p class="notice">Veuillez remplir tous les champs obligatoires (<span>*</span>) du formulaire,<br> afin de pouvoir valider votre commande</p>
    `;
    this.isAlreadyCustomer();
    this.resetInputs();
  }

  /**
   * créé un string contenant les infos de contact et le tableau des produits du panier
   *
   * @return  {string}  infos de commande pour envoi via la méthode postOrder
   */
  sendForm() {
    let contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value
    };

    let products = orinoco.cart.content;

    let contactItems = JSON.stringify({
      contact,
      products
    });
    orinoco.dataManager.postOrder(contactItems);
  }

  /**
   * surveille la soumission du formulaire
   * s'il y a au moins un objet dans le panier, on sauvegarde le prix total dans localStorage puis envoie le formulaire
   * sinon, affiche un modal pour alerter d'ajouter au moins un article
   */
  watchClick(sum) {
    const formBtn = document.getElementById("form");
    formBtn.addEventListener("submit", e => {
      e.preventDefault();
      if (orinoco.cart.content.length > 0) {
        localStorage.setItem("total", sum);
        this.sendForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Vous devez d\'abord ajouter au moins un produit !"
        })
      }
    })
  }
}