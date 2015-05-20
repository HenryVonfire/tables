import Ember from 'ember';

export default Ember.Component.extend({
  // value
  // pattern
  // placeholder
  isDisabled:false,
  isEditing: false,
  innerTextField: Ember.TextField.extend({
    classNames: ['table-input'],
    pattern: Ember.computed(function(){
      return this.get('parentView.pattern');
    }),
    placeholder: Ember.computed(function(){
      return this.get('parentView.placeholder');
    }),
    typeBinding: 'parentView.type',
    valueBinding: 'parentView.value',
    didInsertElement: function() {
      return this.$().focus();
    },
    focusOut: function() {
      return this.set('parentView.isEditing', false);
    }
  }),
  click: function(event) {
    this.set('isEditing', true);
    //this.$().focus();
    return event.stopPropagation();
  },
  onRowContentChange: Ember.observer(function() {
    //console.log("yep");
  }).observes('value'),
});
