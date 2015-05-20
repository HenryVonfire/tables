import Ember from 'ember';
import HeaderCell from 'ember-table/views/header-cell';

export default HeaderCell.extend({
  className: 'editable-table-header-cell',
  templateName: 'editable-table/editable-table-header-cell',
  isSorted: Ember.computed(function(){
    return this.get('content.sorted');
  }).property('isAscending'),
  isAscending: false,
  dataType: Ember.computed(function(){
    return this.get('content.cellType');
  }),
  columnName: Ember.computed(function(){
    return this.get('content.columnName');
  }),
  click: function(event) {
    this.toggleProperty('isAscending');

    return event.stopPropagation();
  },
  /*********************************************************************************************************************
   * BEGINNING MOUSE CONTEXT MENU
   */
  mouseMenu: (function() {
    var _this = this;
    var disableCaption;
    this.$().contextMenu({
      // Name of the class related to the menu
      selector: '.context-menu-three',
      build: function($trigger, e) {
        disableCaption = "Disable";
        if(_this.get('content.isColumnDisabled')){
          disableCaption = "Enable";
        }
        return {
          // Functions for each option in the menu
          callback: function(key, options) {
            if(key === "disable"){
              if(disableCaption === "Disable"){
                _this.set('content.isColumnDisabled', true);
                disableCaption = "Enable";
              }
              else{
                _this.set('content.isColumnDisabled', false);
                disableCaption = "Disable";
              }
            }
          },
          // List of items in the menu
          items: {
            "disable": {name: disableCaption, icon: "disable"}
          }
        };
      }
    });

    this.$('.context-menu-three').on('click', function(e){
      //console.log('clicked', this);
    });
  }).on('didInsertElement')//.on('contextMenu'),

  /*
   * END MOUSE CONTEXT MENU
   ********************************************************************************************************************/
});
