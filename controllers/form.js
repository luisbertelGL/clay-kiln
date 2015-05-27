'use strict';
module.exports = function () {
  var _ = require('lodash'),
    dom = require('../services/dom'),
    edit = require('../services/edit'),
    formvalues = require('../services/formvalues');

  /**
   * constructor
   * @param  {Element} el    
   * @param  {string} ref   component ref
   * @param  {string} path  dot-delineated path to the data
   * @param  {Element} [oldEl] hold a reference to the old element for inline forms
   */
  function constructor(el, ref, path, oldEl) {
    function outsideClickhandler(e) {
      if (!_.contains(e.path, el)) {
        el.dispatchEvent(new CustomEvent('close'));
        this.removeEventListener('click', outsideClickhandler); // note: this references <html>
      }
    }

    // if this is an inline form, add an event handler that will close the form when you click out of it
    if (oldEl) {
      dom.find('html').addEventListener('click', outsideClickhandler);
    }

    this.el = el;
    this.ref = ref;
    this.path = path;
    this.oldEl = oldEl;
    this.form = dom.find(el, 'form');
  }

  constructor.prototype = {
    events: {
      'submit': 'saveData',
      '.save click': 'saveData',
      'close': 'closeForm'
    },

    saveData: function (e) {
      e.preventDefault();

      var form = this.form,
        ref = this.ref,
        path = this.path,
        newData = formvalues(form);

      if (form.checkValidity()) {
        edit.update(ref, newData, path);
      }
    },

    closeForm: function () {
      dom.replaceElement(this.el, this.oldEl);
    }
  };

  return constructor;
};