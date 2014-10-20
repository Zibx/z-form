/**
 * Created by Ivan on 10/20/2014.
 */
var Z = require('z-lib');
Z.Form.Validator = {};

/*number*/
var numberValidator = Z.Form.Validator.Number = function(cfg){
    Z.apply(this, cfg);
};
numberValidator.prototype = {
    min: null,
    max: null,
    validate: function(value){
        var error = false;
        if( Z.isArray(value) || isNaN( value - parseFloat(value) ) )
            error = 'validator.error.number.fail';
        else if( this.min !== null && value < this.min )
            error = 'validator.error.number.min';
        else if( this.max !== null && value > this.max )
            error = 'validator.error.number.max';

        return error;
    }
};
/*number*/
var intValidator = Z.Form.Validator.Integer = function(cfg){
    Z.apply(this, cfg);
};
intValidator.prototype = {
    min: null,
    max: null,
    validate: function(value){
        var error = numberValidator.prototype.call(this, value);
        if( !error && value !== Math.floor(value) )
            error = 'validator.error.integer.fail';

        return error;
    }
};