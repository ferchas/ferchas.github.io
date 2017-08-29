/**
 * Section
 */
const categTemplate = ({ name, permalink, permalinkText, sub_categories, type }) => (
  sub_categories ? `
    <article class="nav-categs-detail__categ" data-type="${type}">
      <h2 class="nav-categs-detail__title"><a href="${permalink}">${name}</a></h2>
      <i class="nav-icon-chevron-right"></i>
      <ul class="nav-categs-detail__categ-list">
        ${sub_categories.map(({ name, permalink }) => (
          `<li><a href="${permalink}">${name}</a></li>`
        )).join('')}
      </ul>
    </article>` : ''
);

const detailTemplate = ({ department_name, categories, permalink, permalinkText, sidebarTitle, sidebar }) => (`
  <header class="nav-categs-detail__header">
    <h1>${department_name}</h1>
  </header>
  <div class="nav-categs-detail__body">
    <div class="nav-categs-detail__body-content">
      ${categories.map(model => categTemplate(model)).join('')}
    </div>
    ${sidebar ? `
    <div class="flexDisplay">
      <aside class="nav-categs-detail__body-aside">
        <h2 class="nav-categs-TO__title">${sidebarTitle}</h2>
        <ul class="nav-categs-detail__list">
        ${sidebar.map(({ fantasy_name, permalink, pictures }) => (
          `<li>
            <a href="${permalink}" style="background-image:url(${pictures.secure_url})">${fantasy_name}</a>
          </li>`
        )).join('')}
        </ul>
      </aside>
    </div>` : ''}
  </div>
`);

class Detail {
  constructor() {
    this.el = document.querySelector('[data-js="nav-categs-detail"]');
  }

  show(props) {
    this.el.innerHTML = detailTemplate(props);
    this.el.hidden = false;
  }

  hide() {
    this.el.hidden = true;
  }
};

/**
 * Departments
 */
const departmentsTemplate = ({ static, departments }) => (`
  <ul class="nav-categs-departments-submenu">
    ${departments.map(({ department_name, permalink }, index, cull) => {
      if(index != cull.length - 1) {
        return `<li><a href="#" data-order="${index}">${department_name}</a></li>`;
      }
    }).join('')}
  </ul>
  <div class="nav-categs-departments-separator"></div>
  <ul class="nav-categs-departments-link">
    ${static.map(({ name, permalink }) => (
      `<li>
          <a href="${permalink}">${name}</a>
          <i class="nav-icon-chevron-right"></i>
       </li>`
    )).join('')}
  </ul>
  <div class="nav-categs-departments-separator"></div>
  <ul class="nav-categs-departments-link">
    <li>
      <a href="#" class="nav-categs-departments__more" >${departments[departments.length-1].department_name}</a>
      <i class="nav-icon-chevron-right"></i>
    </li>
  </ul>
`);

class Departments {
  constructor(model) {
    // Detail section
    this.detail = new Detail();
    // Model
    this.model = this._shapeModel(model);
    // State
    this.lastSelected = null;
    // DOM
    this.el = document.querySelector('[data-js="nav-categs-departments"]');
    // Bindings
    this.el.addEventListener('mouseover', (ev) => this.handleOver(ev.target));
    this.el.addEventListener('click', this.handleClick);
  }

  render() {
    this.el.innerHTML = departmentsTemplate(this.model);
  }

  cleanSelected() {
    if (this.lastSelected) {
      this.lastSelected.classList.remove('nav-categs-departments__selected');
      this.el.style.backgroundImage = null;
      this.lastSelected = null;
    }
  }

  markSelected(el) {
    el.classList.add('nav-categs-departments__selected');
    this.lastSelected = el;
  }

  /**
   * Prevent links to work if it has details to expand
   */
  handleClick(ev) {
    // Only block links with data-order, to expand details
    if (ev.target.tagName === 'A' && ev.target.dataset && ev.target.dataset.order) {
      ev.preventDefault();
    }
  }

  // TODO: This MUST happen on the server
  _shapeModel(raw) {
      console.log("###### raw", raw);
      const data = Object.assign({}, raw);
      const columns = 3;
      const full = 11;
      const half = 5;
      const thirds = 3;

    data.departments = data.departments.map(dep => {

      if (dep.categories.length <= columns){
          dep.categories = dep.categories.map(categ => {
              const subs = categ.sub_categories;
              if (!subs || !subs.length) return categ;

              categ.type = 'full';
              return categ;
          });
      }else{
            dep.categories = dep.categories.map(categ => {
              const subs = categ.sub_categories;
              if (!subs || !subs.length) return categ;
              const len = subs.length;
              if (len >= full) {
                //categ.sub_categories.length = full;
                categ.type = 'full';
                return categ;
              }

              if (len >= (half + 1) && len < full) {
                  categ.type = 'full';
                  return categ;
              }

              if (len > thirds && len >= half) {
                //categ.sub_categories.length = half;
                categ.type = 'full';
                return categ;
              }

              if (len < half && len >= thirds) {
                //categ.sub_categories.length = thirds;
                categ.type = 'full';
                return categ;
              }
              return categ;
            });
      }
      return dep;
    });
    return data;
  }

  /**
   * Show Details and update background image on Departments
   */
  handleOver(target) {
    // Only work with links
    if (target.tagName !== 'A') {
      return;
    }
    // Reset visual behavior: Remove selected link and background image
    this.cleanSelected();
    // If there are NOT sub-categories, exit and hide L1s
    if (!target.dataset || !target.dataset.order) {
      return this.detail.hide();
    }
    // If there are sub-categories...
    // Get the specific data from model
    const data = this.model.departments[target.dataset.order];
    // Set a background for departments, if there's one
    if (data.background_image_url) {
      // this.el.style.backgroundImage = `url(${data.background_image_url})`;
    }
    // Mark Selected
    this.markSelected(target);
    // Render the L1s
    this.detail.show(data);
  }
};

/**
 * Categories
 */
const categoriesTemplate = () => (`
  <nav class="nav-categs" data-js="nav-categs" hidden>
    <div class="nav-categs-container">
      <section class="nav-categs-departments" data-js="nav-categs-departments"></section>
      <section class="nav-categs-detail" data-js="nav-categs-detail" hidden></section>
    </div>
  </nav>
`);

class Categories {
  constructor(triggerSelector, model) {
    console.log(triggerSelector,model);
    // DOM
    this._renderStructure();
    this.el = document.querySelector('[data-js="nav-categs"]');
    this.trigger = document.querySelector(triggerSelector);
    // State
    this.shown = false;
    // Popup content
    this.departments = new Departments(model);
    /**
     * Bindings
     */
    this._hideByClickingOutside = this._hideByClickingOutside.bind(this);
    this._hideByEscaping = this._hideByEscaping.bind(this);
    // Keep interactions inside the component to avoid to click document and close
    this.el.addEventListener('click', (ev) => ev.stopPropagation())
    // Add interaction to the trigger. Toggle view.
    this.trigger.addEventListener('click', (ev) => {
      ev.preventDefault();
      this.show();
    });
    this.el.addEventListener('click', this._hideByClickingOutside);
  }

  _hideByEscaping(ev) {
    if (ev.keyCode === 27) {
      this.hide();
    }
  }

  // _hideByClickingOutside(ev) {
  //   if (ev.target == this.el || this.el.parentNode == ev.target.parentNode ) {
  //     this.hide();
  //   }
  // }

  _hideByClickingOutside(ev) {
    // console.log(ev.target , this.el.children,  this.trigger);
    if (ev.target !== this.el.firstChild && ev.target !== this.trigger) {
      this.hide();
    }
  }

  _renderStructure() {
    const header = document.querySelector('.nav-header');
    if (header) {
      header.insertAdjacentHTML('afterend', categoriesTemplate());
    } else {
      document.body.insertAdjacentHTML('beforeend', categoriesTemplate());
    }
  }

  /**
   * Hides the entire component
   */
  hide() {
    this.el.hidden = true;
    this.shown = false;
    this.trigger.close();

    document.documentElement.removeEventListener('click', this._hideByClickingOutside);
    document.removeEventListener('keydown', this._hideByEscaping);
  }

  /**
   * Shows the entire component and renders content on Departments
   */
  show() {
    const position = this.trigger.getBoundingClientRect();
    this.departments.render();
    this.el.hidden = false;
    this.shown = true;
    this.el.style.top = position.bottom +  'px';
    document.documentElement.addEventListener('click', this._hideByClickingOutside);
    document.addEventListener('keydown', this._hideByEscaping);
  }
};

// var categories = new Categories('[data-js="nav-categs-trigger"]', getCategories());
