/*
 * jQuery dynRow
 * @author admin@gedex.web.id - http://gedex.web.id
 * @version 0.1
 * @date February 12, 2010
 * @category jQuery plugin
 * @copyright (c) 2010 admin@gedex.web.id (gedex.web.id)
 * @license MIT licensed
 */
(function($){
    $.fn.dynRow = function(params) {
        params = params || {}
        
        var defaults = {
            containerRow: '',       // where clonedRow placed?
                                    // this is also its scope
            targetRow: '',          // row to be cloned
            indexRow: 'last',       // which row to be cloned
                                    // in many case: last row,
                                    // but first can used, numeric
                                    // also can be used
            clearVal: true,         // if clonedRow contains
                                    // input, clear its value
            operation: 'append',    // append the clonedRow
            into: '',               // appends clonedRow into this
            maxRow: null,           // maxRow to insert, null: unlimited
            onMax: function(nthRow) {},
            showDelete: true,       // show delete on each row
            beforeClone: function(targetRow, containerRow) {
            },
            afterClone: function(newRow, containerRow) {
            },
            afterAppend: function(newRow, containerRow) {
            }
        }
        
        function err(type, msg) {
            alert(type + ': ' + msg);
            return false;
        }
        
        var o = $.extend(defaults, params);
        
        // checking containerRow and target row
        if ( !o.targetRow.length && !o.containerRow.length ) {
            return err('dynRow Error', 
                'You need to provide containerRow and targetRow!');
        }
        // checking indexRow
        switch ( typeof(o.indexRow) ) {
            case 'string':
                if ( !o.indexRow.length ) {
                    return err('dynRow Error',
                        'You need to provide indexRow!');
                }
                o.indexRow = ':'+o.indexRow;
                break;
            case 'numeric':
                o.indexRow = ':eq('+o.indexRow+')';
                break;
            default:
                return err('dynRow Error', 
                    'indexRow must be string or numeric!');
        }
        
        var addNew = $(this);
        var scope = $(o.containerRow);
        if (!o.into.length) {o.into = o.containerRow}
        var into = $(o.into);
        if ( !into.length ) {
            into = scope;
        }
        var cache = undefined;
        
        if ( !scope.length ) {
            return err('dynRow Error',
                'containerRow doesn\'t exist');
        }
        
        addNew.live('click', function(e) {
            var targetRow = $(o.targetRow+o.indexRow, scope);
            
            var nthRow = $(o.targetRow, scope).length;
            
            if ( o.maxRow != null && nthRow == o.maxRow) {
                o.onMax(nthRow);
                return false;
            }
            
            // if row not exists 
            if ( !targetRow.length ) {
                // cached?
                if ( typeof(cache) != 'undefined' ) {
                    targetRow = cache;
                }
                
                if ( !targetRow.length ) {
                    return false;
                }
            }
            
            // beforeClone tasks
            if ( typeof(o.afterClone) === 'function' ) {
                o.beforeClone(targetRow, scope);
            }
            
            // cloning
            var newRow = targetRow.clone();
            
            // afterClone tasks
            // formating newRow can be done here
            o.afterClone(newRow, scope);
            if ( typeof(cache) === 'undefined' ) {
                cache = newRow;
            }
            
            // inserting newRow
            into[o.operation](newRow);
            
            // afterAppend tasks
            // you can rebinding events here
            o.afterAppend(newRow, scope);
        });
    };
})(jQuery);