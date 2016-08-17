(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
	admin: require('./views/templates/admin'),
	contact: require('./views/templates/contact'),
	demo: require('./views/templates/demo'),
	fieldError: require('./views/templates/fieldError'),
	form: require('./views/templates/form'),
	header: require('./views/templates/header'),
	home: require('./views/templates/home'),
	invalidLoginError: require('./views/templates/invalidLoginError'),
	list: require('./views/templates/list'),
	login: require('./views/templates/login'),
	register: require('./views/templates/register'),
	services: require('./views/templates/services'),
	sidebar: require('./views/templates/sidebar'),
	staff: require('./views/templates/staff')
};

},{"./views/templates/admin":21,"./views/templates/contact":22,"./views/templates/demo":23,"./views/templates/fieldError":24,"./views/templates/form":25,"./views/templates/header":26,"./views/templates/home":27,"./views/templates/invalidLoginError":28,"./views/templates/list":29,"./views/templates/login":30,"./views/templates/register":31,"./views/templates/services":32,"./views/templates/sidebar":33,"./views/templates/staff":34}],2:[function(require,module,exports){
'use strict';

module.exports = {
	Admin: require('./views/Admin'),
	Contact: require('./views/Contact'),
	Demo: require('./views/Demo'),
	Form: require('./views/Form'),
	Header: require('./views/Header'),
	Home: require('./views/Home'),
	List: require('./views/List'),
	Login: require('./views/Login'),
	MyView: require('./views/MyView'),
	Register: require('./views/Register'),
	Services: require('./views/Services'),
	Sidebar: require('./views/Sidebar'),
	Staff: require('./views/Staff')
};

},{"./views/Admin":7,"./views/Contact":8,"./views/Demo":9,"./views/Form":10,"./views/Header":11,"./views/Home":12,"./views/List":13,"./views/Login":14,"./views/MyView":15,"./views/Register":16,"./views/Services":17,"./views/Sidebar":18,"./views/Staff":19}],3:[function(require,module,exports){
'use strict';

module.exports = Object.create({
    create: function create(name, opts) {
        return Object.create(this.Views[name.charAt(0).toUpperCase() + name.slice(1)], Object.assign({ template: { value: this.Templates[name] }, user: { value: this.User }, factory: { value: this } }, opts)).constructor();
    }
}, {
    Templates: { value: require('../.TemplateMap') },
    User: { value: require('../models/User') },
    Views: { value: require('../.ViewMap') }
});

},{"../.TemplateMap":1,"../.ViewMap":2,"../models/User":5}],4:[function(require,module,exports){
'use strict';

require('jquery')(function () {
    require('./router');
    require('backbone').history.start({ pushState: true });
});

},{"./router":6,"backbone":"backbone","jquery":"jquery"}],5:[function(require,module,exports){
"use strict";

module.exports = new (require('backbone').Model.extend({
    defaults: { state: {} },
    initialize: function initialize() {
        this.fetched = this.fetch();
        return this;
    },
    url: function url() {
        return "/user";
    }
}))();

},{"backbone":"backbone"}],6:[function(require,module,exports){
'use strict';

module.exports = new (require('backbone').Router.extend({

    $: require('jquery'),

    Error: require('../../lib/MyError'),

    User: require('./models/User'),

    ViewFactory: require('./factory/View'),

    initialize: function initialize() {
        var _this = this;

        this.contentContainer = this.$('#content');

        return Object.assign(this, {
            views: {},
            header: this.ViewFactory.create('header', { insertion: { value: { $el: this.contentContainer, method: 'before' } } }).on('route', function (route) {
                return _this.navigate(route, { trigger: true });
            })
        });
    },
    goHome: function goHome() {
        this.navigate('home', { trigger: true });
    },
    handler: function handler(resource) {
        var _this2 = this;

        if (!resource) return this.goHome();

        if (resource === 'home') {
            this.header.hide();
        } else {
            if (this.header.isHidden()) this.header.show();
        }

        this.User.fetched.done(function () {

            _this2.header.onUser().on('signout', function () {
                return Promise.all(Object.keys(_this2.views).map(function (name) {
                    return _this2.views[name].delete();
                })).then(_this2.goHome());
            });

            Promise.all(Object.keys(_this2.views).map(function (view) {
                return _this2.views[view].hide();
            })).then(function () {
                if (_this2.views[resource]) return _this2.views[resource].show();
                _this2.views[resource] = _this2.ViewFactory.create(resource, { insertion: { value: { $el: _this2.contentContainer } } });
                if (resource === 'home') _this2.views[resource].on('route', function (route) {
                    return _this2.navigate(route, { trigger: true });
                });
            }).catch(_this2.Error);
        }).fail(this.Error);
    },


    routes: { '(*request)': 'handler' }

}))();

},{"../../lib/MyError":35,"./factory/View":3,"./models/User":5,"backbone":"backbone","jquery":"jquery"}],7:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    requiresLogin: true
});

},{"./__proto__":20}],8:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    /*fields: [ {
        name: 'name',
        type: 'text'
     }, {        
        name: 'email',
        type: 'text',
        error: 'Please enter a valid email address.',
        validate: function( val ) { return this.emailRegex.test(val) }
    }, {
        name: 'password',
        type: 'password',
        error: "Passwords must be at least 6 characters long.",
        validate: val => val.length >= 6
    } ],
     Form: require('./Form'),
     postRender() {
        this.formInstance = Object.create( this.Form, {
            class: { value: this.class },
            //horizontal: { value: this.horizontal },
            fields: { value: this.fields }, 
            container: { value: this.templateData.form },
            //onSubmissionResponse: { value: this.onSubmissionResponse }
        } ).constructor()
        
        return this
    }*/

});

},{"./__proto__":20}],9:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    Views: {
        list: { view: require('./List'), template: require('./templates/list') },
        login: { view: require('./Login'), template: require('./templates/login') },
        register: { view: require('./Register'), template: require('./templates/register') },
        sidebar: { view: require('./Sidebar'), template: require('./templates/sidebar') }
    },

    /*fields: [ {
        class: "form-input",
        name: "email",
        label: 'Email',
        type: 'text',
        error: "Please enter a valid email address.",
        validate: function( val ) { return this.emailRegex.test(val) }
    }, {
        class: "form-input",
        horizontal: true,
        name: "password",
        label: 'Password',
        type: 'password',
        error: "Passwords must be at least 6 characters long.",
        validate: val => val.length >= 6
    }, {
        class: "input-borderless",
        name: "address",
        type: 'text',
        placeholder: "Street Address",
        error: "Required field.",
        validate: function( val ) { return this.$.trim(val) !== '' }
    }, {
        class: "input-flat",
        name: "city",
        type: 'text',
        placeholder: "City",
        error: "Required field.",
        validate: function( val ) { return this.$.trim(val) !== '' }
    }, {
        class: "input-borderless",
        select: true,
        name: "fave",
        label: "Fave Can Album",
        options: [ "Monster Movie", "Soundtracks", "Tago Mago", "Ege Bamyasi", "Future Days" ],
        error: "Please choose an option.",
        validate: function( val ) { return this.$.trim(val) !== '' }
    } ],*/

    postRender: function postRender() {

        //this.sidebar = Object.create( this.Sidebar, { container: { value: this.templateData.sidebar } } ).constructor()

        //this.listInstance = Object.create( this.List, { container: { value: this.els.list } } ).constructor()

        /*this.formInstance = Object.create( this.Form, { 
            fields: { value: this.fields }, 
            container: { value: this.els.form }
        } ).constructor()*/

        /*this.loginExample = Object.create( this.Login, { 
            container: { value: this.els.loginExample },
            class: { value: 'input-borderless' }
        } ).constructor()
        */

        /*this.registerExample = Object.create( this.Register, { 
            container: { value: this.els.registerExample },
            class: { value: 'form-input' },
            horizontal: { value: true }
        } ).constructor()
        
        this.loginExample.els.registerBtn.off('click')
        this.loginExample.els.loginBtn.off('click')
         this.registerExample.els.cancelBtn.off('click')
        this.registerExample.els.registerBtn.off('click')
        */

        //this.else.submitBtn.on( 'click', () => this.formInstance.submitForm( { resource: '' } ) )

        return this;
    }
});

},{"./List":13,"./Login":14,"./Register":16,"./Sidebar":18,"./__proto__":20,"./templates/list":29,"./templates/login":30,"./templates/register":31,"./templates/sidebar":33}],10:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    getTemplateOptions: function getTemplateOptions() {
        var _this = this;

        this.fields.forEach(function (field) {
            var name = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            field['class'] = _this.class;
            if (_this.horizontal) field['horizontal'] = true;
            field[_this.class === 'form-input' ? 'label' : 'placeholder'] = name;
        });

        return { fields: this.fields };
    },
    getFormData: function getFormData() {
        var _this2 = this;

        Object.keys(this.els, function (key) {
            if (/INPUT|TEXTAREAD/.test(_this2.els[key].prop("tagName"))) _this2.formData[key] = _this2.els[key].val();
        });

        return this.formData;
    },


    fields: [],

    onFormFail: function onFormFail(error) {
        console.log(error.stack || error);
        //this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.els.buttonRow, method: 'before' } } )
    },
    onSubmissionResponse: function onSubmissionResponse() {},
    postForm: function postForm(data) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
            _this3.$.ajax({
                data: JSON.stringify(data.values) || JSON.stringify(_this3.getFormData()),
                headers: { token: _this3.user ? _this3.user.get('token') : '' },
                type: "POST",
                url: '/' + data.resource
            });
        });
    },
    postRender: function postRender() {

        var self = this;

        this.els.container.find('input').on('blur', function () {
            var $el = self.$(this),
                field = self._(self.fields).find(function (field) {
                return field.name === $el.attr('id');
            });

            return new Promise(function (resolve, reject) {
                return resolve(field.validate.call(self, $el.val()));
            }).then(function (valid) {
                if (valid) {
                    self.showValid($el);
                } else {
                    self.showError($el, field.error);
                }
            });
        }).on('focus', function () {
            self.removeError(self.$(this));
        });

        return this;
    },
    removeError: function removeError($el) {
        $el.parent().removeClass('error valid');
        $el.siblings('.feedback').remove();
    },
    showError: function showError($el, error) {

        var formGroup = $el.parent();

        if (formGroup.hasClass('error')) return;

        formGroup.removeClass('valid').addClass('error').append(this.templates.fieldError({ error: error }));
    },
    showValid: function showValid($el) {
        $el.parent().removeClass('error').addClass('valid');
        $el.siblings('.feedback').remove();
    },
    submitForm: function submitForm(resource) {
        var _this4 = this;

        this.validate().then(function (result) {
            if (result === false) return;
            _this4.postForm(resource).then(function () {
                return _this4.onSubmissionResponse();
            }).catch(function (e) {
                return _this4.onFormFail(e);
            });
        });
    },


    template: require('./templates/form'),

    templates: {
        fieldError: require('./templates/fieldError')
    },

    validate: function validate() {
        var _this5 = this;

        var valid = true;

        return Promise.all(this.fields.map(function (field) {
            return new Promise(function (resolve, reject) {
                var result = field.validate.call(_this5, _this5.els[field.name].val());
                if (result === false) {
                    valid = false;
                    _this5.showError(_this5.els[field.name], field.error);
                }

                resolve();
            });
        })).then(function () {
            return valid;
        }).catch(function (e) {
            console.log(e.stack || e);return false;
        });
    }
});

},{"./__proto__":20,"./templates/fieldError":24,"./templates/form":25}],11:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        'logo': 'click',
        'navLinks': { event: 'click', selector: 'li' }
        //'signoutBtn': { method: 'signout' }
    },

    onLogoClick: function onLogoClick() {
        this.emit('route', 'home');
    },
    onNavLinksClick: function onNavLinksClick(e) {
        var resource = this.$(e.currentTarget).attr('data-id');
        this.emit('route', resource);
    },
    onUser: function onUser() {
        return this;
    }
});

},{"./__proto__":20}],12:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        'links': { event: 'click', selector: 'li' }
    },

    onLinksClick: function onLinksClick(e) {
        var resource = this.$(e.currentTarget).attr('data-id');
        this.emit('route', resource);
    }
});

},{"./__proto__":20}],13:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":20}],14:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        'registerBtn': { event: 'click', selector: '', method: 'showRegistration' },
        'loginBtn': { event: 'click', selector: '', method: 'login' }
    },

    fields: [{
        name: 'email',
        type: 'text',
        error: 'Please enter a valid email address.',
        validate: function validate(val) {
            return this.emailRegex.test(val);
        }
    }, {
        name: 'password',
        type: 'password',
        error: "Passwords must be at least 6 characters long.",
        validate: function validate(val) {
            return val.length >= 6;
        }
    }],

    Form: require('./Form'),

    login: function login() {
        this.formInstance.submitForm({ resource: "auth" });
    },
    onSubmissionResponse: function onSubmissionResponse(response) {
        if (Object.keys(response).length === 0) {
            return this.slurpTemplate({ template: this.templates.invalidLoginError, insertion: { $el: this.els.container } });
        }

        require('../models/User').set(response);
        this.emit("loggedIn");
        this.hide();
    },
    postRender: function postRender() {
        this.formInstance = Object.create(this.Form, {
            class: { value: this.class },
            //horizontal: { value: this.horizontal },
            fields: { value: this.fields },
            insertion: { value: { $el: this.els.form } },
            onSubmissionResponse: { value: this.onSubmissionResponse }
        }).constructor();

        return this;
    },


    Register: require('./Register'),

    requiresLogin: false,

    showRegistration: function showRegistration() {
        var _this = this;

        var form = this.formInstance,
            email = form.els.email,
            password = form.els.password;

        form.removeError(email);
        email.val('');

        form.removeError(password);
        password.val('');

        if (form.els.invalidLoginError) form.els.invalidLoginError.remove();
        if (form.els.serverError) form.els.serverError.remove();

        this.hide().then(function () {
            return _this.registerInstance ? _this.registerInstance.show() : Object.create(_this.Register, {
                loginInstance: { value: _this },
                class: { value: 'input-borderless' }
            }).constructor();
        });
    },


    template: require('./templates/login'),

    templates: {
        invalidLoginError: require('./templates/invalidLoginError')
    }

});

},{"../models/User":5,"./Form":10,"./Register":16,"./__proto__":20,"./templates/invalidLoginError":28,"./templates/login":30}],15:[function(require,module,exports){
'use strict';

var MyView = function MyView(data) {
    return Object.assign(this, data).initialize();
};

Object.assign(MyView.prototype, require('events').EventEmitter.prototype, {

    Collection: require('backbone').Collection,

    //Error: require('../MyError'),

    Model: require('backbone').Model,

    _: require('underscore'),

    $: require('jquery'),

    delegateEvents: function delegateEvents(key, el) {
        var _this = this;

        var type;

        if (!this.events[key]) return;

        type = Object.prototype.toString.call(this.events[key]);

        if (type === '[object Object]') {
            this.bindEvent(key, this.events[key], el);
        } else if (type === '[object Array]') {
            this.events[key].forEach(function (singleEvent) {
                return _this.bindEvent(key, singleEvent, el);
            });
        }
    },


    delete: function _delete() {
        if (this.templateData && this.templateData.container) {
            this.templateData.container.remove();
            this.emit("removed");
        }
    },

    format: {
        capitalizeFirstLetter: function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    },

    getFormData: function getFormData() {
        var _this2 = this;

        this.formData = {};

        this._.each(this.templateData, function ($el, name) {
            if ($el.prop("tagName") === "INPUT" && $el.val()) _this2.formData[name] = $el.val();
        });

        return this.formData;
    },

    getRouter: function getRouter() {
        return require('../router');
    },

    getTemplateOptions: function getTemplateOptions() {
        return {};
    },

    /*hide() {
        return this.Q.Promise( ( resolve, reject ) => {
            this.templateData.container.hide()
            resolve()
        } )
    },*/

    initialize: function initialize() {
        var _this3 = this;

        if (!this.container) this.container = this.$('#content');

        this.router = this.getRouter();

        //this.modalView = require('./modal')

        this.$(window).resize(this._.throttle(function () {
            return _this3.size();
        }, 500));

        if (this.requiresLogin && !this.user.id) {
            require('./Login').show().once("success", function (e) {
                _this3.router.header.onUser(_this3.user);

                if (_this3.requiresRole && !_this3._(_this3.user.get('roles')).contains(_this3.requiresRole)) {
                    return alert('You do not have access');
                }

                _this3.render();
            });
            return this;
        } else if (this.user.id && this.requiresRole) {
            if (!this._(this.user.get('roles')).contains(this.requiresRole)) {
                return alert('You do not have access');
            }
        }

        return this.render();
    },


    isHidden: function isHidden() {
        return this.templateData.container.css('display') === 'none';
    },

    moment: require('moment'),

    postRender: function postRender() {
        this.renderSubviews();
        return this;
    },

    //Q: require('q'),

    render: function render() {
        this.slurpTemplate({
            template: this.template(this.getTemplateOptions()),
            insertion: { $el: this.insertionEl || this.container, method: this.insertionMethod } });

        this.size();

        this.postRender();

        return this;
    },


    renderSubviews: function renderSubviews() {
        var _this4 = this;

        Object.keys(this.subviews || []).forEach(function (key) {
            return _this4.subviews[key].forEach(function (subviewMeta) {
                _this4[subviewMeta.name] = new subviewMeta.view({ container: _this4.templateData[key] });
            });
        });
    },

    show: function show() {
        this.templateData.container.show();
        this.size();
        return this;
    },

    slurpEl: function slurpEl(el) {

        var key = el.attr('data-js');

        this.templateData[key] = this.templateData.hasOwnProperty(key) ? this.templateData[key].add(el) : el;

        el.removeAttr('data-js');

        if (this.events[key]) this.delegateEvents(key, el);

        return this;
    },

    slurpTemplate: function slurpTemplate(options) {
        var _this5 = this;

        var $html = this.$(options.template),
            selector = '[data-js]';

        if (this.templateData === undefined) this.templateData = {};

        $html.each(function (index, el) {
            var $el = _this5.$(el);
            if ($el.is(selector)) _this5.slurpEl($el);
        });

        $html.get().forEach(function (el) {
            _this5.$(el).find(selector).each(function (i, elToBeSlurped) {
                return _this5.slurpEl(_this5.$(elToBeSlurped));
            });
        });

        if (options && options.insertion) options.insertion.$el[options.insertion.method ? options.insertion.method : 'append']($html);

        return this;
    },

    bindEvent: function bindEvent(elementKey, eventData, el) {
        var elements = el ? el : this.templateData[elementKey];

        elements.on(eventData.event || 'click', eventData.selector, eventData.meta, this[eventData.method].bind(this));
    },

    events: {},

    isMouseOnEl: function isMouseOnEl(event, el) {

        var elOffset = el.offset(),
            elHeight = el.outerHeight(true),
            elWidth = el.outerWidth(true);

        if (event.pageX < elOffset.left || event.pageX > elOffset.left + elWidth || event.pageY < elOffset.top || event.pageY > elOffset.top + elHeight) {

            return false;
        }

        return true;
    },

    requiresLogin: false,

    size: function size() {
        undefined;
    },

    user: require('../models/User'),

    util: require('util')

});

module.exports = MyView;

},{"../models/User":5,"../router":6,"./Login":14,"backbone":"backbone","events":37,"jquery":"jquery","moment":"moment","underscore":"underscore","util":41}],16:[function(require,module,exports){
'use strict';

var _Object$assign;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = Object.assign({}, require('./__proto__'), (_Object$assign = {

    cancel: function cancel() {
        var _this = this;

        var form = this.formInstance,
            name = form.els.name,
            email = form.els.email;

        form.removeError(name);
        name.val('');

        form.removeError(email);
        email.val('');

        if (form.els.invalidLoginError) form.els.invalidLoginError.remove();
        if (form.els.serverError) form.els.serverError.remove();

        this.loginInstance["registerInstance"] = this;
        this.hide().then(function () {
            return _this.loginInstance.show();
        });
    },

    events: {
        'registerBtn': { event: 'click', selector: '', method: 'register' },
        'cancelBtn': { event: 'click', selector: '', method: 'cancel' }
    },

    fields: [{
        name: 'name',
        type: 'text',
        error: 'Name is a required field.',
        validate: function validate(val) {
            return this.$.trim(val) !== '';
        }
    }, {
        name: 'email',
        type: 'text',
        error: 'Please enter a valid email address.',
        validate: function validate(val) {
            return this.emailRegex.test(val);
        }
    }],

    Form: require('./Form'),

    onSubmissionResponse: function onSubmissionResponse(response) {
        var _this2 = this;

        if (response.success === false) {
            return this.slurpTemplate({ template: this.templates.invalidLoginError(response), insertion: { $el: this.els.buttonRow, method: 'before' } });
        }

        this.user.set(response.result.member);

        this.fields.forEach(function (field) {
            return _this2.els[field.name].val('');
        });

        this.hide().then(function () {
            return _this2.loginInstance.emit("loggedIn");
        });
    },

    postRender: function postRender() {
        this.formInstance = Object.create(this.Form, {
            class: { value: this.class },
            fields: { value: this.fields },
            horizontal: { value: this.horizontal },
            insertion: { value: { $el: this.els.form } },
            onSubmissionResponse: { value: this.onSubmissionResponse }
        }).constructor();

        return this;
    },


    requiresLogin: false,

    register: function register() {
        this.formInstance.submitForm({ resource: "member" });
    }
}, _defineProperty(_Object$assign, 'requiresLogin', false), _defineProperty(_Object$assign, 'template', require('./templates/register')), _defineProperty(_Object$assign, 'templates', {
    invalidLoginError: require('./templates/invalidLoginError')
}), _Object$assign));

},{"./Form":10,"./__proto__":20,"./templates/invalidLoginError":28,"./templates/register":31}],17:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    template: require('./templates/demo')

});

},{"./__proto__":20,"./templates/demo":23}],18:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    template: require('./templates/sidebar')

});

},{"./__proto__":20,"./templates/sidebar":33}],19:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":20}],20:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = Object.assign({}, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    _: require('underscore'),

    $: require('jquery'),

    Collection: require('backbone').Collection,

    Model: require('backbone').Model,

    bindEvent: function bindEvent(key, event, selector) {
        var _this = this;

        this.els[key].on(event, selector, function (e) {
            return _this['on' + _this.capitalizeFirstLetter(key) + _this.capitalizeFirstLetter(event)](e);
        });
    },


    capitalizeFirstLetter: function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    constructor: function constructor() {
        var _this2 = this;

        if (this.size) this.$(window).resize(this._.throttle(function () {
            return _this2.size();
        }, 500));

        if (this.requiresLogin && !this.user.id) return this.handleLogin();

        if (this.user && this.user.id && this.requiresRole && !this.hasPrivileges()) return this.showNoAccess();

        return Object.assign(this, { els: {}, slurp: { attr: 'data-js', view: 'data-view' }, views: {} }).render();
    },
    delegateEvents: function delegateEvents(key, el) {
        var _this3 = this;

        var type = _typeof(this.events[key]);

        if (type === "string") {
            this.bindEvent(key, this.events[key]);
        } else if (Array.isArray(this.events[key])) {
            this.events[key].forEach(function (eventObj) {
                return _this3.bindEvent(key, eventObj.event);
            });
        } else {
            this.bindEvent(key, this.events[key].event, this.events[key].selector);
        }
    },
    delete: function _delete(duration) {
        var _this4 = this;

        return this.hide(duration).then(function () {
            _this4.els.container.remove();
            _this4.emit("removed");
            return Promise.resolve();
        });
    },


    events: {},

    getTemplateOptions: function getTemplateOptions() {
        return {};
    },

    handleLogin: function handleLogin() {
        var _this5 = this;

        Object.create(require('./Login'), { class: { value: 'input-borderless' } }).constructor().once("loggedIn", function () {
            return _this5.onLogin();
        });

        return this;
    },
    hasPrivilege: function hasPrivilege() {
        var _this6 = this;

        this.requiresRole && this.user.get('roles').find(function (role) {
            return role === _this6.requiresRole;
        }) === "undefined" ? false : true;
    },
    hide: function hide(duration) {
        var _this7 = this;

        return new Promise(function (resolve, reject) {
            return _this7.els.container.hide(duration || 10, resolve);
        });
    },
    isHidden: function isHidden() {
        return this.els.container.css('display') === 'none';
    },
    onLogin: function onLogin() {
        this.router.header.onUser(this.user);

        this[this.hasPrivileges() ? 'render' : 'showNoAccess']();
    },
    showNoAccess: function showNoAccess() {
        alert("No privileges, son");
        return this;
    },
    postRender: function postRender() {
        return this;
    },
    render: function render() {
        if (!this.insertion) {
            console.log(this);
        }
        this.slurpTemplate({ template: this.template(this.getTemplateOptions()), insertion: this.insertion });

        if (this.size) this.size();

        return this.renderSubviews().postRender();
    },
    renderSubviews: function renderSubviews() {
        var _this8 = this;

        Object.keys(this.Views || []).forEach(function (key) {
            if (_this8.Views[key].el) {
                _this8.views[key] = _this8.factory.create(key, { insertion: { value: { $el: _this8.Views[key].el, method: 'before' } } });
                _this8.Views[key].el.remove();
                _this8.Views[key].el = undefined;
            }
        });

        return this;
    },
    show: function show(duration) {
        var _this9 = this;

        return new Promise(function (resolve, reject) {
            return _this9.els.container.show(duration || 10, function () {
                if (_this9.size) _this9.size();resolve();
            });
        });
    },
    slurpEl: function slurpEl(el) {
        var key = el.attr(this.slurp.attr) || 'container';

        this.els[key] = this.els[key] ? this.els[key].add(el) : el;

        el.removeAttr(this.slurp.attr);

        if (this.events[key]) this.delegateEvents(key, el);
    },
    slurpTemplate: function slurpTemplate(options) {
        var _this10 = this;

        var $html = this.$(options.template),
            selector = '[' + this.slurp.attr + ']',
            viewSelector = '[' + this.slurp.view + ']';

        $html.each(function (i, el) {
            var $el = _this10.$(el);
            if ($el.is(selector) || i === 0) _this10.slurpEl($el);
        });

        $html.get().forEach(function (el) {
            _this10.$(el).find(selector).each(function (undefined, elToBeSlurped) {
                return _this10.slurpEl(_this10.$(elToBeSlurped));
            });
            _this10.$(el).find(viewSelector).each(function (undefined, viewEl) {
                var $el = _this10.$(viewEl);
                _this10.Views[$el.attr(_this10.slurp.view)].el = $el;
            });
        });

        options.insertion.$el[options.insertion.method || 'append']($html);

        return this;
    },
    isMouseOnEl: function isMouseOnEl(event, el) {

        var elOffset = el.offset(),
            elHeight = el.outerHeight(true),
            elWidth = el.outerWidth(true);

        if (event.pageX < elOffset.left || event.pageX > elOffset.left + elWidth || event.pageY < elOffset.top || event.pageY > elOffset.top + elHeight) {

            return false;
        }

        return true;
    },


    requiresLogin: false
});

},{"../../../lib/MyObject":36,"./Login":14,"backbone":"backbone","events":37,"jquery":"jquery","underscore":"underscore"}],21:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "Admin";
};

},{}],22:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <div data-js=\"container\" class=\"contact\">\n        <div class=\"fd-info\">\n            <div class=\"info-box\">\n                <h2>Interested?</h2>\n                <p>Feel free to contact us with any project ideas or questions.</p>\n                <div class=\"contact-details\">\n                    <dl>\n                        <dt>Email</dt>\n                        <dd><a href=\"topher.baron@gmail.com\">topher.baron@gmail.com</a></dd>\n                        <dt>Phone</dt>\n                        <dd>123-456-7890</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div data-js=\"contactForm\" class=\"contact-form\"></div>\n    </div>";
};

},{}],23:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"demo\" data-js=\"container\">\n    <aside class=\"sidebar\">\n        <div data-view=\"sidebar\"></div>\n    </aside>\n    <div class=\"demo-content\">\n        <h2>Lists</h2>\n        <p>Organize your content into neat groups with our lists.</p>\n        <div class=\"example\">\n            <div class=\"inline-view\">\n                <div data-view=\"list\"></div>\n            </div>\n        </div>\n        <h2>Forms</h2>\n        <p>Our forms are customizable to suit the needs of your project. Here, for example, are \n        Login and Register forms, each using different input styles.</p>\n        <div class=\"example\">\n            <div class=\"inline-view\">\n                <div data-view=\"login\"></div>\n            </div>\n            <div class=\"inline-view\">\n                <div data-view=\"register\"></div>\n            </div>\n        </div>\n    </div>\n</div>\n";
};

},{}],24:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<span class=\"feedback\" data-js=\"fieldError\">" + p.error + "</span>";
};

},{}],25:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    var html = '\n<form data-js="container">\n    ' + p.fields.map(function (field) {
        return '<div class="form-group ' + (field.horizontal ? 'horizontal' : '') + '">\n       ' + (field.label ? '<label class="form-label" for="' + field.name + '">' + field.label + '</label>' : '') + '\n       <' + (field.select ? 'select' : 'input') + ' data-js="' + field.name + '" class="' + field.class + '"\n       type="' + field.type + '" id="' + field.name + '" ' + (field.placeholder ? 'placeholder="' + field.placeholder + '"' : '') + '>\n            ' + (field.select ? field.options.map(function (option) {
            return '<option>' + option + '</option>';
        }).join('') + '</select>' : '') + '\n    </div>';
    }).join('') + '\n</form>\n';
    html = html.replace(/>\s+</g, '><');
    return html;
};

},{}],26:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <header class=\"site-header\">\n        <div data-js=\"logo\" class=\"logo\">Future Days</div>\n        <nav>\n            <ul data-js=\"navLinks\" class=\"nav-links\">\n                <li data-id=\"services\" data-id=\"services\">Services</li>\n                <li data-id=\"staff\">Staff</li>\n                <li data-id=\"demo\">Demo</li>\n                <li data-id=\"contact\">Contact Us</li>\n            </ul>\n        </nav>\n    </header>";
};

},{}],27:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <div class=\"home\">\n        <div class=\"logo-block\">\n            <div class=\"logo\">Future Days</div>\n            <p class=\"slogan\">Web solutions for a better tomorrow</p>\n        </div>\n        <ul data-js=\"links\" class=\"link-block\">\n            <li data-id=\"services\">Services</li>\n            <li data-id=\"staff\">Staff</li>\n            <li data-id=\"demo\">Demo</li>\n            <li data-id=\"contact\">Contact Us</li>\n        </ul>\n        <div class=\"text-block\">\n            <p class=\"text\">Future Days is a small, versatile web development team dedicated to producing unique, \n            fully customizable websites and apps. If you can think it, we can make it.</p>\n        </div>\n    </div>";
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div data-js=\"invalidLoginError\" class=\"feedback\">Invalid Credentials</div>";
};

},{}],29:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n\n<ul class=\"list\">\n    <li class=\"list-item\">for</li>\n    <li class=\"list-item\">the</li>\n    <li class=\"list-item\">sake</li>\n    <li class=\"list-item\">of</li>\n    <li class=\"list-item\">future</li>\n    <li class=\"list-item\">days</li>\n</ul>\n";
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"login\" data-js=\"container\">\n    <h1>Login</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n        <button data-js=\"loginBtn\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>\n";
};

},{}],31:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"register\" data-js=\"container\">\n    <h1>Register</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"cancelBtn\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n    </div>\n</div>\n";
};

},{}],32:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <div class=\"services\">\n        <h2>Our Services</h2>\n        <p>We offer a full range of services, including but not limited to:\n        <ul class=\"services-list\">\n            <li>Website and web app development</li>\n            <li>Custom software</li>\n            <li>Hosting</li>\n            <li>Digital Strategy</li>\n        </ul>\n        <h2>Why Choose Us?</h2>\n        <p>As the tech industry has exploded, the market has been glutted with countless developers who possess little experience\n        and a very narrow set of skills, generally limited to the capabilities of their chosen platform. Most WordPress developers,\n        for example, can throw together a theme and some plugins, but if you ask them to implement custom functionality for your site,\n        they will likely be at a loss. At Future Days, we understand how the web and applications work at their deepest\n        levels. We have built our own framework from the ground up, which we continually refine and optimize. Armed with\n        this low level knowledge, we possess the capability to create just about any feature you can imagine. Customization\n        is key. As the web becomes ever more streamlined and cookie cutter, we can help you stand out from the pack.</p>\n\n        <p>Versatility is not our only advantage, however. As a small team with limited overhead, we can do the same work\n        as larger development firms for less money. And we only charge for new work:  no maintenance fees, and if a bug comes up, we fix\n        it without charge, no questions asked. We take full responsibility for the quality of our work.</p>\n    </div>";
};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <nav>\n        <ul class=\"sidebar-links\">\n            <li>Lists</li>\n            <li>Forms</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n        </ul>\n    </nav>\n";
};

},{}],34:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <div class=\"staff\">\n        <div class=\"staff-block\">\n            <img class=\"staff-photo\">\n            <div class=\"bio\">\n                <h2>Chris Baron</h2>\n                <p>text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text </p>\n            </div>\n        </div>\n        <div class=\"staff-block\">\n            <img class=\"staff-photo\">\n            <div class=\"bio\">\n                <h2>Scott Parton</h2>\n                <p></p>\n            </div>\n        </div>\n    </div>";
};

},{}],35:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],36:[function(require,module,exports){
'use strict';

module.exports = {

    Error: require('./MyError'),

    Moment: require('moment'),

    P: function P(fun, args, thisArg) {
        return new Promise(function (resolve, reject) {
            return Reflect.apply(fun, thisArg, args.concat(function (e) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return e ? reject(e) : resolve(args);
            }));
        });
    },

    constructor: function constructor() {
        return this;
    }
};

},{"./MyError":35,"moment":"moment"}],37:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],38:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],39:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
    try {
        cachedSetTimeout = setTimeout;
    } catch (e) {
        cachedSetTimeout = function () {
            throw new Error('setTimeout is not defined');
        }
    }
    try {
        cachedClearTimeout = clearTimeout;
    } catch (e) {
        cachedClearTimeout = function () {
            throw new Error('clearTimeout is not defined');
        }
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],40:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],41:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":40,"_process":39,"inherits":38}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL3JvdXRlci5qcyIsImNsaWVudC9qcy92aWV3cy9BZG1pbi5qcyIsImNsaWVudC9qcy92aWV3cy9Db250YWN0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL0RlbW8uanMiLCJjbGllbnQvanMvdmlld3MvRm9ybS5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9MaXN0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL0xvZ2luLmpzIiwiY2xpZW50L2pzL3ZpZXdzL015Vmlldy5qcyIsImNsaWVudC9qcy92aWV3cy9SZWdpc3Rlci5qcyIsImNsaWVudC9qcy92aWV3cy9TZXJ2aWNlcy5qcyIsImNsaWVudC9qcy92aWV3cy9TaWRlYmFyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1N0YWZmLmpzIiwiY2xpZW50L2pzL3ZpZXdzL19fcHJvdG9fXy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvYWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2NvbnRhY3QuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2RlbW8uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2ZpZWxkRXJyb3IuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2Zvcm0uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2hlYWRlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvaG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvaW52YWxpZExvZ2luRXJyb3IuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xpc3QuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xvZ2luLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9yZWdpc3Rlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvc2VydmljZXMuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL3NpZGViYXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL3N0YWZmLmpzIiwibGliL015RXJyb3IuanMiLCJsaWIvTXlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxPQUFQLEdBQWU7QUFDZCxRQUFPLFFBQVEseUJBQVIsQ0FETztBQUVkLFVBQVMsUUFBUSwyQkFBUixDQUZLO0FBR2QsT0FBTSxRQUFRLHdCQUFSLENBSFE7QUFJZCxhQUFZLFFBQVEsOEJBQVIsQ0FKRTtBQUtkLE9BQU0sUUFBUSx3QkFBUixDQUxRO0FBTWQsU0FBUSxRQUFRLDBCQUFSLENBTk07QUFPZCxPQUFNLFFBQVEsd0JBQVIsQ0FQUTtBQVFkLG9CQUFtQixRQUFRLHFDQUFSLENBUkw7QUFTZCxPQUFNLFFBQVEsd0JBQVIsQ0FUUTtBQVVkLFFBQU8sUUFBUSx5QkFBUixDQVZPO0FBV2QsV0FBVSxRQUFRLDRCQUFSLENBWEk7QUFZZCxXQUFVLFFBQVEsNEJBQVIsQ0FaSTtBQWFkLFVBQVMsUUFBUSwyQkFBUixDQWJLO0FBY2QsUUFBTyxRQUFRLHlCQUFSO0FBZE8sQ0FBZjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBZTtBQUNkLFFBQU8sUUFBUSxlQUFSLENBRE87QUFFZCxVQUFTLFFBQVEsaUJBQVIsQ0FGSztBQUdkLE9BQU0sUUFBUSxjQUFSLENBSFE7QUFJZCxPQUFNLFFBQVEsY0FBUixDQUpRO0FBS2QsU0FBUSxRQUFRLGdCQUFSLENBTE07QUFNZCxPQUFNLFFBQVEsY0FBUixDQU5RO0FBT2QsT0FBTSxRQUFRLGNBQVIsQ0FQUTtBQVFkLFFBQU8sUUFBUSxlQUFSLENBUk87QUFTZCxTQUFRLFFBQVEsZ0JBQVIsQ0FUTTtBQVVkLFdBQVUsUUFBUSxrQkFBUixDQVZJO0FBV2QsV0FBVSxRQUFRLGtCQUFSLENBWEk7QUFZZCxVQUFTLFFBQVEsaUJBQVIsQ0FaSztBQWFkLFFBQU8sUUFBUSxlQUFSO0FBYk8sQ0FBZjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWU7QUFFNUIsVUFGNEIsa0JBRXBCLElBRm9CLEVBRWQsSUFGYyxFQUVQO0FBQ2pCLGVBQU8sT0FBTyxNQUFQLENBQ0gsS0FBSyxLQUFMLENBQVksS0FBSyxNQUFMLENBQVksQ0FBWixFQUFlLFdBQWYsS0FBK0IsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUEzQyxDQURHLEVBRUgsT0FBTyxNQUFQLENBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxLQUFLLFNBQUwsQ0FBZ0IsSUFBaEIsQ0FBVCxFQUFaLEVBQStDLE1BQU0sRUFBRSxPQUFPLEtBQUssSUFBZCxFQUFyRCxFQUEyRSxTQUFTLEVBQUUsT0FBTyxJQUFULEVBQXBGLEVBQWYsRUFBc0gsSUFBdEgsQ0FGRyxFQUdMLFdBSEssRUFBUDtBQUlIO0FBUDJCLENBQWYsRUFTZDtBQUNDLGVBQVcsRUFBRSxPQUFPLFFBQVEsaUJBQVIsQ0FBVCxFQURaO0FBRUMsVUFBTSxFQUFFLE9BQU8sUUFBUSxnQkFBUixDQUFULEVBRlA7QUFHQyxXQUFPLEVBQUUsT0FBTyxRQUFRLGFBQVIsQ0FBVDtBQUhSLENBVGMsQ0FBakI7Ozs7O0FDQUEsUUFBUSxRQUFSLEVBQW1CLFlBQU07QUFDckIsWUFBUSxVQUFSO0FBQ0EsWUFBUSxVQUFSLEVBQW9CLE9BQXBCLENBQTRCLEtBQTVCLENBQW1DLEVBQUUsV0FBVyxJQUFiLEVBQW5DO0FBQ0gsQ0FIRDs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsS0FBTSxRQUFRLFVBQVIsRUFBb0IsS0FBcEIsQ0FBMEIsTUFBMUIsQ0FBa0M7QUFDckQsY0FBVSxFQUFFLE9BQU8sRUFBVCxFQUQyQztBQUVyRCxjQUZxRCx3QkFFeEM7QUFDVCxhQUFLLE9BQUwsR0FBZSxLQUFLLEtBQUwsRUFBZjtBQUNBLGVBQU8sSUFBUDtBQUNILEtBTG9EO0FBTXJELE9BTnFELGlCQU0vQztBQUFFLGVBQU8sT0FBUDtBQUFnQjtBQU42QixDQUFsQyxDQUFOLEdBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixLQUNiLFFBQVEsVUFBUixFQUFvQixNQUFwQixDQUEyQixNQUEzQixDQUFtQzs7QUFFL0IsT0FBRyxRQUFRLFFBQVIsQ0FGNEI7O0FBSS9CLFdBQU8sUUFBUSxtQkFBUixDQUp3Qjs7QUFNL0IsVUFBTSxRQUFRLGVBQVIsQ0FOeUI7O0FBUS9CLGlCQUFhLFFBQVEsZ0JBQVIsQ0FSa0I7O0FBVS9CLGNBVitCLHdCQVVsQjtBQUFBOztBQUVULGFBQUssZ0JBQUwsR0FBd0IsS0FBSyxDQUFMLENBQU8sVUFBUCxDQUF4Qjs7QUFFQSxlQUFPLE9BQU8sTUFBUCxDQUFlLElBQWYsRUFBcUI7QUFDeEIsbUJBQU8sRUFEaUI7QUFFeEIsb0JBQVEsS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQXlCLFFBQXpCLEVBQW1DLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLEtBQUssZ0JBQVosRUFBOEIsUUFBUSxRQUF0QyxFQUFULEVBQWIsRUFBbkMsRUFDSCxFQURHLENBQ0MsT0FERCxFQUNVO0FBQUEsdUJBQVMsTUFBSyxRQUFMLENBQWUsS0FBZixFQUFzQixFQUFFLFNBQVMsSUFBWCxFQUF0QixDQUFUO0FBQUEsYUFEVjtBQUZnQixTQUFyQixDQUFQO0FBS0gsS0FuQjhCO0FBcUIvQixVQXJCK0Isb0JBcUJ0QjtBQUFFLGFBQUssUUFBTCxDQUFlLE1BQWYsRUFBdUIsRUFBRSxTQUFTLElBQVgsRUFBdkI7QUFBNEMsS0FyQnhCO0FBdUIvQixXQXZCK0IsbUJBdUJ0QixRQXZCc0IsRUF1Qlg7QUFBQTs7QUFFaEIsWUFBSSxDQUFDLFFBQUwsRUFBZ0IsT0FBTyxLQUFLLE1BQUwsRUFBUDs7QUFFaEIsWUFBSSxhQUFhLE1BQWpCLEVBQTBCO0FBQ3RCLGlCQUFLLE1BQUwsQ0FBWSxJQUFaO0FBQ0gsU0FGRCxNQUVPO0FBQUUsZ0JBQUksS0FBSyxNQUFMLENBQVksUUFBWixFQUFKLEVBQTZCLEtBQUssTUFBTCxDQUFZLElBQVo7QUFBb0I7O0FBRTFELGFBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsSUFBbEIsQ0FBd0IsWUFBTTs7QUFFMUIsbUJBQUssTUFBTCxDQUFZLE1BQVosR0FDSyxFQURMLENBQ1MsU0FEVCxFQUNvQjtBQUFBLHVCQUNaLFFBQVEsR0FBUixDQUFhLE9BQU8sSUFBUCxDQUFhLE9BQUssS0FBbEIsRUFBMEIsR0FBMUIsQ0FBK0I7QUFBQSwyQkFBUSxPQUFLLEtBQUwsQ0FBWSxJQUFaLEVBQW1CLE1BQW5CLEVBQVI7QUFBQSxpQkFBL0IsQ0FBYixFQUNDLElBREQsQ0FDTyxPQUFLLE1BQUwsRUFEUCxDQURZO0FBQUEsYUFEcEI7O0FBTUEsb0JBQVEsR0FBUixDQUFhLE9BQU8sSUFBUCxDQUFhLE9BQUssS0FBbEIsRUFBMEIsR0FBMUIsQ0FBK0I7QUFBQSx1QkFBUSxPQUFLLEtBQUwsQ0FBWSxJQUFaLEVBQW1CLElBQW5CLEVBQVI7QUFBQSxhQUEvQixDQUFiLEVBQ0MsSUFERCxDQUNPLFlBQU07QUFDVCxvQkFBSSxPQUFLLEtBQUwsQ0FBWSxRQUFaLENBQUosRUFBNkIsT0FBTyxPQUFLLEtBQUwsQ0FBWSxRQUFaLEVBQXVCLElBQXZCLEVBQVA7QUFDN0IsdUJBQUssS0FBTCxDQUFZLFFBQVosSUFDSSxPQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBeUIsUUFBekIsRUFBbUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssT0FBSyxnQkFBWixFQUFULEVBQWIsRUFBbkMsQ0FESjtBQUVBLG9CQUFJLGFBQWEsTUFBakIsRUFBMEIsT0FBSyxLQUFMLENBQVksUUFBWixFQUNyQixFQURxQixDQUNqQixPQURpQixFQUNSO0FBQUEsMkJBQVMsT0FBSyxRQUFMLENBQWUsS0FBZixFQUFzQixFQUFFLFNBQVMsSUFBWCxFQUF0QixDQUFUO0FBQUEsaUJBRFE7QUFFN0IsYUFQRCxFQVFDLEtBUkQsQ0FRUSxPQUFLLEtBUmI7QUFVSCxTQWxCRCxFQWtCSSxJQWxCSixDQWtCVSxLQUFLLEtBbEJmO0FBb0JILEtBbkQ4Qjs7O0FBcUQvQixZQUFRLEVBQUUsY0FBYyxTQUFoQjs7QUFyRHVCLENBQW5DLENBRGEsR0FBakI7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBbUIsUUFBUSxhQUFSLENBQW5CLEVBQTJDO0FBQ3hELG1CQUFlO0FBRHlDLENBQTNDLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLFFBQVEsYUFBUixDQUFuQixFQUEyQzs7QUFFeEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZ3RCxDQUEzQyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWUsRUFBZixFQUFtQixRQUFRLGFBQVIsQ0FBbkIsRUFBMkM7O0FBRXhELFdBQU87QUFDSCxjQUFNLEVBQUUsTUFBTSxRQUFRLFFBQVIsQ0FBUixFQUEyQixVQUFVLFFBQVEsa0JBQVIsQ0FBckMsRUFESDtBQUVILGVBQU8sRUFBRSxNQUFNLFFBQVEsU0FBUixDQUFSLEVBQTRCLFVBQVUsUUFBUSxtQkFBUixDQUF0QyxFQUZKO0FBR0gsa0JBQVUsRUFBRSxNQUFNLFFBQVEsWUFBUixDQUFSLEVBQStCLFVBQVUsUUFBUSxzQkFBUixDQUF6QyxFQUhQO0FBSUgsaUJBQVMsRUFBRSxNQUFNLFFBQVEsV0FBUixDQUFSLEVBQThCLFVBQVUsUUFBUSxxQkFBUixDQUF4QztBQUpOLEtBRmlEOztBQVN4RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNBLGNBaER3RCx3QkFnRDNDOztBQUVUOztBQUVBOztBQUVBOzs7OztBQUtBOzs7Ozs7QUFNQTs7Ozs7Ozs7Ozs7O0FBYUE7O0FBRUEsZUFBTyxJQUFQO0FBQ0g7QUFqRnVELENBQTNDLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW9CLFFBQVEsYUFBUixDQUFwQixFQUE0Qzs7QUFFekQsZ0JBQVksK0NBRjZDOztBQUl6RCxzQkFKeUQsZ0NBSXBDO0FBQUE7O0FBQ2pCLGFBQUssTUFBTCxDQUFZLE9BQVosQ0FBcUIsaUJBQVM7QUFDMUIsZ0JBQUksT0FBTyxNQUFNLElBQU4sQ0FBVyxNQUFYLENBQWtCLENBQWxCLEVBQXFCLFdBQXJCLEtBQXFDLE1BQU0sSUFBTixDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBaEQ7QUFDQSxrQkFBTyxPQUFQLElBQW1CLE1BQUssS0FBeEI7QUFDQSxnQkFBSSxNQUFLLFVBQVQsRUFBc0IsTUFBTyxZQUFQLElBQXdCLElBQXhCO0FBQ3RCLGtCQUFTLE1BQUssS0FBTCxLQUFlLFlBQWpCLEdBQWtDLE9BQWxDLEdBQTRDLGFBQW5ELElBQXFFLElBQXJFO0FBRUgsU0FORDs7QUFRQSxlQUFPLEVBQUUsUUFBUSxLQUFLLE1BQWYsRUFBUDtBQUFnQyxLQWJxQjtBQWV6RCxlQWZ5RCx5QkFlM0M7QUFBQTs7QUFFVixlQUFPLElBQVAsQ0FBYSxLQUFLLEdBQWxCLEVBQXVCLGVBQU87QUFDMUIsZ0JBQUksa0JBQWtCLElBQWxCLENBQXdCLE9BQUssR0FBTCxDQUFVLEdBQVYsRUFBZ0IsSUFBaEIsQ0FBcUIsU0FBckIsQ0FBeEIsQ0FBSixFQUFnRSxPQUFLLFFBQUwsQ0FBZSxHQUFmLElBQXVCLE9BQUssR0FBTCxDQUFVLEdBQVYsRUFBZ0IsR0FBaEIsRUFBdkI7QUFDbkUsU0FGRDs7QUFJQSxlQUFPLEtBQUssUUFBWjtBQUNILEtBdEJ3RDs7O0FBd0J6RCxZQUFRLEVBeEJpRDs7QUEwQnpELGNBMUJ5RCxzQkEwQjdDLEtBMUI2QyxFQTBCckM7QUFDaEIsZ0JBQVEsR0FBUixDQUFhLE1BQU0sS0FBTixJQUFlLEtBQTVCO0FBQ0E7QUFDSCxLQTdCd0Q7QUErQnpELHdCQS9CeUQsa0NBK0JsQyxDQUFHLENBL0IrQjtBQWlDekQsWUFqQ3lELG9CQWlDL0MsSUFqQytDLEVBaUN4QztBQUFBOztBQUViLGVBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN2QyxtQkFBSyxDQUFMLENBQU8sSUFBUCxDQUFhO0FBQ1Qsc0JBQU0sS0FBSyxTQUFMLENBQWdCLEtBQUssTUFBckIsS0FBaUMsS0FBSyxTQUFMLENBQWdCLE9BQUssV0FBTCxFQUFoQixDQUQ5QjtBQUVULHlCQUFTLEVBQUUsT0FBUyxPQUFLLElBQVAsR0FBZ0IsT0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLE9BQWQsQ0FBaEIsR0FBeUMsRUFBbEQsRUFGQTtBQUdULHNCQUFNLE1BSEc7QUFJVCwyQkFBVSxLQUFLO0FBSk4sYUFBYjtBQU1ILFNBUE0sQ0FBUDtBQVFILEtBM0N3RDtBQTZDekQsY0E3Q3lELHdCQTZDNUM7O0FBRVQsWUFBSSxPQUFPLElBQVg7O0FBRUEsYUFBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixJQUFuQixDQUF3QixPQUF4QixFQUNDLEVBREQsQ0FDSyxNQURMLEVBQ2EsWUFBVztBQUNwQixnQkFBSSxNQUFNLEtBQUssQ0FBTCxDQUFPLElBQVAsQ0FBVjtBQUFBLGdCQUNJLFFBQVEsS0FBSyxDQUFMLENBQVEsS0FBSyxNQUFiLEVBQXNCLElBQXRCLENBQTRCLFVBQVUsS0FBVixFQUFrQjtBQUFFLHVCQUFPLE1BQU0sSUFBTixLQUFlLElBQUksSUFBSixDQUFTLElBQVQsQ0FBdEI7QUFBc0MsYUFBdEYsQ0FEWjs7QUFHQSxtQkFBTyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYO0FBQUEsdUJBQXVCLFFBQVMsTUFBTSxRQUFOLENBQWUsSUFBZixDQUFxQixJQUFyQixFQUEyQixJQUFJLEdBQUosRUFBM0IsQ0FBVCxDQUF2QjtBQUFBLGFBQWIsRUFDTixJQURNLENBQ0EsaUJBQVM7QUFDWixvQkFBSSxLQUFKLEVBQVk7QUFBRSx5QkFBSyxTQUFMLENBQWdCLEdBQWhCO0FBQXVCLGlCQUFyQyxNQUNLO0FBQUUseUJBQUssU0FBTCxDQUFnQixHQUFoQixFQUFxQixNQUFNLEtBQTNCO0FBQW9DO0FBQzlDLGFBSk0sQ0FBUDtBQUtILFNBVkQsRUFXQyxFQVhELENBV0ssT0FYTCxFQVdjLFlBQVc7QUFBRSxpQkFBSyxXQUFMLENBQWtCLEtBQUssQ0FBTCxDQUFPLElBQVAsQ0FBbEI7QUFBa0MsU0FYN0Q7O0FBYUEsZUFBTyxJQUFQO0FBQ0gsS0EvRHdEO0FBaUV6RCxlQWpFeUQsdUJBaUU1QyxHQWpFNEMsRUFpRXRDO0FBQ2YsWUFBSSxNQUFKLEdBQWEsV0FBYixDQUF5QixhQUF6QjtBQUNBLFlBQUksUUFBSixDQUFhLFdBQWIsRUFBMEIsTUFBMUI7QUFDSCxLQXBFd0Q7QUFzRXpELGFBdEV5RCxxQkFzRTlDLEdBdEU4QyxFQXNFekMsS0F0RXlDLEVBc0VqQzs7QUFFcEIsWUFBSSxZQUFZLElBQUksTUFBSixFQUFoQjs7QUFFQSxZQUFJLFVBQVUsUUFBVixDQUFvQixPQUFwQixDQUFKLEVBQW9DOztBQUVwQyxrQkFBVSxXQUFWLENBQXNCLE9BQXRCLEVBQStCLFFBQS9CLENBQXdDLE9BQXhDLEVBQWlELE1BQWpELENBQXlELEtBQUssU0FBTCxDQUFlLFVBQWYsQ0FBMkIsRUFBRSxPQUFPLEtBQVQsRUFBM0IsQ0FBekQ7QUFDSCxLQTdFd0Q7QUErRXpELGFBL0V5RCxxQkErRTlDLEdBL0U4QyxFQStFeEM7QUFDYixZQUFJLE1BQUosR0FBYSxXQUFiLENBQXlCLE9BQXpCLEVBQWtDLFFBQWxDLENBQTJDLE9BQTNDO0FBQ0EsWUFBSSxRQUFKLENBQWEsV0FBYixFQUEwQixNQUExQjtBQUNILEtBbEZ3RDtBQW9GekQsY0FwRnlELHNCQW9GN0MsUUFwRjZDLEVBb0ZsQztBQUFBOztBQUNuQixhQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FBc0Isa0JBQVU7QUFDNUIsZ0JBQUksV0FBVyxLQUFmLEVBQXVCO0FBQ3ZCLG1CQUFLLFFBQUwsQ0FBZSxRQUFmLEVBQ0MsSUFERCxDQUNPO0FBQUEsdUJBQU0sT0FBSyxvQkFBTCxFQUFOO0FBQUEsYUFEUCxFQUVDLEtBRkQsQ0FFUTtBQUFBLHVCQUFLLE9BQUssVUFBTCxDQUFpQixDQUFqQixDQUFMO0FBQUEsYUFGUjtBQUdILFNBTEQ7QUFNSCxLQTNGd0Q7OztBQTZGekQsY0FBVSxRQUFRLGtCQUFSLENBN0YrQzs7QUErRnpELGVBQVc7QUFDUCxvQkFBWSxRQUFRLHdCQUFSO0FBREwsS0EvRjhDOztBQW1HekQsWUFuR3lELHNCQW1HOUM7QUFBQTs7QUFDUCxZQUFJLFFBQVEsSUFBWjs7QUFFQSxlQUFPLFFBQVEsR0FBUixDQUFhLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBaUIsaUJBQVM7QUFDMUMsbUJBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN2QyxvQkFBSSxTQUFTLE1BQU0sUUFBTixDQUFlLElBQWYsU0FBMEIsT0FBSyxHQUFMLENBQVUsTUFBTSxJQUFoQixFQUF1QixHQUF2QixFQUExQixDQUFiO0FBQ0Esb0JBQUksV0FBVyxLQUFmLEVBQXVCO0FBQ25CLDRCQUFRLEtBQVI7QUFDQSwyQkFBSyxTQUFMLENBQWdCLE9BQUssR0FBTCxDQUFVLE1BQU0sSUFBaEIsQ0FBaEIsRUFBd0MsTUFBTSxLQUE5QztBQUNIOztBQUVEO0FBQ0gsYUFSTSxDQUFQO0FBU0gsU0FWbUIsQ0FBYixFQVdOLElBWE0sQ0FXQTtBQUFBLG1CQUFNLEtBQU47QUFBQSxTQVhBLEVBWU4sS0FaTSxDQVlDLGFBQUs7QUFBRSxvQkFBUSxHQUFSLENBQWEsRUFBRSxLQUFGLElBQVcsQ0FBeEIsRUFBNkIsT0FBTyxLQUFQO0FBQWMsU0FabkQsQ0FBUDtBQWFIO0FBbkh3RCxDQUE1QyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWUsRUFBZixFQUFtQixRQUFRLGFBQVIsQ0FBbkIsRUFBMkM7O0FBRXhELFlBQVE7QUFDSixnQkFBUSxPQURKO0FBRUosb0JBQVksRUFBRSxPQUFPLE9BQVQsRUFBa0IsVUFBVSxJQUE1QjtBQUNaO0FBSEksS0FGZ0Q7O0FBUXhELGVBUndELHlCQVExQztBQUFFLGFBQUssSUFBTCxDQUFXLE9BQVgsRUFBb0IsTUFBcEI7QUFBOEIsS0FSVTtBQVV4RCxtQkFWd0QsMkJBVXZDLENBVnVDLEVBVW5DO0FBQ2pCLFlBQUksV0FBVyxLQUFLLENBQUwsQ0FBUSxFQUFFLGFBQVYsRUFBMEIsSUFBMUIsQ0FBZ0MsU0FBaEMsQ0FBZjtBQUNBLGFBQUssSUFBTCxDQUFXLE9BQVgsRUFBb0IsUUFBcEI7QUFDSCxLQWJ1RDtBQWV4RCxVQWZ3RCxvQkFlL0M7QUFDTCxlQUFPLElBQVA7QUFDSDtBQWpCdUQsQ0FBM0MsQ0FBakI7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBbUIsUUFBUSxhQUFSLENBQW5CLEVBQTJDOztBQUV4RCxZQUFRO0FBQ0osaUJBQVMsRUFBRSxPQUFPLE9BQVQsRUFBa0IsVUFBVSxJQUE1QjtBQURMLEtBRmdEOztBQU14RCxnQkFOd0Qsd0JBTTFDLENBTjBDLEVBTXRDO0FBQ2QsWUFBSSxXQUFXLEtBQUssQ0FBTCxDQUFRLEVBQUUsYUFBVixFQUEwQixJQUExQixDQUFnQyxTQUFoQyxDQUFmO0FBQ0EsYUFBSyxJQUFMLENBQVcsT0FBWCxFQUFvQixRQUFwQjtBQUNIO0FBVHVELENBQTNDLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW9CLFFBQVEsYUFBUixDQUFwQixFQUE0QyxFQUE1QyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWUsRUFBZixFQUFtQixRQUFRLGFBQVIsQ0FBbkIsRUFBMkM7O0FBRXhELFlBQVE7QUFDSix1QkFBZSxFQUFFLE9BQU8sT0FBVCxFQUFrQixVQUFVLEVBQTVCLEVBQWdDLFFBQVEsa0JBQXhDLEVBRFg7QUFFSixvQkFBWSxFQUFFLE9BQU8sT0FBVCxFQUFrQixVQUFVLEVBQTVCLEVBQWdDLFFBQVEsT0FBeEM7QUFGUixLQUZnRDs7QUFPeEQsWUFBUSxDQUFFO0FBQ04sY0FBTSxPQURBO0FBRU4sY0FBTSxNQUZBO0FBR04sZUFBTyxxQ0FIRDtBQUlOLGtCQUFVLGtCQUFVLEdBQVYsRUFBZ0I7QUFBRSxtQkFBTyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBUDtBQUFrQztBQUp4RCxLQUFGLEVBS0w7QUFDQyxjQUFNLFVBRFA7QUFFQyxjQUFNLFVBRlA7QUFHQyxlQUFPLCtDQUhSO0FBSUMsa0JBQVU7QUFBQSxtQkFBTyxJQUFJLE1BQUosSUFBYyxDQUFyQjtBQUFBO0FBSlgsS0FMSyxDQVBnRDs7QUFtQnhELFVBQU0sUUFBUSxRQUFSLENBbkJrRDs7QUFxQnhELFNBckJ3RCxtQkFxQmhEO0FBQUUsYUFBSyxZQUFMLENBQWtCLFVBQWxCLENBQThCLEVBQUUsVUFBVSxNQUFaLEVBQTlCO0FBQXNELEtBckJSO0FBdUJ4RCx3QkF2QndELGdDQXVCbEMsUUF2QmtDLEVBdUJ2QjtBQUM3QixZQUFJLE9BQU8sSUFBUCxDQUFhLFFBQWIsRUFBd0IsTUFBeEIsS0FBbUMsQ0FBdkMsRUFBMkM7QUFDdkMsbUJBQU8sS0FBSyxhQUFMLENBQW9CLEVBQUUsVUFBVSxLQUFLLFNBQUwsQ0FBZSxpQkFBM0IsRUFBOEMsV0FBVyxFQUFFLEtBQUssS0FBSyxHQUFMLENBQVMsU0FBaEIsRUFBekQsRUFBcEIsQ0FBUDtBQUNIOztBQUVELGdCQUFRLGdCQUFSLEVBQTBCLEdBQTFCLENBQStCLFFBQS9CO0FBQ0EsYUFBSyxJQUFMLENBQVcsVUFBWDtBQUNBLGFBQUssSUFBTDtBQUNILEtBL0J1RDtBQWlDeEQsY0FqQ3dELHdCQWlDM0M7QUFDVCxhQUFLLFlBQUwsR0FBb0IsT0FBTyxNQUFQLENBQWUsS0FBSyxJQUFwQixFQUEwQjtBQUMxQyxtQkFBTyxFQUFFLE9BQU8sS0FBSyxLQUFkLEVBRG1DO0FBRTFDO0FBQ0Esb0JBQVEsRUFBRSxPQUFPLEtBQUssTUFBZCxFQUhrQztBQUkxQyx1QkFBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLEtBQUssR0FBTCxDQUFTLElBQWhCLEVBQVQsRUFKK0I7QUFLMUMsa0NBQXNCLEVBQUUsT0FBTyxLQUFLLG9CQUFkO0FBTG9CLFNBQTFCLEVBTWhCLFdBTmdCLEVBQXBCOztBQVFBLGVBQU8sSUFBUDtBQUNILEtBM0N1RDs7O0FBNkN4RCxjQUFVLFFBQVEsWUFBUixDQTdDOEM7O0FBK0N4RCxtQkFBZSxLQS9DeUM7O0FBaUR4RCxvQkFqRHdELDhCQWlEckM7QUFBQTs7QUFFZixZQUFJLE9BQU8sS0FBSyxZQUFoQjtBQUFBLFlBQ0ksUUFBUSxLQUFLLEdBQUwsQ0FBUyxLQURyQjtBQUFBLFlBRUksV0FBVyxLQUFLLEdBQUwsQ0FBUyxRQUZ4Qjs7QUFJQSxhQUFLLFdBQUwsQ0FBa0IsS0FBbEI7QUFDQSxjQUFNLEdBQU4sQ0FBVSxFQUFWOztBQUVBLGFBQUssV0FBTCxDQUFrQixRQUFsQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxFQUFiOztBQUVBLFlBQUssS0FBSyxHQUFMLENBQVMsaUJBQWQsRUFBa0MsS0FBSyxHQUFMLENBQVMsaUJBQVQsQ0FBMkIsTUFBM0I7QUFDbEMsWUFBSyxLQUFLLEdBQUwsQ0FBUyxXQUFkLEVBQTRCLEtBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsTUFBckI7O0FBRTVCLGFBQUssSUFBTCxHQUFZLElBQVosQ0FBa0I7QUFBQSxtQkFBUSxNQUFLLGdCQUFQLEdBQTRCLE1BQUssZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNUIsR0FDbEIsT0FBTyxNQUFQLENBQWUsTUFBSyxRQUFwQixFQUE4QjtBQUM1QiwrQkFBZSxFQUFFLFlBQUYsRUFEYTtBQUU1Qix1QkFBTyxFQUFFLE9BQU8sa0JBQVQ7QUFGcUIsYUFBOUIsRUFHRSxXQUhGLEVBRFk7QUFBQSxTQUFsQjtBQU1ILEtBdEV1RDs7O0FBd0V4RCxjQUFVLFFBQVEsbUJBQVIsQ0F4RThDOztBQTBFeEQsZUFBVztBQUNQLDJCQUFtQixRQUFRLCtCQUFSO0FBRFo7O0FBMUU2QyxDQUEzQyxDQUFqQjs7Ozs7QUNBQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVUsSUFBVixFQUFpQjtBQUFFLFdBQU8sT0FBTyxNQUFQLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUE0QixVQUE1QixFQUFQO0FBQWlELENBQWpGOztBQUVBLE9BQU8sTUFBUCxDQUFlLE9BQU8sU0FBdEIsRUFBaUMsUUFBUSxRQUFSLEVBQWtCLFlBQWxCLENBQStCLFNBQWhFLEVBQTJFOztBQUV2RSxnQkFBWSxRQUFRLFVBQVIsRUFBb0IsVUFGdUM7O0FBSXZFOztBQUVBLFdBQU8sUUFBUSxVQUFSLEVBQW9CLEtBTjRDOztBQVF2RSxPQUFHLFFBQVEsWUFBUixDQVJvRTs7QUFVdkUsT0FBRyxRQUFRLFFBQVIsQ0FWb0U7O0FBWXZFLGtCQVp1RSwwQkFZdkQsR0FadUQsRUFZbEQsRUFaa0QsRUFZN0M7QUFBQTs7QUFDdEIsWUFBSSxJQUFKOztBQUVBLFlBQUksQ0FBRSxLQUFLLE1BQUwsQ0FBYSxHQUFiLENBQU4sRUFBMkI7O0FBRTNCLGVBQU8sT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLElBQTFCLENBQWdDLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBaEMsQ0FBUDs7QUFFQSxZQUFJLFNBQVMsaUJBQWIsRUFBaUM7QUFDN0IsaUJBQUssU0FBTCxDQUFnQixHQUFoQixFQUFxQixLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQXJCLEVBQXVDLEVBQXZDO0FBQ0gsU0FGRCxNQUVPLElBQUksU0FBUyxnQkFBYixFQUFnQztBQUNuQyxpQkFBSyxNQUFMLENBQVksR0FBWixFQUFpQixPQUFqQixDQUEwQjtBQUFBLHVCQUFlLE1BQUssU0FBTCxDQUFnQixHQUFoQixFQUFxQixXQUFyQixFQUFrQyxFQUFsQyxDQUFmO0FBQUEsYUFBMUI7QUFDSDtBQUNKLEtBeEJzRTs7O0FBMEJ2RSxZQUFRLG1CQUFXO0FBQ2YsWUFBSSxLQUFLLFlBQUwsSUFBcUIsS0FBSyxZQUFMLENBQWtCLFNBQTNDLEVBQXVEO0FBQ25ELGlCQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsTUFBNUI7QUFDQSxpQkFBSyxJQUFMLENBQVUsU0FBVjtBQUNIO0FBQ0osS0EvQnNFOztBQWlDdkUsWUFBUTtBQUNKLCtCQUF1QjtBQUFBLG1CQUFVLE9BQU8sTUFBUCxDQUFjLENBQWQsRUFBaUIsV0FBakIsS0FBaUMsT0FBTyxLQUFQLENBQWEsQ0FBYixDQUEzQztBQUFBO0FBRG5CLEtBakMrRDs7QUFxQ3ZFLGlCQUFhLHVCQUFXO0FBQUE7O0FBQ3BCLGFBQUssUUFBTCxHQUFnQixFQUFoQjs7QUFFQSxhQUFLLENBQUwsQ0FBTyxJQUFQLENBQWEsS0FBSyxZQUFsQixFQUFnQyxVQUFFLEdBQUYsRUFBTyxJQUFQLEVBQWlCO0FBQUUsZ0JBQUksSUFBSSxJQUFKLENBQVMsU0FBVCxNQUF3QixPQUF4QixJQUFtQyxJQUFJLEdBQUosRUFBdkMsRUFBbUQsT0FBSyxRQUFMLENBQWMsSUFBZCxJQUFzQixJQUFJLEdBQUosRUFBdEI7QUFBaUMsU0FBdkk7O0FBRUEsZUFBTyxLQUFLLFFBQVo7QUFDSCxLQTNDc0U7O0FBNkN2RSxlQUFXLHFCQUFXO0FBQUUsZUFBTyxRQUFRLFdBQVIsQ0FBUDtBQUE2QixLQTdDa0I7O0FBK0N2RSx3QkFBb0I7QUFBQSxlQUFPLEVBQVA7QUFBQSxLQS9DbUQ7O0FBaUR2RTs7Ozs7OztBQU9BLGNBeER1RSx3QkF3RDFEO0FBQUE7O0FBRVQsWUFBSSxDQUFFLEtBQUssU0FBWCxFQUF1QixLQUFLLFNBQUwsR0FBaUIsS0FBSyxDQUFMLENBQU8sVUFBUCxDQUFqQjs7QUFFdkIsYUFBSyxNQUFMLEdBQWMsS0FBSyxTQUFMLEVBQWQ7O0FBRUE7O0FBRUEsYUFBSyxDQUFMLENBQU8sTUFBUCxFQUFlLE1BQWYsQ0FBdUIsS0FBSyxDQUFMLENBQU8sUUFBUCxDQUFpQjtBQUFBLG1CQUFNLE9BQUssSUFBTCxFQUFOO0FBQUEsU0FBakIsRUFBb0MsR0FBcEMsQ0FBdkI7O0FBRUEsWUFBSSxLQUFLLGFBQUwsSUFBc0IsQ0FBRSxLQUFLLElBQUwsQ0FBVSxFQUF0QyxFQUEyQztBQUN2QyxvQkFBUSxTQUFSLEVBQW1CLElBQW5CLEdBQTBCLElBQTFCLENBQWdDLFNBQWhDLEVBQTJDLGFBQUs7QUFDNUMsdUJBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsTUFBbkIsQ0FBMkIsT0FBSyxJQUFoQzs7QUFFQSxvQkFBSSxPQUFLLFlBQUwsSUFBdUIsQ0FBRSxPQUFLLENBQUwsQ0FBUSxPQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsT0FBZCxDQUFSLEVBQWlDLFFBQWpDLENBQTJDLE9BQUssWUFBaEQsQ0FBN0IsRUFBZ0c7QUFDNUYsMkJBQU8sTUFBTSx3QkFBTixDQUFQO0FBQ0g7O0FBRUQsdUJBQUssTUFBTDtBQUNILGFBUkQ7QUFTQSxtQkFBTyxJQUFQO0FBQ0gsU0FYRCxNQVdPLElBQUksS0FBSyxJQUFMLENBQVUsRUFBVixJQUFnQixLQUFLLFlBQXpCLEVBQXdDO0FBQzNDLGdCQUFNLENBQUUsS0FBSyxDQUFMLENBQVEsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLE9BQWQsQ0FBUixFQUFpQyxRQUFqQyxDQUEyQyxLQUFLLFlBQWhELENBQVIsRUFBMkU7QUFDdkUsdUJBQU8sTUFBTSx3QkFBTixDQUFQO0FBQ0g7QUFDSjs7QUFFRCxlQUFPLEtBQUssTUFBTCxFQUFQO0FBQ0gsS0FwRnNFOzs7QUFzRnZFLGNBQVUsb0JBQVc7QUFBRSxlQUFPLEtBQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixHQUE1QixDQUFnQyxTQUFoQyxNQUErQyxNQUF0RDtBQUE4RCxLQXRGZDs7QUF5RnZFLFlBQVEsUUFBUSxRQUFSLENBekYrRDs7QUEyRnZFLGdCQUFZLHNCQUFXO0FBQ25CLGFBQUssY0FBTDtBQUNBLGVBQU8sSUFBUDtBQUNILEtBOUZzRTs7QUFnR3ZFOztBQUVBLFVBbEd1RSxvQkFrRzlEO0FBQ0wsYUFBSyxhQUFMLENBQW9CO0FBQ2hCLHNCQUFVLEtBQUssUUFBTCxDQUFlLEtBQUssa0JBQUwsRUFBZixDQURNO0FBRWhCLHVCQUFXLEVBQUUsS0FBSyxLQUFLLFdBQUwsSUFBb0IsS0FBSyxTQUFoQyxFQUEyQyxRQUFRLEtBQUssZUFBeEQsRUFGSyxFQUFwQjs7QUFJQSxhQUFLLElBQUw7O0FBRUEsYUFBSyxVQUFMOztBQUVBLGVBQU8sSUFBUDtBQUNILEtBNUdzRTs7O0FBOEd2RSxvQkFBZ0IsMEJBQVc7QUFBQTs7QUFDdkIsZUFBTyxJQUFQLENBQWEsS0FBSyxRQUFMLElBQWlCLEVBQTlCLEVBQW9DLE9BQXBDLENBQTZDO0FBQUEsbUJBQ3pDLE9BQUssUUFBTCxDQUFlLEdBQWYsRUFBcUIsT0FBckIsQ0FBOEIsdUJBQWU7QUFDekMsdUJBQU0sWUFBWSxJQUFsQixJQUEyQixJQUFJLFlBQVksSUFBaEIsQ0FBc0IsRUFBRSxXQUFXLE9BQUssWUFBTCxDQUFtQixHQUFuQixDQUFiLEVBQXRCLENBQTNCO0FBQTRGLGFBRGhHLENBRHlDO0FBQUEsU0FBN0M7QUFHSCxLQWxIc0U7O0FBb0h2RSxVQUFNLGdCQUFXO0FBQ2IsYUFBSyxZQUFMLENBQWtCLFNBQWxCLENBQTRCLElBQTVCO0FBQ0EsYUFBSyxJQUFMO0FBQ0EsZUFBTyxJQUFQO0FBQ0gsS0F4SHNFOztBQTBIdkUsYUFBUyxpQkFBVSxFQUFWLEVBQWU7O0FBRXBCLFlBQUksTUFBTSxHQUFHLElBQUgsQ0FBUSxTQUFSLENBQVY7O0FBRUEsYUFBSyxZQUFMLENBQW1CLEdBQW5CLElBQTZCLEtBQUssWUFBTCxDQUFrQixjQUFsQixDQUFpQyxHQUFqQyxDQUFGLEdBQ3JCLEtBQUssWUFBTCxDQUFtQixHQUFuQixFQUF5QixHQUF6QixDQUE4QixFQUE5QixDQURxQixHQUVyQixFQUZOOztBQUlBLFdBQUcsVUFBSCxDQUFjLFNBQWQ7O0FBRUEsWUFBSSxLQUFLLE1BQUwsQ0FBYSxHQUFiLENBQUosRUFBeUIsS0FBSyxjQUFMLENBQXFCLEdBQXJCLEVBQTBCLEVBQTFCOztBQUV6QixlQUFPLElBQVA7QUFDSCxLQXZJc0U7O0FBeUl2RSxtQkFBZSx1QkFBVSxPQUFWLEVBQW9CO0FBQUE7O0FBRS9CLFlBQUksUUFBUSxLQUFLLENBQUwsQ0FBUSxRQUFRLFFBQWhCLENBQVo7QUFBQSxZQUNJLFdBQVcsV0FEZjs7QUFHQSxZQUFJLEtBQUssWUFBTCxLQUFzQixTQUExQixFQUFzQyxLQUFLLFlBQUwsR0FBb0IsRUFBcEI7O0FBRXRDLGNBQU0sSUFBTixDQUFZLFVBQUUsS0FBRixFQUFTLEVBQVQsRUFBaUI7QUFDekIsZ0JBQUksTUFBTSxPQUFLLENBQUwsQ0FBTyxFQUFQLENBQVY7QUFDQSxnQkFBSSxJQUFJLEVBQUosQ0FBUSxRQUFSLENBQUosRUFBeUIsT0FBSyxPQUFMLENBQWMsR0FBZDtBQUM1QixTQUhEOztBQUtBLGNBQU0sR0FBTixHQUFZLE9BQVosQ0FBcUIsVUFBRSxFQUFGLEVBQVU7QUFBRSxtQkFBSyxDQUFMLENBQVEsRUFBUixFQUFhLElBQWIsQ0FBbUIsUUFBbkIsRUFBOEIsSUFBOUIsQ0FBb0MsVUFBRSxDQUFGLEVBQUssYUFBTDtBQUFBLHVCQUF3QixPQUFLLE9BQUwsQ0FBYyxPQUFLLENBQUwsQ0FBTyxhQUFQLENBQWQsQ0FBeEI7QUFBQSxhQUFwQztBQUFxRyxTQUF0STs7QUFFQSxZQUFJLFdBQVcsUUFBUSxTQUF2QixFQUFtQyxRQUFRLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBeUIsUUFBUSxTQUFSLENBQWtCLE1BQXBCLEdBQStCLFFBQVEsU0FBUixDQUFrQixNQUFqRCxHQUEwRCxRQUFqRixFQUE2RixLQUE3Rjs7QUFFbkMsZUFBTyxJQUFQO0FBQ0gsS0ExSnNFOztBQTRKdkUsZUFBVyxtQkFBVSxVQUFWLEVBQXNCLFNBQXRCLEVBQWlDLEVBQWpDLEVBQXNDO0FBQzdDLFlBQUksV0FBYSxFQUFGLEdBQVMsRUFBVCxHQUFjLEtBQUssWUFBTCxDQUFtQixVQUFuQixDQUE3Qjs7QUFFQSxpQkFBUyxFQUFULENBQWEsVUFBVSxLQUFWLElBQW1CLE9BQWhDLEVBQXlDLFVBQVUsUUFBbkQsRUFBNkQsVUFBVSxJQUF2RSxFQUE2RSxLQUFNLFVBQVUsTUFBaEIsRUFBeUIsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBN0U7QUFDSCxLQWhLc0U7O0FBa0t2RSxZQUFRLEVBbEsrRDs7QUFvS3ZFLGlCQUFhLHFCQUFVLEtBQVYsRUFBaUIsRUFBakIsRUFBc0I7O0FBRS9CLFlBQUksV0FBVyxHQUFHLE1BQUgsRUFBZjtBQUFBLFlBQ0ksV0FBVyxHQUFHLFdBQUgsQ0FBZ0IsSUFBaEIsQ0FEZjtBQUFBLFlBRUksVUFBVSxHQUFHLFVBQUgsQ0FBZSxJQUFmLENBRmQ7O0FBSUEsWUFBTSxNQUFNLEtBQU4sR0FBYyxTQUFTLElBQXpCLElBQ0UsTUFBTSxLQUFOLEdBQWdCLFNBQVMsSUFBVCxHQUFnQixPQURsQyxJQUVFLE1BQU0sS0FBTixHQUFjLFNBQVMsR0FGekIsSUFHRSxNQUFNLEtBQU4sR0FBZ0IsU0FBUyxHQUFULEdBQWUsUUFIckMsRUFHb0Q7O0FBRWhELG1CQUFPLEtBQVA7QUFDSDs7QUFFRCxlQUFPLElBQVA7QUFDSCxLQW5Mc0U7O0FBcUx2RSxtQkFBZSxLQXJMd0Q7O0FBdUx2RSxVQUFNLGdCQUFNO0FBQUU7QUFBTSxLQXZMbUQ7O0FBeUx2RSxVQUFNLFFBQVEsZ0JBQVIsQ0F6TGlFOztBQTJMdkUsVUFBTSxRQUFRLE1BQVI7O0FBM0xpRSxDQUEzRTs7QUErTEEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCOzs7Ozs7Ozs7QUNqTUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBbUIsUUFBUSxhQUFSLENBQW5COztBQUViLFlBQVEsa0JBQVc7QUFBQTs7QUFFZixZQUFJLE9BQU8sS0FBSyxZQUFoQjtBQUFBLFlBQ0ksT0FBTyxLQUFLLEdBQUwsQ0FBUyxJQURwQjtBQUFBLFlBRUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxLQUZyQjs7QUFJQSxhQUFLLFdBQUwsQ0FBa0IsSUFBbEI7QUFDQSxhQUFLLEdBQUwsQ0FBUyxFQUFUOztBQUVBLGFBQUssV0FBTCxDQUFrQixLQUFsQjtBQUNBLGNBQU0sR0FBTixDQUFVLEVBQVY7O0FBRUEsWUFBSyxLQUFLLEdBQUwsQ0FBUyxpQkFBZCxFQUFrQyxLQUFLLEdBQUwsQ0FBUyxpQkFBVCxDQUEyQixNQUEzQjtBQUNsQyxZQUFLLEtBQUssR0FBTCxDQUFTLFdBQWQsRUFBNEIsS0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixNQUFyQjs7QUFFNUIsYUFBSyxhQUFMLENBQW9CLGtCQUFwQixJQUEyQyxJQUEzQztBQUNBLGFBQUssSUFBTCxHQUFZLElBQVosQ0FBa0I7QUFBQSxtQkFBTSxNQUFLLGFBQUwsQ0FBbUIsSUFBbkIsRUFBTjtBQUFBLFNBQWxCO0FBQ0gsS0FuQlk7O0FBcUJiLFlBQVE7QUFDSix1QkFBZSxFQUFFLE9BQU8sT0FBVCxFQUFrQixVQUFVLEVBQTVCLEVBQWdDLFFBQVEsVUFBeEMsRUFEWDtBQUVKLHFCQUFhLEVBQUUsT0FBTyxPQUFULEVBQWtCLFVBQVUsRUFBNUIsRUFBZ0MsUUFBUSxRQUF4QztBQUZULEtBckJLOztBQTBCYixZQUFRLENBQUU7QUFDTixjQUFNLE1BREE7QUFFTixjQUFNLE1BRkE7QUFHTixlQUFPLDJCQUhEO0FBSU4sa0JBQVUsa0JBQVUsR0FBVixFQUFnQjtBQUFFLG1CQUFPLEtBQUssQ0FBTCxDQUFPLElBQVAsQ0FBWSxHQUFaLE1BQXFCLEVBQTVCO0FBQWdDO0FBSnRELEtBQUYsRUFLTDtBQUNDLGNBQU0sT0FEUDtBQUVDLGNBQU0sTUFGUDtBQUdDLGVBQU8scUNBSFI7QUFJQyxrQkFBVSxrQkFBVSxHQUFWLEVBQWdCO0FBQUUsbUJBQU8sS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQVA7QUFBa0M7QUFKL0QsS0FMSyxDQTFCSzs7QUFzQ2IsVUFBTSxRQUFRLFFBQVIsQ0F0Q087O0FBd0NiLDBCQUFzQiw4QkFBVSxRQUFWLEVBQXFCO0FBQUE7O0FBRXZDLFlBQUssU0FBUyxPQUFULEtBQXFCLEtBQTFCLEVBQWtDO0FBQzlCLG1CQUFPLEtBQUssYUFBTCxDQUFvQixFQUFFLFVBQVUsS0FBSyxTQUFMLENBQWUsaUJBQWYsQ0FBa0MsUUFBbEMsQ0FBWixFQUEwRCxXQUFXLEVBQUUsS0FBSyxLQUFLLEdBQUwsQ0FBUyxTQUFoQixFQUEyQixRQUFRLFFBQW5DLEVBQXJFLEVBQXBCLENBQVA7QUFDSDs7QUFFRCxhQUFLLElBQUwsQ0FBVSxHQUFWLENBQWUsU0FBUyxNQUFULENBQWdCLE1BQS9COztBQUVBLGFBQUssTUFBTCxDQUFZLE9BQVosQ0FBcUI7QUFBQSxtQkFBUyxPQUFLLEdBQUwsQ0FBVSxNQUFNLElBQWhCLEVBQXVCLEdBQXZCLENBQTJCLEVBQTNCLENBQVQ7QUFBQSxTQUFyQjs7QUFFQSxhQUFLLElBQUwsR0FBWSxJQUFaLENBQWtCO0FBQUEsbUJBQU0sT0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXlCLFVBQXpCLENBQU47QUFBQSxTQUFsQjtBQUVILEtBcERZOztBQXNEYixjQXREYSx3QkFzREE7QUFDVCxhQUFLLFlBQUwsR0FBb0IsT0FBTyxNQUFQLENBQWUsS0FBSyxJQUFwQixFQUEwQjtBQUMxQyxtQkFBTyxFQUFFLE9BQU8sS0FBSyxLQUFkLEVBRG1DO0FBRTFDLG9CQUFRLEVBQUUsT0FBTyxLQUFLLE1BQWQsRUFGa0M7QUFHMUMsd0JBQVksRUFBRSxPQUFPLEtBQUssVUFBZCxFQUg4QjtBQUkxQyx1QkFBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLEtBQUssR0FBTCxDQUFTLElBQWhCLEVBQVQsRUFKK0I7QUFLMUMsa0NBQXNCLEVBQUUsT0FBTyxLQUFLLG9CQUFkO0FBTG9CLFNBQTFCLEVBTWhCLFdBTmdCLEVBQXBCOztBQVFBLGVBQU8sSUFBUDtBQUNILEtBaEVZOzs7QUFrRWIsbUJBQWUsS0FsRUY7O0FBb0ViLFlBcEVhLHNCQW9FRjtBQUFFLGFBQUssWUFBTCxDQUFrQixVQUFsQixDQUE4QixFQUFFLFVBQVUsUUFBWixFQUE5QjtBQUF3RDtBQXBFeEQsb0RBc0VFLEtBdEVGLCtDQXdFSCxRQUFRLHNCQUFSLENBeEVHLGdEQTBFRjtBQUNQLHVCQUFtQixRQUFRLCtCQUFSO0FBRFosQ0ExRUUsbUJBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLFFBQVEsYUFBUixDQUFuQixFQUEyQzs7QUFFeEQsY0FBVSxRQUFRLGtCQUFSOztBQUY4QyxDQUEzQyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWUsRUFBZixFQUFtQixRQUFRLGFBQVIsQ0FBbkIsRUFBMkM7O0FBRXhELGNBQVUsUUFBUSxxQkFBUjs7QUFGOEMsQ0FBM0MsQ0FBakI7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBbUIsUUFBUSxhQUFSLENBQW5CLEVBQTJDLEVBQTNDLENBQWpCOzs7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBb0IsUUFBUSx1QkFBUixDQUFwQixFQUFzRCxRQUFRLFFBQVIsRUFBa0IsWUFBbEIsQ0FBK0IsU0FBckYsRUFBZ0c7O0FBRTdHLE9BQUcsUUFBUSxZQUFSLENBRjBHOztBQUk3RyxPQUFHLFFBQVEsUUFBUixDQUowRzs7QUFNN0csZ0JBQVksUUFBUSxVQUFSLEVBQW9CLFVBTjZFOztBQVE3RyxXQUFPLFFBQVEsVUFBUixFQUFvQixLQVJrRjs7QUFVN0csYUFWNkcscUJBVWxHLEdBVmtHLEVBVTdGLEtBVjZGLEVBVXRGLFFBVnNGLEVBVTNFO0FBQUE7O0FBQzlCLGFBQUssR0FBTCxDQUFTLEdBQVQsRUFBYyxFQUFkLENBQWtCLEtBQWxCLEVBQXlCLFFBQXpCLEVBQW1DO0FBQUEsbUJBQUssYUFBVyxNQUFLLHFCQUFMLENBQTJCLEdBQTNCLENBQVgsR0FBNkMsTUFBSyxxQkFBTCxDQUEyQixLQUEzQixDQUE3QyxFQUFvRixDQUFwRixDQUFMO0FBQUEsU0FBbkM7QUFDSCxLQVo0Rzs7O0FBYzdHLDJCQUF1QjtBQUFBLGVBQVUsT0FBTyxNQUFQLENBQWMsQ0FBZCxFQUFpQixXQUFqQixLQUFpQyxPQUFPLEtBQVAsQ0FBYSxDQUFiLENBQTNDO0FBQUEsS0Fkc0Y7O0FBZ0I3RyxlQWhCNkcseUJBZ0IvRjtBQUFBOztBQUVWLFlBQUksS0FBSyxJQUFULEVBQWdCLEtBQUssQ0FBTCxDQUFPLE1BQVAsRUFBZSxNQUFmLENBQXVCLEtBQUssQ0FBTCxDQUFPLFFBQVAsQ0FBaUI7QUFBQSxtQkFBTSxPQUFLLElBQUwsRUFBTjtBQUFBLFNBQWpCLEVBQW9DLEdBQXBDLENBQXZCOztBQUVoQixZQUFJLEtBQUssYUFBTCxJQUFzQixDQUFDLEtBQUssSUFBTCxDQUFVLEVBQXJDLEVBQTBDLE9BQU8sS0FBSyxXQUFMLEVBQVA7O0FBRTFDLFlBQUksS0FBSyxJQUFMLElBQWEsS0FBSyxJQUFMLENBQVUsRUFBdkIsSUFBNkIsS0FBSyxZQUFsQyxJQUFrRCxDQUFDLEtBQUssYUFBTCxFQUF2RCxFQUE4RSxPQUFPLEtBQUssWUFBTCxFQUFQOztBQUU5RSxlQUFPLE9BQU8sTUFBUCxDQUFlLElBQWYsRUFBcUIsRUFBRSxLQUFLLEVBQVAsRUFBWSxPQUFPLEVBQUUsTUFBTSxTQUFSLEVBQW1CLE1BQU0sV0FBekIsRUFBbkIsRUFBMkQsT0FBTyxFQUFsRSxFQUFyQixFQUErRixNQUEvRixFQUFQO0FBQ0gsS0F6QjRHO0FBMkI3RyxrQkEzQjZHLDBCQTJCN0YsR0EzQjZGLEVBMkJ4RixFQTNCd0YsRUEyQm5GO0FBQUE7O0FBQ3RCLFlBQUksZUFBYyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWQsQ0FBSjs7QUFFQSxZQUFJLFNBQVMsUUFBYixFQUF3QjtBQUFFLGlCQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsS0FBSyxNQUFMLENBQVksR0FBWixDQUFyQjtBQUF5QyxTQUFuRSxNQUNLLElBQUksTUFBTSxPQUFOLENBQWUsS0FBSyxNQUFMLENBQVksR0FBWixDQUFmLENBQUosRUFBd0M7QUFDekMsaUJBQUssTUFBTCxDQUFhLEdBQWIsRUFBbUIsT0FBbkIsQ0FBNEI7QUFBQSx1QkFBWSxPQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsU0FBUyxLQUE5QixDQUFaO0FBQUEsYUFBNUI7QUFDSCxTQUZJLE1BRUU7QUFDSCxpQkFBSyxTQUFMLENBQWdCLEdBQWhCLEVBQXFCLEtBQUssTUFBTCxDQUFZLEdBQVosRUFBaUIsS0FBdEMsRUFBNkMsS0FBSyxNQUFMLENBQVksR0FBWixFQUFpQixRQUE5RDtBQUNIO0FBQ0osS0FwQzRHO0FBc0M3RyxVQXRDNkcsbUJBc0NyRyxRQXRDcUcsRUFzQzFGO0FBQUE7O0FBQ2YsZUFBTyxLQUFLLElBQUwsQ0FBVyxRQUFYLEVBQ04sSUFETSxDQUNBLFlBQU07QUFDVCxtQkFBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixNQUFuQjtBQUNBLG1CQUFLLElBQUwsQ0FBVSxTQUFWO0FBQ0EsbUJBQU8sUUFBUSxPQUFSLEVBQVA7QUFDSCxTQUxNLENBQVA7QUFNSCxLQTdDNEc7OztBQStDN0csWUFBUSxFQS9DcUc7O0FBaUQ3Ryx3QkFBb0I7QUFBQSxlQUFPLEVBQVA7QUFBQSxLQWpEeUY7O0FBbUQ3RyxlQW5ENkcseUJBbUQvRjtBQUFBOztBQUNWLGVBQU8sTUFBUCxDQUFlLFFBQVEsU0FBUixDQUFmLEVBQW1DLEVBQUUsT0FBTyxFQUFFLE9BQU8sa0JBQVQsRUFBVCxFQUFuQyxFQUE4RSxXQUE5RSxHQUE0RixJQUE1RixDQUFrRyxVQUFsRyxFQUE4RztBQUFBLG1CQUFNLE9BQUssT0FBTCxFQUFOO0FBQUEsU0FBOUc7O0FBRUEsZUFBTyxJQUFQO0FBQ0gsS0F2RDRHO0FBeUQ3RyxnQkF6RDZHLDBCQXlEOUY7QUFBQTs7QUFDVCxhQUFLLFlBQUwsSUFBdUIsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLE9BQWQsRUFBdUIsSUFBdkIsQ0FBNkI7QUFBQSxtQkFBUSxTQUFTLE9BQUssWUFBdEI7QUFBQSxTQUE3QixNQUFzRSxXQUEvRixHQUFpSCxLQUFqSCxHQUF5SCxJQUF6SDtBQUNILEtBM0Q0RztBQTZEN0csUUE3RDZHLGdCQTZEdkcsUUE3RHVHLEVBNkQ1RjtBQUFBOztBQUNiLGVBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWDtBQUFBLG1CQUF1QixPQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLElBQW5CLENBQXlCLFlBQVksRUFBckMsRUFBeUMsT0FBekMsQ0FBdkI7QUFBQSxTQUFiLENBQVA7QUFDSCxLQS9ENEc7QUFpRTdHLFlBakU2RyxzQkFpRWxHO0FBQUUsZUFBTyxLQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLFNBQXZCLE1BQXNDLE1BQTdDO0FBQXFELEtBakUyQztBQW1FN0csV0FuRTZHLHFCQW1Fbkc7QUFDTixhQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLE1BQW5CLENBQTJCLEtBQUssSUFBaEM7O0FBRUEsYUFBUSxLQUFLLGFBQUwsRUFBRixHQUEyQixRQUEzQixHQUFzQyxjQUE1QztBQUNILEtBdkU0RztBQXlFN0csZ0JBekU2RywwQkF5RTlGO0FBQ1gsY0FBTSxvQkFBTjtBQUNBLGVBQU8sSUFBUDtBQUNILEtBNUU0RztBQThFN0csY0E5RTZHLHdCQThFaEc7QUFBRSxlQUFPLElBQVA7QUFBYSxLQTlFaUY7QUFnRjdHLFVBaEY2RyxvQkFnRnBHO0FBQ0wsWUFBSSxDQUFDLEtBQUssU0FBVixFQUFzQjtBQUFFLG9CQUFRLEdBQVIsQ0FBYSxJQUFiO0FBQXFCO0FBQzdDLGFBQUssYUFBTCxDQUFvQixFQUFFLFVBQVUsS0FBSyxRQUFMLENBQWUsS0FBSyxrQkFBTCxFQUFmLENBQVosRUFBd0QsV0FBVyxLQUFLLFNBQXhFLEVBQXBCOztBQUVBLFlBQUksS0FBSyxJQUFULEVBQWdCLEtBQUssSUFBTDs7QUFFaEIsZUFBTyxLQUFLLGNBQUwsR0FDSyxVQURMLEVBQVA7QUFFSCxLQXhGNEc7QUEwRjdHLGtCQTFGNkcsNEJBMEY1RjtBQUFBOztBQUNiLGVBQU8sSUFBUCxDQUFhLEtBQUssS0FBTCxJQUFjLEVBQTNCLEVBQWlDLE9BQWpDLENBQTBDLGVBQU87QUFDN0MsZ0JBQUksT0FBSyxLQUFMLENBQVksR0FBWixFQUFrQixFQUF0QixFQUEyQjtBQUN2Qix1QkFBSyxLQUFMLENBQVksR0FBWixJQUFvQixPQUFLLE9BQUwsQ0FBYSxNQUFiLENBQXFCLEdBQXJCLEVBQTBCLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLE9BQUssS0FBTCxDQUFZLEdBQVosRUFBa0IsRUFBekIsRUFBNkIsUUFBUSxRQUFyQyxFQUFULEVBQWIsRUFBMUIsQ0FBcEI7QUFDQSx1QkFBSyxLQUFMLENBQVksR0FBWixFQUFrQixFQUFsQixDQUFxQixNQUFyQjtBQUNBLHVCQUFLLEtBQUwsQ0FBWSxHQUFaLEVBQWtCLEVBQWxCLEdBQXVCLFNBQXZCO0FBQ0g7QUFDSixTQU5EOztBQVFBLGVBQU8sSUFBUDtBQUNILEtBcEc0RztBQXNHN0csUUF0RzZHLGdCQXNHdkcsUUF0R3VHLEVBc0c1RjtBQUFBOztBQUNiLGVBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWDtBQUFBLG1CQUF1QixPQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLElBQW5CLENBQXlCLFlBQVksRUFBckMsRUFBeUMsWUFBTTtBQUFFLG9CQUFJLE9BQUssSUFBVCxFQUFnQixPQUFLLElBQUwsR0FBYTtBQUFXLGFBQXpGLENBQXZCO0FBQUEsU0FBYixDQUFQO0FBQ0gsS0F4RzRHO0FBMEc3RyxXQTFHNkcsbUJBMEdwRyxFQTFHb0csRUEwRy9GO0FBQ1YsWUFBSSxNQUFNLEdBQUcsSUFBSCxDQUFTLEtBQUssS0FBTCxDQUFXLElBQXBCLEtBQThCLFdBQXhDOztBQUVBLGFBQUssR0FBTCxDQUFVLEdBQVYsSUFBa0IsS0FBSyxHQUFMLENBQVUsR0FBVixJQUFrQixLQUFLLEdBQUwsQ0FBVSxHQUFWLEVBQWdCLEdBQWhCLENBQXFCLEVBQXJCLENBQWxCLEdBQThDLEVBQWhFOztBQUVBLFdBQUcsVUFBSCxDQUFjLEtBQUssS0FBTCxDQUFXLElBQXpCOztBQUVBLFlBQUksS0FBSyxNQUFMLENBQWEsR0FBYixDQUFKLEVBQXlCLEtBQUssY0FBTCxDQUFxQixHQUFyQixFQUEwQixFQUExQjtBQUM1QixLQWxINEc7QUFvSDdHLGlCQXBINkcseUJBb0g5RixPQXBIOEYsRUFvSHBGO0FBQUE7O0FBRXJCLFlBQUksUUFBUSxLQUFLLENBQUwsQ0FBUSxRQUFRLFFBQWhCLENBQVo7QUFBQSxZQUNJLGlCQUFlLEtBQUssS0FBTCxDQUFXLElBQTFCLE1BREo7QUFBQSxZQUVJLHFCQUFtQixLQUFLLEtBQUwsQ0FBVyxJQUE5QixNQUZKOztBQUlBLGNBQU0sSUFBTixDQUFZLFVBQUUsQ0FBRixFQUFLLEVBQUwsRUFBYTtBQUNyQixnQkFBSSxNQUFNLFFBQUssQ0FBTCxDQUFPLEVBQVAsQ0FBVjtBQUNBLGdCQUFJLElBQUksRUFBSixDQUFRLFFBQVIsS0FBc0IsTUFBTSxDQUFoQyxFQUFvQyxRQUFLLE9BQUwsQ0FBYyxHQUFkO0FBQ3ZDLFNBSEQ7O0FBS0EsY0FBTSxHQUFOLEdBQVksT0FBWixDQUFxQixVQUFFLEVBQUYsRUFBVTtBQUMzQixvQkFBSyxDQUFMLENBQVEsRUFBUixFQUFhLElBQWIsQ0FBbUIsUUFBbkIsRUFBOEIsSUFBOUIsQ0FBb0MsVUFBRSxTQUFGLEVBQWEsYUFBYjtBQUFBLHVCQUFnQyxRQUFLLE9BQUwsQ0FBYyxRQUFLLENBQUwsQ0FBTyxhQUFQLENBQWQsQ0FBaEM7QUFBQSxhQUFwQztBQUNBLG9CQUFLLENBQUwsQ0FBUSxFQUFSLEVBQWEsSUFBYixDQUFtQixZQUFuQixFQUFrQyxJQUFsQyxDQUF3QyxVQUFFLFNBQUYsRUFBYSxNQUFiLEVBQXlCO0FBQzdELG9CQUFJLE1BQU0sUUFBSyxDQUFMLENBQU8sTUFBUCxDQUFWO0FBQ0Esd0JBQUssS0FBTCxDQUFZLElBQUksSUFBSixDQUFTLFFBQUssS0FBTCxDQUFXLElBQXBCLENBQVosRUFBd0MsRUFBeEMsR0FBNkMsR0FBN0M7QUFDSCxhQUhEO0FBSUgsU0FORDs7QUFRQSxnQkFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXVCLFFBQVEsU0FBUixDQUFrQixNQUFsQixJQUE0QixRQUFuRCxFQUErRCxLQUEvRDs7QUFFQSxlQUFPLElBQVA7QUFDSCxLQTFJNEc7QUE0STdHLGVBNUk2Ryx1QkE0SWhHLEtBNUlnRyxFQTRJekYsRUE1SXlGLEVBNElwRjs7QUFFckIsWUFBSSxXQUFXLEdBQUcsTUFBSCxFQUFmO0FBQUEsWUFDSSxXQUFXLEdBQUcsV0FBSCxDQUFnQixJQUFoQixDQURmO0FBQUEsWUFFSSxVQUFVLEdBQUcsVUFBSCxDQUFlLElBQWYsQ0FGZDs7QUFJQSxZQUFNLE1BQU0sS0FBTixHQUFjLFNBQVMsSUFBekIsSUFDRSxNQUFNLEtBQU4sR0FBZ0IsU0FBUyxJQUFULEdBQWdCLE9BRGxDLElBRUUsTUFBTSxLQUFOLEdBQWMsU0FBUyxHQUZ6QixJQUdFLE1BQU0sS0FBTixHQUFnQixTQUFTLEdBQVQsR0FBZSxRQUhyQyxFQUdvRDs7QUFFaEQsbUJBQU8sS0FBUDtBQUNIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBM0o0Rzs7O0FBNko3RyxtQkFBZTtBQTdKOEYsQ0FBaEcsQ0FBakI7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBQyxDQUFEO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBQyxDQUFEO0FBQUEsOERBRStCLEVBQUUsS0FGakM7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBQyxDQUFELEVBQU87QUFDcEIsUUFBSSw4Q0FFRCxFQUFFLE1BQUYsQ0FBUyxHQUFULENBQWM7QUFBQSw0Q0FDWSxNQUFNLFVBQVIsb0JBRFYscUJBRVQsTUFBTSxLQUFSLHVDQUFxRCxNQUFNLElBQTNELFVBQXNFLE1BQU0sS0FBNUUsa0JBRlcsb0JBR1IsTUFBTSxNQUFSLHFCQUhVLG1CQUcwQyxNQUFNLElBSGhELGlCQUdrRSxNQUFNLEtBSHhFLHdCQUlMLE1BQU0sSUFKRCxjQUlnQixNQUFNLElBSnRCLFdBSW1DLE1BQU0sV0FBUixxQkFBeUMsTUFBTSxXQUEvQyxXQUpqQyx5QkFLTCxNQUFNLE1BQVAsR0FBaUIsTUFBTSxPQUFOLENBQWMsR0FBZCxDQUFtQjtBQUFBLGdDQUN2QixNQUR1QjtBQUFBLFNBQW5CLEVBQ2lCLElBRGpCLENBQ3NCLEVBRHRCLGVBQWpCLEtBTE07QUFBQSxLQUFkLEVBT08sSUFQUCxDQU9ZLEVBUFosQ0FGQyxnQkFBSjtBQVlBLFdBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixFQUFzQixJQUF0QixDQUFQO0FBQ0EsV0FBTyxJQUFQO0FBQ0gsQ0FmRDs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBQyxDQUFEO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBRSxDQUFGO0FBQUE7QUFBQSxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsZUFBTztBQUFFLFVBQVEsR0FBUixDQUFhLElBQUksS0FBSixJQUFhLEdBQTFCO0FBQWlDLENBQTNEOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjs7QUFFYixXQUFPLFFBQVEsV0FBUixDQUZNOztBQUliLFlBQVEsUUFBUSxRQUFSLENBSks7O0FBTWIsT0FBRyxXQUFFLEdBQUYsRUFBTyxJQUFQLEVBQWEsT0FBYjtBQUFBLGVBQ0MsSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWDtBQUFBLG1CQUF1QixRQUFRLEtBQVIsQ0FBZSxHQUFmLEVBQW9CLE9BQXBCLEVBQTZCLEtBQUssTUFBTCxDQUFhLFVBQUUsQ0FBRjtBQUFBLGtEQUFRLElBQVI7QUFBUSx3QkFBUjtBQUFBOztBQUFBLHVCQUFrQixJQUFJLE9BQU8sQ0FBUCxDQUFKLEdBQWdCLFFBQVEsSUFBUixDQUFsQztBQUFBLGFBQWIsQ0FBN0IsQ0FBdkI7QUFBQSxTQUFiLENBREQ7QUFBQSxLQU5VOztBQVNiLGVBVGEseUJBU0M7QUFBRSxlQUFPLElBQVA7QUFBYTtBQVRoQixDQUFqQjs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdGFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9hZG1pbicpLFxuXHRjb250YWN0OiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9jb250YWN0JyksXG5cdGRlbW86IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2RlbW8nKSxcblx0ZmllbGRFcnJvcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZmllbGRFcnJvcicpLFxuXHRmb3JtOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9mb3JtJyksXG5cdGhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvaGVhZGVyJyksXG5cdGhvbWU6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2hvbWUnKSxcblx0aW52YWxpZExvZ2luRXJyb3I6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yJyksXG5cdGxpc3Q6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2xpc3QnKSxcblx0bG9naW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2xvZ2luJyksXG5cdHJlZ2lzdGVyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9yZWdpc3RlcicpLFxuXHRzZXJ2aWNlczogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvc2VydmljZXMnKSxcblx0c2lkZWJhcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvc2lkZWJhcicpLFxuXHRzdGFmZjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvc3RhZmYnKVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvQWRtaW4nKSxcblx0Q29udGFjdDogcmVxdWlyZSgnLi92aWV3cy9Db250YWN0JyksXG5cdERlbW86IHJlcXVpcmUoJy4vdmlld3MvRGVtbycpLFxuXHRGb3JtOiByZXF1aXJlKCcuL3ZpZXdzL0Zvcm0nKSxcblx0SGVhZGVyOiByZXF1aXJlKCcuL3ZpZXdzL0hlYWRlcicpLFxuXHRIb21lOiByZXF1aXJlKCcuL3ZpZXdzL0hvbWUnKSxcblx0TGlzdDogcmVxdWlyZSgnLi92aWV3cy9MaXN0JyksXG5cdExvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL0xvZ2luJyksXG5cdE15VmlldzogcmVxdWlyZSgnLi92aWV3cy9NeVZpZXcnKSxcblx0UmVnaXN0ZXI6IHJlcXVpcmUoJy4vdmlld3MvUmVnaXN0ZXInKSxcblx0U2VydmljZXM6IHJlcXVpcmUoJy4vdmlld3MvU2VydmljZXMnKSxcblx0U2lkZWJhcjogcmVxdWlyZSgnLi92aWV3cy9TaWRlYmFyJyksXG5cdFN0YWZmOiByZXF1aXJlKCcuL3ZpZXdzL1N0YWZmJylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIGNyZWF0ZSggbmFtZSwgb3B0cyApIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLlZpZXdzWyBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKSBdLFxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbiggeyB0ZW1wbGF0ZTogeyB2YWx1ZTogdGhpcy5UZW1wbGF0ZXNbIG5hbWUgXSB9LCB1c2VyOiB7IHZhbHVlOiB0aGlzLlVzZXIgfSwgZmFjdG9yeTogeyB2YWx1ZTogdGhpcyB9IH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICB9LFxuXG59LCB7XG4gICAgVGVtcGxhdGVzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVGVtcGxhdGVNYXAnKSB9LFxuICAgIFVzZXI6IHsgdmFsdWU6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyApIH0sXG4gICAgVmlld3M6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5WaWV3TWFwJykgfVxufSApXG4iLCJyZXF1aXJlKCdqcXVlcnknKSggKCkgPT4ge1xuICAgIHJlcXVpcmUoJy4vcm91dGVyJylcbiAgICByZXF1aXJlKCdiYWNrYm9uZScpLmhpc3Rvcnkuc3RhcnQoIHsgcHVzaFN0YXRlOiB0cnVlIH0gKVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyAoIHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwuZXh0ZW5kKCB7XG4gICAgZGVmYXVsdHM6IHsgc3RhdGU6IHt9IH0sXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5mZXRjaGVkID0gdGhpcy5mZXRjaCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICB1cmwoKSB7IHJldHVybiBcIi91c2VyXCIgfVxufSApICkoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgKFxuICAgIHJlcXVpcmUoJ2JhY2tib25lJykuUm91dGVyLmV4dGVuZCgge1xuXG4gICAgICAgICQ6IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgICAgICBcbiAgICAgICAgVXNlcjogcmVxdWlyZSgnLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuXG4gICAgICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY29udGVudENvbnRhaW5lciA9IHRoaXMuJCgnI2NvbnRlbnQnKVxuXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywge1xuICAgICAgICAgICAgICAgIHZpZXdzOiB7IH0sXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAncm91dGUnLCByb3V0ZSA9PiB0aGlzLm5hdmlnYXRlKCByb3V0ZSwgeyB0cmlnZ2VyOiB0cnVlIH0gKSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSxcblxuICAgICAgICBnb0hvbWUoKSB7IHRoaXMubmF2aWdhdGUoICdob21lJywgeyB0cmlnZ2VyOiB0cnVlIH0gKSB9LFxuXG4gICAgICAgIGhhbmRsZXIoIHJlc291cmNlICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggIXJlc291cmNlICkgcmV0dXJuIHRoaXMuZ29Ib21lKClcblxuICAgICAgICAgICAgaWYoIHJlc291cmNlID09PSAnaG9tZScgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXIuaGlkZSgpXG4gICAgICAgICAgICB9IGVsc2UgeyBpZiggdGhpcy5oZWFkZXIuaXNIaWRkZW4oKSApIHRoaXMuaGVhZGVyLnNob3coKSB9XG5cbiAgICAgICAgICAgIHRoaXMuVXNlci5mZXRjaGVkLmRvbmUoICgpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyLm9uVXNlcigpXG4gICAgICAgICAgICAgICAgICAgIC5vbiggJ3NpZ25vdXQnLCAoKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy52aWV3cyApLm1hcCggbmFtZSA9PiB0aGlzLnZpZXdzWyBuYW1lIF0uZGVsZXRlKCkgKSApXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbiggdGhpcy5nb0hvbWUoKSApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy52aWV3c1sgdmlldyBdLmhpZGUoKSApIClcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy52aWV3c1sgcmVzb3VyY2UgXSApIHJldHVybiB0aGlzLnZpZXdzWyByZXNvdXJjZSBdLnNob3coKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyByZXNvdXJjZSBdID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCByZXNvdXJjZSwgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgJGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIgfSB9IH0gKVxuICAgICAgICAgICAgICAgICAgICBpZiggcmVzb3VyY2UgPT09ICdob21lJyApIHRoaXMudmlld3NbIHJlc291cmNlIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbiggJ3JvdXRlJywgcm91dGUgPT4gdGhpcy5uYXZpZ2F0ZSggcm91dGUsIHsgdHJpZ2dlcjogdHJ1ZSB9ICkgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gKS5mYWlsKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgIFxuICAgICAgICB9LFxuXG4gICAgICAgIHJvdXRlczogeyAnKCpyZXF1ZXN0KSc6ICdoYW5kbGVyJyB9XG5cbiAgICB9IClcbikoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgLypmaWVsZHM6IFsge1xuICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xuXG4gICAgfSwgeyAgICAgICAgXG4gICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgZXJyb3I6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgfSwge1xuICAgICAgICBuYW1lOiAncGFzc3dvcmQnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICBlcnJvcjogXCJQYXNzd29yZHMgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMgbG9uZy5cIixcbiAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiB2YWwubGVuZ3RoID49IDZcbiAgICB9IF0sXG5cbiAgICBGb3JtOiByZXF1aXJlKCcuL0Zvcm0nKSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuZm9ybUluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Gb3JtLCB7XG4gICAgICAgICAgICBjbGFzczogeyB2YWx1ZTogdGhpcy5jbGFzcyB9LFxuICAgICAgICAgICAgLy9ob3Jpem9udGFsOiB7IHZhbHVlOiB0aGlzLmhvcml6b250YWwgfSxcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSwgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMudGVtcGxhdGVEYXRhLmZvcm0gfSxcbiAgICAgICAgICAgIC8vb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9Ki9cblxufSApIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgVmlld3M6IHtcbiAgICAgICAgbGlzdDogeyB2aWV3OiByZXF1aXJlKCcuL0xpc3QnKSwgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2xpc3QnKSAgfSxcbiAgICAgICAgbG9naW46IHsgdmlldzogcmVxdWlyZSgnLi9Mb2dpbicpLCB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvbG9naW4nKSAgfSxcbiAgICAgICAgcmVnaXN0ZXI6IHsgdmlldzogcmVxdWlyZSgnLi9SZWdpc3RlcicpLCB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvcmVnaXN0ZXInKSAgfSxcbiAgICAgICAgc2lkZWJhcjogeyB2aWV3OiByZXF1aXJlKCcuL1NpZGViYXInKSwgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3NpZGViYXInKSAgfVxuICAgIH0sXG5cbiAgICAvKmZpZWxkczogWyB7XG4gICAgICAgIGNsYXNzOiBcImZvcm0taW5wdXRcIixcbiAgICAgICAgbmFtZTogXCJlbWFpbFwiLFxuICAgICAgICBsYWJlbDogJ0VtYWlsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZW1haWxSZWdleC50ZXN0KHZhbCkgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiZm9ybS1pbnB1dFwiLFxuICAgICAgICBob3Jpem9udGFsOiB0cnVlLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGxhYmVsOiAnUGFzc3dvcmQnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICBlcnJvcjogXCJQYXNzd29yZHMgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMgbG9uZy5cIixcbiAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiB2YWwubGVuZ3RoID49IDZcbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImlucHV0LWJvcmRlcmxlc3NcIixcbiAgICAgICAgbmFtZTogXCJhZGRyZXNzXCIsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiU3RyZWV0IEFkZHJlc3NcIixcbiAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtZmxhdFwiLFxuICAgICAgICBuYW1lOiBcImNpdHlcIixcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJDaXR5XCIsXG4gICAgICAgIGVycm9yOiBcIlJlcXVpcmVkIGZpZWxkLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImlucHV0LWJvcmRlcmxlc3NcIixcbiAgICAgICAgc2VsZWN0OiB0cnVlLFxuICAgICAgICBuYW1lOiBcImZhdmVcIixcbiAgICAgICAgbGFiZWw6IFwiRmF2ZSBDYW4gQWxidW1cIixcbiAgICAgICAgb3B0aW9uczogWyBcIk1vbnN0ZXIgTW92aWVcIiwgXCJTb3VuZHRyYWNrc1wiLCBcIlRhZ28gTWFnb1wiLCBcIkVnZSBCYW15YXNpXCIsIFwiRnV0dXJlIERheXNcIiBdLFxuICAgICAgICBlcnJvcjogXCJQbGVhc2UgY2hvb3NlIGFuIG9wdGlvbi5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLiQudHJpbSh2YWwpICE9PSAnJyB9XG4gICAgfSBdLCovXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIC8vdGhpcy5zaWRlYmFyID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5TaWRlYmFyLCB7IGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy50ZW1wbGF0ZURhdGEuc2lkZWJhciB9IH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgIFxuICAgICAgICAvL3RoaXMubGlzdEluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5MaXN0LCB7IGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMubGlzdCB9IH0gKS5jb25zdHJ1Y3RvcigpXG5cbiAgICAgICAgLyp0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwgeyBcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSwgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmZvcm0gfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKSovXG5cbiAgICAgICAgLyp0aGlzLmxvZ2luRXhhbXBsZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTG9naW4sIHsgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmxvZ2luRXhhbXBsZSB9LFxuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgICovXG4gICAgICAgIFxuICAgICAgICAvKnRoaXMucmVnaXN0ZXJFeGFtcGxlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5SZWdpc3RlciwgeyBcbiAgICAgICAgICAgIGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMucmVnaXN0ZXJFeGFtcGxlIH0sXG4gICAgICAgICAgICBjbGFzczogeyB2YWx1ZTogJ2Zvcm0taW5wdXQnIH0sXG4gICAgICAgICAgICBob3Jpem9udGFsOiB7IHZhbHVlOiB0cnVlIH1cbiAgICAgICAgfSApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9naW5FeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgdGhpcy5sb2dpbkV4YW1wbGUuZWxzLmxvZ2luQnRuLm9mZignY2xpY2snKVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5jYW5jZWxCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgKi9cblxuICAgICAgICAvL3RoaXMuZWxzZS5zdWJtaXRCdG4ub24oICdjbGljaycsICgpID0+IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6ICcnIH0gKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGVtYWlsUmVnZXg6IC9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7MiwzfSkrJC8sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnMoKSB7IFxuICAgICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKCBmaWVsZCA9PiB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGZpZWxkLm5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBmaWVsZC5uYW1lLnNsaWNlKDEpXG4gICAgICAgICAgICBmaWVsZFsgJ2NsYXNzJyBdID0gdGhpcy5jbGFzc1xuICAgICAgICAgICAgaWYoIHRoaXMuaG9yaXpvbnRhbCApIGZpZWxkWyAnaG9yaXpvbnRhbCcgXSA9IHRydWVcbiAgICAgICAgICAgIGZpZWxkWyAoIHRoaXMuY2xhc3MgPT09ICdmb3JtLWlucHV0JyApID8gJ2xhYmVsJyA6ICdwbGFjZWhvbGRlcicgXSA9IG5hbWVcblxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4geyBmaWVsZHM6IHRoaXMuZmllbGRzIH0gfSxcblxuICAgIGdldEZvcm1EYXRhKCkge1xuXG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLmVscywga2V5ID0+IHtcbiAgICAgICAgICAgIGlmKCAvSU5QVVR8VEVYVEFSRUFELy50ZXN0KCB0aGlzLmVsc1sga2V5IF0ucHJvcChcInRhZ05hbWVcIikgKSApIHRoaXMuZm9ybURhdGFbIGtleSBdID0gdGhpcy5lbHNbIGtleSBdLnZhbCgpXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1EYXRhXG4gICAgfSxcblxuICAgIGZpZWxkczogWyBdLFxuXG4gICAgb25Gb3JtRmFpbCggZXJyb3IgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCBlcnJvci5zdGFjayB8fCBlcnJvciApO1xuICAgICAgICAvL3RoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZXMuc2VydmVyRXJyb3IoIGVycm9yICksIGluc2VydGlvbjogeyAkZWw6IHRoaXMuZWxzLmJ1dHRvblJvdywgbWV0aG9kOiAnYmVmb3JlJyB9IH0gKVxuICAgIH0sXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZSgpIHsgfSxcblxuICAgIHBvc3RGb3JtKCBkYXRhICkge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuJC5hamF4KCB7XG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoIGRhdGEudmFsdWVzICkgfHwgSlNPTi5zdHJpbmdpZnkoIHRoaXMuZ2V0Rm9ybURhdGEoKSApLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgdG9rZW46ICggdGhpcy51c2VyICkgPyB0aGlzLnVzZXIuZ2V0KCd0b2tlbicpIDogJycgfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB1cmw6IGAvJHsgZGF0YS5yZXNvdXJjZSB9YFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5maW5kKCdpbnB1dCcpXG4gICAgICAgIC5vbiggJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkZWwgPSBzZWxmLiQodGhpcyksXG4gICAgICAgICAgICAgICAgZmllbGQgPSBzZWxmLl8oIHNlbGYuZmllbGRzICkuZmluZCggZnVuY3Rpb24oIGZpZWxkICkgeyByZXR1cm4gZmllbGQubmFtZSA9PT0gJGVsLmF0dHIoJ2lkJykgfSApXG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiByZXNvbHZlKCBmaWVsZC52YWxpZGF0ZS5jYWxsKCBzZWxmLCAkZWwudmFsKCkgKSApIClcbiAgICAgICAgICAgIC50aGVuKCB2YWxpZCA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIHZhbGlkICkgeyBzZWxmLnNob3dWYWxpZCggJGVsICkgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyBzZWxmLnNob3dFcnJvciggJGVsLCBmaWVsZC5lcnJvciApIH1cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICAgICAgLm9uKCAnZm9jdXMnLCBmdW5jdGlvbigpIHsgc2VsZi5yZW1vdmVFcnJvciggc2VsZi4kKHRoaXMpICkgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXJyb3IoICRlbCApIHtcbiAgICAgICAgJGVsLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdlcnJvciB2YWxpZCcpXG4gICAgICAgICRlbC5zaWJsaW5ncygnLmZlZWRiYWNrJykucmVtb3ZlKClcbiAgICB9LFxuXG4gICAgc2hvd0Vycm9yKCAkZWwsIGVycm9yICkge1xuXG4gICAgICAgIHZhciBmb3JtR3JvdXAgPSAkZWwucGFyZW50KClcblxuICAgICAgICBpZiggZm9ybUdyb3VwLmhhc0NsYXNzKCAnZXJyb3InICkgKSByZXR1cm5cblxuICAgICAgICBmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ3ZhbGlkJykuYWRkQ2xhc3MoJ2Vycm9yJykuYXBwZW5kKCB0aGlzLnRlbXBsYXRlcy5maWVsZEVycm9yKCB7IGVycm9yOiBlcnJvciB9ICkgKVxuICAgIH0sXG5cbiAgICBzaG93VmFsaWQoICRlbCApIHtcbiAgICAgICAgJGVsLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmFkZENsYXNzKCd2YWxpZCcpXG4gICAgICAgICRlbC5zaWJsaW5ncygnLmZlZWRiYWNrJykucmVtb3ZlKClcbiAgICB9LFxuXG4gICAgc3VibWl0Rm9ybSggcmVzb3VyY2UgKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYoIHJlc3VsdCA9PT0gZmFsc2UgKSByZXR1cm5cbiAgICAgICAgICAgIHRoaXMucG9zdEZvcm0oIHJlc291cmNlIClcbiAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLm9uU3VibWlzc2lvblJlc3BvbnNlKCkgKVxuICAgICAgICAgICAgLmNhdGNoKCBlID0+IHRoaXMub25Gb3JtRmFpbCggZSApIClcbiAgICAgICAgfSApICAgIFxuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvZm9ybScpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGZpZWxkRXJyb3I6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2ZpZWxkRXJyb3InKVxuICAgIH0sXG5cbiAgICB2YWxpZGF0ZSgpIHtcbiAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCB0aGlzLmZpZWxkcy5tYXAoIGZpZWxkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZpZWxkLnZhbGlkYXRlLmNhbGwodGhpcywgdGhpcy5lbHNbIGZpZWxkLm5hbWUgXS52YWwoKSApICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiggcmVzdWx0ID09PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dFcnJvciggdGhpcy5lbHNbIGZpZWxkLm5hbWUgXSwgZmllbGQuZXJyb3IgKSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApIClcbiAgICAgICAgLnRoZW4oICgpID0+IHZhbGlkIClcbiAgICAgICAgLmNhdGNoKCBlID0+IHsgY29uc29sZS5sb2coIGUuc3RhY2sgfHwgZSApOyByZXR1cm4gZmFsc2UgfSApXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnbG9nbyc6ICdjbGljaycsXG4gICAgICAgICduYXZMaW5rcyc6IHsgZXZlbnQ6ICdjbGljaycsIHNlbGVjdG9yOiAnbGknIH1cbiAgICAgICAgLy8nc2lnbm91dEJ0bic6IHsgbWV0aG9kOiAnc2lnbm91dCcgfVxuICAgIH0sXG5cbiAgICBvbkxvZ29DbGljaygpIHsgdGhpcy5lbWl0KCAncm91dGUnLCAnaG9tZScgKSB9LFxuXG4gICAgb25OYXZMaW5rc0NsaWNrKCBlICkge1xuICAgICAgICB2YXIgcmVzb3VyY2UgPSB0aGlzLiQoIGUuY3VycmVudFRhcmdldCApLmF0dHIoICdkYXRhLWlkJyApICAgICBcbiAgICAgICAgdGhpcy5lbWl0KCAncm91dGUnLCByZXNvdXJjZSApXG4gICAgfSxcblxuICAgIG9uVXNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIFxuICAgIC8qc2lnbm91dCgpIHtcblxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSAncGF0Y2h3b3Jrand0PTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnO1xuXG4gICAgICAgIHRoaXMudXNlci5jbGVhcigpXG5cbiAgICAgICAgdGhpcy5lbWl0KCdzaWdub3V0JylcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZSggXCIvXCIsIHsgdHJpZ2dlcjogdHJ1ZSB9IClcbiAgICB9Ki9cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2xpbmtzJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICdsaScgfVxuICAgIH0sXG5cbiAgICBvbkxpbmtzQ2xpY2soIGUgKSB7XG4gICAgICAgIHZhciByZXNvdXJjZSA9IHRoaXMuJCggZS5jdXJyZW50VGFyZ2V0ICkuYXR0ciggJ2RhdGEtaWQnICkgICAgICBcbiAgICAgICAgdGhpcy5lbWl0KCAncm91dGUnLCByZXNvdXJjZSApXG4gICAgfSxcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ3JlZ2lzdGVyQnRuJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICcnLCBtZXRob2Q6ICdzaG93UmVnaXN0cmF0aW9uJyB9LFxuICAgICAgICAnbG9naW5CdG4nOiB7IGV2ZW50OiAnY2xpY2snLCBzZWxlY3RvcjogJycsIG1ldGhvZDogJ2xvZ2luJyB9XG4gICAgfSxcblxuICAgIGZpZWxkczogWyB7ICAgICAgICBcbiAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJyxcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVtYWlsUmVnZXgudGVzdCh2YWwpIH1cbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdwYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIGVycm9yOiBcIlBhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLlwiLFxuICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPj0gNlxuICAgIH0gXSxcblxuICAgIEZvcm06IHJlcXVpcmUoJy4vRm9ybScpLFxuXG4gICAgbG9naW4oKSB7IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6IFwiYXV0aFwiIH0gKSB9LFxuXG4gICAgb25TdWJtaXNzaW9uUmVzcG9uc2UoIHJlc3BvbnNlICkge1xuICAgICAgICBpZiggT2JqZWN0LmtleXMoIHJlc3BvbnNlICkubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZXMuaW52YWxpZExvZ2luRXJyb3IsIGluc2VydGlvbjogeyAkZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0gKVxuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJykuc2V0KCByZXNwb25zZSApXG4gICAgICAgIHRoaXMuZW1pdCggXCJsb2dnZWRJblwiIClcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5mb3JtSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkZvcm0sIHtcbiAgICAgICAgICAgIGNsYXNzOiB7IHZhbHVlOiB0aGlzLmNsYXNzIH0sXG4gICAgICAgICAgICAvL2hvcml6b250YWw6IHsgdmFsdWU6IHRoaXMuaG9yaXpvbnRhbCB9LFxuICAgICAgICAgICAgZmllbGRzOiB7IHZhbHVlOiB0aGlzLmZpZWxkcyB9LCBcbiAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuZWxzLmZvcm0gfSB9LFxuICAgICAgICAgICAgb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgUmVnaXN0ZXI6IHJlcXVpcmUoJy4vUmVnaXN0ZXInKSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuXG4gICAgc2hvd1JlZ2lzdHJhdGlvbigpIHsgXG5cbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmZvcm1JbnN0YW5jZSxcbiAgICAgICAgICAgIGVtYWlsID0gZm9ybS5lbHMuZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZCA9IGZvcm0uZWxzLnBhc3N3b3JkXG4gICAgICAgIFxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBlbWFpbCApXG4gICAgICAgIGVtYWlsLnZhbCgnJylcblxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBwYXNzd29yZCApXG4gICAgICAgIHBhc3N3b3JkLnZhbCgnJylcbiAgICAgICAgXG4gICAgICAgIGlmICggZm9ybS5lbHMuaW52YWxpZExvZ2luRXJyb3IgKSBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvci5yZW1vdmUoKVxuICAgICAgICBpZiAoIGZvcm0uZWxzLnNlcnZlckVycm9yICkgZm9ybS5lbHMuc2VydmVyRXJyb3IucmVtb3ZlKClcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+ICggdGhpcy5yZWdpc3Rlckluc3RhbmNlICkgPyB0aGlzLnJlZ2lzdGVySW5zdGFuY2Uuc2hvdygpXG4gICAgICAgICAgICA6IE9iamVjdC5jcmVhdGUoIHRoaXMuUmVnaXN0ZXIsIHtcbiAgICAgICAgICAgICAgICBsb2dpbkluc3RhbmNlOiB7IHZhbHVlOiB0aGlzIH0sXG4gICAgICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9IFxuICAgICAgICAgICAgfSApLmNvbnN0cnVjdG9yKCkgKVxuXG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9sb2dpbicpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpXG4gICAgfVxuXG59IClcbiIsInZhciBNeVZpZXcgPSBmdW5jdGlvbiggZGF0YSApIHsgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIGRhdGEgKS5pbml0aWFsaXplKCkgfVxuXG5PYmplY3QuYXNzaWduKCBNeVZpZXcucHJvdG90eXBlLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBDb2xsZWN0aW9uOiByZXF1aXJlKCdiYWNrYm9uZScpLkNvbGxlY3Rpb24sXG4gICAgXG4gICAgLy9FcnJvcjogcmVxdWlyZSgnLi4vTXlFcnJvcicpLFxuXG4gICAgTW9kZWw6IHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwsXG5cbiAgICBfOiByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cbiAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZTtcblxuICAgICAgICBpZiggISB0aGlzLmV2ZW50c1sga2V5IF0gKSByZXR1cm5cblxuICAgICAgICB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB0aGlzLmV2ZW50c1trZXldICk7XG5cbiAgICAgICAgaWYoIHR5cGUgPT09ICdbb2JqZWN0IE9iamVjdF0nICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSwgZWwgKTtcbiAgICAgICAgfSBlbHNlIGlmKCB0eXBlID09PSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XS5mb3JFYWNoKCBzaW5nbGVFdmVudCA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBzaW5nbGVFdmVudCwgZWwgKSApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhICYmIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lciApIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZFwiKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGZvcm1hdDoge1xuICAgICAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXI6IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbiAgICB9LFxuXG4gICAgZ2V0Rm9ybURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhID0geyB9XG5cbiAgICAgICAgdGhpcy5fLmVhY2goIHRoaXMudGVtcGxhdGVEYXRhLCAoICRlbCwgbmFtZSApID0+IHsgaWYoICRlbC5wcm9wKFwidGFnTmFtZVwiKSA9PT0gXCJJTlBVVFwiICYmICRlbC52YWwoKSApIHRoaXMuZm9ybURhdGFbbmFtZV0gPSAkZWwudmFsKCkgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURhdGFcbiAgICB9LFxuXG4gICAgZ2V0Um91dGVyOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4uL3JvdXRlcicpIH0sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnM6ICgpID0+ICh7fSksXG5cbiAgICAvKmhpZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlEuUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuaGlkZSgpXG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSwqL1xuXG4gICAgaW5pdGlhbGl6ZSgpIHtcblxuICAgICAgICBpZiggISB0aGlzLmNvbnRhaW5lciApIHRoaXMuY29udGFpbmVyID0gdGhpcy4kKCcjY29udGVudCcpXG4gICAgICAgIFxuICAgICAgICB0aGlzLnJvdXRlciA9IHRoaXMuZ2V0Um91dGVyKClcblxuICAgICAgICAvL3RoaXMubW9kYWxWaWV3ID0gcmVxdWlyZSgnLi9tb2RhbCcpXG5cbiAgICAgICAgdGhpcy4kKHdpbmRvdykucmVzaXplKCB0aGlzLl8udGhyb3R0bGUoICgpID0+IHRoaXMuc2l6ZSgpLCA1MDAgKSApXG5cbiAgICAgICAgaWYoIHRoaXMucmVxdWlyZXNMb2dpbiAmJiAhIHRoaXMudXNlci5pZCApIHtcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vTG9naW4nKS5zaG93KCkub25jZSggXCJzdWNjZXNzXCIsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLmhlYWRlci5vblVzZXIoIHRoaXMudXNlciApXG5cbiAgICAgICAgICAgICAgICBpZiggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCAhIHRoaXMuXyggdGhpcy51c2VyLmdldCgncm9sZXMnKSApLmNvbnRhaW5zKCB0aGlzLnJlcXVpcmVzUm9sZSApICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgnWW91IGRvIG5vdCBoYXZlIGFjY2VzcycpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9IGVsc2UgaWYoIHRoaXMudXNlci5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSApIHtcbiAgICAgICAgICAgIGlmKCAoICEgdGhpcy5fKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpICkuY29udGFpbnMoIHRoaXMucmVxdWlyZXNSb2xlICkgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoJ1lvdSBkbyBub3QgaGF2ZSBhY2Nlc3MnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKClcbiAgICB9LFxuXG4gICAgaXNIaWRkZW46IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgfSxcblxuICAgIFxuICAgIG1vbWVudDogcmVxdWlyZSgnbW9tZW50JyksXG5cbiAgICBwb3N0UmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJTdWJ2aWV3cygpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIC8vUTogcmVxdWlyZSgncScpLFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNsdXJwVGVtcGxhdGUoIHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksXG4gICAgICAgICAgICBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmluc2VydGlvbkVsIHx8IHRoaXMuY29udGFpbmVyLCBtZXRob2Q6IHRoaXMuaW5zZXJ0aW9uTWV0aG9kIH0gfSApXG5cbiAgICAgICAgdGhpcy5zaXplKClcblxuICAgICAgICB0aGlzLnBvc3RSZW5kZXIoKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMuc3Vidmlld3MgfHwgWyBdICkuZm9yRWFjaCgga2V5ID0+IFxuICAgICAgICAgICAgdGhpcy5zdWJ2aWV3c1sga2V5IF0uZm9yRWFjaCggc3Vidmlld01ldGEgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXNbIHN1YnZpZXdNZXRhLm5hbWUgXSA9IG5ldyBzdWJ2aWV3TWV0YS52aWV3KCB7IGNvbnRhaW5lcjogdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdIH0gKSB9ICkgKVxuICAgIH0sXG5cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLnNob3coKVxuICAgICAgICB0aGlzLnNpemUoKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2x1cnBFbDogZnVuY3Rpb24oIGVsICkge1xuXG4gICAgICAgIHZhciBrZXkgPSBlbC5hdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdID0gKCB0aGlzLnRlbXBsYXRlRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpIClcbiAgICAgICAgICAgID8gdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdLmFkZCggZWwgKVxuICAgICAgICAgICAgOiBlbDtcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgaWYoIHRoaXMuZXZlbnRzWyBrZXkgXSApIHRoaXMuZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzbHVycFRlbXBsYXRlOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblxuICAgICAgICB2YXIgJGh0bWwgPSB0aGlzLiQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gJ1tkYXRhLWpzXSc7XG5cbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhID09PSB1bmRlZmluZWQgKSB0aGlzLnRlbXBsYXRlRGF0YSA9IHsgfTtcblxuICAgICAgICAkaHRtbC5lYWNoKCAoIGluZGV4LCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSApIHRoaXMuc2x1cnBFbCggJGVsIClcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRodG1sLmdldCgpLmZvckVhY2goICggZWwgKSA9PiB7IHRoaXMuJCggZWwgKS5maW5kKCBzZWxlY3RvciApLmVhY2goICggaSwgZWxUb0JlU2x1cnBlZCApID0+IHRoaXMuc2x1cnBFbCggdGhpcy4kKGVsVG9CZVNsdXJwZWQpICkgKSB9IClcbiAgICAgICBcbiAgICAgICAgaWYoIG9wdGlvbnMgJiYgb3B0aW9ucy5pbnNlcnRpb24gKSBvcHRpb25zLmluc2VydGlvbi4kZWxbICggb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kICkgPyBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgOiAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBcbiAgICBiaW5kRXZlbnQ6IGZ1bmN0aW9uKCBlbGVtZW50S2V5LCBldmVudERhdGEsIGVsICkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSAoIGVsICkgPyBlbCA6IHRoaXMudGVtcGxhdGVEYXRhWyBlbGVtZW50S2V5IF07XG5cbiAgICAgICAgZWxlbWVudHMub24oIGV2ZW50RGF0YS5ldmVudCB8fCAnY2xpY2snLCBldmVudERhdGEuc2VsZWN0b3IsIGV2ZW50RGF0YS5tZXRhLCB0aGlzWyBldmVudERhdGEubWV0aG9kIF0uYmluZCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBpc01vdXNlT25FbDogZnVuY3Rpb24oIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlICk7XG5cbiAgICAgICAgaWYoICggZXZlbnQucGFnZVggPCBlbE9mZnNldC5sZWZ0ICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVggPiAoIGVsT2Zmc2V0LmxlZnQgKyBlbFdpZHRoICkgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA8IGVsT2Zmc2V0LnRvcCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZID4gKCBlbE9mZnNldC50b3AgKyBlbEhlaWdodCApICkgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcbiAgICBcbiAgICBzaXplOiAoKSA9PiB7IHRoaXMgfSxcblxuICAgIHVzZXI6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyksXG5cbiAgICB1dGlsOiByZXF1aXJlKCd1dGlsJylcblxufSApXG5cbm1vZHVsZS5leHBvcnRzID0gTXlWaWV3XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBmb3JtID0gdGhpcy5mb3JtSW5zdGFuY2UsXG4gICAgICAgICAgICBuYW1lID0gZm9ybS5lbHMubmFtZSxcbiAgICAgICAgICAgIGVtYWlsID0gZm9ybS5lbHMuZW1haWxcbiAgICAgICAgXG4gICAgICAgIGZvcm0ucmVtb3ZlRXJyb3IoIG5hbWUgKVxuICAgICAgICBuYW1lLnZhbCgnJylcblxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBlbWFpbCApXG4gICAgICAgIGVtYWlsLnZhbCgnJylcbiAgICAgICAgXG4gICAgICAgIGlmICggZm9ybS5lbHMuaW52YWxpZExvZ2luRXJyb3IgKSBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvci5yZW1vdmUoKVxuICAgICAgICBpZiAoIGZvcm0uZWxzLnNlcnZlckVycm9yICkgZm9ybS5lbHMuc2VydmVyRXJyb3IucmVtb3ZlKClcblxuICAgICAgICB0aGlzLmxvZ2luSW5zdGFuY2VbIFwicmVnaXN0ZXJJbnN0YW5jZVwiIF0gPSB0aGlzXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubG9naW5JbnN0YW5jZS5zaG93KCkgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ3JlZ2lzdGVyQnRuJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICcnLCBtZXRob2Q6ICdyZWdpc3RlcicgfSxcbiAgICAgICAgJ2NhbmNlbEJ0bic6IHsgZXZlbnQ6ICdjbGljaycsIHNlbGVjdG9yOiAnJywgbWV0aG9kOiAnY2FuY2VsJyB9XG4gICAgfSxcblxuICAgIGZpZWxkczogWyB7XG4gICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogJ05hbWUgaXMgYSByZXF1aXJlZCBmaWVsZC4nLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgZXJyb3I6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgfSBdLFxuXG4gICAgRm9ybTogcmVxdWlyZSgnLi9Gb3JtJyksXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZTogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXG4gICAgICAgIGlmICggcmVzcG9uc2Uuc3VjY2VzcyA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5pbnZhbGlkTG9naW5FcnJvciggcmVzcG9uc2UgKSwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuYnV0dG9uUm93LCBtZXRob2Q6ICdiZWZvcmUnIH0gfSApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXIuc2V0KCByZXNwb25zZS5yZXN1bHQubWVtYmVyIClcblxuICAgICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKCBmaWVsZCA9PiB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgnJykgKVxuXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubG9naW5JbnN0YW5jZS5lbWl0KCBcImxvZ2dlZEluXCIgKSApXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwge1xuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6IHRoaXMuY2xhc3MgfSxcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSxcbiAgICAgICAgICAgIGhvcml6b250YWw6IHsgdmFsdWU6IHRoaXMuaG9yaXpvbnRhbCB9LCBcbiAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuZWxzLmZvcm0gfSB9LFxuICAgICAgICAgICAgb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG5cbiAgICByZWdpc3RlcigpIHsgdGhpcy5mb3JtSW5zdGFuY2Uuc3VibWl0Rm9ybSggeyByZXNvdXJjZTogXCJtZW1iZXJcIiB9ICkgfSxcbiAgICBcbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9yZWdpc3RlcicpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9kZW1vJylcblxufSApIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3NpZGViYXInKVxuXG59ICkiLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbn0gKSIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgXzogcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXG4gICAgJDogcmVxdWlyZSgnanF1ZXJ5JyksXG5cbiAgICBDb2xsZWN0aW9uOiByZXF1aXJlKCdiYWNrYm9uZScpLkNvbGxlY3Rpb24sXG4gICAgXG4gICAgTW9kZWw6IHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwsXG5cbiAgICBiaW5kRXZlbnQoIGtleSwgZXZlbnQsIHNlbGVjdG9yICkge1xuICAgICAgICB0aGlzLmVsc1trZXldLm9uKCBldmVudCwgc2VsZWN0b3IsIGUgPT4gdGhpc1sgYG9uJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihrZXkpfSR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoZXZlbnQpfWAgXSggZSApIClcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyOiBzdHJpbmcgPT4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpLFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuJCh3aW5kb3cpLnJlc2l6ZSggdGhpcy5fLnRocm90dGxlKCAoKSA9PiB0aGlzLnNpemUoKSwgNTAwICkgKVxuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgIXRoaXMudXNlci5pZCApIHJldHVybiB0aGlzLmhhbmRsZUxvZ2luKClcblxuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSAmJiAhdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSByZXR1cm4gdGhpcy5zaG93Tm9BY2Nlc3MoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHsgZWxzOiB7IH0sIHNsdXJwOiB7IGF0dHI6ICdkYXRhLWpzJywgdmlldzogJ2RhdGEtdmlldycgfSwgdmlld3M6IHsgfSB9ICkucmVuZGVyKClcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHRoaXMuZXZlbnRzW2tleV1cblxuICAgICAgICBpZiggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHsgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSApIH1cbiAgICAgICAgZWxzZSBpZiggQXJyYXkuaXNBcnJheSggdGhpcy5ldmVudHNba2V5XSApICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbIGtleSBdLmZvckVhY2goIGV2ZW50T2JqID0+IHRoaXMuYmluZEV2ZW50KCBrZXksIGV2ZW50T2JqLmV2ZW50ICkgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XS5ldmVudCwgdGhpcy5ldmVudHNba2V5XS5zZWxlY3RvciApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlKCBkdXJhdGlvbiApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlkZSggZHVyYXRpb24gKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkXCIpXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnM6ICgpID0+ICh7fSksXG5cbiAgICBoYW5kbGVMb2dpbigpIHtcbiAgICAgICAgT2JqZWN0LmNyZWF0ZSggcmVxdWlyZSgnLi9Mb2dpbicpLCB7IGNsYXNzOiB7IHZhbHVlOiAnaW5wdXQtYm9yZGVybGVzcycgfSB9ICkuY29uc3RydWN0b3IoKS5vbmNlKCBcImxvZ2dlZEluXCIsICgpID0+IHRoaXMub25Mb2dpbigpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBoYXNQcml2aWxlZ2UoKSB7XG4gICAgICAgICggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpLmZpbmQoIHJvbGUgPT4gcm9sZSA9PT0gdGhpcy5yZXF1aXJlc1JvbGUgKSA9PT0gXCJ1bmRlZmluZWRcIiApICkgPyBmYWxzZSA6IHRydWVcbiAgICB9LFxuXG4gICAgaGlkZSggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB0aGlzLmVscy5jb250YWluZXIuaGlkZSggZHVyYXRpb24gfHwgMTAsIHJlc29sdmUgKSApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICB0aGlzLnJvdXRlci5oZWFkZXIub25Vc2VyKCB0aGlzLnVzZXIgKVxuXG4gICAgICAgIHRoaXNbICggdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSA/ICdyZW5kZXInIDogJ3Nob3dOb0FjY2VzcycgXSgpXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYoICF0aGlzLmluc2VydGlvbiApIHsgY29uc29sZS5sb2coIHRoaXMgKSB9XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSggdGhpcy5nZXRUZW1wbGF0ZU9wdGlvbnMoKSApLCBpbnNlcnRpb246IHRoaXMuaW5zZXJ0aW9uIH0gKVxuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgICAgICAgICAgICAucG9zdFJlbmRlcigpXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5WaWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIHRoaXMuVmlld3NbIGtleSBdLmVsICkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGtleSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSgga2V5LCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuVmlld3NbIGtleSBdLmVsLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gdGhpcy5lbHMuY29udGFpbmVyLnNob3coIGR1cmF0aW9uIHx8IDEwLCAoKSA9PiB7IGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKTsgcmVzb2x2ZSgpIH0gKSApXG4gICAgfSxcblxuICAgIHNsdXJwRWwoIGVsICkge1xuICAgICAgICB2YXIga2V5ID0gZWwuYXR0ciggdGhpcy5zbHVycC5hdHRyICkgfHwgJ2NvbnRhaW5lcidcblxuICAgICAgICB0aGlzLmVsc1sga2V5IF0gPSB0aGlzLmVsc1sga2V5IF0gPyB0aGlzLmVsc1sga2V5IF0uYWRkKCBlbCApIDogZWxcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG5cbiAgICAgICAgdmFyICRodG1sID0gdGhpcy4kKCBvcHRpb25zLnRlbXBsYXRlICksXG4gICAgICAgICAgICBzZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLmF0dHJ9XWAsXG4gICAgICAgICAgICB2aWV3U2VsZWN0b3IgPSBgWyR7dGhpcy5zbHVycC52aWV3fV1gXG5cbiAgICAgICAgJGh0bWwuZWFjaCggKCBpLCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSB8fCBpID09PSAwICkgdGhpcy5zbHVycEVsKCAkZWwgKVxuICAgICAgICB9IClcblxuICAgICAgICAkaHRtbC5nZXQoKS5mb3JFYWNoKCAoIGVsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kKCBlbCApLmZpbmQoIHNlbGVjdG9yICkuZWFjaCggKCB1bmRlZmluZWQsIGVsVG9CZVNsdXJwZWQgKSA9PiB0aGlzLnNsdXJwRWwoIHRoaXMuJChlbFRvQmVTbHVycGVkKSApIClcbiAgICAgICAgICAgIHRoaXMuJCggZWwgKS5maW5kKCB2aWV3U2VsZWN0b3IgKS5lYWNoKCAoIHVuZGVmaW5lZCwgdmlld0VsICkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQodmlld0VsKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbICRlbC5hdHRyKHRoaXMuc2x1cnAudmlldykgXS5lbCA9ICRlbFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgICAgIFxuICAgICAgICBvcHRpb25zLmluc2VydGlvbi4kZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaXNNb3VzZU9uRWwoIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlIClcblxuICAgICAgICBpZiggKCBldmVudC5wYWdlWCA8IGVsT2Zmc2V0LmxlZnQgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWCA+ICggZWxPZmZzZXQubGVmdCArIGVsV2lkdGggKSApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZIDwgZWxPZmZzZXQudG9wICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPiAoIGVsT2Zmc2V0LnRvcCArIGVsSGVpZ2h0ICkgKSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2Vcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGBBZG1pbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuICAgIDxkaXYgZGF0YS1qcz1cImNvbnRhaW5lclwiIGNsYXNzPVwiY29udGFjdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZmQtaW5mb1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImluZm8tYm94XCI+XG4gICAgICAgICAgICAgICAgPGgyPkludGVyZXN0ZWQ/PC9oMj5cbiAgICAgICAgICAgICAgICA8cD5GZWVsIGZyZWUgdG8gY29udGFjdCB1cyB3aXRoIGFueSBwcm9qZWN0IGlkZWFzIG9yIHF1ZXN0aW9ucy48L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtZGV0YWlsc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+RW1haWw8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRkPjxhIGhyZWY9XCJ0b3BoZXIuYmFyb25AZ21haWwuY29tXCI+dG9waGVyLmJhcm9uQGdtYWlsLmNvbTwvYT48L2RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGR0PlBob25lPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZD4xMjMtNDU2LTc4OTA8L2RkPlxuICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGRhdGEtanM9XCJjb250YWN0Rm9ybVwiIGNsYXNzPVwiY29udGFjdC1mb3JtXCI+PC9kaXY+XG4gICAgPC9kaXY+YCIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IGBcbjxkaXYgY2xhc3M9XCJkZW1vXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxhc2lkZSBjbGFzcz1cInNpZGViYXJcIj5cbiAgICAgICAgPGRpdiBkYXRhLXZpZXc9XCJzaWRlYmFyXCI+PC9kaXY+XG4gICAgPC9hc2lkZT5cbiAgICA8ZGl2IGNsYXNzPVwiZGVtby1jb250ZW50XCI+XG4gICAgICAgIDxoMj5MaXN0czwvaDI+XG4gICAgICAgIDxwPk9yZ2FuaXplIHlvdXIgY29udGVudCBpbnRvIG5lYXQgZ3JvdXBzIHdpdGggb3VyIGxpc3RzLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cImV4YW1wbGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtdmlld1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwibGlzdFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aDI+Rm9ybXM8L2gyPlxuICAgICAgICA8cD5PdXIgZm9ybXMgYXJlIGN1c3RvbWl6YWJsZSB0byBzdWl0IHRoZSBuZWVkcyBvZiB5b3VyIHByb2plY3QuIEhlcmUsIGZvciBleGFtcGxlLCBhcmUgXG4gICAgICAgIExvZ2luIGFuZCBSZWdpc3RlciBmb3JtcywgZWFjaCB1c2luZyBkaWZmZXJlbnQgaW5wdXQgc3R5bGVzLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cImV4YW1wbGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtdmlld1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwibG9naW5cIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubGluZS12aWV3XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLXZpZXc9XCJyZWdpc3RlclwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChwKSA9PlxuXG5gPHNwYW4gY2xhc3M9XCJmZWVkYmFja1wiIGRhdGEtanM9XCJmaWVsZEVycm9yXCI+JHsgcC5lcnJvciB9PC9zcGFuPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IHtcbiAgICB2YXIgaHRtbCA9IGBcbjxmb3JtIGRhdGEtanM9XCJjb250YWluZXJcIj5cbiAgICAkeyBwLmZpZWxkcy5tYXAoIGZpZWxkID0+XG4gICAgYDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwICR7ICggZmllbGQuaG9yaXpvbnRhbCApID8gYGhvcml6b250YWxgIDogYGAgfVwiPlxuICAgICAgICR7ICggZmllbGQubGFiZWwgKSA/IGA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwiJHsgZmllbGQubmFtZSB9XCI+JHsgZmllbGQubGFiZWwgfTwvbGFiZWw+YCA6IGBgIH1cbiAgICAgICA8JHsgKCBmaWVsZC5zZWxlY3QgKSA/IGBzZWxlY3RgIDogYGlucHV0YCB9IGRhdGEtanM9XCIkeyBmaWVsZC5uYW1lIH1cIiBjbGFzcz1cIiR7IGZpZWxkLmNsYXNzIH1cIlxuICAgICAgIHR5cGU9XCIkeyBmaWVsZC50eXBlIH1cIiBpZD1cIiR7IGZpZWxkLm5hbWUgfVwiICR7ICggZmllbGQucGxhY2Vob2xkZXIgKSA/IGBwbGFjZWhvbGRlcj1cIiR7IGZpZWxkLnBsYWNlaG9sZGVyIH1cImAgOiBgYCB9PlxuICAgICAgICAgICAgJHsgKGZpZWxkLnNlbGVjdCkgPyBmaWVsZC5vcHRpb25zLm1hcCggb3B0aW9uID0+XG4gICAgICAgICAgICAgICAgYDxvcHRpb24+JHsgb3B0aW9uIH08L29wdGlvbj5gICkuam9pbignJykgKyBgPC9zZWxlY3Q+YCA6IGBgIH1cbiAgICA8L2Rpdj5gICkuam9pbignJykgfVxuPC9mb3JtPlxuYCBcbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC8+XFxzKzwvZywnPjwnKVxuICAgIHJldHVybiBodG1sXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGBcbiAgICA8aGVhZGVyIGNsYXNzPVwic2l0ZS1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBkYXRhLWpzPVwibG9nb1wiIGNsYXNzPVwibG9nb1wiPkZ1dHVyZSBEYXlzPC9kaXY+XG4gICAgICAgIDxuYXY+XG4gICAgICAgICAgICA8dWwgZGF0YS1qcz1cIm5hdkxpbmtzXCIgY2xhc3M9XCJuYXYtbGlua3NcIj5cbiAgICAgICAgICAgICAgICA8bGkgZGF0YS1pZD1cInNlcnZpY2VzXCIgZGF0YS1pZD1cInNlcnZpY2VzXCI+U2VydmljZXM8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSBkYXRhLWlkPVwic3RhZmZcIj5TdGFmZjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIGRhdGEtaWQ9XCJkZW1vXCI+RGVtbzwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIGRhdGEtaWQ9XCJjb250YWN0XCI+Q29udGFjdCBVczwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICA8L2hlYWRlcj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGBcbiAgICA8ZGl2IGNsYXNzPVwiaG9tZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibG9nby1ibG9ja1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvZ29cIj5GdXR1cmUgRGF5czwvZGl2PlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJzbG9nYW5cIj5XZWIgc29sdXRpb25zIGZvciBhIGJldHRlciB0b21vcnJvdzwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDx1bCBkYXRhLWpzPVwibGlua3NcIiBjbGFzcz1cImxpbmstYmxvY2tcIj5cbiAgICAgICAgICAgIDxsaSBkYXRhLWlkPVwic2VydmljZXNcIj5TZXJ2aWNlczwvbGk+XG4gICAgICAgICAgICA8bGkgZGF0YS1pZD1cInN0YWZmXCI+U3RhZmY8L2xpPlxuICAgICAgICAgICAgPGxpIGRhdGEtaWQ9XCJkZW1vXCI+RGVtbzwvbGk+XG4gICAgICAgICAgICA8bGkgZGF0YS1pZD1cImNvbnRhY3RcIj5Db250YWN0IFVzPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtYmxvY2tcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwidGV4dFwiPkZ1dHVyZSBEYXlzIGlzIGEgc21hbGwsIHZlcnNhdGlsZSB3ZWIgZGV2ZWxvcG1lbnQgdGVhbSBkZWRpY2F0ZWQgdG8gcHJvZHVjaW5nIHVuaXF1ZSwgXG4gICAgICAgICAgICBmdWxseSBjdXN0b21pemFibGUgd2Vic2l0ZXMgYW5kIGFwcHMuIElmIHlvdSBjYW4gdGhpbmsgaXQsIHdlIGNhbiBtYWtlIGl0LjwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdiBkYXRhLWpzPVwiaW52YWxpZExvZ2luRXJyb3JcIiBjbGFzcz1cImZlZWRiYWNrXCI+SW52YWxpZCBDcmVkZW50aWFsczwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuXG48dWwgY2xhc3M9XCJsaXN0XCI+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+Zm9yPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj50aGU8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPnNha2U8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPm9mPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5mdXR1cmU8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPmRheXM8L2xpPlxuPC91bD5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuPGRpdiBjbGFzcz1cImxvZ2luXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMT5Mb2dpbjwvaDE+XG4gICAgPGRpdiBkYXRhLWpzPVwiZm9ybVwiPjwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImJ1dHRvblJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJyZWdpc3RlckJ0blwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPlJlZ2lzdGVyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImxvZ2luQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+TG9nIEluPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuPGRpdiBjbGFzcz1cInJlZ2lzdGVyXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMT5SZWdpc3RlcjwvaDE+XG4gICAgPGRpdiBkYXRhLWpzPVwiZm9ybVwiPjwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImJ1dHRvblJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwicmVnaXN0ZXJCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5SZWdpc3RlcjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG4gICAgPGRpdiBjbGFzcz1cInNlcnZpY2VzXCI+XG4gICAgICAgIDxoMj5PdXIgU2VydmljZXM8L2gyPlxuICAgICAgICA8cD5XZSBvZmZlciBhIGZ1bGwgcmFuZ2Ugb2Ygc2VydmljZXMsIGluY2x1ZGluZyBidXQgbm90IGxpbWl0ZWQgdG86XG4gICAgICAgIDx1bCBjbGFzcz1cInNlcnZpY2VzLWxpc3RcIj5cbiAgICAgICAgICAgIDxsaT5XZWJzaXRlIGFuZCB3ZWIgYXBwIGRldmVsb3BtZW50PC9saT5cbiAgICAgICAgICAgIDxsaT5DdXN0b20gc29mdHdhcmU8L2xpPlxuICAgICAgICAgICAgPGxpPkhvc3Rpbmc8L2xpPlxuICAgICAgICAgICAgPGxpPkRpZ2l0YWwgU3RyYXRlZ3k8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgICA8aDI+V2h5IENob29zZSBVcz88L2gyPlxuICAgICAgICA8cD5BcyB0aGUgdGVjaCBpbmR1c3RyeSBoYXMgZXhwbG9kZWQsIHRoZSBtYXJrZXQgaGFzIGJlZW4gZ2x1dHRlZCB3aXRoIGNvdW50bGVzcyBkZXZlbG9wZXJzIHdobyBwb3NzZXNzIGxpdHRsZSBleHBlcmllbmNlXG4gICAgICAgIGFuZCBhIHZlcnkgbmFycm93IHNldCBvZiBza2lsbHMsIGdlbmVyYWxseSBsaW1pdGVkIHRvIHRoZSBjYXBhYmlsaXRpZXMgb2YgdGhlaXIgY2hvc2VuIHBsYXRmb3JtLiBNb3N0IFdvcmRQcmVzcyBkZXZlbG9wZXJzLFxuICAgICAgICBmb3IgZXhhbXBsZSwgY2FuIHRocm93IHRvZ2V0aGVyIGEgdGhlbWUgYW5kIHNvbWUgcGx1Z2lucywgYnV0IGlmIHlvdSBhc2sgdGhlbSB0byBpbXBsZW1lbnQgY3VzdG9tIGZ1bmN0aW9uYWxpdHkgZm9yIHlvdXIgc2l0ZSxcbiAgICAgICAgdGhleSB3aWxsIGxpa2VseSBiZSBhdCBhIGxvc3MuIEF0IEZ1dHVyZSBEYXlzLCB3ZSB1bmRlcnN0YW5kIGhvdyB0aGUgd2ViIGFuZCBhcHBsaWNhdGlvbnMgd29yayBhdCB0aGVpciBkZWVwZXN0XG4gICAgICAgIGxldmVscy4gV2UgaGF2ZSBidWlsdCBvdXIgb3duIGZyYW1ld29yayBmcm9tIHRoZSBncm91bmQgdXAsIHdoaWNoIHdlIGNvbnRpbnVhbGx5IHJlZmluZSBhbmQgb3B0aW1pemUuIEFybWVkIHdpdGhcbiAgICAgICAgdGhpcyBsb3cgbGV2ZWwga25vd2xlZGdlLCB3ZSBwb3NzZXNzIHRoZSBjYXBhYmlsaXR5IHRvIGNyZWF0ZSBqdXN0IGFib3V0IGFueSBmZWF0dXJlIHlvdSBjYW4gaW1hZ2luZS4gQ3VzdG9taXphdGlvblxuICAgICAgICBpcyBrZXkuIEFzIHRoZSB3ZWIgYmVjb21lcyBldmVyIG1vcmUgc3RyZWFtbGluZWQgYW5kIGNvb2tpZSBjdXR0ZXIsIHdlIGNhbiBoZWxwIHlvdSBzdGFuZCBvdXQgZnJvbSB0aGUgcGFjay48L3A+XG5cbiAgICAgICAgPHA+VmVyc2F0aWxpdHkgaXMgbm90IG91ciBvbmx5IGFkdmFudGFnZSwgaG93ZXZlci4gQXMgYSBzbWFsbCB0ZWFtIHdpdGggbGltaXRlZCBvdmVyaGVhZCwgd2UgY2FuIGRvIHRoZSBzYW1lIHdvcmtcbiAgICAgICAgYXMgbGFyZ2VyIGRldmVsb3BtZW50IGZpcm1zIGZvciBsZXNzIG1vbmV5LiBBbmQgd2Ugb25seSBjaGFyZ2UgZm9yIG5ldyB3b3JrOiAgbm8gbWFpbnRlbmFuY2UgZmVlcywgYW5kIGlmIGEgYnVnIGNvbWVzIHVwLCB3ZSBmaXhcbiAgICAgICAgaXQgd2l0aG91dCBjaGFyZ2UsIG5vIHF1ZXN0aW9ucyBhc2tlZC4gV2UgdGFrZSBmdWxsIHJlc3BvbnNpYmlsaXR5IGZvciB0aGUgcXVhbGl0eSBvZiBvdXIgd29yay48L3A+XG4gICAgPC9kaXY+YCIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IGBcbiAgICA8bmF2PlxuICAgICAgICA8dWwgY2xhc3M9XCJzaWRlYmFyLWxpbmtzXCI+XG4gICAgICAgICAgICA8bGk+TGlzdHM8L2xpPlxuICAgICAgICAgICAgPGxpPkZvcm1zPC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgPC91bD5cbiAgICA8L25hdj5cbmAiLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGBcbiAgICA8ZGl2IGNsYXNzPVwic3RhZmZcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN0YWZmLWJsb2NrXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwic3RhZmYtcGhvdG9cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiaW9cIj5cbiAgICAgICAgICAgICAgICA8aDI+Q2hyaXMgQmFyb248L2gyPlxuICAgICAgICAgICAgICAgIDxwPnRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IHRleHQgdGV4dCB0ZXh0IDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN0YWZmLWJsb2NrXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwic3RhZmYtcGhvdG9cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiaW9cIj5cbiAgICAgICAgICAgICAgICA8aDI+U2NvdHQgUGFydG9uPC9oMj5cbiAgICAgICAgICAgICAgICA8cD48L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+YCIsIm1vZHVsZS5leHBvcnRzID0gZXJyID0+IHsgY29uc29sZS5sb2coIGVyci5zdGFjayB8fCBlcnIgKSB9XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIEVycm9yOiByZXF1aXJlKCcuL015RXJyb3InKSxcblxuICAgIE1vbWVudDogcmVxdWlyZSgnbW9tZW50JyksXG5cbiAgICBQOiAoIGZ1biwgYXJncywgdGhpc0FyZyApID0+XG4gICAgICAgIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IFJlZmxlY3QuYXBwbHkoIGZ1biwgdGhpc0FyZywgYXJncy5jb25jYXQoICggZSwgLi4uYXJncyApID0+IGUgPyByZWplY3QoZSkgOiByZXNvbHZlKGFyZ3MpICkgKSApLFxuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkgeyByZXR1cm4gdGhpcyB9XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiJdfQ==
