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
var sortAscending = false;
var dataType = null;
export default TableComponent.extend({
  //myStyle: function() {
  //  var height = escapeCSS(this.get('height'));
  //  console.log(height);
  //  return ("height: " + height).htmlSafe();
  //}.property('height'),

  tableColumns: Ember.computed(function() {
    var dateColumn = ColumnDefinition.create({
      savedWidth: 150,
      textAlign: 'text-align-left',
      headerCellName: 'Date',
      getCellContent: function(row) {
        return row.get('date').toDateString();
      }
    });
    var openColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Open',
      getCellContent: function(row) {
        return row.get('open').toFixed(2);
      }
    });
    var highColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'High',
      getCellContent: function(row) {
        return row.get('high').toFixed(2);
      }
    });
    var lowColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Low',
      getCellContent: function(row) {
        return row.get('low').toFixed(2);
      }
    });
    var closeColumn = ColumnDefinition.create({
      savedWidth: 100,
      headerCellName: 'Close',
      getCellContent: function(row) {
        //console.log(row);
        //Object.getOwnPropertyNames(row).forEach(function(val, idx, array) {
        //  print();
        //  console.log(val + ' -> ' + row[val]);
        //});
        //console.log(row["content"].close);
        return row.get('close').toFixed(2);
      }
    });
    return [dateColumn, openColumn, highColumn, lowColumn, closeColumn];
  }).property(),

  tableContent: Ember.computed(function() {
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
    //var col = this.get('sortColumn');
    //if (col) {
    //  dataTable.sort(function (a, b) {
    //    if (sortAscending) {
    //      if (dataType === "text") {
    //        var x = getValueCell(a, columnName).toString().toLowerCase(),
    //          y = getValueCell(b, columnName).toString().toLowerCase();
    //        return x < y ? -1 : x > y ? 1 : 0;
    //      } else {
    //        return getValueCell(a, columnName) - getValueCell(b, columnName);
    //      }
    //
    //    }
    //    else {
    //      if (dataType === "text") {
    //        var x = getValueCell(b, columnName).toString().toLowerCase(),
    //          y = getValueCell(a, columnName).toString().toLowerCase();
    //        return x < y ? -1 : x > y ? 1 : 0;
    //      } else {
    //        return getValueCell(b, columnName) - getValueCell(a, columnName);
    //      }
    //    }
    //
    //  });
    //}
    savedTable = dataTable;
    return dataTable;
  }),//.property('sortColumn'),


  /*********************************************************************************************************************
   * BEGINNING SORTING FUNCTIONALITY
   */
  sortColumn: null,
  sortBehaviour: function() {
    Ember.run.once(this, 'sortingData');
  }.observes('sortColumn'),
  sortingData: (function(){
    var col = this.get('sortColumn');
    if (col) {
      var sortTable = this.get('tableContent').sort(function (a, b) {
        if(sortAscending){
          if(dataType === "text"){
            var x = getValueCell(a,columnName).toString().toLowerCase(),
              y = getValueCell(b,columnName).toString().toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          }else{
            return getValueCell(a,columnName) - getValueCell(b,columnName);
          }

        }
        else{
          if(dataType === "text"){
            var x = getValueCell(b,columnName).toString().toLowerCase(),
              y = getValueCell(a,columnName).toString().toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          }else{
            return getValueCell(b,columnName) - getValueCell(a,columnName);
          }
        }

      });
      // Performing a get and then a setObjects allows to refresh the content element
      this.get("tableContent").setObjects(sortTable);
    }
  }),


  /*
   * END SORTING FUNCTIONALITY
   ********************************************************************************************************************/





  /*********************************************************************************************************************
   * BEGINNING FILTER FUNCTIONALITY
   */

  theFilter: "",
  checkFilterMatch: function (theObject, str) {
    var field, match;
    match = false;

    for (field in theObject) {
      // Sorting by the beginning of the field
      //if (theObject[field].toString().toLowerCase().slice(0, str.length) === str.toLowerCase()) {
      // Sorting by the content of the cell
      //if (theObject[field].toString().search(str.toString()) !== -1) {
      //if (theObject[field].toString().toLowerCase().match(str.toLowerCase()) !== null) {
      if(theObject[field].toString().toLowerCase().indexOf(str.toLowerCase()) !== -1){

        match = true;
      }
    }
    return match;
  },
  filterData: (function () {
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
      console.log(filteredContent);
      this.set('tableContent', filteredContent);
      //this.set('content', this.get('arrangedContent')); // to get sorted content
      //this.set('isFilterApplied', true);
    } else {
      //this.set("content", this.get("content"));
      this.set("tableContent", savedTable);

      //this.set('isFilterApplied', false);
    }
  }).observes('theFilter'),

  /*
   * END FILTER FUNCTIONALITY
   ********************************************************************************************************************/

  actions: {
    sortHigh: function() {
      //TODO: figure out why the sorting is not working with a filtered table
      //console.log(this.get('tableContent'));
      //this.set('sortColumn', this.get('tableContent')[2]);
      columnName = "high";
      sortAscending = !sortAscending;
      dataType = "number";
      this.set('sortColumn', columnName + ":" + sortAscending + ":" + dataType);
    },

    sortLow: function() {
      //this.set('sortColumn', this.get('tableContent')[3]);
      columnName = "low";
      sortAscending = !sortAscending;
      dataType = "number";
      this.set('sortColumn', columnName + ":" + sortAscending + ":" + dataType);
    },
    sortDate: function(){
      //this.set('sortColumn', this.get('tableContent')[0]);
      columnName = "date";
      sortAscending = !sortAscending;
      dataType = "number";
      this.set('sortColumn', columnName + ":" + sortAscending + ":" + dataType);
    }
  }
});


