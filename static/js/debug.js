(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
	admin: require('./views/templates/admin'),
	demo: require('./views/templates/demo'),
	fieldError: require('./views/templates/fieldError'),
	form: require('./views/templates/form'),
	header: require('./views/templates/header'),
	home: require('./views/templates/home'),
	invalidLoginError: require('./views/templates/invalidLoginError'),
	list: require('./views/templates/list'),
	login: require('./views/templates/login'),
	register: require('./views/templates/register')
};

},{"./views/templates/admin":17,"./views/templates/demo":18,"./views/templates/fieldError":19,"./views/templates/form":20,"./views/templates/header":21,"./views/templates/home":22,"./views/templates/invalidLoginError":23,"./views/templates/list":24,"./views/templates/login":25,"./views/templates/register":26}],2:[function(require,module,exports){
'use strict';

module.exports = {
	Admin: require('./views/Admin'),
	Demo: require('./views/Demo'),
	Form: require('./views/Form'),
	Header: require('./views/Header'),
	Home: require('./views/Home'),
	List: require('./views/List'),
	Login: require('./views/Login'),
	MyView: require('./views/MyView'),
	Register: require('./views/Register')
};

},{"./views/Admin":7,"./views/Demo":8,"./views/Form":9,"./views/Header":10,"./views/Home":11,"./views/List":12,"./views/Login":13,"./views/MyView":14,"./views/Register":15}],3:[function(require,module,exports){
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

        this.contentContainer = this.$('#content');

        return Object.assign(this, {
            views: {},
            header: this.ViewFactory.create('header', { insertion: { value: { $el: this.contentContainer, method: 'before' } } })
        });
    },
    goHome: function goHome() {
        this.navigate('home', { trigger: true });
    },
    handler: function handler(resource) {
        var _this = this;

        if (!resource) return this.goHome();

        this.User.fetched.done(function () {

            _this.header.onUser().on('signout', function () {
                return Promise.all(Object.keys(_this.views).map(function (name) {
                    return _this.views[name].delete();
                })).then(_this.goHome());
            });

            Promise.all(Object.keys(_this.views).map(function (view) {
                return _this.views[view].hide();
            })).then(function () {
                if (_this.views[resource]) return _this.views[resource].show();
                _this.views[resource] = _this.ViewFactory.create(resource, { insertion: { value: { $el: _this.contentContainer } } }).on('route', function (route) {
                    return _this.navigate(route, { trigger: true });
                });
            }).catch(_this.Error);
        }).fail(this.Error);
    },


    routes: { '(*request)': 'handler' }

}))();

},{"../../lib/MyError":27,"./factory/View":3,"./models/User":5,"backbone":"backbone","jquery":"jquery"}],7:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    requiresLogin: true
});

},{"./__proto__":16}],8:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    Views: {
        list: { view: require('./List'), template: require('./templates/list') },
        login: { view: require('./Login'), template: require('./templates/login') },
        register: { view: require('./Register'), template: require('./templates/register') }
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

    Form: require('./Form'),
    List: require('./List'),
    Login: require('./Login'),
    Register: require('./Register'),

    postRender: function postRender() {

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
    },


    template: require('./templates/demo')

});

},{"./Form":9,"./List":12,"./Login":13,"./Register":15,"./__proto__":16,"./templates/demo":18,"./templates/list":24,"./templates/login":25,"./templates/register":26}],9:[function(require,module,exports){
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

},{"./__proto__":16,"./templates/fieldError":19,"./templates/form":20}],10:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        signoutBtn: { method: 'signout' }
    },

    onUser: function onUser() {
        return this;
    },
    signout: function signout() {

        document.cookie = 'patchworkjwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        this.user.clear();

        this.emit('signout');

        this.router.navigate("/", { trigger: true });
    }
});

},{"./__proto__":16}],11:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":16}],12:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    template: require('./templates/list')
});

},{"./__proto__":16,"./templates/list":24}],13:[function(require,module,exports){
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
                class: { value: 'input-flat' }
            }).constructor();
        });
    },


    template: require('./templates/login'),

    templates: {
        invalidLoginError: require('./templates/invalidLoginError')
    }

});

},{"../models/User":5,"./Form":9,"./Register":15,"./__proto__":16,"./templates/invalidLoginError":23,"./templates/login":25}],14:[function(require,module,exports){
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

},{"../models/User":5,"../router":6,"./Login":13,"backbone":"backbone","events":29,"jquery":"jquery","moment":"moment","underscore":"underscore","util":33}],15:[function(require,module,exports){
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

},{"./Form":9,"./__proto__":16,"./templates/invalidLoginError":23,"./templates/register":26}],16:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = Object.assign({}, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    _: require('underscore'),

    $: require('jquery'),

    Collection: require('backbone').Collection,

    Model: require('backbone').Model,

    bindEvent: function bindEvent(key, event) {
        var _this = this;

        var selector = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

        this.els[key].on('click', selector, function (e) {
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
            this.bindEvent(key, this.events[key].event);
        }
    },
    delete: function _delete(duration) {
        var _this4 = this;

        return this.hide(duration).then(function () {
            _this4.else.container.remove();
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
                _this9.size();resolve();
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

},{"../../../lib/MyObject":28,"./Login":13,"backbone":"backbone","events":29,"jquery":"jquery","underscore":"underscore"}],17:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "Admin";
};

},{}],18:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div data-js=\"container\">\n    <h2>Lists</h2>\n    <p>Organize your content into neat groups with our lists.</p>\n    <div class=\"example\" data-view=\"list\"></div>\n    <h2>Forms</h2>\n    <p>Our forms are customizable to suit the needs of your project. Here, for example, are \n    Login and Register forms, each using different input styles.</p>\n    <div class=\"example\">\n        <div class=\"inline-view\">\n            <div data-view=\"login\"></div>\n        </div>\n        <div class=\"inline-view\">\n            <div data-view=\"register\"></div>\n        </div>\n    </div>\n</div>\n";
};

},{}],19:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<span class=\"feedback\" data-js=\"fieldError\">" + p.error + "</span>";
};

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Header</div>";
};

},{}],22:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Future Days</div>";
};

},{}],23:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div data-js=\"invalidLoginError\" class=\"feedback\">Invalid Credentials</div>";
};

},{}],24:[function(require,module,exports){
"use strict";

module.exports = function (options) {
    return "\n\n<ul class=\"list\">\n    <li class=\"list-item\">for</li>\n    <li class=\"list-item\">the</li>\n    <li class=\"list-item\">sake</li>\n    <li class=\"list-item\">of</li>\n    <li class=\"list-item\">future</li>\n    <li class=\"list-item\">days</li>\n</ul>\n";
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"login\" data-js=\"container\">\n    <h1>Login</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n        <button data-js=\"loginBtn\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>\n";
};

},{}],26:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"register\" data-js=\"container\">\n    <h1>Register</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"cancelBtn\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n    </div>\n</div>\n";
};

},{}],27:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],28:[function(require,module,exports){
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

},{"./MyError":27,"moment":"moment"}],29:[function(require,module,exports){
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
      }
      throw TypeError('Uncaught, unspecified "error" event.');
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
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
    var timeout = setTimeout(cleanUpNextTick);
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
    clearTimeout(timeout);
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
        setTimeout(drainQueue, 0);
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

},{}],32:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],33:[function(require,module,exports){
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

},{"./support/isBuffer":32,"_process":31,"inherits":30}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL3JvdXRlci5qcyIsImNsaWVudC9qcy92aWV3cy9BZG1pbi5qcyIsImNsaWVudC9qcy92aWV3cy9EZW1vLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0Zvcm0uanMiLCJjbGllbnQvanMvdmlld3MvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0hvbWUuanMiLCJjbGllbnQvanMvdmlld3MvTGlzdC5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9NeVZpZXcuanMiLCJjbGllbnQvanMvdmlld3MvUmVnaXN0ZXIuanMiLCJjbGllbnQvanMvdmlld3MvX19wcm90b19fLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9hZG1pbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvZGVtby5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvZmllbGRFcnJvci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvZm9ybS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvaGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9ob21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbGlzdC5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvbG9naW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL3JlZ2lzdGVyLmpzIiwibGliL015RXJyb3IuanMiLCJsaWIvTXlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxPQUFQLEdBQWU7QUFDZCxRQUFPLFFBQVEseUJBQVIsQ0FETztBQUVkLE9BQU0sUUFBUSx3QkFBUixDQUZRO0FBR2QsYUFBWSxRQUFRLDhCQUFSLENBSEU7QUFJZCxPQUFNLFFBQVEsd0JBQVIsQ0FKUTtBQUtkLFNBQVEsUUFBUSwwQkFBUixDQUxNO0FBTWQsT0FBTSxRQUFRLHdCQUFSLENBTlE7QUFPZCxvQkFBbUIsUUFBUSxxQ0FBUixDQVBMO0FBUWQsT0FBTSxRQUFRLHdCQUFSLENBUlE7QUFTZCxRQUFPLFFBQVEseUJBQVIsQ0FUTztBQVVkLFdBQVUsUUFBUSw0QkFBUjtBQVZJLENBQWY7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWU7QUFDZCxRQUFPLFFBQVEsZUFBUixDQURPO0FBRWQsT0FBTSxRQUFRLGNBQVIsQ0FGUTtBQUdkLE9BQU0sUUFBUSxjQUFSLENBSFE7QUFJZCxTQUFRLFFBQVEsZ0JBQVIsQ0FKTTtBQUtkLE9BQU0sUUFBUSxjQUFSLENBTFE7QUFNZCxPQUFNLFFBQVEsY0FBUixDQU5RO0FBT2QsUUFBTyxRQUFRLGVBQVIsQ0FQTztBQVFkLFNBQVEsUUFBUSxnQkFBUixDQVJNO0FBU2QsV0FBVSxRQUFRLGtCQUFSO0FBVEksQ0FBZjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWU7QUFFNUIsVUFGNEIsa0JBRXBCLElBRm9CLEVBRWQsSUFGYyxFQUVQO0FBQ2pCLGVBQU8sT0FBTyxNQUFQLENBQ0gsS0FBSyxLQUFMLENBQVksS0FBSyxNQUFMLENBQVksQ0FBWixFQUFlLFdBQWYsS0FBK0IsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUEzQyxDQURHLEVBRUgsT0FBTyxNQUFQLENBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxLQUFLLFNBQUwsQ0FBZ0IsSUFBaEIsQ0FBVCxFQUFaLEVBQStDLE1BQU0sRUFBRSxPQUFPLEtBQUssSUFBZCxFQUFyRCxFQUEyRSxTQUFTLEVBQUUsT0FBTyxJQUFULEVBQXBGLEVBQWYsRUFBc0gsSUFBdEgsQ0FGRyxFQUdMLFdBSEssRUFBUDtBQUlIO0FBUDJCLENBQWYsRUFTZDtBQUNDLGVBQVcsRUFBRSxPQUFPLFFBQVEsaUJBQVIsQ0FBVCxFQURaO0FBRUMsVUFBTSxFQUFFLE9BQU8sUUFBUSxnQkFBUixDQUFULEVBRlA7QUFHQyxXQUFPLEVBQUUsT0FBTyxRQUFRLGFBQVIsQ0FBVDtBQUhSLENBVGMsQ0FBakI7Ozs7O0FDQUEsUUFBUSxRQUFSLEVBQW1CLFlBQU07QUFDckIsWUFBUSxVQUFSO0FBQ0EsWUFBUSxVQUFSLEVBQW9CLE9BQXBCLENBQTRCLEtBQTVCLENBQW1DLEVBQUUsV0FBVyxJQUFiLEVBQW5DO0FBQ0gsQ0FIRDs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsS0FBTSxRQUFRLFVBQVIsRUFBb0IsS0FBcEIsQ0FBMEIsTUFBMUIsQ0FBa0M7QUFDckQsY0FBVSxFQUFFLE9BQU8sRUFBVCxFQUQyQztBQUVyRCxjQUZxRCx3QkFFeEM7QUFDVCxhQUFLLE9BQUwsR0FBZSxLQUFLLEtBQUwsRUFBZjtBQUNBLGVBQU8sSUFBUDtBQUNILEtBTG9EO0FBTXJELE9BTnFELGlCQU0vQztBQUFFLGVBQU8sT0FBUDtBQUFnQjtBQU42QixDQUFsQyxDQUFOLEdBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixLQUNiLFFBQVEsVUFBUixFQUFvQixNQUFwQixDQUEyQixNQUEzQixDQUFtQzs7QUFFL0IsT0FBRyxRQUFRLFFBQVIsQ0FGNEI7O0FBSS9CLFdBQU8sUUFBUSxtQkFBUixDQUp3Qjs7QUFNL0IsVUFBTSxRQUFRLGVBQVIsQ0FOeUI7O0FBUS9CLGlCQUFhLFFBQVEsZ0JBQVIsQ0FSa0I7O0FBVS9CLGNBVitCLHdCQVVsQjs7QUFFVCxhQUFLLGdCQUFMLEdBQXdCLEtBQUssQ0FBTCxDQUFPLFVBQVAsQ0FBeEI7O0FBRUEsZUFBTyxPQUFPLE1BQVAsQ0FBZSxJQUFmLEVBQXFCO0FBQ3hCLG1CQUFPLEVBRGlCO0FBRXhCLG9CQUFRLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUF5QixRQUF6QixFQUFtQyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFLLGdCQUFaLEVBQThCLFFBQVEsUUFBdEMsRUFBVCxFQUFiLEVBQW5DO0FBRmdCLFNBQXJCLENBQVA7QUFJSCxLQWxCOEI7QUFvQi9CLFVBcEIrQixvQkFvQnRCO0FBQUUsYUFBSyxRQUFMLENBQWUsTUFBZixFQUF1QixFQUFFLFNBQVMsSUFBWCxFQUF2QjtBQUE0QyxLQXBCeEI7QUFzQi9CLFdBdEIrQixtQkFzQnRCLFFBdEJzQixFQXNCWDtBQUFBOztBQUVoQixZQUFJLENBQUMsUUFBTCxFQUFnQixPQUFPLEtBQUssTUFBTCxFQUFQOztBQUVoQixhQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLElBQWxCLENBQXdCLFlBQU07O0FBRTFCLGtCQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQ0ssRUFETCxDQUNTLFNBRFQsRUFDb0I7QUFBQSx1QkFDWixRQUFRLEdBQVIsQ0FBYSxPQUFPLElBQVAsQ0FBYSxNQUFLLEtBQWxCLEVBQTBCLEdBQTFCLENBQStCO0FBQUEsMkJBQVEsTUFBSyxLQUFMLENBQVksSUFBWixFQUFtQixNQUFuQixFQUFSO0FBQUEsaUJBQS9CLENBQWIsRUFDQyxJQURELENBQ08sTUFBSyxNQUFMLEVBRFAsQ0FEWTtBQUFBLGFBRHBCOztBQU1BLG9CQUFRLEdBQVIsQ0FBYSxPQUFPLElBQVAsQ0FBYSxNQUFLLEtBQWxCLEVBQTBCLEdBQTFCLENBQStCO0FBQUEsdUJBQVEsTUFBSyxLQUFMLENBQVksSUFBWixFQUFtQixJQUFuQixFQUFSO0FBQUEsYUFBL0IsQ0FBYixFQUNDLElBREQsQ0FDTyxZQUFNO0FBQ1Qsb0JBQUksTUFBSyxLQUFMLENBQVksUUFBWixDQUFKLEVBQTZCLE9BQU8sTUFBSyxLQUFMLENBQVksUUFBWixFQUF1QixJQUF2QixFQUFQO0FBQzdCLHNCQUFLLEtBQUwsQ0FBWSxRQUFaLElBQ0ksTUFBSyxXQUFMLENBQWlCLE1BQWpCLENBQXlCLFFBQXpCLEVBQW1DLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLE1BQUssZ0JBQVosRUFBVCxFQUFiLEVBQW5DLEVBQ0ssRUFETCxDQUNTLE9BRFQsRUFDa0I7QUFBQSwyQkFBUyxNQUFLLFFBQUwsQ0FBZSxLQUFmLEVBQXNCLEVBQUUsU0FBUyxJQUFYLEVBQXRCLENBQVQ7QUFBQSxpQkFEbEIsQ0FESjtBQUdILGFBTkQsRUFPQyxLQVBELENBT1EsTUFBSyxLQVBiO0FBU0gsU0FqQkQsRUFpQkksSUFqQkosQ0FpQlUsS0FBSyxLQWpCZjtBQW1CSCxLQTdDOEI7OztBQStDL0IsWUFBUSxFQUFFLGNBQWMsU0FBaEI7O0FBL0N1QixDQUFuQyxDQURhLEdBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLFFBQVEsYUFBUixDQUFuQixFQUEyQztBQUN4RCxtQkFBZTtBQUR5QyxDQUEzQyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWUsRUFBZixFQUFtQixRQUFRLGFBQVIsQ0FBbkIsRUFBMkM7O0FBRXhELFdBQU87QUFDSCxjQUFNLEVBQUUsTUFBTSxRQUFRLFFBQVIsQ0FBUixFQUEyQixVQUFVLFFBQVEsa0JBQVIsQ0FBckMsRUFESDtBQUVILGVBQU8sRUFBRSxNQUFNLFFBQVEsU0FBUixDQUFSLEVBQTRCLFVBQVUsUUFBUSxtQkFBUixDQUF0QyxFQUZKO0FBR0gsa0JBQVUsRUFBRSxNQUFNLFFBQVEsWUFBUixDQUFSLEVBQStCLFVBQVUsUUFBUSxzQkFBUixDQUF6QztBQUhQLEtBRmlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStDeEQsVUFBTSxRQUFRLFFBQVIsQ0EvQ2tEO0FBZ0R4RCxVQUFNLFFBQVEsUUFBUixDQWhEa0Q7QUFpRHhELFdBQU8sUUFBUSxTQUFSLENBakRpRDtBQWtEeEQsY0FBVSxRQUFRLFlBQVIsQ0FsRDhDOztBQW9EeEQsY0FwRHdELHdCQW9EM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJULGVBQU8sSUFBUDtBQUNILEtBbkZ1RDs7O0FBcUYzRCxjQUFVLFFBQVEsa0JBQVI7O0FBckZpRCxDQUEzQyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWUsRUFBZixFQUFvQixRQUFRLGFBQVIsQ0FBcEIsRUFBNEM7O0FBRXpELGdCQUFZLCtDQUY2Qzs7QUFJekQsc0JBSnlELGdDQUlwQztBQUFBOztBQUNqQixhQUFLLE1BQUwsQ0FBWSxPQUFaLENBQXFCLGlCQUFTO0FBQzFCLGdCQUFJLE9BQU8sTUFBTSxJQUFOLENBQVcsTUFBWCxDQUFrQixDQUFsQixFQUFxQixXQUFyQixLQUFxQyxNQUFNLElBQU4sQ0FBVyxLQUFYLENBQWlCLENBQWpCLENBQWhEO0FBQ0Esa0JBQU8sT0FBUCxJQUFtQixNQUFLLEtBQXhCO0FBQ0EsZ0JBQUksTUFBSyxVQUFULEVBQXNCLE1BQU8sWUFBUCxJQUF3QixJQUF4QjtBQUN0QixrQkFBUyxNQUFLLEtBQUwsS0FBZSxZQUFqQixHQUFrQyxPQUFsQyxHQUE0QyxhQUFuRCxJQUFxRSxJQUFyRTtBQUVILFNBTkQ7O0FBUUEsZUFBTyxFQUFFLFFBQVEsS0FBSyxNQUFmLEVBQVA7QUFBZ0MsS0FicUI7QUFlekQsZUFmeUQseUJBZTNDO0FBQUE7O0FBRVYsZUFBTyxJQUFQLENBQWEsS0FBSyxHQUFsQixFQUF1QixlQUFPO0FBQzFCLGdCQUFJLGtCQUFrQixJQUFsQixDQUF3QixPQUFLLEdBQUwsQ0FBVSxHQUFWLEVBQWdCLElBQWhCLENBQXFCLFNBQXJCLENBQXhCLENBQUosRUFBZ0UsT0FBSyxRQUFMLENBQWUsR0FBZixJQUF1QixPQUFLLEdBQUwsQ0FBVSxHQUFWLEVBQWdCLEdBQWhCLEVBQXZCO0FBQ25FLFNBRkQ7O0FBSUEsZUFBTyxLQUFLLFFBQVo7QUFDSCxLQXRCd0Q7OztBQXdCekQsWUFBUSxFQXhCaUQ7O0FBMEJ6RCxjQTFCeUQsc0JBMEI3QyxLQTFCNkMsRUEwQnJDO0FBQ2hCLGdCQUFRLEdBQVIsQ0FBYSxNQUFNLEtBQU4sSUFBZSxLQUE1Qjs7QUFFSCxLQTdCd0Q7QUErQnpELHdCQS9CeUQsa0NBK0JsQyxDQUFHLENBL0IrQjtBQWlDekQsWUFqQ3lELG9CQWlDL0MsSUFqQytDLEVBaUN4QztBQUFBOztBQUViLGVBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN2QyxtQkFBSyxDQUFMLENBQU8sSUFBUCxDQUFhO0FBQ1Qsc0JBQU0sS0FBSyxTQUFMLENBQWdCLEtBQUssTUFBckIsS0FBaUMsS0FBSyxTQUFMLENBQWdCLE9BQUssV0FBTCxFQUFoQixDQUQ5QjtBQUVULHlCQUFTLEVBQUUsT0FBUyxPQUFLLElBQVAsR0FBZ0IsT0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLE9BQWQsQ0FBaEIsR0FBeUMsRUFBbEQsRUFGQTtBQUdULHNCQUFNLE1BSEc7QUFJVCwyQkFBVSxLQUFLO0FBSk4sYUFBYjtBQU1ILFNBUE0sQ0FBUDtBQVFILEtBM0N3RDtBQTZDekQsY0E3Q3lELHdCQTZDNUM7O0FBRVQsWUFBSSxPQUFPLElBQVg7O0FBRUEsYUFBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixJQUFuQixDQUF3QixPQUF4QixFQUNDLEVBREQsQ0FDSyxNQURMLEVBQ2EsWUFBVztBQUNwQixnQkFBSSxNQUFNLEtBQUssQ0FBTCxDQUFPLElBQVAsQ0FBVjtnQkFDSSxRQUFRLEtBQUssQ0FBTCxDQUFRLEtBQUssTUFBYixFQUFzQixJQUF0QixDQUE0QixVQUFVLEtBQVYsRUFBa0I7QUFBRSx1QkFBTyxNQUFNLElBQU4sS0FBZSxJQUFJLElBQUosQ0FBUyxJQUFULENBQXRCO0FBQXNDLGFBQXRGLENBRFo7O0FBR0EsbUJBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWDtBQUFBLHVCQUF1QixRQUFTLE1BQU0sUUFBTixDQUFlLElBQWYsQ0FBcUIsSUFBckIsRUFBMkIsSUFBSSxHQUFKLEVBQTNCLENBQVQsQ0FBdkI7QUFBQSxhQUFiLEVBQ04sSUFETSxDQUNBLGlCQUFTO0FBQ1osb0JBQUksS0FBSixFQUFZO0FBQUUseUJBQUssU0FBTCxDQUFnQixHQUFoQjtBQUF1QixpQkFBckMsTUFDSztBQUFFLHlCQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsTUFBTSxLQUEzQjtBQUFvQztBQUM5QyxhQUpNLENBQVA7QUFLSCxTQVZELEVBV0MsRUFYRCxDQVdLLE9BWEwsRUFXYyxZQUFXO0FBQUUsaUJBQUssV0FBTCxDQUFrQixLQUFLLENBQUwsQ0FBTyxJQUFQLENBQWxCO0FBQWtDLFNBWDdEOztBQWFBLGVBQU8sSUFBUDtBQUNILEtBL0R3RDtBQWlFekQsZUFqRXlELHVCQWlFNUMsR0FqRTRDLEVBaUV0QztBQUNmLFlBQUksTUFBSixHQUFhLFdBQWIsQ0FBeUIsYUFBekI7QUFDQSxZQUFJLFFBQUosQ0FBYSxXQUFiLEVBQTBCLE1BQTFCO0FBQ0gsS0FwRXdEO0FBc0V6RCxhQXRFeUQscUJBc0U5QyxHQXRFOEMsRUFzRXpDLEtBdEV5QyxFQXNFakM7O0FBRXBCLFlBQUksWUFBWSxJQUFJLE1BQUosRUFBaEI7O0FBRUEsWUFBSSxVQUFVLFFBQVYsQ0FBb0IsT0FBcEIsQ0FBSixFQUFvQzs7QUFFcEMsa0JBQVUsV0FBVixDQUFzQixPQUF0QixFQUErQixRQUEvQixDQUF3QyxPQUF4QyxFQUFpRCxNQUFqRCxDQUF5RCxLQUFLLFNBQUwsQ0FBZSxVQUFmLENBQTJCLEVBQUUsT0FBTyxLQUFULEVBQTNCLENBQXpEO0FBQ0gsS0E3RXdEO0FBK0V6RCxhQS9FeUQscUJBK0U5QyxHQS9FOEMsRUErRXhDO0FBQ2IsWUFBSSxNQUFKLEdBQWEsV0FBYixDQUF5QixPQUF6QixFQUFrQyxRQUFsQyxDQUEyQyxPQUEzQztBQUNBLFlBQUksUUFBSixDQUFhLFdBQWIsRUFBMEIsTUFBMUI7QUFDSCxLQWxGd0Q7QUFvRnpELGNBcEZ5RCxzQkFvRjdDLFFBcEY2QyxFQW9GbEM7QUFBQTs7QUFDbkIsYUFBSyxRQUFMLEdBQWdCLElBQWhCLENBQXNCLGtCQUFVO0FBQzVCLGdCQUFJLFdBQVcsS0FBZixFQUF1QjtBQUN2QixtQkFBSyxRQUFMLENBQWUsUUFBZixFQUNDLElBREQsQ0FDTztBQUFBLHVCQUFNLE9BQUssb0JBQUwsRUFBTjtBQUFBLGFBRFAsRUFFQyxLQUZELENBRVE7QUFBQSx1QkFBSyxPQUFLLFVBQUwsQ0FBaUIsQ0FBakIsQ0FBTDtBQUFBLGFBRlI7QUFHSCxTQUxEO0FBTUgsS0EzRndEOzs7QUE2RnpELGNBQVUsUUFBUSxrQkFBUixDQTdGK0M7O0FBK0Z6RCxlQUFXO0FBQ1Asb0JBQVksUUFBUSx3QkFBUjtBQURMLEtBL0Y4Qzs7QUFtR3pELFlBbkd5RCxzQkFtRzlDO0FBQUE7O0FBQ1AsWUFBSSxRQUFRLElBQVo7O0FBRUEsZUFBTyxRQUFRLEdBQVIsQ0FBYSxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWlCLGlCQUFTO0FBQzFDLG1CQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDdkMsb0JBQUksU0FBUyxNQUFNLFFBQU4sQ0FBZSxJQUFmLFNBQTBCLE9BQUssR0FBTCxDQUFVLE1BQU0sSUFBaEIsRUFBdUIsR0FBdkIsRUFBMUIsQ0FBYjtBQUNBLG9CQUFJLFdBQVcsS0FBZixFQUF1QjtBQUNuQiw0QkFBUSxLQUFSO0FBQ0EsMkJBQUssU0FBTCxDQUFnQixPQUFLLEdBQUwsQ0FBVSxNQUFNLElBQWhCLENBQWhCLEVBQXdDLE1BQU0sS0FBOUM7QUFDSDs7QUFFRDtBQUNILGFBUk0sQ0FBUDtBQVNILFNBVm1CLENBQWIsRUFXTixJQVhNLENBV0E7QUFBQSxtQkFBTSxLQUFOO0FBQUEsU0FYQSxFQVlOLEtBWk0sQ0FZQyxhQUFLO0FBQUUsb0JBQVEsR0FBUixDQUFhLEVBQUUsS0FBRixJQUFXLENBQXhCLEVBQTZCLE9BQU8sS0FBUDtBQUFjLFNBWm5ELENBQVA7QUFhSDtBQW5Id0QsQ0FBNUMsQ0FBakI7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBbUIsUUFBUSxhQUFSLENBQW5CLEVBQTJDOztBQUV4RCxZQUFRO0FBQ0osb0JBQVksRUFBRSxRQUFRLFNBQVY7QUFEUixLQUZnRDs7QUFNeEQsVUFOd0Qsb0JBTS9DO0FBQ0wsZUFBTyxJQUFQO0FBQ0gsS0FSdUQ7QUFVeEQsV0FWd0QscUJBVTlDOztBQUVOLGlCQUFTLE1BQVQsR0FBa0IsdURBQWxCOztBQUVBLGFBQUssSUFBTCxDQUFVLEtBQVY7O0FBRUEsYUFBSyxJQUFMLENBQVUsU0FBVjs7QUFFQSxhQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXNCLEdBQXRCLEVBQTJCLEVBQUUsU0FBUyxJQUFYLEVBQTNCO0FBQ0g7QUFuQnVELENBQTNDLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLFFBQVEsYUFBUixDQUFuQixFQUEyQyxFQUEzQyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLENBQWUsRUFBZixFQUFvQixRQUFRLGFBQVIsQ0FBcEIsRUFBNEM7QUFDekQsY0FBVSxRQUFRLGtCQUFSO0FBRCtDLENBQTVDLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLFFBQVEsYUFBUixDQUFuQixFQUEyQzs7QUFFeEQsWUFBUTtBQUNKLHVCQUFlLEVBQUUsT0FBTyxPQUFULEVBQWtCLFVBQVUsRUFBNUIsRUFBZ0MsUUFBUSxrQkFBeEMsRUFEWDtBQUVKLG9CQUFZLEVBQUUsT0FBTyxPQUFULEVBQWtCLFVBQVUsRUFBNUIsRUFBZ0MsUUFBUSxPQUF4QztBQUZSLEtBRmdEOztBQU94RCxZQUFRLENBQUU7QUFDTixjQUFNLE9BREE7QUFFTixjQUFNLE1BRkE7QUFHTixlQUFPLHFDQUhEO0FBSU4sa0JBQVUsa0JBQVUsR0FBVixFQUFnQjtBQUFFLG1CQUFPLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUFQO0FBQWtDO0FBSnhELEtBQUYsRUFLTDtBQUNDLGNBQU0sVUFEUDtBQUVDLGNBQU0sVUFGUDtBQUdDLGVBQU8sK0NBSFI7QUFJQyxrQkFBVTtBQUFBLG1CQUFPLElBQUksTUFBSixJQUFjLENBQXJCO0FBQUE7QUFKWCxLQUxLLENBUGdEOztBQW1CeEQsVUFBTSxRQUFRLFFBQVIsQ0FuQmtEOztBQXFCeEQsU0FyQndELG1CQXFCaEQ7QUFBRSxhQUFLLFlBQUwsQ0FBa0IsVUFBbEIsQ0FBOEIsRUFBRSxVQUFVLE1BQVosRUFBOUI7QUFBc0QsS0FyQlI7QUF1QnhELHdCQXZCd0QsZ0NBdUJsQyxRQXZCa0MsRUF1QnZCO0FBQzdCLFlBQUksT0FBTyxJQUFQLENBQWEsUUFBYixFQUF3QixNQUF4QixLQUFtQyxDQUF2QyxFQUEyQztBQUN2QyxtQkFBTyxLQUFLLGFBQUwsQ0FBb0IsRUFBRSxVQUFVLEtBQUssU0FBTCxDQUFlLGlCQUEzQixFQUE4QyxXQUFXLEVBQUUsS0FBSyxLQUFLLEdBQUwsQ0FBUyxTQUFoQixFQUF6RCxFQUFwQixDQUFQO0FBQ0g7O0FBRUQsZ0JBQVEsZ0JBQVIsRUFBMEIsR0FBMUIsQ0FBK0IsUUFBL0I7QUFDQSxhQUFLLElBQUwsQ0FBVyxVQUFYO0FBQ0EsYUFBSyxJQUFMO0FBQ0gsS0EvQnVEO0FBaUN4RCxjQWpDd0Qsd0JBaUMzQztBQUNULGFBQUssWUFBTCxHQUFvQixPQUFPLE1BQVAsQ0FBZSxLQUFLLElBQXBCLEVBQTBCO0FBQzFDLG1CQUFPLEVBQUUsT0FBTyxLQUFLLEtBQWQsRUFEbUM7O0FBRzFDLG9CQUFRLEVBQUUsT0FBTyxLQUFLLE1BQWQsRUFIa0M7QUFJMUMsdUJBQVcsRUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFLLEdBQUwsQ0FBUyxJQUFoQixFQUFULEVBSitCO0FBSzFDLGtDQUFzQixFQUFFLE9BQU8sS0FBSyxvQkFBZDtBQUxvQixTQUExQixFQU1oQixXQU5nQixFQUFwQjs7QUFRQSxlQUFPLElBQVA7QUFDSCxLQTNDdUQ7OztBQTZDeEQsY0FBVSxRQUFRLFlBQVIsQ0E3QzhDOztBQStDeEQsbUJBQWUsS0EvQ3lDOztBQWlEeEQsb0JBakR3RCw4QkFpRHJDO0FBQUE7O0FBRWYsWUFBSSxPQUFPLEtBQUssWUFBaEI7WUFDSSxRQUFRLEtBQUssR0FBTCxDQUFTLEtBRHJCO1lBRUksV0FBVyxLQUFLLEdBQUwsQ0FBUyxRQUZ4Qjs7QUFJQSxhQUFLLFdBQUwsQ0FBa0IsS0FBbEI7QUFDQSxjQUFNLEdBQU4sQ0FBVSxFQUFWOztBQUVBLGFBQUssV0FBTCxDQUFrQixRQUFsQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxFQUFiOztBQUVBLFlBQUssS0FBSyxHQUFMLENBQVMsaUJBQWQsRUFBa0MsS0FBSyxHQUFMLENBQVMsaUJBQVQsQ0FBMkIsTUFBM0I7QUFDbEMsWUFBSyxLQUFLLEdBQUwsQ0FBUyxXQUFkLEVBQTRCLEtBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsTUFBckI7O0FBRTVCLGFBQUssSUFBTCxHQUFZLElBQVosQ0FBa0I7QUFBQSxtQkFBUSxNQUFLLGdCQUFQLEdBQTRCLE1BQUssZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNUIsR0FDbEIsT0FBTyxNQUFQLENBQWUsTUFBSyxRQUFwQixFQUE4QjtBQUM1QiwrQkFBZSxFQUFFLFlBQUYsRUFEYTtBQUU1Qix1QkFBTyxFQUFFLE9BQU8sWUFBVDtBQUZxQixhQUE5QixFQUdFLFdBSEYsRUFEWTtBQUFBLFNBQWxCO0FBTUgsS0F0RXVEOzs7QUF3RXhELGNBQVUsUUFBUSxtQkFBUixDQXhFOEM7O0FBMEV4RCxlQUFXO0FBQ1AsMkJBQW1CLFFBQVEsK0JBQVI7QUFEWjs7QUExRTZDLENBQTNDLENBQWpCOzs7OztBQ0FBLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBVSxJQUFWLEVBQWlCO0FBQUUsV0FBTyxPQUFPLE1BQVAsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTRCLFVBQTVCLEVBQVA7QUFBaUQsQ0FBakY7O0FBRUEsT0FBTyxNQUFQLENBQWUsT0FBTyxTQUF0QixFQUFpQyxRQUFRLFFBQVIsRUFBa0IsWUFBbEIsQ0FBK0IsU0FBaEUsRUFBMkU7O0FBRXZFLGdCQUFZLFFBQVEsVUFBUixFQUFvQixVQUZ1Qzs7OztBQU12RSxXQUFPLFFBQVEsVUFBUixFQUFvQixLQU40Qzs7QUFRdkUsT0FBRyxRQUFRLFlBQVIsQ0FSb0U7O0FBVXZFLE9BQUcsUUFBUSxRQUFSLENBVm9FOztBQVl2RSxrQkFadUUsMEJBWXZELEdBWnVELEVBWWxELEVBWmtELEVBWTdDO0FBQUE7O0FBQ3RCLFlBQUksSUFBSjs7QUFFQSxZQUFJLENBQUUsS0FBSyxNQUFMLENBQWEsR0FBYixDQUFOLEVBQTJCOztBQUUzQixlQUFPLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUFnQyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWhDLENBQVA7O0FBRUEsWUFBSSxTQUFTLGlCQUFiLEVBQWlDO0FBQzdCLGlCQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsS0FBSyxNQUFMLENBQVksR0FBWixDQUFyQixFQUF1QyxFQUF2QztBQUNILFNBRkQsTUFFTyxJQUFJLFNBQVMsZ0JBQWIsRUFBZ0M7QUFDbkMsaUJBQUssTUFBTCxDQUFZLEdBQVosRUFBaUIsT0FBakIsQ0FBMEI7QUFBQSx1QkFBZSxNQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsV0FBckIsRUFBa0MsRUFBbEMsQ0FBZjtBQUFBLGFBQTFCO0FBQ0g7QUFDSixLQXhCc0U7OztBQTBCdkUsWUFBUSxtQkFBVztBQUNmLFlBQUksS0FBSyxZQUFMLElBQXFCLEtBQUssWUFBTCxDQUFrQixTQUEzQyxFQUF1RDtBQUNuRCxpQkFBSyxZQUFMLENBQWtCLFNBQWxCLENBQTRCLE1BQTVCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLFNBQVY7QUFDSDtBQUNKLEtBL0JzRTs7QUFpQ3ZFLFlBQVE7QUFDSiwrQkFBdUI7QUFBQSxtQkFBVSxPQUFPLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLFdBQWpCLEtBQWlDLE9BQU8sS0FBUCxDQUFhLENBQWIsQ0FBM0M7QUFBQTtBQURuQixLQWpDK0Q7O0FBcUN2RSxpQkFBYSx1QkFBVztBQUFBOztBQUNwQixhQUFLLFFBQUwsR0FBZ0IsRUFBaEI7O0FBRUEsYUFBSyxDQUFMLENBQU8sSUFBUCxDQUFhLEtBQUssWUFBbEIsRUFBZ0MsVUFBRSxHQUFGLEVBQU8sSUFBUCxFQUFpQjtBQUFFLGdCQUFJLElBQUksSUFBSixDQUFTLFNBQVQsTUFBd0IsT0FBeEIsSUFBbUMsSUFBSSxHQUFKLEVBQXZDLEVBQW1ELE9BQUssUUFBTCxDQUFjLElBQWQsSUFBc0IsSUFBSSxHQUFKLEVBQXRCO0FBQWlDLFNBQXZJOztBQUVBLGVBQU8sS0FBSyxRQUFaO0FBQ0gsS0EzQ3NFOztBQTZDdkUsZUFBVyxxQkFBVztBQUFFLGVBQU8sUUFBUSxXQUFSLENBQVA7QUFBNkIsS0E3Q2tCOztBQStDdkUsd0JBQW9CO0FBQUEsZUFBTyxFQUFQO0FBQUEsS0EvQ21EOzs7Ozs7Ozs7QUF3RHZFLGNBeER1RSx3QkF3RDFEO0FBQUE7O0FBRVQsWUFBSSxDQUFFLEtBQUssU0FBWCxFQUF1QixLQUFLLFNBQUwsR0FBaUIsS0FBSyxDQUFMLENBQU8sVUFBUCxDQUFqQjs7QUFFdkIsYUFBSyxNQUFMLEdBQWMsS0FBSyxTQUFMLEVBQWQ7Ozs7QUFJQSxhQUFLLENBQUwsQ0FBTyxNQUFQLEVBQWUsTUFBZixDQUF1QixLQUFLLENBQUwsQ0FBTyxRQUFQLENBQWlCO0FBQUEsbUJBQU0sT0FBSyxJQUFMLEVBQU47QUFBQSxTQUFqQixFQUFvQyxHQUFwQyxDQUF2Qjs7QUFFQSxZQUFJLEtBQUssYUFBTCxJQUFzQixDQUFFLEtBQUssSUFBTCxDQUFVLEVBQXRDLEVBQTJDO0FBQ3ZDLG9CQUFRLFNBQVIsRUFBbUIsSUFBbkIsR0FBMEIsSUFBMUIsQ0FBZ0MsU0FBaEMsRUFBMkMsYUFBSztBQUM1Qyx1QkFBSyxNQUFMLENBQVksTUFBWixDQUFtQixNQUFuQixDQUEyQixPQUFLLElBQWhDOztBQUVBLG9CQUFJLE9BQUssWUFBTCxJQUF1QixDQUFFLE9BQUssQ0FBTCxDQUFRLE9BQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxPQUFkLENBQVIsRUFBaUMsUUFBakMsQ0FBMkMsT0FBSyxZQUFoRCxDQUE3QixFQUFnRztBQUM1RiwyQkFBTyxNQUFNLHdCQUFOLENBQVA7QUFDSDs7QUFFRCx1QkFBSyxNQUFMO0FBQ0gsYUFSRDtBQVNBLG1CQUFPLElBQVA7QUFDSCxTQVhELE1BV08sSUFBSSxLQUFLLElBQUwsQ0FBVSxFQUFWLElBQWdCLEtBQUssWUFBekIsRUFBd0M7QUFDM0MsZ0JBQU0sQ0FBRSxLQUFLLENBQUwsQ0FBUSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsT0FBZCxDQUFSLEVBQWlDLFFBQWpDLENBQTJDLEtBQUssWUFBaEQsQ0FBUixFQUEyRTtBQUN2RSx1QkFBTyxNQUFNLHdCQUFOLENBQVA7QUFDSDtBQUNKOztBQUVELGVBQU8sS0FBSyxNQUFMLEVBQVA7QUFDSCxLQXBGc0U7OztBQXNGdkUsY0FBVSxvQkFBVztBQUFFLGVBQU8sS0FBSyxZQUFMLENBQWtCLFNBQWxCLENBQTRCLEdBQTVCLENBQWdDLFNBQWhDLE1BQStDLE1BQXREO0FBQThELEtBdEZkOztBQXlGdkUsWUFBUSxRQUFRLFFBQVIsQ0F6RitEOztBQTJGdkUsZ0JBQVksc0JBQVc7QUFDbkIsYUFBSyxjQUFMO0FBQ0EsZUFBTyxJQUFQO0FBQ0gsS0E5RnNFOzs7O0FBa0d2RSxVQWxHdUUsb0JBa0c5RDtBQUNMLGFBQUssYUFBTCxDQUFvQjtBQUNoQixzQkFBVSxLQUFLLFFBQUwsQ0FBZSxLQUFLLGtCQUFMLEVBQWYsQ0FETTtBQUVoQix1QkFBVyxFQUFFLEtBQUssS0FBSyxXQUFMLElBQW9CLEtBQUssU0FBaEMsRUFBMkMsUUFBUSxLQUFLLGVBQXhELEVBRkssRUFBcEI7O0FBSUEsYUFBSyxJQUFMOztBQUVBLGFBQUssVUFBTDs7QUFFQSxlQUFPLElBQVA7QUFDSCxLQTVHc0U7OztBQThHdkUsb0JBQWdCLDBCQUFXO0FBQUE7O0FBQ3ZCLGVBQU8sSUFBUCxDQUFhLEtBQUssUUFBTCxJQUFpQixFQUE5QixFQUFvQyxPQUFwQyxDQUE2QztBQUFBLG1CQUN6QyxPQUFLLFFBQUwsQ0FBZSxHQUFmLEVBQXFCLE9BQXJCLENBQThCLHVCQUFlO0FBQ3pDLHVCQUFNLFlBQVksSUFBbEIsSUFBMkIsSUFBSSxZQUFZLElBQWhCLENBQXNCLEVBQUUsV0FBVyxPQUFLLFlBQUwsQ0FBbUIsR0FBbkIsQ0FBYixFQUF0QixDQUEzQjtBQUE0RixhQURoRyxDQUR5QztBQUFBLFNBQTdDO0FBR0gsS0FsSHNFOztBQW9IdkUsVUFBTSxnQkFBVztBQUNiLGFBQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixJQUE1QjtBQUNBLGFBQUssSUFBTDtBQUNBLGVBQU8sSUFBUDtBQUNILEtBeEhzRTs7QUEwSHZFLGFBQVMsaUJBQVUsRUFBVixFQUFlOztBQUVwQixZQUFJLE1BQU0sR0FBRyxJQUFILENBQVEsU0FBUixDQUFWOztBQUVBLGFBQUssWUFBTCxDQUFtQixHQUFuQixJQUE2QixLQUFLLFlBQUwsQ0FBa0IsY0FBbEIsQ0FBaUMsR0FBakMsQ0FBRixHQUNyQixLQUFLLFlBQUwsQ0FBbUIsR0FBbkIsRUFBeUIsR0FBekIsQ0FBOEIsRUFBOUIsQ0FEcUIsR0FFckIsRUFGTjs7QUFJQSxXQUFHLFVBQUgsQ0FBYyxTQUFkOztBQUVBLFlBQUksS0FBSyxNQUFMLENBQWEsR0FBYixDQUFKLEVBQXlCLEtBQUssY0FBTCxDQUFxQixHQUFyQixFQUEwQixFQUExQjs7QUFFekIsZUFBTyxJQUFQO0FBQ0gsS0F2SXNFOztBQXlJdkUsbUJBQWUsdUJBQVUsT0FBVixFQUFvQjtBQUFBOztBQUUvQixZQUFJLFFBQVEsS0FBSyxDQUFMLENBQVEsUUFBUSxRQUFoQixDQUFaO1lBQ0ksV0FBVyxXQURmOztBQUdBLFlBQUksS0FBSyxZQUFMLEtBQXNCLFNBQTFCLEVBQXNDLEtBQUssWUFBTCxHQUFvQixFQUFwQjs7QUFFdEMsY0FBTSxJQUFOLENBQVksVUFBRSxLQUFGLEVBQVMsRUFBVCxFQUFpQjtBQUN6QixnQkFBSSxNQUFNLE9BQUssQ0FBTCxDQUFPLEVBQVAsQ0FBVjtBQUNBLGdCQUFJLElBQUksRUFBSixDQUFRLFFBQVIsQ0FBSixFQUF5QixPQUFLLE9BQUwsQ0FBYyxHQUFkO0FBQzVCLFNBSEQ7O0FBS0EsY0FBTSxHQUFOLEdBQVksT0FBWixDQUFxQixVQUFFLEVBQUYsRUFBVTtBQUFFLG1CQUFLLENBQUwsQ0FBUSxFQUFSLEVBQWEsSUFBYixDQUFtQixRQUFuQixFQUE4QixJQUE5QixDQUFvQyxVQUFFLENBQUYsRUFBSyxhQUFMO0FBQUEsdUJBQXdCLE9BQUssT0FBTCxDQUFjLE9BQUssQ0FBTCxDQUFPLGFBQVAsQ0FBZCxDQUF4QjtBQUFBLGFBQXBDO0FBQXFHLFNBQXRJOztBQUVBLFlBQUksV0FBVyxRQUFRLFNBQXZCLEVBQW1DLFFBQVEsU0FBUixDQUFrQixHQUFsQixDQUF5QixRQUFRLFNBQVIsQ0FBa0IsTUFBcEIsR0FBK0IsUUFBUSxTQUFSLENBQWtCLE1BQWpELEdBQTBELFFBQWpGLEVBQTZGLEtBQTdGOztBQUVuQyxlQUFPLElBQVA7QUFDSCxLQTFKc0U7O0FBNEp2RSxlQUFXLG1CQUFVLFVBQVYsRUFBc0IsU0FBdEIsRUFBaUMsRUFBakMsRUFBc0M7QUFDN0MsWUFBSSxXQUFhLEVBQUYsR0FBUyxFQUFULEdBQWMsS0FBSyxZQUFMLENBQW1CLFVBQW5CLENBQTdCOztBQUVBLGlCQUFTLEVBQVQsQ0FBYSxVQUFVLEtBQVYsSUFBbUIsT0FBaEMsRUFBeUMsVUFBVSxRQUFuRCxFQUE2RCxVQUFVLElBQXZFLEVBQTZFLEtBQU0sVUFBVSxNQUFoQixFQUF5QixJQUF6QixDQUE4QixJQUE5QixDQUE3RTtBQUNILEtBaEtzRTs7QUFrS3ZFLFlBQVEsRUFsSytEOztBQW9LdkUsaUJBQWEscUJBQVUsS0FBVixFQUFpQixFQUFqQixFQUFzQjs7QUFFL0IsWUFBSSxXQUFXLEdBQUcsTUFBSCxFQUFmO1lBQ0ksV0FBVyxHQUFHLFdBQUgsQ0FBZ0IsSUFBaEIsQ0FEZjtZQUVJLFVBQVUsR0FBRyxVQUFILENBQWUsSUFBZixDQUZkOztBQUlBLFlBQU0sTUFBTSxLQUFOLEdBQWMsU0FBUyxJQUF6QixJQUNFLE1BQU0sS0FBTixHQUFnQixTQUFTLElBQVQsR0FBZ0IsT0FEbEMsSUFFRSxNQUFNLEtBQU4sR0FBYyxTQUFTLEdBRnpCLElBR0UsTUFBTSxLQUFOLEdBQWdCLFNBQVMsR0FBVCxHQUFlLFFBSHJDLEVBR29EOztBQUVoRCxtQkFBTyxLQUFQO0FBQ0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0FuTHNFOztBQXFMdkUsbUJBQWUsS0FyTHdEOztBQXVMdkUsVUFBTSxnQkFBTTtBQUFFO0FBQU0sS0F2TG1EOztBQXlMdkUsVUFBTSxRQUFRLGdCQUFSLENBekxpRTs7QUEyTHZFLFVBQU0sUUFBUSxNQUFSOztBQTNMaUUsQ0FBM0U7O0FBK0xBLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7Ozs7O0FDak1BLE9BQU8sT0FBUCxHQUFpQixPQUFPLE1BQVAsQ0FBZSxFQUFmLEVBQW1CLFFBQVEsYUFBUixDQUFuQjs7QUFFYixZQUFRLGtCQUFXO0FBQUE7O0FBRWYsWUFBSSxPQUFPLEtBQUssWUFBaEI7WUFDSSxPQUFPLEtBQUssR0FBTCxDQUFTLElBRHBCO1lBRUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxLQUZyQjs7QUFJQSxhQUFLLFdBQUwsQ0FBa0IsSUFBbEI7QUFDQSxhQUFLLEdBQUwsQ0FBUyxFQUFUOztBQUVBLGFBQUssV0FBTCxDQUFrQixLQUFsQjtBQUNBLGNBQU0sR0FBTixDQUFVLEVBQVY7O0FBRUEsWUFBSyxLQUFLLEdBQUwsQ0FBUyxpQkFBZCxFQUFrQyxLQUFLLEdBQUwsQ0FBUyxpQkFBVCxDQUEyQixNQUEzQjtBQUNsQyxZQUFLLEtBQUssR0FBTCxDQUFTLFdBQWQsRUFBNEIsS0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixNQUFyQjs7QUFFNUIsYUFBSyxhQUFMLENBQW9CLGtCQUFwQixJQUEyQyxJQUEzQztBQUNBLGFBQUssSUFBTCxHQUFZLElBQVosQ0FBa0I7QUFBQSxtQkFBTSxNQUFLLGFBQUwsQ0FBbUIsSUFBbkIsRUFBTjtBQUFBLFNBQWxCO0FBQ0gsS0FuQlk7O0FBcUJiLFlBQVE7QUFDSix1QkFBZSxFQUFFLE9BQU8sT0FBVCxFQUFrQixVQUFVLEVBQTVCLEVBQWdDLFFBQVEsVUFBeEMsRUFEWDtBQUVKLHFCQUFhLEVBQUUsT0FBTyxPQUFULEVBQWtCLFVBQVUsRUFBNUIsRUFBZ0MsUUFBUSxRQUF4QztBQUZULEtBckJLOztBQTBCYixZQUFRLENBQUU7QUFDTixjQUFNLE1BREE7QUFFTixjQUFNLE1BRkE7QUFHTixlQUFPLDJCQUhEO0FBSU4sa0JBQVUsa0JBQVUsR0FBVixFQUFnQjtBQUFFLG1CQUFPLEtBQUssQ0FBTCxDQUFPLElBQVAsQ0FBWSxHQUFaLE1BQXFCLEVBQTVCO0FBQWdDO0FBSnRELEtBQUYsRUFLTDtBQUNDLGNBQU0sT0FEUDtBQUVDLGNBQU0sTUFGUDtBQUdDLGVBQU8scUNBSFI7QUFJQyxrQkFBVSxrQkFBVSxHQUFWLEVBQWdCO0FBQUUsbUJBQU8sS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLEdBQXJCLENBQVA7QUFBa0M7QUFKL0QsS0FMSyxDQTFCSzs7QUFzQ2IsVUFBTSxRQUFRLFFBQVIsQ0F0Q087O0FBd0NiLDBCQUFzQiw4QkFBVSxRQUFWLEVBQXFCO0FBQUE7O0FBRXZDLFlBQUssU0FBUyxPQUFULEtBQXFCLEtBQTFCLEVBQWtDO0FBQzlCLG1CQUFPLEtBQUssYUFBTCxDQUFvQixFQUFFLFVBQVUsS0FBSyxTQUFMLENBQWUsaUJBQWYsQ0FBa0MsUUFBbEMsQ0FBWixFQUEwRCxXQUFXLEVBQUUsS0FBSyxLQUFLLEdBQUwsQ0FBUyxTQUFoQixFQUEyQixRQUFRLFFBQW5DLEVBQXJFLEVBQXBCLENBQVA7QUFDSDs7QUFFRCxhQUFLLElBQUwsQ0FBVSxHQUFWLENBQWUsU0FBUyxNQUFULENBQWdCLE1BQS9COztBQUVBLGFBQUssTUFBTCxDQUFZLE9BQVosQ0FBcUI7QUFBQSxtQkFBUyxPQUFLLEdBQUwsQ0FBVSxNQUFNLElBQWhCLEVBQXVCLEdBQXZCLENBQTJCLEVBQTNCLENBQVQ7QUFBQSxTQUFyQjs7QUFFQSxhQUFLLElBQUwsR0FBWSxJQUFaLENBQWtCO0FBQUEsbUJBQU0sT0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXlCLFVBQXpCLENBQU47QUFBQSxTQUFsQjtBQUVILEtBcERZOztBQXNEYixjQXREYSx3QkFzREE7QUFDVCxhQUFLLFlBQUwsR0FBb0IsT0FBTyxNQUFQLENBQWUsS0FBSyxJQUFwQixFQUEwQjtBQUMxQyxtQkFBTyxFQUFFLE9BQU8sS0FBSyxLQUFkLEVBRG1DO0FBRTFDLG9CQUFRLEVBQUUsT0FBTyxLQUFLLE1BQWQsRUFGa0M7QUFHMUMsd0JBQVksRUFBRSxPQUFPLEtBQUssVUFBZCxFQUg4QjtBQUkxQyx1QkFBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLEtBQUssR0FBTCxDQUFTLElBQWhCLEVBQVQsRUFKK0I7QUFLMUMsa0NBQXNCLEVBQUUsT0FBTyxLQUFLLG9CQUFkO0FBTG9CLFNBQTFCLEVBTWhCLFdBTmdCLEVBQXBCOztBQVFBLGVBQU8sSUFBUDtBQUNILEtBaEVZOzs7QUFrRWIsbUJBQWUsS0FsRUY7O0FBb0ViLFlBcEVhLHNCQW9FRjtBQUFFLGFBQUssWUFBTCxDQUFrQixVQUFsQixDQUE4QixFQUFFLFVBQVUsUUFBWixFQUE5QjtBQUF3RDtBQXBFeEQsb0RBc0VFLEtBdEVGLCtDQXdFSCxRQUFRLHNCQUFSLENBeEVHLGdEQTBFRjtBQUNQLHVCQUFtQixRQUFRLCtCQUFSO0FBRFosQ0ExRUUsbUJBQWpCOzs7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBb0IsUUFBUSx1QkFBUixDQUFwQixFQUFzRCxRQUFRLFFBQVIsRUFBa0IsWUFBbEIsQ0FBK0IsU0FBckYsRUFBZ0c7O0FBRTdHLE9BQUcsUUFBUSxZQUFSLENBRjBHOztBQUk3RyxPQUFHLFFBQVEsUUFBUixDQUowRzs7QUFNN0csZ0JBQVksUUFBUSxVQUFSLEVBQW9CLFVBTjZFOztBQVE3RyxXQUFPLFFBQVEsVUFBUixFQUFvQixLQVJrRjs7QUFVN0csYUFWNkcscUJBVWxHLEdBVmtHLEVBVTdGLEtBVjZGLEVBVXhFO0FBQUE7O0FBQUEsWUFBZCxRQUFjLHlEQUFMLEVBQUs7O0FBQ2pDLGFBQUssR0FBTCxDQUFTLEdBQVQsRUFBYyxFQUFkLENBQWtCLE9BQWxCLEVBQTJCLFFBQTNCLEVBQXFDO0FBQUEsbUJBQUssYUFBVyxNQUFLLHFCQUFMLENBQTJCLEdBQTNCLENBQVgsR0FBNkMsTUFBSyxxQkFBTCxDQUEyQixLQUEzQixDQUE3QyxFQUFvRixDQUFwRixDQUFMO0FBQUEsU0FBckM7QUFDSCxLQVo0Rzs7O0FBYzdHLDJCQUF1QjtBQUFBLGVBQVUsT0FBTyxNQUFQLENBQWMsQ0FBZCxFQUFpQixXQUFqQixLQUFpQyxPQUFPLEtBQVAsQ0FBYSxDQUFiLENBQTNDO0FBQUEsS0Fkc0Y7O0FBZ0I3RyxlQWhCNkcseUJBZ0IvRjtBQUFBOztBQUVWLFlBQUksS0FBSyxJQUFULEVBQWdCLEtBQUssQ0FBTCxDQUFPLE1BQVAsRUFBZSxNQUFmLENBQXVCLEtBQUssQ0FBTCxDQUFPLFFBQVAsQ0FBaUI7QUFBQSxtQkFBTSxPQUFLLElBQUwsRUFBTjtBQUFBLFNBQWpCLEVBQW9DLEdBQXBDLENBQXZCOztBQUVoQixZQUFJLEtBQUssYUFBTCxJQUFzQixDQUFDLEtBQUssSUFBTCxDQUFVLEVBQXJDLEVBQTBDLE9BQU8sS0FBSyxXQUFMLEVBQVA7O0FBRTFDLFlBQUksS0FBSyxJQUFMLElBQWEsS0FBSyxJQUFMLENBQVUsRUFBdkIsSUFBNkIsS0FBSyxZQUFsQyxJQUFrRCxDQUFDLEtBQUssYUFBTCxFQUF2RCxFQUE4RSxPQUFPLEtBQUssWUFBTCxFQUFQOztBQUU5RSxlQUFPLE9BQU8sTUFBUCxDQUFlLElBQWYsRUFBcUIsRUFBRSxLQUFLLEVBQVAsRUFBWSxPQUFPLEVBQUUsTUFBTSxTQUFSLEVBQW1CLE1BQU0sV0FBekIsRUFBbkIsRUFBMkQsT0FBTyxFQUFsRSxFQUFyQixFQUErRixNQUEvRixFQUFQO0FBQ0gsS0F6QjRHO0FBMkI3RyxrQkEzQjZHLDBCQTJCN0YsR0EzQjZGLEVBMkJ4RixFQTNCd0YsRUEyQm5GO0FBQUE7O0FBQ3RCLFlBQUksZUFBYyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWQsQ0FBSjs7QUFFQSxZQUFJLFNBQVMsUUFBYixFQUF3QjtBQUFFLGlCQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsS0FBSyxNQUFMLENBQVksR0FBWixDQUFyQjtBQUF5QyxTQUFuRSxNQUNLLElBQUksTUFBTSxPQUFOLENBQWUsS0FBSyxNQUFMLENBQVksR0FBWixDQUFmLENBQUosRUFBd0M7QUFDekMsaUJBQUssTUFBTCxDQUFhLEdBQWIsRUFBbUIsT0FBbkIsQ0FBNEI7QUFBQSx1QkFBWSxPQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsU0FBUyxLQUE5QixDQUFaO0FBQUEsYUFBNUI7QUFDSCxTQUZJLE1BRUU7QUFDSCxpQkFBSyxTQUFMLENBQWdCLEdBQWhCLEVBQXFCLEtBQUssTUFBTCxDQUFZLEdBQVosRUFBaUIsS0FBdEM7QUFDSDtBQUNKLEtBcEM0RztBQXNDN0csVUF0QzZHLG1CQXNDckcsUUF0Q3FHLEVBc0MxRjtBQUFBOztBQUNmLGVBQU8sS0FBSyxJQUFMLENBQVcsUUFBWCxFQUNOLElBRE0sQ0FDQSxZQUFNO0FBQ1QsbUJBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsTUFBcEI7QUFDQSxtQkFBSyxJQUFMLENBQVUsU0FBVjtBQUNBLG1CQUFPLFFBQVEsT0FBUixFQUFQO0FBQ0gsU0FMTSxDQUFQO0FBTUgsS0E3QzRHOzs7QUErQzdHLFlBQVEsRUEvQ3FHOztBQWlEN0csd0JBQW9CO0FBQUEsZUFBTyxFQUFQO0FBQUEsS0FqRHlGOztBQW1EN0csZUFuRDZHLHlCQW1EL0Y7QUFBQTs7QUFDVixlQUFPLE1BQVAsQ0FBZSxRQUFRLFNBQVIsQ0FBZixFQUFtQyxFQUFFLE9BQU8sRUFBRSxPQUFPLGtCQUFULEVBQVQsRUFBbkMsRUFBOEUsV0FBOUUsR0FBNEYsSUFBNUYsQ0FBa0csVUFBbEcsRUFBOEc7QUFBQSxtQkFBTSxPQUFLLE9BQUwsRUFBTjtBQUFBLFNBQTlHOztBQUVBLGVBQU8sSUFBUDtBQUNILEtBdkQ0RztBQXlEN0csZ0JBekQ2RywwQkF5RDlGO0FBQUE7O0FBQ1QsYUFBSyxZQUFMLElBQXVCLEtBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxPQUFkLEVBQXVCLElBQXZCLENBQTZCO0FBQUEsbUJBQVEsU0FBUyxPQUFLLFlBQXRCO0FBQUEsU0FBN0IsTUFBc0UsV0FBL0YsR0FBaUgsS0FBakgsR0FBeUgsSUFBekg7QUFDSCxLQTNENEc7QUE2RDdHLFFBN0Q2RyxnQkE2RHZHLFFBN0R1RyxFQTZENUY7QUFBQTs7QUFDYixlQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVg7QUFBQSxtQkFBdUIsT0FBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixJQUFuQixDQUF5QixZQUFZLEVBQXJDLEVBQXlDLE9BQXpDLENBQXZCO0FBQUEsU0FBYixDQUFQO0FBQ0gsS0EvRDRHO0FBaUU3RyxZQWpFNkcsc0JBaUVsRztBQUFFLGVBQU8sS0FBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixHQUFuQixDQUF1QixTQUF2QixNQUFzQyxNQUE3QztBQUFxRCxLQWpFMkM7QUFtRTdHLFdBbkU2RyxxQkFtRW5HO0FBQ04sYUFBSyxNQUFMLENBQVksTUFBWixDQUFtQixNQUFuQixDQUEyQixLQUFLLElBQWhDOztBQUVBLGFBQVEsS0FBSyxhQUFMLEVBQUYsR0FBMkIsUUFBM0IsR0FBc0MsY0FBNUM7QUFDSCxLQXZFNEc7QUF5RTdHLGdCQXpFNkcsMEJBeUU5RjtBQUNYLGNBQU0sb0JBQU47QUFDQSxlQUFPLElBQVA7QUFDSCxLQTVFNEc7QUE4RTdHLGNBOUU2Ryx3QkE4RWhHO0FBQUUsZUFBTyxJQUFQO0FBQWEsS0E5RWlGO0FBZ0Y3RyxVQWhGNkcsb0JBZ0ZwRztBQUNMLFlBQUksQ0FBQyxLQUFLLFNBQVYsRUFBc0I7QUFBRSxvQkFBUSxHQUFSLENBQWEsSUFBYjtBQUFxQjtBQUM3QyxhQUFLLGFBQUwsQ0FBb0IsRUFBRSxVQUFVLEtBQUssUUFBTCxDQUFlLEtBQUssa0JBQUwsRUFBZixDQUFaLEVBQXdELFdBQVcsS0FBSyxTQUF4RSxFQUFwQjs7QUFFQSxZQUFJLEtBQUssSUFBVCxFQUFnQixLQUFLLElBQUw7O0FBRWhCLGVBQU8sS0FBSyxjQUFMLEdBQ0ssVUFETCxFQUFQO0FBRUgsS0F4RjRHO0FBMEY3RyxrQkExRjZHLDRCQTBGNUY7QUFBQTs7QUFDYixlQUFPLElBQVAsQ0FBYSxLQUFLLEtBQUwsSUFBYyxFQUEzQixFQUFpQyxPQUFqQyxDQUEwQyxlQUFPO0FBQzdDLGdCQUFJLE9BQUssS0FBTCxDQUFZLEdBQVosRUFBa0IsRUFBdEIsRUFBMkI7QUFDdkIsdUJBQUssS0FBTCxDQUFZLEdBQVosSUFBb0IsT0FBSyxPQUFMLENBQWEsTUFBYixDQUFxQixHQUFyQixFQUEwQixFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsS0FBSyxPQUFLLEtBQUwsQ0FBWSxHQUFaLEVBQWtCLEVBQXpCLEVBQTZCLFFBQVEsUUFBckMsRUFBVCxFQUFiLEVBQTFCLENBQXBCO0FBQ0EsdUJBQUssS0FBTCxDQUFZLEdBQVosRUFBa0IsRUFBbEIsQ0FBcUIsTUFBckI7QUFDQSx1QkFBSyxLQUFMLENBQVksR0FBWixFQUFrQixFQUFsQixHQUF1QixTQUF2QjtBQUNIO0FBQ0osU0FORDs7QUFRQSxlQUFPLElBQVA7QUFDSCxLQXBHNEc7QUFzRzdHLFFBdEc2RyxnQkFzR3ZHLFFBdEd1RyxFQXNHNUY7QUFBQTs7QUFDYixlQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVg7QUFBQSxtQkFBdUIsT0FBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixJQUFuQixDQUF5QixZQUFZLEVBQXJDLEVBQXlDLFlBQU07QUFBRSx1QkFBSyxJQUFMLEdBQWE7QUFBVyxhQUF6RSxDQUF2QjtBQUFBLFNBQWIsQ0FBUDtBQUNILEtBeEc0RztBQTBHN0csV0ExRzZHLG1CQTBHcEcsRUExR29HLEVBMEcvRjtBQUNWLFlBQUksTUFBTSxHQUFHLElBQUgsQ0FBUyxLQUFLLEtBQUwsQ0FBVyxJQUFwQixLQUE4QixXQUF4Qzs7QUFFQSxhQUFLLEdBQUwsQ0FBVSxHQUFWLElBQWtCLEtBQUssR0FBTCxDQUFVLEdBQVYsSUFBa0IsS0FBSyxHQUFMLENBQVUsR0FBVixFQUFnQixHQUFoQixDQUFxQixFQUFyQixDQUFsQixHQUE4QyxFQUFoRTs7QUFFQSxXQUFHLFVBQUgsQ0FBYyxLQUFLLEtBQUwsQ0FBVyxJQUF6Qjs7QUFFQSxZQUFJLEtBQUssTUFBTCxDQUFhLEdBQWIsQ0FBSixFQUF5QixLQUFLLGNBQUwsQ0FBcUIsR0FBckIsRUFBMEIsRUFBMUI7QUFDNUIsS0FsSDRHO0FBb0g3RyxpQkFwSDZHLHlCQW9IOUYsT0FwSDhGLEVBb0hwRjtBQUFBOztBQUVyQixZQUFJLFFBQVEsS0FBSyxDQUFMLENBQVEsUUFBUSxRQUFoQixDQUFaO1lBQ0ksaUJBQWUsS0FBSyxLQUFMLENBQVcsSUFBMUIsTUFESjtZQUVJLHFCQUFtQixLQUFLLEtBQUwsQ0FBVyxJQUE5QixNQUZKOztBQUlBLGNBQU0sSUFBTixDQUFZLFVBQUUsQ0FBRixFQUFLLEVBQUwsRUFBYTtBQUNyQixnQkFBSSxNQUFNLFFBQUssQ0FBTCxDQUFPLEVBQVAsQ0FBVjtBQUNBLGdCQUFJLElBQUksRUFBSixDQUFRLFFBQVIsS0FBc0IsTUFBTSxDQUFoQyxFQUFvQyxRQUFLLE9BQUwsQ0FBYyxHQUFkO0FBQ3ZDLFNBSEQ7O0FBS0EsY0FBTSxHQUFOLEdBQVksT0FBWixDQUFxQixVQUFFLEVBQUYsRUFBVTtBQUMzQixvQkFBSyxDQUFMLENBQVEsRUFBUixFQUFhLElBQWIsQ0FBbUIsUUFBbkIsRUFBOEIsSUFBOUIsQ0FBb0MsVUFBRSxTQUFGLEVBQWEsYUFBYjtBQUFBLHVCQUFnQyxRQUFLLE9BQUwsQ0FBYyxRQUFLLENBQUwsQ0FBTyxhQUFQLENBQWQsQ0FBaEM7QUFBQSxhQUFwQztBQUNBLG9CQUFLLENBQUwsQ0FBUSxFQUFSLEVBQWEsSUFBYixDQUFtQixZQUFuQixFQUFrQyxJQUFsQyxDQUF3QyxVQUFFLFNBQUYsRUFBYSxNQUFiLEVBQXlCO0FBQzdELG9CQUFJLE1BQU0sUUFBSyxDQUFMLENBQU8sTUFBUCxDQUFWO0FBQ0Esd0JBQUssS0FBTCxDQUFZLElBQUksSUFBSixDQUFTLFFBQUssS0FBTCxDQUFXLElBQXBCLENBQVosRUFBd0MsRUFBeEMsR0FBNkMsR0FBN0M7QUFDSCxhQUhEO0FBSUgsU0FORDs7QUFRQSxnQkFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXVCLFFBQVEsU0FBUixDQUFrQixNQUFsQixJQUE0QixRQUFuRCxFQUErRCxLQUEvRDs7QUFFQSxlQUFPLElBQVA7QUFDSCxLQTFJNEc7QUE0STdHLGVBNUk2Ryx1QkE0SWhHLEtBNUlnRyxFQTRJekYsRUE1SXlGLEVBNElwRjs7QUFFckIsWUFBSSxXQUFXLEdBQUcsTUFBSCxFQUFmO1lBQ0ksV0FBVyxHQUFHLFdBQUgsQ0FBZ0IsSUFBaEIsQ0FEZjtZQUVJLFVBQVUsR0FBRyxVQUFILENBQWUsSUFBZixDQUZkOztBQUlBLFlBQU0sTUFBTSxLQUFOLEdBQWMsU0FBUyxJQUF6QixJQUNFLE1BQU0sS0FBTixHQUFnQixTQUFTLElBQVQsR0FBZ0IsT0FEbEMsSUFFRSxNQUFNLEtBQU4sR0FBYyxTQUFTLEdBRnpCLElBR0UsTUFBTSxLQUFOLEdBQWdCLFNBQVMsR0FBVCxHQUFlLFFBSHJDLEVBR29EOztBQUVoRCxtQkFBTyxLQUFQO0FBQ0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0EzSjRHOzs7QUE2SjdHLG1CQUFlO0FBN0o4RixDQUFoRyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFDLENBQUQ7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFDLENBQUQ7QUFBQSw4REFFK0IsRUFBRSxLQUZqQztBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFDLENBQUQsRUFBTztBQUNwQixRQUFJLDhDQUVELEVBQUUsTUFBRixDQUFTLEdBQVQsQ0FBYztBQUFBLDRDQUNZLE1BQU0sVUFBUixvQkFEVixxQkFFVCxNQUFNLEtBQVIsdUNBQXFELE1BQU0sSUFBM0QsVUFBc0UsTUFBTSxLQUE1RSxrQkFGVyxvQkFHUixNQUFNLE1BQVIscUJBSFUsbUJBRzBDLE1BQU0sSUFIaEQsaUJBR2tFLE1BQU0sS0FIeEUsd0JBSUwsTUFBTSxJQUpELGNBSWdCLE1BQU0sSUFKdEIsV0FJbUMsTUFBTSxXQUFSLHFCQUF5QyxNQUFNLFdBQS9DLFdBSmpDLHlCQUtMLE1BQU0sTUFBUCxHQUFpQixNQUFNLE9BQU4sQ0FBYyxHQUFkLENBQW1CO0FBQUEsZ0NBQ3ZCLE1BRHVCO0FBQUEsU0FBbkIsRUFDaUIsSUFEakIsQ0FDc0IsRUFEdEIsZUFBakIsS0FMTTtBQUFBLEtBQWQsRUFPTyxJQVBQLENBT1ksRUFQWixDQUZDLGdCQUFKO0FBWUEsV0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXNCLElBQXRCLENBQVA7QUFDQSxXQUFPLElBQVA7QUFDSCxDQWZEOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFFLENBQUY7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFFLENBQUY7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFFLENBQUY7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFFLE9BQUY7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFFLENBQUY7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFFLENBQUY7QUFBQTtBQUFBLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixlQUFPO0FBQUUsVUFBUSxHQUFSLENBQWEsSUFBSSxLQUFKLElBQWEsR0FBMUI7QUFBaUMsQ0FBM0Q7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCOztBQUViLFdBQU8sUUFBUSxXQUFSLENBRk07O0FBSWIsWUFBUSxRQUFRLFFBQVIsQ0FKSzs7QUFNYixPQUFHLFdBQUUsR0FBRixFQUFPLElBQVAsRUFBYSxPQUFiO0FBQUEsZUFDQyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYO0FBQUEsbUJBQXVCLFFBQVEsS0FBUixDQUFlLEdBQWYsRUFBb0IsT0FBcEIsRUFBNkIsS0FBSyxNQUFMLENBQWEsVUFBRSxDQUFGO0FBQUEsa0RBQVEsSUFBUjtBQUFRLHdCQUFSO0FBQUE7O0FBQUEsdUJBQWtCLElBQUksT0FBTyxDQUFQLENBQUosR0FBZ0IsUUFBUSxJQUFSLENBQWxDO0FBQUEsYUFBYixDQUE3QixDQUF2QjtBQUFBLFNBQWIsQ0FERDtBQUFBLEtBTlU7O0FBU2IsZUFUYSx5QkFTQztBQUFFLGVBQU8sSUFBUDtBQUFhO0FBVGhCLENBQWpCOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdGFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9hZG1pbicpLFxuXHRkZW1vOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9kZW1vJyksXG5cdGZpZWxkRXJyb3I6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2ZpZWxkRXJyb3InKSxcblx0Zm9ybTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZm9ybScpLFxuXHRoZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2hlYWRlcicpLFxuXHRob21lOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9ob21lJyksXG5cdGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpLFxuXHRsaXN0OiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9saXN0JyksXG5cdGxvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9sb2dpbicpLFxuXHRyZWdpc3RlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvcmVnaXN0ZXInKVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvQWRtaW4nKSxcblx0RGVtbzogcmVxdWlyZSgnLi92aWV3cy9EZW1vJyksXG5cdEZvcm06IHJlcXVpcmUoJy4vdmlld3MvRm9ybScpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvSG9tZScpLFxuXHRMaXN0OiByZXF1aXJlKCcuL3ZpZXdzL0xpc3QnKSxcblx0TG9naW46IHJlcXVpcmUoJy4vdmlld3MvTG9naW4nKSxcblx0TXlWaWV3OiByZXF1aXJlKCcuL3ZpZXdzL015VmlldycpLFxuXHRSZWdpc3RlcjogcmVxdWlyZSgnLi92aWV3cy9SZWdpc3RlcicpXG59IiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCB7XG5cbiAgICBjcmVhdGUoIG5hbWUsIG9wdHMgKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSkgXSxcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oIHsgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSwgdXNlcjogeyB2YWx1ZTogdGhpcy5Vc2VyIH0sIGZhY3Rvcnk6IHsgdmFsdWU6IHRoaXMgfSB9LCBvcHRzIClcbiAgICAgICAgKS5jb25zdHJ1Y3RvcigpXG4gICAgfSxcblxufSwge1xuICAgIFRlbXBsYXRlczogeyB2YWx1ZTogcmVxdWlyZSgnLi4vLlRlbXBsYXRlTWFwJykgfSxcbiAgICBVc2VyOiB7IHZhbHVlOiByZXF1aXJlKCcuLi9tb2RlbHMvVXNlcicgKSB9LFxuICAgIFZpZXdzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVmlld01hcCcpIH1cbn0gKVxuIiwicmVxdWlyZSgnanF1ZXJ5JykoICgpID0+IHtcbiAgICByZXF1aXJlKCcuL3JvdXRlcicpXG4gICAgcmVxdWlyZSgnYmFja2JvbmUnKS5oaXN0b3J5LnN0YXJ0KCB7IHB1c2hTdGF0ZTogdHJ1ZSB9IClcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgKCByZXF1aXJlKCdiYWNrYm9uZScpLk1vZGVsLmV4dGVuZCgge1xuICAgIGRlZmF1bHRzOiB7IHN0YXRlOiB7fSB9LFxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hlZCA9IHRoaXMuZmV0Y2goKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG4gICAgdXJsKCkgeyByZXR1cm4gXCIvdXNlclwiIH1cbn0gKSApKClcbiIsIm1vZHVsZS5leHBvcnRzID0gbmV3IChcbiAgICByZXF1aXJlKCdiYWNrYm9uZScpLlJvdXRlci5leHRlbmQoIHtcblxuICAgICAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgICAgICBFcnJvcjogcmVxdWlyZSgnLi4vLi4vbGliL015RXJyb3InKSxcbiAgICAgICAgXG4gICAgICAgIFVzZXI6IHJlcXVpcmUoJy4vbW9kZWxzL1VzZXInKSxcblxuICAgICAgICBWaWV3RmFjdG9yeTogcmVxdWlyZSgnLi9mYWN0b3J5L1ZpZXcnKSxcblxuICAgICAgICBpbml0aWFsaXplKCkge1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRDb250YWluZXIgPSB0aGlzLiQoJyNjb250ZW50JylcblxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHtcbiAgICAgICAgICAgICAgICB2aWV3czogeyB9LFxuICAgICAgICAgICAgICAgIGhlYWRlcjogdGhpcy5WaWV3RmFjdG9yeS5jcmVhdGUoICdoZWFkZXInLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuY29udGVudENvbnRhaW5lciwgbWV0aG9kOiAnYmVmb3JlJyB9IH0gfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSxcblxuICAgICAgICBnb0hvbWUoKSB7IHRoaXMubmF2aWdhdGUoICdob21lJywgeyB0cmlnZ2VyOiB0cnVlIH0gKSB9LFxuXG4gICAgICAgIGhhbmRsZXIoIHJlc291cmNlICkge1xuXG4gICAgICAgICAgICBpZiggIXJlc291cmNlICkgcmV0dXJuIHRoaXMuZ29Ib21lKClcblxuICAgICAgICAgICAgdGhpcy5Vc2VyLmZldGNoZWQuZG9uZSggKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXIub25Vc2VyKClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnc2lnbm91dCcsICgpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCBuYW1lID0+IHRoaXMudmlld3NbIG5hbWUgXS5kZWxldGUoKSApIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCB0aGlzLmdvSG9tZSgpIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy52aWV3cyApLm1hcCggdmlldyA9PiB0aGlzLnZpZXdzWyB2aWV3IF0uaGlkZSgpICkgKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLnZpZXdzWyByZXNvdXJjZSBdICkgcmV0dXJuIHRoaXMudmlld3NbIHJlc291cmNlIF0uc2hvdygpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIHJlc291cmNlIF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5WaWV3RmFjdG9yeS5jcmVhdGUoIHJlc291cmNlLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuY29udGVudENvbnRhaW5lciB9IH0gfSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCAncm91dGUnLCByb3V0ZSA9PiB0aGlzLm5hdmlnYXRlKCByb3V0ZSwgeyB0cmlnZ2VyOiB0cnVlIH0gKSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSApLmZhaWwoIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgXG4gICAgICAgIH0sXG5cbiAgICAgICAgcm91dGVzOiB7ICcoKnJlcXVlc3QpJzogJ2hhbmRsZXInIH1cblxuICAgIH0gKVxuKSgpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBWaWV3czoge1xuICAgICAgICBsaXN0OiB7IHZpZXc6IHJlcXVpcmUoJy4vTGlzdCcpLCB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvbGlzdCcpICB9LFxuICAgICAgICBsb2dpbjogeyB2aWV3OiByZXF1aXJlKCcuL0xvZ2luJyksIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9sb2dpbicpICB9LFxuICAgICAgICByZWdpc3RlcjogeyB2aWV3OiByZXF1aXJlKCcuL1JlZ2lzdGVyJyksIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9yZWdpc3RlcicpICB9XG4gICAgfSxcblxuICAgIC8qZmllbGRzOiBbIHtcbiAgICAgICAgY2xhc3M6IFwiZm9ybS1pbnB1dFwiLFxuICAgICAgICBuYW1lOiBcImVtYWlsXCIsXG4gICAgICAgIGxhYmVsOiAnRW1haWwnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGVycm9yOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJmb3JtLWlucHV0XCIsXG4gICAgICAgIGhvcml6b250YWw6IHRydWUsXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbGFiZWw6ICdQYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIGVycm9yOiBcIlBhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLlwiLFxuICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPj0gNlxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtYm9yZGVybGVzc1wiLFxuICAgICAgICBuYW1lOiBcImFkZHJlc3NcIixcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJTdHJlZXQgQWRkcmVzc1wiLFxuICAgICAgICBlcnJvcjogXCJSZXF1aXJlZCBmaWVsZC5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLiQudHJpbSh2YWwpICE9PSAnJyB9XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJpbnB1dC1mbGF0XCIsXG4gICAgICAgIG5hbWU6IFwiY2l0eVwiLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcIkNpdHlcIixcbiAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtYm9yZGVybGVzc1wiLFxuICAgICAgICBzZWxlY3Q6IHRydWUsXG4gICAgICAgIG5hbWU6IFwiZmF2ZVwiLFxuICAgICAgICBsYWJlbDogXCJGYXZlIENhbiBBbGJ1bVwiLFxuICAgICAgICBvcHRpb25zOiBbIFwiTW9uc3RlciBNb3ZpZVwiLCBcIlNvdW5kdHJhY2tzXCIsIFwiVGFnbyBNYWdvXCIsIFwiRWdlIEJhbXlhc2lcIiwgXCJGdXR1cmUgRGF5c1wiIF0sXG4gICAgICAgIGVycm9yOiBcIlBsZWFzZSBjaG9vc2UgYW4gb3B0aW9uLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9IF0sKi9cblxuICAgIEZvcm06IHJlcXVpcmUoJy4vRm9ybScpLFxuICAgIExpc3Q6IHJlcXVpcmUoJy4vTGlzdCcpLFxuICAgIExvZ2luOiByZXF1aXJlKCcuL0xvZ2luJyksXG4gICAgUmVnaXN0ZXI6IHJlcXVpcmUoJy4vUmVnaXN0ZXInKSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIFxuICAgICAgICAvL3RoaXMubGlzdEluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5MaXN0LCB7IGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMubGlzdCB9IH0gKS5jb25zdHJ1Y3RvcigpXG5cbiAgICAgICAgLyp0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwgeyBcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSwgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmZvcm0gfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKSovXG5cbiAgICAgICAgLyp0aGlzLmxvZ2luRXhhbXBsZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTG9naW4sIHsgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmxvZ2luRXhhbXBsZSB9LFxuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgICovXG4gICAgICAgIFxuICAgICAgICAvKnRoaXMucmVnaXN0ZXJFeGFtcGxlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5SZWdpc3RlciwgeyBcbiAgICAgICAgICAgIGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMucmVnaXN0ZXJFeGFtcGxlIH0sXG4gICAgICAgICAgICBjbGFzczogeyB2YWx1ZTogJ2Zvcm0taW5wdXQnIH0sXG4gICAgICAgICAgICBob3Jpem9udGFsOiB7IHZhbHVlOiB0cnVlIH1cbiAgICAgICAgfSApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9naW5FeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgdGhpcy5sb2dpbkV4YW1wbGUuZWxzLmxvZ2luQnRuLm9mZignY2xpY2snKVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5jYW5jZWxCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgKi9cblxuICAgICAgICAvL3RoaXMuZWxzZS5zdWJtaXRCdG4ub24oICdjbGljaycsICgpID0+IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6ICcnIH0gKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9kZW1vJylcblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZW1haWxSZWdleDogL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLyxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHsgXG4gICAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goIGZpZWxkID0+IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gZmllbGQubmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZpZWxkLm5hbWUuc2xpY2UoMSlcbiAgICAgICAgICAgIGZpZWxkWyAnY2xhc3MnIF0gPSB0aGlzLmNsYXNzXG4gICAgICAgICAgICBpZiggdGhpcy5ob3Jpem9udGFsICkgZmllbGRbICdob3Jpem9udGFsJyBdID0gdHJ1ZVxuICAgICAgICAgICAgZmllbGRbICggdGhpcy5jbGFzcyA9PT0gJ2Zvcm0taW5wdXQnICkgPyAnbGFiZWwnIDogJ3BsYWNlaG9sZGVyJyBdID0gbmFtZVxuXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB7IGZpZWxkczogdGhpcy5maWVsZHMgfSB9LFxuXG4gICAgZ2V0Rm9ybURhdGEoKSB7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMuZWxzLCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIC9JTlBVVHxURVhUQVJFQUQvLnRlc3QoIHRoaXMuZWxzWyBrZXkgXS5wcm9wKFwidGFnTmFtZVwiKSApICkgdGhpcy5mb3JtRGF0YVsga2V5IF0gPSB0aGlzLmVsc1sga2V5IF0udmFsKClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURhdGFcbiAgICB9LFxuXG4gICAgZmllbGRzOiBbIF0sXG5cbiAgICBvbkZvcm1GYWlsKCBlcnJvciApIHtcbiAgICAgICAgY29uc29sZS5sb2coIGVycm9yLnN0YWNrIHx8IGVycm9yICk7XG4gICAgICAgIC8vdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5zZXJ2ZXJFcnJvciggZXJyb3IgKSwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuYnV0dG9uUm93LCBtZXRob2Q6ICdiZWZvcmUnIH0gfSApXG4gICAgfSxcblxuICAgIG9uU3VibWlzc2lvblJlc3BvbnNlKCkgeyB9LFxuXG4gICAgcG9zdEZvcm0oIGRhdGEgKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kLmFqYXgoIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSggZGF0YS52YWx1ZXMgKSB8fCBKU09OLnN0cmluZ2lmeSggdGhpcy5nZXRGb3JtRGF0YSgpICksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyB0b2tlbjogKCB0aGlzLnVzZXIgKSA/IHRoaXMudXNlci5nZXQoJ3Rva2VuJykgOiAnJyB9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIHVybDogYC8keyBkYXRhLnJlc291cmNlIH1gXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmZpbmQoJ2lucHV0JylcbiAgICAgICAgLm9uKCAnYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICRlbCA9IHNlbGYuJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmaWVsZCA9IHNlbGYuXyggc2VsZi5maWVsZHMgKS5maW5kKCBmdW5jdGlvbiggZmllbGQgKSB7IHJldHVybiBmaWVsZC5uYW1lID09PSAkZWwuYXR0cignaWQnKSB9IClcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHJlc29sdmUoIGZpZWxkLnZhbGlkYXRlLmNhbGwoIHNlbGYsICRlbC52YWwoKSApICkgKVxuICAgICAgICAgICAgLnRoZW4oIHZhbGlkID0+IHtcbiAgICAgICAgICAgICAgICBpZiggdmFsaWQgKSB7IHNlbGYuc2hvd1ZhbGlkKCAkZWwgKSB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IHNlbGYuc2hvd0Vycm9yKCAkZWwsIGZpZWxkLmVycm9yICkgfVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgICAgICAub24oICdmb2N1cycsIGZ1bmN0aW9uKCkgeyBzZWxmLnJlbW92ZUVycm9yKCBzZWxmLiQodGhpcykgKSB9IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZW1vdmVFcnJvciggJGVsICkge1xuICAgICAgICAkZWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Vycm9yIHZhbGlkJylcbiAgICAgICAgJGVsLnNpYmxpbmdzKCcuZmVlZGJhY2snKS5yZW1vdmUoKVxuICAgIH0sXG5cbiAgICBzaG93RXJyb3IoICRlbCwgZXJyb3IgKSB7XG5cbiAgICAgICAgdmFyIGZvcm1Hcm91cCA9ICRlbC5wYXJlbnQoKVxuXG4gICAgICAgIGlmKCBmb3JtR3JvdXAuaGFzQ2xhc3MoICdlcnJvcicgKSApIHJldHVyblxuXG4gICAgICAgIGZvcm1Hcm91cC5yZW1vdmVDbGFzcygndmFsaWQnKS5hZGRDbGFzcygnZXJyb3InKS5hcHBlbmQoIHRoaXMudGVtcGxhdGVzLmZpZWxkRXJyb3IoIHsgZXJyb3I6IGVycm9yIH0gKSApXG4gICAgfSxcblxuICAgIHNob3dWYWxpZCggJGVsICkge1xuICAgICAgICAkZWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuYWRkQ2xhc3MoJ3ZhbGlkJylcbiAgICAgICAgJGVsLnNpYmxpbmdzKCcuZmVlZGJhY2snKS5yZW1vdmUoKVxuICAgIH0sXG5cbiAgICBzdWJtaXRGb3JtKCByZXNvdXJjZSApIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiggcmVzdWx0ID09PSBmYWxzZSApIHJldHVyblxuICAgICAgICAgICAgdGhpcy5wb3N0Rm9ybSggcmVzb3VyY2UgKVxuICAgICAgICAgICAgLnRoZW4oICgpID0+IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UoKSApXG4gICAgICAgICAgICAuY2F0Y2goIGUgPT4gdGhpcy5vbkZvcm1GYWlsKCBlICkgKVxuICAgICAgICB9ICkgICAgXG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9mb3JtJyksXG5cbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgZmllbGRFcnJvcjogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvZmllbGRFcnJvcicpXG4gICAgfSxcblxuICAgIHZhbGlkYXRlKCkge1xuICAgICAgICB2YXIgdmFsaWQgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHRoaXMuZmllbGRzLm1hcCggZmllbGQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmllbGQudmFsaWRhdGUuY2FsbCh0aGlzLCB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgpICkgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCByZXN1bHQgPT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKCB0aGlzLmVsc1sgZmllbGQubmFtZSBdLCBmaWVsZC5lcnJvciApICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkgKVxuICAgICAgICAudGhlbiggKCkgPT4gdmFsaWQgKVxuICAgICAgICAuY2F0Y2goIGUgPT4geyBjb25zb2xlLmxvZyggZS5zdGFjayB8fCBlICk7IHJldHVybiBmYWxzZSB9IClcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIHNpZ25vdXRCdG46IHsgbWV0aG9kOiAnc2lnbm91dCcgfVxuICAgIH0sXG5cbiAgICBvblVzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBcbiAgICBzaWdub3V0KCkge1xuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9ICdwYXRjaHdvcmtqd3Q9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UOyc7XG5cbiAgICAgICAgdGhpcy51c2VyLmNsZWFyKClcblxuICAgICAgICB0aGlzLmVtaXQoJ3NpZ25vdXQnKVxuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKCBcIi9cIiwgeyB0cmlnZ2VyOiB0cnVlIH0gKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2xpc3QnKVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ3JlZ2lzdGVyQnRuJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICcnLCBtZXRob2Q6ICdzaG93UmVnaXN0cmF0aW9uJyB9LFxuICAgICAgICAnbG9naW5CdG4nOiB7IGV2ZW50OiAnY2xpY2snLCBzZWxlY3RvcjogJycsIG1ldGhvZDogJ2xvZ2luJyB9XG4gICAgfSxcblxuICAgIGZpZWxkczogWyB7ICAgICAgICBcbiAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJyxcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVtYWlsUmVnZXgudGVzdCh2YWwpIH1cbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdwYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIGVycm9yOiBcIlBhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLlwiLFxuICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPj0gNlxuICAgIH0gXSxcblxuICAgIEZvcm06IHJlcXVpcmUoJy4vRm9ybScpLFxuXG4gICAgbG9naW4oKSB7IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6IFwiYXV0aFwiIH0gKSB9LFxuXG4gICAgb25TdWJtaXNzaW9uUmVzcG9uc2UoIHJlc3BvbnNlICkge1xuICAgICAgICBpZiggT2JqZWN0LmtleXMoIHJlc3BvbnNlICkubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZXMuaW52YWxpZExvZ2luRXJyb3IsIGluc2VydGlvbjogeyAkZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0gKVxuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJykuc2V0KCByZXNwb25zZSApXG4gICAgICAgIHRoaXMuZW1pdCggXCJsb2dnZWRJblwiIClcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5mb3JtSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkZvcm0sIHtcbiAgICAgICAgICAgIGNsYXNzOiB7IHZhbHVlOiB0aGlzLmNsYXNzIH0sXG4gICAgICAgICAgICAvL2hvcml6b250YWw6IHsgdmFsdWU6IHRoaXMuaG9yaXpvbnRhbCB9LFxuICAgICAgICAgICAgZmllbGRzOiB7IHZhbHVlOiB0aGlzLmZpZWxkcyB9LCBcbiAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuZWxzLmZvcm0gfSB9LFxuICAgICAgICAgICAgb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgUmVnaXN0ZXI6IHJlcXVpcmUoJy4vUmVnaXN0ZXInKSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuXG4gICAgc2hvd1JlZ2lzdHJhdGlvbigpIHsgXG5cbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmZvcm1JbnN0YW5jZSxcbiAgICAgICAgICAgIGVtYWlsID0gZm9ybS5lbHMuZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZCA9IGZvcm0uZWxzLnBhc3N3b3JkXG4gICAgICAgIFxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBlbWFpbCApXG4gICAgICAgIGVtYWlsLnZhbCgnJylcblxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBwYXNzd29yZCApXG4gICAgICAgIHBhc3N3b3JkLnZhbCgnJylcbiAgICAgICAgXG4gICAgICAgIGlmICggZm9ybS5lbHMuaW52YWxpZExvZ2luRXJyb3IgKSBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvci5yZW1vdmUoKVxuICAgICAgICBpZiAoIGZvcm0uZWxzLnNlcnZlckVycm9yICkgZm9ybS5lbHMuc2VydmVyRXJyb3IucmVtb3ZlKClcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+ICggdGhpcy5yZWdpc3Rlckluc3RhbmNlICkgPyB0aGlzLnJlZ2lzdGVySW5zdGFuY2Uuc2hvdygpXG4gICAgICAgICAgICA6IE9iamVjdC5jcmVhdGUoIHRoaXMuUmVnaXN0ZXIsIHtcbiAgICAgICAgICAgICAgICBsb2dpbkluc3RhbmNlOiB7IHZhbHVlOiB0aGlzIH0sXG4gICAgICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1mbGF0JyB9IFxuICAgICAgICAgICAgfSApLmNvbnN0cnVjdG9yKCkgKVxuXG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9sb2dpbicpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpXG4gICAgfVxuXG59IClcbiIsInZhciBNeVZpZXcgPSBmdW5jdGlvbiggZGF0YSApIHsgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIGRhdGEgKS5pbml0aWFsaXplKCkgfVxuXG5PYmplY3QuYXNzaWduKCBNeVZpZXcucHJvdG90eXBlLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBDb2xsZWN0aW9uOiByZXF1aXJlKCdiYWNrYm9uZScpLkNvbGxlY3Rpb24sXG4gICAgXG4gICAgLy9FcnJvcjogcmVxdWlyZSgnLi4vTXlFcnJvcicpLFxuXG4gICAgTW9kZWw6IHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwsXG5cbiAgICBfOiByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cbiAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZTtcblxuICAgICAgICBpZiggISB0aGlzLmV2ZW50c1sga2V5IF0gKSByZXR1cm5cblxuICAgICAgICB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB0aGlzLmV2ZW50c1trZXldICk7XG5cbiAgICAgICAgaWYoIHR5cGUgPT09ICdbb2JqZWN0IE9iamVjdF0nICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSwgZWwgKTtcbiAgICAgICAgfSBlbHNlIGlmKCB0eXBlID09PSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XS5mb3JFYWNoKCBzaW5nbGVFdmVudCA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBzaW5nbGVFdmVudCwgZWwgKSApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhICYmIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lciApIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZFwiKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGZvcm1hdDoge1xuICAgICAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXI6IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbiAgICB9LFxuXG4gICAgZ2V0Rm9ybURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhID0geyB9XG5cbiAgICAgICAgdGhpcy5fLmVhY2goIHRoaXMudGVtcGxhdGVEYXRhLCAoICRlbCwgbmFtZSApID0+IHsgaWYoICRlbC5wcm9wKFwidGFnTmFtZVwiKSA9PT0gXCJJTlBVVFwiICYmICRlbC52YWwoKSApIHRoaXMuZm9ybURhdGFbbmFtZV0gPSAkZWwudmFsKCkgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURhdGFcbiAgICB9LFxuXG4gICAgZ2V0Um91dGVyOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4uL3JvdXRlcicpIH0sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnM6ICgpID0+ICh7fSksXG5cbiAgICAvKmhpZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlEuUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuaGlkZSgpXG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSwqL1xuXG4gICAgaW5pdGlhbGl6ZSgpIHtcblxuICAgICAgICBpZiggISB0aGlzLmNvbnRhaW5lciApIHRoaXMuY29udGFpbmVyID0gdGhpcy4kKCcjY29udGVudCcpXG4gICAgICAgIFxuICAgICAgICB0aGlzLnJvdXRlciA9IHRoaXMuZ2V0Um91dGVyKClcblxuICAgICAgICAvL3RoaXMubW9kYWxWaWV3ID0gcmVxdWlyZSgnLi9tb2RhbCcpXG5cbiAgICAgICAgdGhpcy4kKHdpbmRvdykucmVzaXplKCB0aGlzLl8udGhyb3R0bGUoICgpID0+IHRoaXMuc2l6ZSgpLCA1MDAgKSApXG5cbiAgICAgICAgaWYoIHRoaXMucmVxdWlyZXNMb2dpbiAmJiAhIHRoaXMudXNlci5pZCApIHtcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vTG9naW4nKS5zaG93KCkub25jZSggXCJzdWNjZXNzXCIsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLmhlYWRlci5vblVzZXIoIHRoaXMudXNlciApXG5cbiAgICAgICAgICAgICAgICBpZiggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCAhIHRoaXMuXyggdGhpcy51c2VyLmdldCgncm9sZXMnKSApLmNvbnRhaW5zKCB0aGlzLnJlcXVpcmVzUm9sZSApICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgnWW91IGRvIG5vdCBoYXZlIGFjY2VzcycpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9IGVsc2UgaWYoIHRoaXMudXNlci5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSApIHtcbiAgICAgICAgICAgIGlmKCAoICEgdGhpcy5fKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpICkuY29udGFpbnMoIHRoaXMucmVxdWlyZXNSb2xlICkgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoJ1lvdSBkbyBub3QgaGF2ZSBhY2Nlc3MnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKClcbiAgICB9LFxuXG4gICAgaXNIaWRkZW46IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgfSxcblxuICAgIFxuICAgIG1vbWVudDogcmVxdWlyZSgnbW9tZW50JyksXG5cbiAgICBwb3N0UmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJTdWJ2aWV3cygpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIC8vUTogcmVxdWlyZSgncScpLFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNsdXJwVGVtcGxhdGUoIHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksXG4gICAgICAgICAgICBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmluc2VydGlvbkVsIHx8IHRoaXMuY29udGFpbmVyLCBtZXRob2Q6IHRoaXMuaW5zZXJ0aW9uTWV0aG9kIH0gfSApXG5cbiAgICAgICAgdGhpcy5zaXplKClcblxuICAgICAgICB0aGlzLnBvc3RSZW5kZXIoKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMuc3Vidmlld3MgfHwgWyBdICkuZm9yRWFjaCgga2V5ID0+IFxuICAgICAgICAgICAgdGhpcy5zdWJ2aWV3c1sga2V5IF0uZm9yRWFjaCggc3Vidmlld01ldGEgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXNbIHN1YnZpZXdNZXRhLm5hbWUgXSA9IG5ldyBzdWJ2aWV3TWV0YS52aWV3KCB7IGNvbnRhaW5lcjogdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdIH0gKSB9ICkgKVxuICAgIH0sXG5cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLnNob3coKVxuICAgICAgICB0aGlzLnNpemUoKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2x1cnBFbDogZnVuY3Rpb24oIGVsICkge1xuXG4gICAgICAgIHZhciBrZXkgPSBlbC5hdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdID0gKCB0aGlzLnRlbXBsYXRlRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpIClcbiAgICAgICAgICAgID8gdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdLmFkZCggZWwgKVxuICAgICAgICAgICAgOiBlbDtcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgaWYoIHRoaXMuZXZlbnRzWyBrZXkgXSApIHRoaXMuZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzbHVycFRlbXBsYXRlOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblxuICAgICAgICB2YXIgJGh0bWwgPSB0aGlzLiQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gJ1tkYXRhLWpzXSc7XG5cbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhID09PSB1bmRlZmluZWQgKSB0aGlzLnRlbXBsYXRlRGF0YSA9IHsgfTtcblxuICAgICAgICAkaHRtbC5lYWNoKCAoIGluZGV4LCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSApIHRoaXMuc2x1cnBFbCggJGVsIClcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRodG1sLmdldCgpLmZvckVhY2goICggZWwgKSA9PiB7IHRoaXMuJCggZWwgKS5maW5kKCBzZWxlY3RvciApLmVhY2goICggaSwgZWxUb0JlU2x1cnBlZCApID0+IHRoaXMuc2x1cnBFbCggdGhpcy4kKGVsVG9CZVNsdXJwZWQpICkgKSB9IClcbiAgICAgICBcbiAgICAgICAgaWYoIG9wdGlvbnMgJiYgb3B0aW9ucy5pbnNlcnRpb24gKSBvcHRpb25zLmluc2VydGlvbi4kZWxbICggb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kICkgPyBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgOiAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBcbiAgICBiaW5kRXZlbnQ6IGZ1bmN0aW9uKCBlbGVtZW50S2V5LCBldmVudERhdGEsIGVsICkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSAoIGVsICkgPyBlbCA6IHRoaXMudGVtcGxhdGVEYXRhWyBlbGVtZW50S2V5IF07XG5cbiAgICAgICAgZWxlbWVudHMub24oIGV2ZW50RGF0YS5ldmVudCB8fCAnY2xpY2snLCBldmVudERhdGEuc2VsZWN0b3IsIGV2ZW50RGF0YS5tZXRhLCB0aGlzWyBldmVudERhdGEubWV0aG9kIF0uYmluZCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBpc01vdXNlT25FbDogZnVuY3Rpb24oIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlICk7XG5cbiAgICAgICAgaWYoICggZXZlbnQucGFnZVggPCBlbE9mZnNldC5sZWZ0ICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVggPiAoIGVsT2Zmc2V0LmxlZnQgKyBlbFdpZHRoICkgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA8IGVsT2Zmc2V0LnRvcCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZID4gKCBlbE9mZnNldC50b3AgKyBlbEhlaWdodCApICkgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcbiAgICBcbiAgICBzaXplOiAoKSA9PiB7IHRoaXMgfSxcblxuICAgIHVzZXI6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyksXG5cbiAgICB1dGlsOiByZXF1aXJlKCd1dGlsJylcblxufSApXG5cbm1vZHVsZS5leHBvcnRzID0gTXlWaWV3XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBmb3JtID0gdGhpcy5mb3JtSW5zdGFuY2UsXG4gICAgICAgICAgICBuYW1lID0gZm9ybS5lbHMubmFtZSxcbiAgICAgICAgICAgIGVtYWlsID0gZm9ybS5lbHMuZW1haWxcbiAgICAgICAgXG4gICAgICAgIGZvcm0ucmVtb3ZlRXJyb3IoIG5hbWUgKVxuICAgICAgICBuYW1lLnZhbCgnJylcblxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBlbWFpbCApXG4gICAgICAgIGVtYWlsLnZhbCgnJylcbiAgICAgICAgXG4gICAgICAgIGlmICggZm9ybS5lbHMuaW52YWxpZExvZ2luRXJyb3IgKSBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvci5yZW1vdmUoKVxuICAgICAgICBpZiAoIGZvcm0uZWxzLnNlcnZlckVycm9yICkgZm9ybS5lbHMuc2VydmVyRXJyb3IucmVtb3ZlKClcblxuICAgICAgICB0aGlzLmxvZ2luSW5zdGFuY2VbIFwicmVnaXN0ZXJJbnN0YW5jZVwiIF0gPSB0aGlzXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubG9naW5JbnN0YW5jZS5zaG93KCkgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ3JlZ2lzdGVyQnRuJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICcnLCBtZXRob2Q6ICdyZWdpc3RlcicgfSxcbiAgICAgICAgJ2NhbmNlbEJ0bic6IHsgZXZlbnQ6ICdjbGljaycsIHNlbGVjdG9yOiAnJywgbWV0aG9kOiAnY2FuY2VsJyB9XG4gICAgfSxcblxuICAgIGZpZWxkczogWyB7XG4gICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogJ05hbWUgaXMgYSByZXF1aXJlZCBmaWVsZC4nLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgZXJyb3I6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgfSBdLFxuXG4gICAgRm9ybTogcmVxdWlyZSgnLi9Gb3JtJyksXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZTogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXG4gICAgICAgIGlmICggcmVzcG9uc2Uuc3VjY2VzcyA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5pbnZhbGlkTG9naW5FcnJvciggcmVzcG9uc2UgKSwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuYnV0dG9uUm93LCBtZXRob2Q6ICdiZWZvcmUnIH0gfSApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXIuc2V0KCByZXNwb25zZS5yZXN1bHQubWVtYmVyIClcblxuICAgICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKCBmaWVsZCA9PiB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgnJykgKVxuXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubG9naW5JbnN0YW5jZS5lbWl0KCBcImxvZ2dlZEluXCIgKSApXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwge1xuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6IHRoaXMuY2xhc3MgfSxcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSxcbiAgICAgICAgICAgIGhvcml6b250YWw6IHsgdmFsdWU6IHRoaXMuaG9yaXpvbnRhbCB9LCBcbiAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuZWxzLmZvcm0gfSB9LFxuICAgICAgICAgICAgb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG5cbiAgICByZWdpc3RlcigpIHsgdGhpcy5mb3JtSW5zdGFuY2Uuc3VibWl0Rm9ybSggeyByZXNvdXJjZTogXCJtZW1iZXJcIiB9ICkgfSxcbiAgICBcbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9yZWdpc3RlcicpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgXzogcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXG4gICAgJDogcmVxdWlyZSgnanF1ZXJ5JyksXG5cbiAgICBDb2xsZWN0aW9uOiByZXF1aXJlKCdiYWNrYm9uZScpLkNvbGxlY3Rpb24sXG4gICAgXG4gICAgTW9kZWw6IHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwsXG5cbiAgICBiaW5kRXZlbnQoIGtleSwgZXZlbnQsIHNlbGVjdG9yPScnICkge1xuICAgICAgICB0aGlzLmVsc1trZXldLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZSA9PiB0aGlzWyBgb24ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGtleSl9JHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihldmVudCl9YCBdKCBlICkgKVxuICAgIH0sXG5cbiAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXI6IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSksXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBpZiggdGhpcy5zaXplICkgdGhpcy4kKHdpbmRvdykucmVzaXplKCB0aGlzLl8udGhyb3R0bGUoICgpID0+IHRoaXMuc2l6ZSgpLCA1MDAgKSApXG5cbiAgICAgICAgaWYoIHRoaXMucmVxdWlyZXNMb2dpbiAmJiAhdGhpcy51c2VyLmlkICkgcmV0dXJuIHRoaXMuaGFuZGxlTG9naW4oKVxuXG4gICAgICAgIGlmKCB0aGlzLnVzZXIgJiYgdGhpcy51c2VyLmlkICYmIHRoaXMucmVxdWlyZXNSb2xlICYmICF0aGlzLmhhc1ByaXZpbGVnZXMoKSApIHJldHVybiB0aGlzLnNob3dOb0FjY2VzcygpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywgeyBlbHM6IHsgfSwgc2x1cnA6IHsgYXR0cjogJ2RhdGEtanMnLCB2aWV3OiAnZGF0YS12aWV3JyB9LCB2aWV3czogeyB9IH0gKS5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdGhpcy5ldmVudHNba2V5XVxuXG4gICAgICAgIGlmKCB0eXBlID09PSBcInN0cmluZ1wiICkgeyB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldICkgfVxuICAgICAgICBlbHNlIGlmKCBBcnJheS5pc0FycmF5KCB0aGlzLmV2ZW50c1trZXldICkgKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1sga2V5IF0uZm9yRWFjaCggZXZlbnRPYmogPT4gdGhpcy5iaW5kRXZlbnQoIGtleSwgZXZlbnRPYmouZXZlbnQgKSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldLmV2ZW50IClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGUoIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKCBkdXJhdGlvbiApXG4gICAgICAgIC50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsc2UuY29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkXCIpXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnM6ICgpID0+ICh7fSksXG5cbiAgICBoYW5kbGVMb2dpbigpIHtcbiAgICAgICAgT2JqZWN0LmNyZWF0ZSggcmVxdWlyZSgnLi9Mb2dpbicpLCB7IGNsYXNzOiB7IHZhbHVlOiAnaW5wdXQtYm9yZGVybGVzcycgfSB9ICkuY29uc3RydWN0b3IoKS5vbmNlKCBcImxvZ2dlZEluXCIsICgpID0+IHRoaXMub25Mb2dpbigpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBoYXNQcml2aWxlZ2UoKSB7XG4gICAgICAgICggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpLmZpbmQoIHJvbGUgPT4gcm9sZSA9PT0gdGhpcy5yZXF1aXJlc1JvbGUgKSA9PT0gXCJ1bmRlZmluZWRcIiApICkgPyBmYWxzZSA6IHRydWVcbiAgICB9LFxuXG4gICAgaGlkZSggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB0aGlzLmVscy5jb250YWluZXIuaGlkZSggZHVyYXRpb24gfHwgMTAsIHJlc29sdmUgKSApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICB0aGlzLnJvdXRlci5oZWFkZXIub25Vc2VyKCB0aGlzLnVzZXIgKVxuXG4gICAgICAgIHRoaXNbICggdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSA/ICdyZW5kZXInIDogJ3Nob3dOb0FjY2VzcycgXSgpXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYoICF0aGlzLmluc2VydGlvbiApIHsgY29uc29sZS5sb2coIHRoaXMgKSB9XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSggdGhpcy5nZXRUZW1wbGF0ZU9wdGlvbnMoKSApLCBpbnNlcnRpb246IHRoaXMuaW5zZXJ0aW9uIH0gKVxuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgICAgICAgICAgICAucG9zdFJlbmRlcigpXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5WaWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIHRoaXMuVmlld3NbIGtleSBdLmVsICkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGtleSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSgga2V5LCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuVmlld3NbIGtleSBdLmVsLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gdGhpcy5lbHMuY29udGFpbmVyLnNob3coIGR1cmF0aW9uIHx8IDEwLCAoKSA9PiB7IHRoaXMuc2l6ZSgpOyByZXNvbHZlKCkgfSApIClcbiAgICB9LFxuXG4gICAgc2x1cnBFbCggZWwgKSB7XG4gICAgICAgIHZhciBrZXkgPSBlbC5hdHRyKCB0aGlzLnNsdXJwLmF0dHIgKSB8fCAnY29udGFpbmVyJ1xuXG4gICAgICAgIHRoaXMuZWxzWyBrZXkgXSA9IHRoaXMuZWxzWyBrZXkgXSA/IHRoaXMuZWxzWyBrZXkgXS5hZGQoIGVsICkgOiBlbFxuXG4gICAgICAgIGVsLnJlbW92ZUF0dHIodGhpcy5zbHVycC5hdHRyKVxuXG4gICAgICAgIGlmKCB0aGlzLmV2ZW50c1sga2V5IF0gKSB0aGlzLmRlbGVnYXRlRXZlbnRzKCBrZXksIGVsIClcbiAgICB9LFxuXG4gICAgc2x1cnBUZW1wbGF0ZSggb3B0aW9ucyApIHtcblxuICAgICAgICB2YXIgJGh0bWwgPSB0aGlzLiQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gYFske3RoaXMuc2x1cnAuYXR0cn1dYCxcbiAgICAgICAgICAgIHZpZXdTZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLnZpZXd9XWBcblxuICAgICAgICAkaHRtbC5lYWNoKCAoIGksIGVsICkgPT4ge1xuICAgICAgICAgICAgdmFyICRlbCA9IHRoaXMuJChlbCk7XG4gICAgICAgICAgICBpZiggJGVsLmlzKCBzZWxlY3RvciApIHx8IGkgPT09IDAgKSB0aGlzLnNsdXJwRWwoICRlbCApXG4gICAgICAgIH0gKVxuXG4gICAgICAgICRodG1sLmdldCgpLmZvckVhY2goICggZWwgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiQoIGVsICkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCAoIHVuZGVmaW5lZCwgZWxUb0JlU2x1cnBlZCApID0+IHRoaXMuc2x1cnBFbCggdGhpcy4kKGVsVG9CZVNsdXJwZWQpICkgKVxuICAgICAgICAgICAgdGhpcy4kKCBlbCApLmZpbmQoIHZpZXdTZWxlY3RvciApLmVhY2goICggdW5kZWZpbmVkLCB2aWV3RWwgKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyICRlbCA9IHRoaXMuJCh2aWV3RWwpXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sgJGVsLmF0dHIodGhpcy5zbHVycC52aWV3KSBdLmVsID0gJGVsXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgICAgXG4gICAgICAgIG9wdGlvbnMuaW5zZXJ0aW9uLiRlbFsgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kIHx8ICdhcHBlbmQnIF0oICRodG1sIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBpc01vdXNlT25FbCggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKVxuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gYEFkbWluYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAocCkgPT4gYFxuPGRpdiBkYXRhLWpzPVwiY29udGFpbmVyXCI+XG4gICAgPGgyPkxpc3RzPC9oMj5cbiAgICA8cD5Pcmdhbml6ZSB5b3VyIGNvbnRlbnQgaW50byBuZWF0IGdyb3VwcyB3aXRoIG91ciBsaXN0cy48L3A+XG4gICAgPGRpdiBjbGFzcz1cImV4YW1wbGVcIiBkYXRhLXZpZXc9XCJsaXN0XCI+PC9kaXY+XG4gICAgPGgyPkZvcm1zPC9oMj5cbiAgICA8cD5PdXIgZm9ybXMgYXJlIGN1c3RvbWl6YWJsZSB0byBzdWl0IHRoZSBuZWVkcyBvZiB5b3VyIHByb2plY3QuIEhlcmUsIGZvciBleGFtcGxlLCBhcmUgXG4gICAgTG9naW4gYW5kIFJlZ2lzdGVyIGZvcm1zLCBlYWNoIHVzaW5nIGRpZmZlcmVudCBpbnB1dCBzdHlsZXMuPC9wPlxuICAgIDxkaXYgY2xhc3M9XCJleGFtcGxlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtdmlld1wiPlxuICAgICAgICAgICAgPGRpdiBkYXRhLXZpZXc9XCJsb2dpblwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlubGluZS12aWV3XCI+XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdmlldz1cInJlZ2lzdGVyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChwKSA9PlxuXG5gPHNwYW4gY2xhc3M9XCJmZWVkYmFja1wiIGRhdGEtanM9XCJmaWVsZEVycm9yXCI+JHsgcC5lcnJvciB9PC9zcGFuPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IHtcbiAgICB2YXIgaHRtbCA9IGBcbjxmb3JtIGRhdGEtanM9XCJjb250YWluZXJcIj5cbiAgICAkeyBwLmZpZWxkcy5tYXAoIGZpZWxkID0+XG4gICAgYDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwICR7ICggZmllbGQuaG9yaXpvbnRhbCApID8gYGhvcml6b250YWxgIDogYGAgfVwiPlxuICAgICAgICR7ICggZmllbGQubGFiZWwgKSA/IGA8bGFiZWwgY2xhc3M9XCJmb3JtLWxhYmVsXCIgZm9yPVwiJHsgZmllbGQubmFtZSB9XCI+JHsgZmllbGQubGFiZWwgfTwvbGFiZWw+YCA6IGBgIH1cbiAgICAgICA8JHsgKCBmaWVsZC5zZWxlY3QgKSA/IGBzZWxlY3RgIDogYGlucHV0YCB9IGRhdGEtanM9XCIkeyBmaWVsZC5uYW1lIH1cIiBjbGFzcz1cIiR7IGZpZWxkLmNsYXNzIH1cIlxuICAgICAgIHR5cGU9XCIkeyBmaWVsZC50eXBlIH1cIiBpZD1cIiR7IGZpZWxkLm5hbWUgfVwiICR7ICggZmllbGQucGxhY2Vob2xkZXIgKSA/IGBwbGFjZWhvbGRlcj1cIiR7IGZpZWxkLnBsYWNlaG9sZGVyIH1cImAgOiBgYCB9PlxuICAgICAgICAgICAgJHsgKGZpZWxkLnNlbGVjdCkgPyBmaWVsZC5vcHRpb25zLm1hcCggb3B0aW9uID0+XG4gICAgICAgICAgICAgICAgYDxvcHRpb24+JHsgb3B0aW9uIH08L29wdGlvbj5gICkuam9pbignJykgKyBgPC9zZWxlY3Q+YCA6IGBgIH1cbiAgICA8L2Rpdj5gICkuam9pbignJykgfVxuPC9mb3JtPlxuYCBcbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC8+XFxzKzwvZywnPjwnKVxuICAgIHJldHVybiBodG1sXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2PkhlYWRlcjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYDxkaXY+RnV0dXJlIERheXM8L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2IGRhdGEtanM9XCJpbnZhbGlkTG9naW5FcnJvclwiIGNsYXNzPVwiZmVlZGJhY2tcIj5JbnZhbGlkIENyZWRlbnRpYWxzPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIG9wdGlvbnMgKSA9PiBgXG5cbjx1bCBjbGFzcz1cImxpc3RcIj5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5mb3I8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPnRoZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+c2FrZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+b2Y8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPmZ1dHVyZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+ZGF5czwvbGk+XG48L3VsPlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG48ZGl2IGNsYXNzPVwibG9naW5cIiBkYXRhLWpzPVwiY29udGFpbmVyXCI+XG4gICAgPGgxPkxvZ2luPC9oMT5cbiAgICA8ZGl2IGRhdGEtanM9XCJmb3JtXCI+PC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwiYnV0dG9uUm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInJlZ2lzdGVyQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+UmVnaXN0ZXI8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwibG9naW5CdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5Mb2cgSW48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG48ZGl2IGNsYXNzPVwicmVnaXN0ZXJcIiBkYXRhLWpzPVwiY29udGFpbmVyXCI+XG4gICAgPGgxPlJlZ2lzdGVyPC9oMT5cbiAgICA8ZGl2IGRhdGEtanM9XCJmb3JtXCI+PC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwiYnV0dG9uUm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImNhbmNlbEJ0blwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJyZWdpc3RlckJ0blwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPlJlZ2lzdGVyPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmAiLCJtb2R1bGUuZXhwb3J0cyA9IGVyciA9PiB7IGNvbnNvbGUubG9nKCBlcnIuc3RhY2sgfHwgZXJyICkgfVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBFcnJvcjogcmVxdWlyZSgnLi9NeUVycm9yJyksXG5cbiAgICBNb21lbnQ6IHJlcXVpcmUoJ21vbWVudCcpLFxuXG4gICAgUDogKCBmdW4sIGFyZ3MsIHRoaXNBcmcgKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiBSZWZsZWN0LmFwcGx5KCBmdW4sIHRoaXNBcmcsIGFyZ3MuY29uY2F0KCAoIGUsIC4uLmFyZ3MgKSA9PiBlID8gcmVqZWN0KGUpIDogcmVzb2x2ZShhcmdzKSApICkgKSxcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHsgcmV0dXJuIHRoaXMgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iXX0=
