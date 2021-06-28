class Product {
  
  constructor(domTarget, productId) {

    this.showProduct(domTarget, productId);
  }

  /**
   * récupère les infos du produit dans l'api puis les affichent dans la cible
   * lance la méthode pour surveiller les quantités choisies
   *
   * @param   {HTMLElement}  domTarget  élément dans lequel afficher
   * @param   {string}  productId  Id du produit à afficher
   *
   */
  async showProduct(domTarget, productId) {
    const produit = await orinoco.dataManager.getProduct(productId); 
    domTarget.innerHTML = this.productHtml(produit); 
    this.initQtySelector();
  }

  /**
   * Surveille le changement de quantité
   *
   * @return  {[type]}  [return description]
   */
  initQtySelector() {
    let getMinus = document.getElementById("minusBtn");
    let getPlus = document.getElementById("plusBtn");
    let getBtn = document.getElementById("addButton");

    getMinus.addEventListener("click", this.decrementInput);
    getPlus.addEventListener("click", this.incrementInput);
    getBtn.addEventListener("click", this.addToCart);
  }

  /**
   * génère le HTML d'un produit
   *
   * @param   {Object}  specs  les propriétés de l'objet
   *
   * @return  {HTMLElement}         le html du produit
   */
  productHtml(specs) {
    return /*html*/ `
    <article class="singleProduct">
      <figure>
        <img src="${specs.imageUrl}" alt="Ours en peluche marron">
      </figure>
      <section>
        <div class="productHeading">
          <h2>${specs.name}</h2>
          <span class="price">${specs.price / 100},00€</span>
        </div>
        <p class="first">${specs.description}</p>
        <div class="setQty">
          <div class="minusBtn" id="minusBtn">
            <i class="fas fa-minus"></i>
          </div>
          <input type="text" class="field" id="field" value="1" aria-label="Champ affichant la quantité">
          <div class="plusBtn" id="plusBtn">
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <div class="customize">
          <div class="displayColor">
            ${this.showColor(specs.colors)}
          </div>
          <label for="colors">Choisir sa couleur </label>
          <select name="colors" id="colors">
            ${this.showOptionColor(specs.colors)}
          </select>
        </div>
        <input class="addButton" id="addButton" type="button" value="Ajouter au panier">
      </section>
    </article>
    `;
  }


  /**
   * génère la liste des couleurs sous forme de dropdown list
   *
   * @param   {Array}  colors  les variantes de couleurs propres au produit
   *
   * @return  {HTMLElement}    les couleurs sous forme html
   */
  showOptionColor(colors) {
    let html = "";
    for (let i = 0, size = colors.length; i < size; i++) {
      html += ` <option>${this.convertToDisplayName(colors[i])}</option>`;
    }
    return html;
  }

  /**
   * Transfornme les noms de couleurs pour qu'il soit présentable dans la dropdown list
   *
   * @param   {[type]}  color  [color description]
   *
   * @return  {[type]}         [return description]
   */
  convertToDisplayName(color) {
    let colors = color
      .toLowerCase()
      .split(" ");

    let maj;
    for (let i = 0, size = colors.length; i < size; i++) {
      maj = colors[i].slice(0, 1).toUpperCase();
      colors[i] = maj + colors[i].slice(1);
    }
    return colors.join(" ");
  }

  /**
   * génère la liste des couleurs sous forme de pastille.
   *
   * @param   {Array}  colors  les variantes
   *
   * @return  {String}         les couleurs sous forme html
   */
  showColor(colors) {
    let html = "";
    for (let i = 0, size = colors.length; i < size; i++) {
      html += `<i class="fas fa-circle ${this.convertToClassName(colors[i])}" ></i>`;
    }
    return html;
  }

  /**
   * Récupère le nom de la couleur dans l'api et le transforme en nom de classe.
   *
   * @param   {string}  color  correspond aux couleurs pour chaque nounours
   *
   * @return  {string}         nom de classe en camelCase qui finit par Color utilisé dans le CSS.
   */
  convertToClassName(color) {
    let colors = color
      .toLowerCase()
      .split(" ");

    let maj;
    for (let i = 1, size = colors.length; i < size; i++) {
      maj = colors[i].slice(0, 1).toUpperCase();
      colors[i] = maj + colors[i].slice(1);
    }
    return colors.join("") + "Color";
  }

  /**
   * récupère le chiffre présent dans le champ "field" et le réduit de 1 jusqu'à 1 minimum, sinon ne fait rien
   */
  decrementInput() {
    let getInput = document.getElementById("field").value;
    let stringToNumber = parseInt(getInput, 10);
    if (getInput > 1) {
      let newInput = stringToNumber -= 1;
      document.getElementById("field").value = newInput;
    }
  }

  /**
   * récupère le chiffre présent dans le champ "field" et l'augmente de 1
   */
  incrementInput() {
    let getInput = document.getElementById("field").value;
    let stringToNumber = parseInt(getInput, 10);
    let newInput = stringToNumber += 1;
    document.getElementById("field").value = newInput;
  }

  /**
   * Récupère l'id du produit en paramètre d'url, ainsi que la quantité sélectionnée et l'ajoute à l'array du composant panier
   * ensuite, affiche un modal qui récapitule le nombre de nounours ajouté et propose une redirection panier ou index
   */
  addToCart() {
    let params = (new URL(document.location)).searchParams;
    let produit = params.get("_id");
    let getInput = document.getElementById("field").value;
    let stringToNumber = parseInt(getInput, 10);
    orinoco.cart.add(produit, stringToNumber);
    Swal.fire({
      position: "top",
      showDenyButton: true,
      icon: "success",
      title: "Bravo",
      text: "Vous avez ajouté " + stringToNumber + " nounours au panier.",
      confirmButtonText: "Aller au panier",
      denyButtonText: "Retourner à l'accueil"
    }).then((result) => {
      if (result.isConfirmed) {
        document.location.href="./panier.html ";
      } else if (result.isDenied) {
        document.location.href="./index.html ";
      }
    });
  }

}