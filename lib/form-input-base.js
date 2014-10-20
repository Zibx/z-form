/**
 * Created by Ivan on 10/15/2014.
 */
(function(  ){
    'use strict';
    var Z = require('z-lib' ),
        View = require('z-view' ),
        DOM = require('z-lib-dom' ),
        Observable = require('z-observable' ),
        $Observable = Z.Observable.prototype;
    var Base = function( cfg ){
        Z.apply(this, cfg);
        $Observable._init.call(this);
        this.emptyText = this.emptyText || Z.Locale.get('form.field.'+ this.type +'.emptyText', 'form.field.emptyText');
        this.disabledText = this.disabledText || Z.Locale.get('form.field.'+ this.type +'.disabledText', 'form.field.disabledText');
        this._setValue(this[this.valueProperty]);
        this._initListeners();
        this._draw();
        this._unbindListeners();
            Z.DOM.addListener(this.renderTo, 'click', Z.bind(this, '_mouseClick'));

    },
        blurKeyDown = function( e ){
            var code = Z.DOM.getKeyCode(e);
            if(code === Z.DOM.keyCode.tab){
                this.fire('tab', e.shiftKey ? -1 : 1 );
            }else if( code === Z.DOM.keyCode.enter || code === Z.DOM.keyCode.space ){
                this.fire( (code === Z.DOM.keyCode.enter ? 'enter' : 'space') + 'Key', e );
                this.blurElement.blur();
                this.focus( void 0 );
            }else{
                return true;
            }
            return Z.DOM.stopEvent(e);
        };
    Base.prototype = Z.extend( $Observable, Z.extend( Z.View.Observable, {
        focused: false,
        focusable: true,
        blurOnEnter: true,
        valueProperty: 'value',
        displayValueProperty: 'displayValue',
        blurElementCls: 'js_z_hidden_blur_input',
        useBlurElement: true,
        // set inner value. call it from edit state.
        _setValue: function (value) {
            this[this.valueProperty] = this.dataSetter(value);
            this._lastValue = value;
            this.setDisplayValue(value);
        },
        _bindListeners: function(  ){
            var listen = this[this.listenersProperty] = {
                windowBlur: Z.DOM.addListener(window, 'blur', Z.bind(this, 'blur')),
                windowClick: Z.DOM.addListener(document, 'click', Z.bind(this, 'blur')),
                //keyboard: js.util.Keyboard.attach(this)
            };
        },
        _draw: function(  ){
            this._unbindListeners();
            this.draw();
            this._bindListeners();
        },
        setDisplayValue: function( value ){
            this[this.displayValueProperty] = value;
        },
        getDisplayValue: function(  ){
            return this[this.displayValueProperty];
        },
        // public interface to set value. it wouldn't fire change
        setValue: function (value) {
            this._setValue(value);
            this._update();
            return value;
        },
        // method that would set value and fire change event if value differs with previous one
        changeValue: function () {
            var value = arguments.length ? arguments[0] : this.value,
                lastValue = this._lastValue;

            if (!this.nullable && value === null)
                return;

            if (this._lastValue !== value) {
                this._setValue(value);
                if (this.fire('change', value, lastValue) !== false) {

                }
            }
            this.fire('tryFireChange', value, lastValue);
            return value;
        },
        _update: function(  ){
            if (this.currentState === 'view')
                this.inited && this.refresh();
            else if (this.currentState === 'edit'){
                if( this.updateEditState )
                    this.updateEditState();
                else
                    throw 'base field don\'t support setValue in edit mode';
            }
        },
        dataSetter: function( value ){
            return value;
        },
        dataGetter: function(  ){

        },
        _createBlurElement: function(){
            var blurElement;
            if( !(blurElement = this.blurElement) && this.renderTo){
                blurElement = document.createElement( 'input' );
                blurElement.className = this.blurElementCls;
                Z.DOM.addListener( blurElement, 'click', Z.DOM.stopEvent );
                this.renderTo.parentNode.appendChild( blurElement );
                Z.DOM.addListener( blurElement, 'keydown', blurKeyDown.bind(this))
            }
        },
        innerFocus: function(  ){
            if( this.useBlurElement ){
                this._createBlurElement();
                this.blurElement && this.blurElement.focus();//setTimeout( JS.bind(this.blurEl, 'focus'),10);
            }
        },
        innerBlur: function(  ){
            this.blur();
            this.innerFocus();
        },
        die: function(){
            this._unbindListeners();
            this.blurElement && this.blurElement.parentNode.removeChild( this.blurElement );
        },
        blur: function () {
            if( !this.focused || this.fire('tryBlur') === false )
                return false;

            this.set('focused', false);
            this.state('view');

            this.fire('blur');
            this._unbindListeners();
            if( this.focusValue !== this.value )
                this.fire( 'changed', this.getValue() );

            return true;
        },
        _mouseClick: function (e) {
            !this.focused && this.focus( void 0 );
            e.stopPropagation();
        },
        focus: function (direction) {
            if (this.fire('tryFocus') === false || (this.disabled === true || this.enabled === false) )
                return false;

            if (!this.focused)
                this.focusValue = this.value;
            this.set('focused', true);
            this.state('edit');

            this.fire('focus');

            return direction;
        },
        state: function (state) {
            this._unbindListeners();
            this.currentState = state;

            if( this.inited ) {
                if (this.manualRefresh)
                    typeof this.manualRefresh === 'function' && this.manualRefresh();
                else
                    this._draw();
                if( state === 'edit' ){
                    this._bindListeners();
                    this.innerFocus();
                }
                this.fire('state', state);
                this.fire(state + 'State');
            }
        },
    }));
    Z.Form.Input.Base = Base;

})();