import Ember from 'ember';
import ColumnDefinition from 'ember-table/models/column-definition';
import TableComponent from 'ember-table/components/ember-table';
//import TableCell from 'ember-table/views/table-cell';
//import HeaderCell from 'ember-table/views/header-cell';


function getValueCell(row, columnName){
  return row[columnName];
}

var savedTable = null;
var columnName = null;
var customSortAscending = false;
var dataType = null;

export default TableComponent.extend({

  layoutName: 'components/ember-table',
  numFixedColumns: 0,
  isCollapsed: false,
  isHeaderHeightResizable: true,
  rowHeight: 30,
  hasHeader: true,
  hasFooter: false,
  headerHeight: 70,
  //numColumns: 5,
  content:null,
  columns:null,

  /*********************************************************************************************************************
   * BEGINNING MOUSE CONTEXT MENU
   */
  mouseMenu: (function() {
    var _this = this;
    this.$().contextMenu({
      // Name of the class related to the menu
      selector: '.context-menu-one',
      // Functions for each option in the menu
      callback: function(key, options) {
        if(key === "inc"){
          _this.send('incRowHeight');
        }
        if(key === "dec"){
          _this.send('decRowHeight');
        }
      },
      // List of items in the menu
      items: {
        "inc":{name:"+ Row Size", icon: "plus"},
        "dec":{name:"- Row Size", icon: "minus"},
        "sep1": "---------",
        "edit": {name: "Edit", icon: "edit"},
        "cut": {name: "Cut", icon: "cut"},
        "copy": {name: "Copy", icon: "copy"},
        "paste": {name: "Paste", icon: "paste"},
        "delete": {name: "Delete", icon: "delete"},
        "sep2": "---------",
        "quit": {name: "Quit", icon: "quit"}
      }
    });

    this.$('.context-menu-one').on('click', function(e){
      //console.log('clicked', this);
    });
  }).on('didInsertElement'),//.on('contextMenu'),

  /*
   * END MOUSE CONTEXT MENU
   ********************************************************************************************************************/


  columns: Ember.computed(function() {
    var dateColumn = ColumnDefinition.create({
      savedWidth: 150,
      textAlign: 'text-align-left',
      headerCellName: 'Date',
      cellType: "number",
      columnName: 'date',
      placeholder: 'date',
      pattern:'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$',
      isColumnDisabled:false,
      headerCellView: 'editable-table-header-cell',
      sorted: false,
      getCellContent: function(row) {
        return row.get('date').toDateString();
      }
    });
    var openColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Open',
      cellType: "number",
      columnName: 'open',
      placeholder: 'open',
      pattern:'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$',
      isColumnDisabled:false,
      headerCellView: 'editable-table-header-cell',
      tableCellViewClass: 'editable-table-cell',
      sorted: false,
      getCellContent: function(row){
        return row.get('open').toFixed(2);
      },
      setCellContent: function(row, value) {
        return row.set('open', +value);
      }
    });
    var highColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'High',
      cellType: "number",
      columnName: 'high',
      placeholder: 'high',
      pattern:'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$',
      isColumnDisabled:false,
      headerCellView: 'editable-table-header-cell',
      tableCellViewClass: 'editable-table-cell',
      sorted: false,
      getCellContent: function(row){
        return row.get('high').toFixed(2);
      },
      setCellContent: function(row, value) {
        return row.set('high', +value);
      }
    });
    var lowColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Low',
      cellType: "number",
      columnName: 'low',
      placeholder: 'low',
      pattern:'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$',
      isColumnDisabled:false,
      headerCellView: 'editable-table-header-cell',
      tableCellViewClass: 'editable-table-cell',
      sorted: false,
      getCellContent: function(row){
        return row.get('low').toFixed(2);
      },
      setCellContent: function(row, value) {
        return row.set('low', +value);
      }
    });
    var closeColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Close',
      cellType: "number",
      columnName: 'close',
      placeholder: 'close',
      pattern:'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$',
      isColumnDisabled:false,
      headerCellView: 'editable-table-header-cell',
      tableCellViewClass: 'editable-table-cell',
      sorted: false,
      getCellContent: function(row){
        return row.get('close').toFixed(2);
      },
      setCellContent: function(row, value) {
        return row.set('close', +value);
      }
    });
    //Changing the order in which the columns are returned affects how their are showed.
    //This can be used to set a prefixed order for them.
    return [dateColumn, highColumn, lowColumn, openColumn, closeColumn];
  }),

  content: Ember.computed(function() {
    var dataTable = Array.apply(null, new Array(15)).map(function (_, i)  {
      var date = new Date();
      date.setDate(date.getDate() + i);

      return {
        date: date,
        open: Math.random() * 100 - 50,
        high: Math.random() * 100 - 50,
        low: Math.random() * 100 - 50,
        close: Math.random() * 100 - 50,
        volume: Math.random() * 1000000
      };
    });
    savedTable = dataTable;
    return dataTable;
  }),

  /*********************************************************************************************************************
   * BEGINNING FILTER FUNCTIONALITY
   */

  theFilter: "",
  checkFilterMatch: function (theObject, str) {
    var field, match;
    match = false;

    for (field in theObject) {
      if(theObject[field].toString().toLowerCase().indexOf(str.toLowerCase()) !== -1){

        match = true;
      }
    }
    return match;
  },
  filterData: (function () {
    console.log("filter entered");
    if (this.get('theFilter') !== "") {
      var filteredContent = savedTable.filter((function (_this) {
        return function (theObject, index, enumerable) {
          if (_this.get("theFilter")) {
            return _this.checkFilterMatch(theObject, _this.get("theFilter"));
          } else {
            return true;
          }
        };
      })(this));
      this.set('content', filteredContent);
    } else {
      this.set("content", savedTable);
    }
  }).observes('theFilter'),

  /*
   * END FILTER FUNCTIONALITY
   ********************************************************************************************************************/

  actions: {
    sortByColumn: function(columnName, ascending, dataType){
      var listColumns = this.get('columns');
      for(var i = 0; i< listColumns.length; i++){
        if(listColumns[i].columnName === columnName){
          listColumns[i].sorted = true;
        }else{
          listColumns[i].sorted = false;
        }
      }

      var sortTable = this.get('content').sort(function (a, b) {
        if(ascending){
          if(dataType === "text"){
            var x = a[columnName].toString().toLowerCase(),
              y = b[columnName].toString().toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          }else{
            return a[columnName] - b[columnName];
          }

        }
        else{
          if(dataType === "text"){
            var x = b[columnName].toString().toLowerCase(),
              y = a[columnName].toString().toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          }else{
            return b[columnName] - a[columnName];
          }
        }
      });
      // Performing a get and then a setObjects allows to refresh the contentTable element
      this.get("content").setObjects(sortTable);
    },
    sortHigh: function() {
      //TODO: figure out why the sorting is not working with a filtered table
      //console.log(this.get('content'));
      //this.set('sortColumn', this.get('content')[2]);
      columnName = "high";
      customSortAscending = !customSortAscending;
      dataType = "number";
      this.set('sortColumn', columnName + ":" + customSortAscending + ":" + dataType);
    },

    sortLow: function() {
      //this.set('sortColumn', this.get('content')[3]);
      columnName = "low";
      customSortAscending = !customSortAscending;
      dataType = "number";
      this.set('sortColumn', columnName + ":" + customSortAscending + ":" + dataType);
    },
    sortDate: function(){
      //this.set('sortColumn', this.get('content')[0]);
      columnName = "date";
      customSortAscending = !customSortAscending;
      dataType = "number";
      this.set('sortColumn', columnName + ":" + customSortAscending + ":" + dataType);
    }
  }
});


