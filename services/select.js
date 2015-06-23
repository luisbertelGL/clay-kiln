// all components get decorated with component bars (which are hidden by default)
// components that are "selected" get their bar (and their parents' bars) shown

var references = require('./references'),
  dom = require('./dom'),
  currentSelected;

/**
 * set selection on a component
 * @param {Element} el editable element or component el
 * @param {{ref: string, path: string, data: object}} options
 * @param {MouseEvent} e
 */
function select(el) {
  var parent, // todo: allow n-number of parents to be selected
    attr = '[' + references.referenceAttribute + ']';

  el = dom.closest(el, attr);
  parent = dom.closest(el.parentNode, attr);

  // selected component gets .selected, parent gets .selected-parent
  el.classList.add('selected');
  parent.classList.add('.selected-parent');
  currentSelected = el;
}

/**
 * remove selection
 */
function unselect() {
  var parent = dom.closest(currentSelected.parentNode, '[' + references.referenceAttribute + ']');

  currentSelected.classList.remove('selected');
  parent.classList.remove('.selected-parent');
  currentSelected = null;
}

/**
 * only add select decorator to components' root element
 * @param {Element} el
 * @returns {boolean}
 */
function when(el) {
  return el.hasAttribute(references.referenceAttribute);
}

/**
 * set the bar's height after images and such may have loaded
 */
function setHeight(el) {
  var componentHeight = getComputedStyle(el).height;

  dom.find(el, '.component-bar-title').style.width = parseInt(componentHeight) - 20 + 'px';
}

/**
 * add component bar (with click events)
 * @param {Element} el
 * @param {{ref: string, path: string, data: object}} options
 * @returns {Element}
 */
function handler(el, options) {
  var tpl = `
    <aside class="component-bar" title="${references.getComponentNameFromReference(options.ref).toUpperCase()}">
      <span class="component-bar-title">${references.getComponentNameFromReference(options.ref)}</span>
    </aside>
  `,
  componentBar = dom.create(tpl);

  // make sure components are relatively positioned
  el.classList.add('component-bar-wrapper');
  dom.prependChild(el, componentBar); // prepended, so parent components are behind child components
  window.setTimeout(setHeight.bind(null, el), 500);
  return el;
}

// focus and unfocus
module.exports.select = select;
module.exports.unselect = unselect;

// decorators
module.exports.when = when;
module.exports.handler = handler;
