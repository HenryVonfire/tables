import Ember from 'ember';
import TableCell from 'ember-table/views/table-cell';

export default TableCell.extend({
  className: 'editable-table-cell',
  templateName: 'editable-table/editable-table-cell',
  pattern: 'parentView.pattern',
  placeholder: 'parentView.placeholder',
  isEditing: false,
  disable: false,
  isDisabled: Ember.computed('disable',function(){
    var newDate = this.get('parentView.row.content.date');
    var newHeader = this.get('content.headerCellName');
    if(this.get('content.isColumnDisabled')){
      this.set('disable',true);
    }else{
      if (this.get('indexDisabled').indexOf(newHeader + ":" + newDate) !== -1) {
        this.set('disable',true);
      }else{
        this.set('disable',false);
      }
    }
    return this.get('disable');
  }),
  indexDisabled: [],
  type: 'text',

  innerTextField: Ember.TextField.extend({
    typeBinding: 'parentView.type',
    valueBinding: 'parentView.cellContent',
    didInsertElement: function() {
      return this.$().focus();
    },
    focusOut: function() {
      return this.set('parentView.isEditing', false);
    }
  }),

  click: function(event) {
    if(!this.get('disable') && !this.get('content.isColumnDisabled')){
      this.set('isEditing', true);
    }
    return event.stopPropagation();
  },

  // onRowContentDidChange not only finish the edit action but also check the right value of disable for each cell
  // when the rows are reordered.
  onRowContentDidChange: Ember.observer(function() {
    //console.log(this.get('parentView.parentView.parentView.parentView.parentView.columns.[]'));
    var newDate = this.get('parentView.row.content.date');
    var newHeader = this.get('content.headerCellName');
    if(this.get('content.isColumnDisabled')){
      this.set('disable',true);
    }else{
      if (this.get('indexDisabled').indexOf(newHeader + ":" + newDate) !== -1) {
        this.set('disable',true);
      }else{
        this.set('disable',false);
      }
    }
    return this.set('isEditing', false);
  }).observes('row.content','content.isColumnDisabled'),


  /*********************************************************************************************************************
   * BEGINNING MOUSE CONTEXT MENU
   */
  mouseMenu: (function() {
    var _this = this;
    var elementDisabled;
    var disableText;


    this.$().contextMenu({
      // Name of the class related to the menu
      selector: '.context-menu-two',
      build: function($trigger, e) {
        // Initialisation of the name and clickability of the option depending on the state of the cell
        elementDisabled=false;
        if(_this.get('content.isColumnDisabled')){
          elementDisabled=true;
        }
        disableText="Disable";
        if(_this.get('disable')){
          disableText="Enable";
        }

        return {
          // Functions for each option in the menu
          callback: function(key, options) {
            if(key === "edit"){
              if(_this.get('disable') === false){
                _this.set('isEditing', true);
              }
            }
            if(key === "disable"){
              var indexArray = _this.get('indexDisabled');
              var newDate = _this.get('parentView.row.content.date');
              var newHeader = _this.content.headerCellName.toString();
              if(disableText === "Disable"){
                indexArray.push(newHeader + ":" + newDate);
                _this.set('disable', true);
              }
              else{
                //Obtains the index of disabled cells, finds the one which match with the actual one and extracts it from the array
                indexArray.splice(indexArray.indexOf(newHeader + ":" + newDate),1);
                _this.set('disable', false);
              }
            }
          },
          // List of items in the menu
          items: {
            "edit": {name: "Edit", icon: "edit", disabled: elementDisabled},
            "disable": {name: disableText, icon: "disable", disabled: elementDisabled}
          }
        };
      }
    });

    this.$('.context-menu-two').on('click', function(e){
      //console.log('clicked', this);
    });
  }).on('didInsertElement')//.on('contextMenu'),

  /*
   * END MOUSE CONTEXT MENU
   ********************************************************************************************************************/
});


//old_template:
//<div class="context-menu-two">
//  {{#if view.isDisabled}}
//    <span class="ember-table-content" style="background-color: lightgray;">
//      <span class='content'>{{view.cellContent}}</span>
//    </span>
//  {{else}}
//    <span class="ember-table-content" >
//      {{#if view.isEditing}}
//        {{view view.innerTextField}}
//        {{!checked-input
//        value=view.cellContent}}
//      {{else}}
//          <span class='content'>{{view.cellContent}}</span>
//      {{/if}}
//    </span>
//  {{/if}}
//</div>

