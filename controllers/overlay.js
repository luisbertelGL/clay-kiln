module.exports = function () {
  var dom = require('../services/dom'),
    focus = require('../services/focus'),
    noScrollClass = 'noscroll';

  /**
   * @returns {DOMTokenList}
   */
  function getHtmlClassList() {
    return dom.find('html').classList;
  }

  /**
   * Disable scrolling on the page.
   */
  function disableScroll() {
    getHtmlClassList().add(noScrollClass);
  }

  /**
   * Enable scrolling on the page.
   */
  function enableScroll() {
    getHtmlClassList().remove(noScrollClass);
  }

  function constructor(el) {
    disableScroll();
    dom.onRemove(el, enableScroll);
  }

  constructor.prototype = {
    events: {
      'click': 'close'
    },

    close: function (e) {
      if (e.target === e.currentTarget) {
        // we clicked on the overlay itself
        focus.unfocus();
      }
    }
  };
  return constructor;
};
