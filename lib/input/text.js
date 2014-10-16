/**
 * Created by Ivan on 10/16/2014.
 */
(function(  ){
    'use strict';
    var Z = require('z-lib' ),
        base = Z.Form.Input.Base,
        $base = base.prototype,
        Text = Z.Form.Input.Text = function( cfg ){
            Z.apply(this, cfg);
            base.call(this);
        },
        tpl = function( value ){
            return '<input value="'+value+'">';
        };
    Text.prototype = Z.extend($base, {
        emptyText: 'Empty',
        disabledText: 'Disabled',
        draw: function(  ){
            this.renderTo.innerHTML = tpl(this.getDisplayValue());
        }
    })
})();