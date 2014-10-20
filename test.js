var Form = require('./lib/form');
new Form({
    items: {
        i1: {
            type: 'Text',
            renderTo: document.getElementById( 'f1' ),
            value: 123,
            validator: Form.Validator.Text({
                minLength: 3
            })
        },
        i2: {
            type: 'Text',
            renderTo: document.getElementById( 'f2' ),
            value: 456,
            validator: Form.Validator.Number
        }
    }
});
/*
new Form.Input.Text({renderTo: document.getElementById('f1'), value: 123});
new Form.Input.Text({renderTo: document.getElementById('f2'), value: 456});
    */