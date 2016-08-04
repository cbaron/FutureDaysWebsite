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

},{"./views/templates/admin":16,"./views/templates/demo":17,"./views/templates/fieldError":18,"./views/templates/form":19,"./views/templates/header":20,"./views/templates/home":21,"./views/templates/invalidLoginError":22,"./views/templates/list":23,"./views/templates/login":24,"./views/templates/register":25}],2:[function(require,module,exports){
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

},{"./views/Admin":6,"./views/Demo":7,"./views/Form":8,"./views/Header":9,"./views/Home":10,"./views/List":11,"./views/Login":12,"./views/MyView":13,"./views/Register":14}],3:[function(require,module,exports){
'use strict';

require('jquery')(function () {
    require('./router');
    require('backbone').history.start({ pushState: true });
});

},{"./router":5,"backbone":"backbone","jquery":"jquery"}],4:[function(require,module,exports){
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

},{"backbone":"backbone"}],5:[function(require,module,exports){
'use strict';

module.exports = new (require('backbone').Router.extend({

    $: require('jquery'),

    Error: require('../../lib/MyError'),

    User: require('./models/User'),

    Views: require('./.ViewMap'),

    Templates: require('./.TemplateMap'),

    initialize: function initialize() {

        this.contentContainer = this.$('#content');

        return Object.assign(this, {
            views: {},
            header: Object.create(this.Views.Header, {
                insertion: { value: { $el: this.contentContainer, method: 'before' } },
                template: { value: this.Templates.header }
            }).constructor()
        });
    },
    goHome: function goHome() {
        this.navigate('home', { trigger: true });
    },
    handler: function handler(resource) {
        var _this = this;

        if (!resource) return this.goHome();

        this.User.fetched.done(function () {

            _this.Views.Header.onUser(_this.User).on('signout', function () {
                return Promise.all(Object.keys(_this.views).map(function (name) {
                    return _this.views[name].delete();
                })).then(_this.goHome());
            });

            Promise.all(Object.keys(_this.views).map(function (view) {
                return _this.views[view].hide();
            })).then(function () {
                if (_this.views[resource]) return _this.views[resource].show();
                console.log(_this.User);
                _this.views[resource] = Object.create(_this.Views['' + (resource.charAt(0).toUpperCase() + resource.slice(1))], {
                    insertion: { value: { $el: _this.contentContainer } },
                    template: { value: _this.Templates[resource] },
                    user: { value: _this.User }
                }).constructor().on('route', function (route) {
                    return _this.navigate(route, { trigger: true });
                });
            }).catch(_this.Error);
        }).fail(this.Error);
    },


    routes: { '(*request)': 'handler' }

}))();

},{"../../lib/MyError":26,"./.TemplateMap":1,"./.ViewMap":2,"./models/User":4,"backbone":"backbone","jquery":"jquery"}],6:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    requiresLogin: true
});

},{"./__proto__":15}],7:[function(require,module,exports){
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

},{"./Form":8,"./List":11,"./Login":12,"./Register":14,"./__proto__":15,"./templates/demo":17,"./templates/list":23,"./templates/login":24,"./templates/register":25}],8:[function(require,module,exports){
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

},{"./__proto__":15,"./templates/fieldError":18,"./templates/form":19}],9:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        signoutBtn: { method: 'signout' }
    },

    onUser: function onUser(user) {
        this.user = user;
        return this;
    },
    signout: function signout() {

        document.cookie = 'patchworkjwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        this.user.clear();

        this.emit('signout');

        this.router.navigate("/", { trigger: true });
    }
});

},{"./__proto__":15}],10:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":15}],11:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    template: require('./templates/list')
});

},{"./__proto__":15,"./templates/list":23}],12:[function(require,module,exports){
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

},{"../models/User":4,"./Form":8,"./Register":14,"./__proto__":15,"./templates/invalidLoginError":22,"./templates/login":24}],13:[function(require,module,exports){
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

},{"../models/User":4,"../router":5,"./Login":12,"backbone":"backbone","events":28,"jquery":"jquery","moment":"moment","underscore":"underscore","util":32}],14:[function(require,module,exports){
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

},{"./Form":8,"./__proto__":15,"./templates/invalidLoginError":22,"./templates/register":25}],15:[function(require,module,exports){
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
                _this8.views[key] = Object.create(_this8.Views[key].view, {
                    insertion: { value: { $el: _this8.Views[key].el, method: 'before' } },
                    template: { value: _this8.Views[key].template }
                }).constructor();

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

},{"../../../lib/MyObject":27,"./Login":12,"backbone":"backbone","events":28,"jquery":"jquery","underscore":"underscore"}],16:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "Admin";
};

},{}],17:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div data-js=\"container\">\n    <h2>Lists</h2>\n    <p>Organize your content into neat groups with our lists.</p>\n    <div class=\"example\" data-view=\"list\"></div>\n    <h2>Forms</h2>\n    <p>Our forms are customizable to suit the needs of your project. Here, for example, are \n    Login and Register forms, each using different input styles.</p>\n    <div class=\"example\">\n        <div class=\"inline-view\">\n            <div data-view=\"login\"></div>\n        </div>\n        <div class=\"inline-view\">\n            <div data-view=\"register\"></div>\n        </div>\n    </div>\n</div>\n";
};

},{}],18:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<span class=\"feedback\" data-js=\"fieldError\">" + p.error + "</span>";
};

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Header</div>";
};

},{}],21:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Future Days</div>";
};

},{}],22:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div data-js=\"invalidLoginError\" class=\"feedback\">Invalid Credentials</div>";
};

},{}],23:[function(require,module,exports){
"use strict";

module.exports = function (options) {
    return "\n\n<ul class=\"list\">\n    <li class=\"list-item\">for</li>\n    <li class=\"list-item\">the</li>\n    <li class=\"list-item\">sake</li>\n    <li class=\"list-item\">of</li>\n    <li class=\"list-item\">future</li>\n    <li class=\"list-item\">days</li>\n</ul>\n";
};

},{}],24:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"login\" data-js=\"container\">\n    <h1>Login</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n        <button data-js=\"loginBtn\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>\n";
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"register\" data-js=\"container\">\n    <h1>Register</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"cancelBtn\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n    </div>\n</div>\n";
};

},{}],26:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],27:[function(require,module,exports){
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

},{"./MyError":26,"moment":"moment"}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],32:[function(require,module,exports){
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

},{"./support/isBuffer":31,"_process":30,"inherits":29}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzL21haW4uanMiLCJjbGllbnQvanMvbW9kZWxzL1VzZXIuanMiLCJjbGllbnQvanMvcm91dGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0RlbW8uanMiLCJjbGllbnQvanMvdmlld3MvRm9ybS5qcyIsImNsaWVudC9qcy92aWV3cy9IZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvSG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy9MaXN0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL0xvZ2luLmpzIiwiY2xpZW50L2pzL3ZpZXdzL015Vmlldy5qcyIsImNsaWVudC9qcy92aWV3cy9SZWdpc3Rlci5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9kZW1vLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9maWVsZEVycm9yLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9mb3JtLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9oZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2hvbWUuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saXN0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9sb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvcmVnaXN0ZXIuanMiLCJsaWIvTXlFcnJvci5qcyIsImxpYi9NeU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLE9BQVAsR0FBZTtBQUNkLFFBQU8sUUFBUSx5QkFBUixDQURPO0FBRWQsT0FBTSxRQUFRLHdCQUFSLENBRlE7QUFHZCxhQUFZLFFBQVEsOEJBQVIsQ0FIRTtBQUlkLE9BQU0sUUFBUSx3QkFBUixDQUpRO0FBS2QsU0FBUSxRQUFRLDBCQUFSLENBTE07QUFNZCxPQUFNLFFBQVEsd0JBQVIsQ0FOUTtBQU9kLG9CQUFtQixRQUFRLHFDQUFSLENBUEw7QUFRZCxPQUFNLFFBQVEsd0JBQVIsQ0FSUTtBQVNkLFFBQU8sUUFBUSx5QkFBUixDQVRPO0FBVWQsV0FBVSxRQUFRLDRCQUFSO0FBVkksQ0FBZjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBZTtBQUNkLFFBQU8sUUFBUSxlQUFSLENBRE87QUFFZCxPQUFNLFFBQVEsY0FBUixDQUZRO0FBR2QsT0FBTSxRQUFRLGNBQVIsQ0FIUTtBQUlkLFNBQVEsUUFBUSxnQkFBUixDQUpNO0FBS2QsT0FBTSxRQUFRLGNBQVIsQ0FMUTtBQU1kLE9BQU0sUUFBUSxjQUFSLENBTlE7QUFPZCxRQUFPLFFBQVEsZUFBUixDQVBPO0FBUWQsU0FBUSxRQUFRLGdCQUFSLENBUk07QUFTZCxXQUFVLFFBQVEsa0JBQVI7QUFUSSxDQUFmOzs7OztBQ0FBLFFBQVEsUUFBUixFQUFtQixZQUFNO0FBQ3JCLFlBQVEsVUFBUjtBQUNBLFlBQVEsVUFBUixFQUFvQixPQUFwQixDQUE0QixLQUE1QixDQUFtQyxFQUFFLFdBQVcsSUFBYixFQUFuQztBQUNILENBSEQ7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLEtBQU0sUUFBUSxV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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdGFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9hZG1pbicpLFxuXHRkZW1vOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9kZW1vJyksXG5cdGZpZWxkRXJyb3I6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2ZpZWxkRXJyb3InKSxcblx0Zm9ybTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZm9ybScpLFxuXHRoZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2hlYWRlcicpLFxuXHRob21lOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9ob21lJyksXG5cdGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpLFxuXHRsaXN0OiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9saXN0JyksXG5cdGxvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9sb2dpbicpLFxuXHRyZWdpc3RlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvcmVnaXN0ZXInKVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvQWRtaW4nKSxcblx0RGVtbzogcmVxdWlyZSgnLi92aWV3cy9EZW1vJyksXG5cdEZvcm06IHJlcXVpcmUoJy4vdmlld3MvRm9ybScpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvSG9tZScpLFxuXHRMaXN0OiByZXF1aXJlKCcuL3ZpZXdzL0xpc3QnKSxcblx0TG9naW46IHJlcXVpcmUoJy4vdmlld3MvTG9naW4nKSxcblx0TXlWaWV3OiByZXF1aXJlKCcuL3ZpZXdzL015VmlldycpLFxuXHRSZWdpc3RlcjogcmVxdWlyZSgnLi92aWV3cy9SZWdpc3RlcicpXG59IiwicmVxdWlyZSgnanF1ZXJ5JykoICgpID0+IHtcbiAgICByZXF1aXJlKCcuL3JvdXRlcicpXG4gICAgcmVxdWlyZSgnYmFja2JvbmUnKS5oaXN0b3J5LnN0YXJ0KCB7IHB1c2hTdGF0ZTogdHJ1ZSB9IClcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgKCByZXF1aXJlKCdiYWNrYm9uZScpLk1vZGVsLmV4dGVuZCgge1xuICAgIGRlZmF1bHRzOiB7IHN0YXRlOiB7fSB9LFxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hlZCA9IHRoaXMuZmV0Y2goKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG4gICAgdXJsKCkgeyByZXR1cm4gXCIvdXNlclwiIH1cbn0gKSApKClcbiIsIm1vZHVsZS5leHBvcnRzID0gbmV3IChcbiAgICByZXF1aXJlKCdiYWNrYm9uZScpLlJvdXRlci5leHRlbmQoIHtcblxuICAgICAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgICAgICBFcnJvcjogcmVxdWlyZSgnLi4vLi4vbGliL015RXJyb3InKSxcbiAgICAgICAgXG4gICAgICAgIFVzZXI6IHJlcXVpcmUoJy4vbW9kZWxzL1VzZXInKSxcblxuICAgICAgICBWaWV3czogcmVxdWlyZSgnLi8uVmlld01hcCcpLFxuICAgICAgICBcbiAgICAgICAgVGVtcGxhdGVzOiByZXF1aXJlKCcuLy5UZW1wbGF0ZU1hcCcpLFxuICAgICAgICBcbiAgICAgICAgaW5pdGlhbGl6ZSgpIHtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50Q29udGFpbmVyID0gdGhpcy4kKCcjY29udGVudCcpXG5cbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB0aGlzLCB7XG4gICAgICAgICAgICAgICAgdmlld3M6IHsgfSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IE9iamVjdC5jcmVhdGUoIHRoaXMuVmlld3MuSGVhZGVyLCB7XG4gICAgICAgICAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuY29udGVudENvbnRhaW5lciwgbWV0aG9kOiAnYmVmb3JlJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB7IHZhbHVlOiB0aGlzLlRlbXBsYXRlcy5oZWFkZXIgfVxuICAgICAgICAgICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSxcblxuICAgICAgICBnb0hvbWUoKSB7IHRoaXMubmF2aWdhdGUoICdob21lJywgeyB0cmlnZ2VyOiB0cnVlIH0gKSB9LFxuXG4gICAgICAgIGhhbmRsZXIoIHJlc291cmNlICkge1xuXG4gICAgICAgICAgICBpZiggIXJlc291cmNlICkgcmV0dXJuIHRoaXMuZ29Ib21lKClcblxuICAgICAgICAgICAgdGhpcy5Vc2VyLmZldGNoZWQuZG9uZSggKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3cy5IZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgLm9uVXNlciggdGhpcy5Vc2VyIClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnc2lnbm91dCcsICgpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCBuYW1lID0+IHRoaXMudmlld3NbIG5hbWUgXS5kZWxldGUoKSApIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCB0aGlzLmdvSG9tZSgpIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy52aWV3cyApLm1hcCggdmlldyA9PiB0aGlzLnZpZXdzWyB2aWV3IF0uaGlkZSgpICkgKVxuICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLnZpZXdzWyByZXNvdXJjZSBdICkgcmV0dXJuIHRoaXMudmlld3NbIHJlc291cmNlIF0uc2hvdygpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggdGhpcy5Vc2VyIClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgcmVzb3VyY2UgXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGAke3Jlc291cmNlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcmVzb3VyY2Uuc2xpY2UoMSl9YCBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyByZXNvdXJjZSBdIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHsgdmFsdWU6IHRoaXMuVXNlciB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29uc3RydWN0b3IoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCAncm91dGUnLCByb3V0ZSA9PiB0aGlzLm5hdmlnYXRlKCByb3V0ZSwgeyB0cmlnZ2VyOiB0cnVlIH0gKSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgLmNhdGNoKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSApLmZhaWwoIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgXG4gICAgICAgIH0sXG5cbiAgICAgICAgcm91dGVzOiB7ICcoKnJlcXVlc3QpJzogJ2hhbmRsZXInIH1cblxuICAgIH0gKVxuKSgpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBWaWV3czoge1xuICAgICAgICBsaXN0OiB7IHZpZXc6IHJlcXVpcmUoJy4vTGlzdCcpLCB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvbGlzdCcpICB9LFxuICAgICAgICBsb2dpbjogeyB2aWV3OiByZXF1aXJlKCcuL0xvZ2luJyksIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9sb2dpbicpICB9LFxuICAgICAgICByZWdpc3RlcjogeyB2aWV3OiByZXF1aXJlKCcuL1JlZ2lzdGVyJyksIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9yZWdpc3RlcicpICB9XG4gICAgfSxcblxuICAgIC8qZmllbGRzOiBbIHtcbiAgICAgICAgY2xhc3M6IFwiZm9ybS1pbnB1dFwiLFxuICAgICAgICBuYW1lOiBcImVtYWlsXCIsXG4gICAgICAgIGxhYmVsOiAnRW1haWwnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGVycm9yOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJmb3JtLWlucHV0XCIsXG4gICAgICAgIGhvcml6b250YWw6IHRydWUsXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbGFiZWw6ICdQYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIGVycm9yOiBcIlBhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLlwiLFxuICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPj0gNlxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtYm9yZGVybGVzc1wiLFxuICAgICAgICBuYW1lOiBcImFkZHJlc3NcIixcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJTdHJlZXQgQWRkcmVzc1wiLFxuICAgICAgICBlcnJvcjogXCJSZXF1aXJlZCBmaWVsZC5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLiQudHJpbSh2YWwpICE9PSAnJyB9XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJpbnB1dC1mbGF0XCIsXG4gICAgICAgIG5hbWU6IFwiY2l0eVwiLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcIkNpdHlcIixcbiAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtYm9yZGVybGVzc1wiLFxuICAgICAgICBzZWxlY3Q6IHRydWUsXG4gICAgICAgIG5hbWU6IFwiZmF2ZVwiLFxuICAgICAgICBsYWJlbDogXCJGYXZlIENhbiBBbGJ1bVwiLFxuICAgICAgICBvcHRpb25zOiBbIFwiTW9uc3RlciBNb3ZpZVwiLCBcIlNvdW5kdHJhY2tzXCIsIFwiVGFnbyBNYWdvXCIsIFwiRWdlIEJhbXlhc2lcIiwgXCJGdXR1cmUgRGF5c1wiIF0sXG4gICAgICAgIGVycm9yOiBcIlBsZWFzZSBjaG9vc2UgYW4gb3B0aW9uLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9IF0sKi9cblxuICAgIEZvcm06IHJlcXVpcmUoJy4vRm9ybScpLFxuICAgIExpc3Q6IHJlcXVpcmUoJy4vTGlzdCcpLFxuICAgIExvZ2luOiByZXF1aXJlKCcuL0xvZ2luJyksXG4gICAgUmVnaXN0ZXI6IHJlcXVpcmUoJy4vUmVnaXN0ZXInKSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIFxuICAgICAgICAvL3RoaXMubGlzdEluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5MaXN0LCB7IGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMubGlzdCB9IH0gKS5jb25zdHJ1Y3RvcigpXG5cbiAgICAgICAgLyp0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwgeyBcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSwgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmZvcm0gfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKSovXG5cbiAgICAgICAgLyp0aGlzLmxvZ2luRXhhbXBsZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTG9naW4sIHsgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmxvZ2luRXhhbXBsZSB9LFxuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgICovXG4gICAgICAgIFxuICAgICAgICAvKnRoaXMucmVnaXN0ZXJFeGFtcGxlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5SZWdpc3RlciwgeyBcbiAgICAgICAgICAgIGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMucmVnaXN0ZXJFeGFtcGxlIH0sXG4gICAgICAgICAgICBjbGFzczogeyB2YWx1ZTogJ2Zvcm0taW5wdXQnIH0sXG4gICAgICAgICAgICBob3Jpem9udGFsOiB7IHZhbHVlOiB0cnVlIH1cbiAgICAgICAgfSApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9naW5FeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgdGhpcy5sb2dpbkV4YW1wbGUuZWxzLmxvZ2luQnRuLm9mZignY2xpY2snKVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5jYW5jZWxCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgKi9cblxuICAgICAgICAvL3RoaXMuZWxzZS5zdWJtaXRCdG4ub24oICdjbGljaycsICgpID0+IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6ICcnIH0gKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9kZW1vJylcblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZW1haWxSZWdleDogL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLyxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHsgXG4gICAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goIGZpZWxkID0+IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gZmllbGQubmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZpZWxkLm5hbWUuc2xpY2UoMSlcbiAgICAgICAgICAgIGZpZWxkWyAnY2xhc3MnIF0gPSB0aGlzLmNsYXNzXG4gICAgICAgICAgICBpZiggdGhpcy5ob3Jpem9udGFsICkgZmllbGRbICdob3Jpem9udGFsJyBdID0gdHJ1ZVxuICAgICAgICAgICAgZmllbGRbICggdGhpcy5jbGFzcyA9PT0gJ2Zvcm0taW5wdXQnICkgPyAnbGFiZWwnIDogJ3BsYWNlaG9sZGVyJyBdID0gbmFtZVxuXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB7IGZpZWxkczogdGhpcy5maWVsZHMgfSB9LFxuXG4gICAgZ2V0Rm9ybURhdGEoKSB7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMuZWxzLCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIC9JTlBVVHxURVhUQVJFQUQvLnRlc3QoIHRoaXMuZWxzWyBrZXkgXS5wcm9wKFwidGFnTmFtZVwiKSApICkgdGhpcy5mb3JtRGF0YVsga2V5IF0gPSB0aGlzLmVsc1sga2V5IF0udmFsKClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURhdGFcbiAgICB9LFxuXG4gICAgZmllbGRzOiBbIF0sXG5cbiAgICBvbkZvcm1GYWlsKCBlcnJvciApIHtcbiAgICAgICAgY29uc29sZS5sb2coIGVycm9yLnN0YWNrIHx8IGVycm9yICk7XG4gICAgICAgIC8vdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5zZXJ2ZXJFcnJvciggZXJyb3IgKSwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuYnV0dG9uUm93LCBtZXRob2Q6ICdiZWZvcmUnIH0gfSApXG4gICAgfSxcblxuICAgIG9uU3VibWlzc2lvblJlc3BvbnNlKCkgeyB9LFxuXG4gICAgcG9zdEZvcm0oIGRhdGEgKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kLmFqYXgoIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSggZGF0YS52YWx1ZXMgKSB8fCBKU09OLnN0cmluZ2lmeSggdGhpcy5nZXRGb3JtRGF0YSgpICksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyB0b2tlbjogKCB0aGlzLnVzZXIgKSA/IHRoaXMudXNlci5nZXQoJ3Rva2VuJykgOiAnJyB9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIHVybDogYC8keyBkYXRhLnJlc291cmNlIH1gXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLmZpbmQoJ2lucHV0JylcbiAgICAgICAgLm9uKCAnYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICRlbCA9IHNlbGYuJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmaWVsZCA9IHNlbGYuXyggc2VsZi5maWVsZHMgKS5maW5kKCBmdW5jdGlvbiggZmllbGQgKSB7IHJldHVybiBmaWVsZC5uYW1lID09PSAkZWwuYXR0cignaWQnKSB9IClcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHJlc29sdmUoIGZpZWxkLnZhbGlkYXRlLmNhbGwoIHNlbGYsICRlbC52YWwoKSApICkgKVxuICAgICAgICAgICAgLnRoZW4oIHZhbGlkID0+IHtcbiAgICAgICAgICAgICAgICBpZiggdmFsaWQgKSB7IHNlbGYuc2hvd1ZhbGlkKCAkZWwgKSB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IHNlbGYuc2hvd0Vycm9yKCAkZWwsIGZpZWxkLmVycm9yICkgfVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgICAgICAub24oICdmb2N1cycsIGZ1bmN0aW9uKCkgeyBzZWxmLnJlbW92ZUVycm9yKCBzZWxmLiQodGhpcykgKSB9IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZW1vdmVFcnJvciggJGVsICkge1xuICAgICAgICAkZWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Vycm9yIHZhbGlkJylcbiAgICAgICAgJGVsLnNpYmxpbmdzKCcuZmVlZGJhY2snKS5yZW1vdmUoKVxuICAgIH0sXG5cbiAgICBzaG93RXJyb3IoICRlbCwgZXJyb3IgKSB7XG5cbiAgICAgICAgdmFyIGZvcm1Hcm91cCA9ICRlbC5wYXJlbnQoKVxuXG4gICAgICAgIGlmKCBmb3JtR3JvdXAuaGFzQ2xhc3MoICdlcnJvcicgKSApIHJldHVyblxuXG4gICAgICAgIGZvcm1Hcm91cC5yZW1vdmVDbGFzcygndmFsaWQnKS5hZGRDbGFzcygnZXJyb3InKS5hcHBlbmQoIHRoaXMudGVtcGxhdGVzLmZpZWxkRXJyb3IoIHsgZXJyb3I6IGVycm9yIH0gKSApXG4gICAgfSxcblxuICAgIHNob3dWYWxpZCggJGVsICkge1xuICAgICAgICAkZWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuYWRkQ2xhc3MoJ3ZhbGlkJylcbiAgICAgICAgJGVsLnNpYmxpbmdzKCcuZmVlZGJhY2snKS5yZW1vdmUoKVxuICAgIH0sXG5cbiAgICBzdWJtaXRGb3JtKCByZXNvdXJjZSApIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiggcmVzdWx0ID09PSBmYWxzZSApIHJldHVyblxuICAgICAgICAgICAgdGhpcy5wb3N0Rm9ybSggcmVzb3VyY2UgKVxuICAgICAgICAgICAgLnRoZW4oICgpID0+IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UoKSApXG4gICAgICAgICAgICAuY2F0Y2goIGUgPT4gdGhpcy5vbkZvcm1GYWlsKCBlICkgKVxuICAgICAgICB9ICkgICAgXG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9mb3JtJyksXG5cbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgZmllbGRFcnJvcjogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvZmllbGRFcnJvcicpXG4gICAgfSxcblxuICAgIHZhbGlkYXRlKCkge1xuICAgICAgICB2YXIgdmFsaWQgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHRoaXMuZmllbGRzLm1hcCggZmllbGQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmllbGQudmFsaWRhdGUuY2FsbCh0aGlzLCB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgpICkgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCByZXN1bHQgPT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKCB0aGlzLmVsc1sgZmllbGQubmFtZSBdLCBmaWVsZC5lcnJvciApICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkgKVxuICAgICAgICAudGhlbiggKCkgPT4gdmFsaWQgKVxuICAgICAgICAuY2F0Y2goIGUgPT4geyBjb25zb2xlLmxvZyggZS5zdGFjayB8fCBlICk7IHJldHVybiBmYWxzZSB9IClcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIHNpZ25vdXRCdG46IHsgbWV0aG9kOiAnc2lnbm91dCcgfVxuICAgIH0sXG5cbiAgICBvblVzZXIoIHVzZXIgKSB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIFxuICAgIHNpZ25vdXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gJ3BhdGNod29ya2p3dD07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7JztcblxuICAgICAgICB0aGlzLnVzZXIuY2xlYXIoKVxuXG4gICAgICAgIHRoaXMuZW1pdCgnc2lnbm91dCcpXG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoIFwiL1wiLCB7IHRyaWdnZXI6IHRydWUgfSApXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvbGlzdCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICAncmVnaXN0ZXJCdG4nOiB7IGV2ZW50OiAnY2xpY2snLCBzZWxlY3RvcjogJycsIG1ldGhvZDogJ3Nob3dSZWdpc3RyYXRpb24nIH0sXG4gICAgICAgICdsb2dpbkJ0bic6IHsgZXZlbnQ6ICdjbGljaycsIHNlbGVjdG9yOiAnJywgbWV0aG9kOiAnbG9naW4nIH1cbiAgICB9LFxuXG4gICAgZmllbGRzOiBbIHsgICAgICAgIFxuICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGVycm9yOiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZW1haWxSZWdleC50ZXN0KHZhbCkgfVxuICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgZXJyb3I6IFwiUGFzc3dvcmRzIG11c3QgYmUgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzIGxvbmcuXCIsXG4gICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gdmFsLmxlbmd0aCA+PSA2XG4gICAgfSBdLFxuXG4gICAgRm9ybTogcmVxdWlyZSgnLi9Gb3JtJyksXG5cbiAgICBsb2dpbigpIHsgdGhpcy5mb3JtSW5zdGFuY2Uuc3VibWl0Rm9ybSggeyByZXNvdXJjZTogXCJhdXRoXCIgfSApIH0sXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZSggcmVzcG9uc2UgKSB7XG4gICAgICAgIGlmKCBPYmplY3Qua2V5cyggcmVzcG9uc2UgKS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5pbnZhbGlkTG9naW5FcnJvciwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuY29udGFpbmVyIH0gfSApXG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmVxdWlyZSgnLi4vbW9kZWxzL1VzZXInKS5zZXQoIHJlc3BvbnNlIClcbiAgICAgICAgdGhpcy5lbWl0KCBcImxvZ2dlZEluXCIgKVxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwge1xuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6IHRoaXMuY2xhc3MgfSxcbiAgICAgICAgICAgIC8vaG9yaXpvbnRhbDogeyB2YWx1ZTogdGhpcy5ob3Jpem9udGFsIH0sXG4gICAgICAgICAgICBmaWVsZHM6IHsgdmFsdWU6IHRoaXMuZmllbGRzIH0sIFxuICAgICAgICAgICAgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5lbHMuZm9ybSB9IH0sXG4gICAgICAgICAgICBvblN1Ym1pc3Npb25SZXNwb25zZTogeyB2YWx1ZTogdGhpcy5vblN1Ym1pc3Npb25SZXNwb25zZSB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBSZWdpc3RlcjogcmVxdWlyZSgnLi9SZWdpc3RlcicpLFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG5cbiAgICBzaG93UmVnaXN0cmF0aW9uKCkgeyBcblxuICAgICAgICB2YXIgZm9ybSA9IHRoaXMuZm9ybUluc3RhbmNlLFxuICAgICAgICAgICAgZW1haWwgPSBmb3JtLmVscy5lbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkID0gZm9ybS5lbHMucGFzc3dvcmRcbiAgICAgICAgXG4gICAgICAgIGZvcm0ucmVtb3ZlRXJyb3IoIGVtYWlsIClcbiAgICAgICAgZW1haWwudmFsKCcnKVxuXG4gICAgICAgIGZvcm0ucmVtb3ZlRXJyb3IoIHBhc3N3b3JkIClcbiAgICAgICAgcGFzc3dvcmQudmFsKCcnKVxuICAgICAgICBcbiAgICAgICAgaWYgKCBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvciApIGZvcm0uZWxzLmludmFsaWRMb2dpbkVycm9yLnJlbW92ZSgpXG4gICAgICAgIGlmICggZm9ybS5lbHMuc2VydmVyRXJyb3IgKSBmb3JtLmVscy5zZXJ2ZXJFcnJvci5yZW1vdmUoKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gKCB0aGlzLnJlZ2lzdGVySW5zdGFuY2UgKSA/IHRoaXMucmVnaXN0ZXJJbnN0YW5jZS5zaG93KClcbiAgICAgICAgICAgIDogT2JqZWN0LmNyZWF0ZSggdGhpcy5SZWdpc3Rlciwge1xuICAgICAgICAgICAgICAgIGxvZ2luSW5zdGFuY2U6IHsgdmFsdWU6IHRoaXMgfSxcbiAgICAgICAgICAgICAgICBjbGFzczogeyB2YWx1ZTogJ2lucHV0LWZsYXQnIH0gXG4gICAgICAgICAgICB9ICkuY29uc3RydWN0b3IoKSApXG5cbiAgICB9LFxuXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2xvZ2luJyksXG5cbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgaW52YWxpZExvZ2luRXJyb3I6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yJylcbiAgICB9XG5cbn0gKVxuIiwidmFyIE15VmlldyA9IGZ1bmN0aW9uKCBkYXRhICkgeyByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywgZGF0YSApLmluaXRpYWxpemUoKSB9XG5cbk9iamVjdC5hc3NpZ24oIE15Vmlldy5wcm90b3R5cGUsIHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAgIENvbGxlY3Rpb246IHJlcXVpcmUoJ2JhY2tib25lJykuQ29sbGVjdGlvbixcbiAgICBcbiAgICAvL0Vycm9yOiByZXF1aXJlKCcuLi9NeUVycm9yJyksXG5cbiAgICBNb2RlbDogcmVxdWlyZSgnYmFja2JvbmUnKS5Nb2RlbCxcblxuICAgIF86IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblxuICAgICQ6IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKSB7XG4gICAgICAgIHZhciB0eXBlO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuZXZlbnRzWyBrZXkgXSApIHJldHVyblxuXG4gICAgICAgIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHRoaXMuZXZlbnRzW2tleV0gKTtcblxuICAgICAgICBpZiggdHlwZSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldLCBlbCApO1xuICAgICAgICB9IGVsc2UgaWYoIHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScgKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldLmZvckVhY2goIHNpbmdsZUV2ZW50ID0+IHRoaXMuYmluZEV2ZW50KCBrZXksIHNpbmdsZUV2ZW50LCBlbCApIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiggdGhpcy50ZW1wbGF0ZURhdGEgJiYgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyICkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkXCIpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9ybWF0OiB7XG4gICAgICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKVxuICAgIH0sXG5cbiAgICBnZXRGb3JtRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEgPSB7IH1cblxuICAgICAgICB0aGlzLl8uZWFjaCggdGhpcy50ZW1wbGF0ZURhdGEsICggJGVsLCBuYW1lICkgPT4geyBpZiggJGVsLnByb3AoXCJ0YWdOYW1lXCIpID09PSBcIklOUFVUXCIgJiYgJGVsLnZhbCgpICkgdGhpcy5mb3JtRGF0YVtuYW1lXSA9ICRlbC52YWwoKSB9IClcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtRGF0YVxuICAgIH0sXG5cbiAgICBnZXRSb3V0ZXI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi4vcm91dGVyJykgfSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9uczogKCkgPT4gKHt9KSxcblxuICAgIC8qaGlkZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuUS5Qcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5oaWRlKClcbiAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9IClcbiAgICB9LCovXG5cbiAgICBpbml0aWFsaXplKCkge1xuXG4gICAgICAgIGlmKCAhIHRoaXMuY29udGFpbmVyICkgdGhpcy5jb250YWluZXIgPSB0aGlzLiQoJyNjb250ZW50JylcbiAgICAgICAgXG4gICAgICAgIHRoaXMucm91dGVyID0gdGhpcy5nZXRSb3V0ZXIoKVxuXG4gICAgICAgIC8vdGhpcy5tb2RhbFZpZXcgPSByZXF1aXJlKCcuL21vZGFsJylcblxuICAgICAgICB0aGlzLiQod2luZG93KS5yZXNpemUoIHRoaXMuXy50aHJvdHRsZSggKCkgPT4gdGhpcy5zaXplKCksIDUwMCApIClcblxuICAgICAgICBpZiggdGhpcy5yZXF1aXJlc0xvZ2luICYmICEgdGhpcy51c2VyLmlkICkge1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9Mb2dpbicpLnNob3coKS5vbmNlKCBcInN1Y2Nlc3NcIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIuaGVhZGVyLm9uVXNlciggdGhpcy51c2VyIClcblxuICAgICAgICAgICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzUm9sZSAmJiAoICEgdGhpcy5fKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpICkuY29udGFpbnMoIHRoaXMucmVxdWlyZXNSb2xlICkgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KCdZb3UgZG8gbm90IGhhdmUgYWNjZXNzJylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH0gZWxzZSBpZiggdGhpcy51c2VyLmlkICYmIHRoaXMucmVxdWlyZXNSb2xlICkge1xuICAgICAgICAgICAgaWYoICggISB0aGlzLl8oIHRoaXMudXNlci5nZXQoJ3JvbGVzJykgKS5jb250YWlucyggdGhpcy5yZXF1aXJlc1JvbGUgKSApICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgnWW91IGRvIG5vdCBoYXZlIGFjY2VzcycpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBpc0hpZGRlbjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyB9LFxuXG4gICAgXG4gICAgbW9tZW50OiByZXF1aXJlKCdtb21lbnQnKSxcblxuICAgIHBvc3RSZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgLy9ROiByZXF1aXJlKCdxJyksXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSgge1xuICAgICAgICAgICAgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUoIHRoaXMuZ2V0VGVtcGxhdGVPcHRpb25zKCkgKSxcbiAgICAgICAgICAgIGluc2VydGlvbjogeyAkZWw6IHRoaXMuaW5zZXJ0aW9uRWwgfHwgdGhpcy5jb250YWluZXIsIG1ldGhvZDogdGhpcy5pbnNlcnRpb25NZXRob2QgfSB9IClcblxuICAgICAgICB0aGlzLnNpemUoKVxuXG4gICAgICAgIHRoaXMucG9zdFJlbmRlcigpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5zdWJ2aWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4gXG4gICAgICAgICAgICB0aGlzLnN1YnZpZXdzWyBrZXkgXS5mb3JFYWNoKCBzdWJ2aWV3TWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpc1sgc3Vidmlld01ldGEubmFtZSBdID0gbmV3IHN1YnZpZXdNZXRhLnZpZXcoIHsgY29udGFpbmVyOiB0aGlzLnRlbXBsYXRlRGF0YVsga2V5IF0gfSApIH0gKSApXG4gICAgfSxcblxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuc2hvdygpXG4gICAgICAgIHRoaXMuc2l6ZSgpXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzbHVycEVsOiBmdW5jdGlvbiggZWwgKSB7XG5cbiAgICAgICAgdmFyIGtleSA9IGVsLmF0dHIoJ2RhdGEtanMnKTtcblxuICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YVsga2V5IF0gPSAoIHRoaXMudGVtcGxhdGVEYXRhLmhhc093blByb3BlcnR5KGtleSkgKVxuICAgICAgICAgICAgPyB0aGlzLnRlbXBsYXRlRGF0YVsga2V5IF0uYWRkKCBlbCApXG4gICAgICAgICAgICA6IGVsO1xuXG4gICAgICAgIGVsLnJlbW92ZUF0dHIoJ2RhdGEtanMnKTtcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGU6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG4gICAgICAgIHZhciAkaHRtbCA9IHRoaXMuJCggb3B0aW9ucy50ZW1wbGF0ZSApLFxuICAgICAgICAgICAgc2VsZWN0b3IgPSAnW2RhdGEtanNdJztcblxuICAgICAgICBpZiggdGhpcy50ZW1wbGF0ZURhdGEgPT09IHVuZGVmaW5lZCApIHRoaXMudGVtcGxhdGVEYXRhID0geyB9O1xuXG4gICAgICAgICRodG1sLmVhY2goICggaW5kZXgsIGVsICkgPT4ge1xuICAgICAgICAgICAgdmFyICRlbCA9IHRoaXMuJChlbCk7XG4gICAgICAgICAgICBpZiggJGVsLmlzKCBzZWxlY3RvciApICkgdGhpcy5zbHVycEVsKCAkZWwgKVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgJGh0bWwuZ2V0KCkuZm9yRWFjaCggKCBlbCApID0+IHsgdGhpcy4kKCBlbCApLmZpbmQoIHNlbGVjdG9yICkuZWFjaCggKCBpLCBlbFRvQmVTbHVycGVkICkgPT4gdGhpcy5zbHVycEVsKCB0aGlzLiQoZWxUb0JlU2x1cnBlZCkgKSApIH0gKVxuICAgICAgIFxuICAgICAgICBpZiggb3B0aW9ucyAmJiBvcHRpb25zLmluc2VydGlvbiApIG9wdGlvbnMuaW5zZXJ0aW9uLiRlbFsgKCBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgKSA/IG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCA6ICdhcHBlbmQnIF0oICRodG1sIClcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIFxuICAgIGJpbmRFdmVudDogZnVuY3Rpb24oIGVsZW1lbnRLZXksIGV2ZW50RGF0YSwgZWwgKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9ICggZWwgKSA/IGVsIDogdGhpcy50ZW1wbGF0ZURhdGFbIGVsZW1lbnRLZXkgXTtcblxuICAgICAgICBlbGVtZW50cy5vbiggZXZlbnREYXRhLmV2ZW50IHx8ICdjbGljaycsIGV2ZW50RGF0YS5zZWxlY3RvciwgZXZlbnREYXRhLm1ldGEsIHRoaXNbIGV2ZW50RGF0YS5tZXRob2QgXS5iaW5kKHRoaXMpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7fSxcblxuICAgIGlzTW91c2VPbkVsOiBmdW5jdGlvbiggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKTtcblxuICAgICAgICBpZiggKCBldmVudC5wYWdlWCA8IGVsT2Zmc2V0LmxlZnQgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWCA+ICggZWxPZmZzZXQubGVmdCArIGVsV2lkdGggKSApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZIDwgZWxPZmZzZXQudG9wICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPiAoIGVsT2Zmc2V0LnRvcCArIGVsSGVpZ2h0ICkgKSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuICAgIFxuICAgIHNpemU6ICgpID0+IHsgdGhpcyB9LFxuXG4gICAgdXNlcjogcmVxdWlyZSgnLi4vbW9kZWxzL1VzZXInKSxcblxuICAgIHV0aWw6IHJlcXVpcmUoJ3V0aWwnKVxuXG59IClcblxubW9kdWxlLmV4cG9ydHMgPSBNeVZpZXdcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmZvcm1JbnN0YW5jZSxcbiAgICAgICAgICAgIG5hbWUgPSBmb3JtLmVscy5uYW1lLFxuICAgICAgICAgICAgZW1haWwgPSBmb3JtLmVscy5lbWFpbFxuICAgICAgICBcbiAgICAgICAgZm9ybS5yZW1vdmVFcnJvciggbmFtZSApXG4gICAgICAgIG5hbWUudmFsKCcnKVxuXG4gICAgICAgIGZvcm0ucmVtb3ZlRXJyb3IoIGVtYWlsIClcbiAgICAgICAgZW1haWwudmFsKCcnKVxuICAgICAgICBcbiAgICAgICAgaWYgKCBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvciApIGZvcm0uZWxzLmludmFsaWRMb2dpbkVycm9yLnJlbW92ZSgpXG4gICAgICAgIGlmICggZm9ybS5lbHMuc2VydmVyRXJyb3IgKSBmb3JtLmVscy5zZXJ2ZXJFcnJvci5yZW1vdmUoKVxuXG4gICAgICAgIHRoaXMubG9naW5JbnN0YW5jZVsgXCJyZWdpc3Rlckluc3RhbmNlXCIgXSA9IHRoaXNcbiAgICAgICAgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5sb2dpbkluc3RhbmNlLnNob3coKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICAncmVnaXN0ZXJCdG4nOiB7IGV2ZW50OiAnY2xpY2snLCBzZWxlY3RvcjogJycsIG1ldGhvZDogJ3JlZ2lzdGVyJyB9LFxuICAgICAgICAnY2FuY2VsQnRuJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICcnLCBtZXRob2Q6ICdjYW5jZWwnIH1cbiAgICB9LFxuXG4gICAgZmllbGRzOiBbIHtcbiAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGVycm9yOiAnTmFtZSBpcyBhIHJlcXVpcmVkIGZpZWxkLicsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJyxcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVtYWlsUmVnZXgudGVzdCh2YWwpIH1cbiAgICB9IF0sXG5cbiAgICBGb3JtOiByZXF1aXJlKCcuL0Zvcm0nKSxcblxuICAgIG9uU3VibWlzc2lvblJlc3BvbnNlOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cbiAgICAgICAgaWYgKCByZXNwb25zZS5zdWNjZXNzID09PSBmYWxzZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNsdXJwVGVtcGxhdGUoIHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGVzLmludmFsaWRMb2dpbkVycm9yKCByZXNwb25zZSApLCBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmVscy5idXR0b25Sb3csIG1ldGhvZDogJ2JlZm9yZScgfSB9IClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlci5zZXQoIHJlc3BvbnNlLnJlc3VsdC5tZW1iZXIgKVxuXG4gICAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goIGZpZWxkID0+IHRoaXMuZWxzWyBmaWVsZC5uYW1lIF0udmFsKCcnKSApXG5cbiAgICAgICAgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5sb2dpbkluc3RhbmNlLmVtaXQoIFwibG9nZ2VkSW5cIiApIClcbiAgICAgICAgXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuZm9ybUluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5Gb3JtLCB7XG4gICAgICAgICAgICBjbGFzczogeyB2YWx1ZTogdGhpcy5jbGFzcyB9LFxuICAgICAgICAgICAgZmllbGRzOiB7IHZhbHVlOiB0aGlzLmZpZWxkcyB9LFxuICAgICAgICAgICAgaG9yaXpvbnRhbDogeyB2YWx1ZTogdGhpcy5ob3Jpem9udGFsIH0sIFxuICAgICAgICAgICAgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5lbHMuZm9ybSB9IH0sXG4gICAgICAgICAgICBvblN1Ym1pc3Npb25SZXNwb25zZTogeyB2YWx1ZTogdGhpcy5vblN1Ym1pc3Npb25SZXNwb25zZSB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIHJlZ2lzdGVyKCkgeyB0aGlzLmZvcm1JbnN0YW5jZS5zdWJtaXRGb3JtKCB7IHJlc291cmNlOiBcIm1lbWJlclwiIH0gKSB9LFxuICAgIFxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3JlZ2lzdGVyJyksXG5cbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgaW52YWxpZExvZ2luRXJyb3I6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yJylcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBfOiByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cbiAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIENvbGxlY3Rpb246IHJlcXVpcmUoJ2JhY2tib25lJykuQ29sbGVjdGlvbixcbiAgICBcbiAgICBNb2RlbDogcmVxdWlyZSgnYmFja2JvbmUnKS5Nb2RlbCxcblxuICAgIGJpbmRFdmVudCgga2V5LCBldmVudCwgc2VsZWN0b3I9JycgKSB7XG4gICAgICAgIHRoaXMuZWxzW2tleV0ub24oICdjbGljaycsIHNlbGVjdG9yLCBlID0+IHRoaXNbIGBvbiR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoa2V5KX0ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGV2ZW50KX1gIF0oIGUgKSApXG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLiQod2luZG93KS5yZXNpemUoIHRoaXMuXy50aHJvdHRsZSggKCkgPT4gdGhpcy5zaXplKCksIDUwMCApIClcblxuICAgICAgICBpZiggdGhpcy5yZXF1aXJlc0xvZ2luICYmICF0aGlzLnVzZXIuaWQgKSByZXR1cm4gdGhpcy5oYW5kbGVMb2dpbigpXG5cbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuaWQgJiYgdGhpcy5yZXF1aXJlc1JvbGUgJiYgIXRoaXMuaGFzUHJpdmlsZWdlcygpICkgcmV0dXJuIHRoaXMuc2hvd05vQWNjZXNzKClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiB0aGlzLmV2ZW50c1trZXldXG5cbiAgICAgICAgaWYoIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7IHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0gKSB9XG4gICAgICAgIGVsc2UgaWYoIEFycmF5LmlzQXJyYXkoIHRoaXMuZXZlbnRzW2tleV0gKSApIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWyBrZXkgXS5mb3JFYWNoKCBldmVudE9iaiA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBldmVudE9iai5ldmVudCApIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0uZXZlbnQgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlbGV0ZSggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoIGR1cmF0aW9uIClcbiAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxzZS5jb250YWluZXIucmVtb3ZlKClcbiAgICAgICAgICAgIHRoaXMuZW1pdChcInJlbW92ZWRcIilcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7fSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9uczogKCkgPT4gKHt9KSxcblxuICAgIGhhbmRsZUxvZ2luKCkge1xuICAgICAgICBPYmplY3QuY3JlYXRlKCByZXF1aXJlKCcuL0xvZ2luJyksIHsgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9IH0gKS5jb25zdHJ1Y3RvcigpLm9uY2UoIFwibG9nZ2VkSW5cIiwgKCkgPT4gdGhpcy5vbkxvZ2luKCkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGhhc1ByaXZpbGVnZSgpIHtcbiAgICAgICAgKCB0aGlzLnJlcXVpcmVzUm9sZSAmJiAoIHRoaXMudXNlci5nZXQoJ3JvbGVzJykuZmluZCggcm9sZSA9PiByb2xlID09PSB0aGlzLnJlcXVpcmVzUm9sZSApID09PSBcInVuZGVmaW5lZFwiICkgKSA/IGZhbHNlIDogdHJ1ZVxuICAgIH0sXG5cbiAgICBoaWRlKCBkdXJhdGlvbiApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHRoaXMuZWxzLmNvbnRhaW5lci5oaWRlKCBkdXJhdGlvbiB8fCAxMCwgcmVzb2x2ZSApIClcbiAgICB9LFxuICAgIFxuICAgIGlzSGlkZGVuKCkgeyByZXR1cm4gdGhpcy5lbHMuY29udGFpbmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgfSxcblxuICAgIG9uTG9naW4oKSB7XG4gICAgICAgIHRoaXMucm91dGVyLmhlYWRlci5vblVzZXIoIHRoaXMudXNlciApXG5cbiAgICAgICAgdGhpc1sgKCB0aGlzLmhhc1ByaXZpbGVnZXMoKSApID8gJ3JlbmRlcicgOiAnc2hvd05vQWNjZXNzJyBdKClcbiAgICB9LFxuXG4gICAgc2hvd05vQWNjZXNzKCkge1xuICAgICAgICBhbGVydChcIk5vIHByaXZpbGVnZXMsIHNvblwiKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkgeyByZXR1cm4gdGhpcyB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBpZiggIXRoaXMuaW5zZXJ0aW9uICkgeyBjb25zb2xlLmxvZyggdGhpcyApIH1cbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksIGluc2VydGlvbjogdGhpcy5pbnNlcnRpb24gfSApXG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICAgICAgICAgICAgIC5wb3N0UmVuZGVyKClcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3MoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLlZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy5WaWV3c1sga2V5IF0uZWwgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sga2V5IF0gPVxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sga2V5IF0udmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRpb246IHsgdmFsdWU6IHsgJGVsOiB0aGlzLlZpZXdzWyBrZXkgXS5lbCwgbWV0aG9kOiAnYmVmb3JlJyB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVmlld3NbIGtleSBdLnRlbXBsYXRlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sga2V5IF0uZWwucmVtb3ZlKClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbCA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBzaG93KCBkdXJhdGlvbiApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHRoaXMuZWxzLmNvbnRhaW5lci5zaG93KCBkdXJhdGlvbiB8fCAxMCwgKCkgPT4geyB0aGlzLnNpemUoKTsgcmVzb2x2ZSgpIH0gKSApXG4gICAgfSxcblxuICAgIHNsdXJwRWwoIGVsICkge1xuICAgICAgICB2YXIga2V5ID0gZWwuYXR0ciggdGhpcy5zbHVycC5hdHRyICkgfHwgJ2NvbnRhaW5lcidcblxuICAgICAgICB0aGlzLmVsc1sga2V5IF0gPSB0aGlzLmVsc1sga2V5IF0gPyB0aGlzLmVsc1sga2V5IF0uYWRkKCBlbCApIDogZWxcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG5cbiAgICAgICAgdmFyICRodG1sID0gdGhpcy4kKCBvcHRpb25zLnRlbXBsYXRlICksXG4gICAgICAgICAgICBzZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLmF0dHJ9XWAsXG4gICAgICAgICAgICB2aWV3U2VsZWN0b3IgPSBgWyR7dGhpcy5zbHVycC52aWV3fV1gXG5cbiAgICAgICAgJGh0bWwuZWFjaCggKCBpLCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSB8fCBpID09PSAwICkgdGhpcy5zbHVycEVsKCAkZWwgKVxuICAgICAgICB9IClcblxuICAgICAgICAkaHRtbC5nZXQoKS5mb3JFYWNoKCAoIGVsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kKCBlbCApLmZpbmQoIHNlbGVjdG9yICkuZWFjaCggKCB1bmRlZmluZWQsIGVsVG9CZVNsdXJwZWQgKSA9PiB0aGlzLnNsdXJwRWwoIHRoaXMuJChlbFRvQmVTbHVycGVkKSApIClcbiAgICAgICAgICAgIHRoaXMuJCggZWwgKS5maW5kKCB2aWV3U2VsZWN0b3IgKS5lYWNoKCAoIHVuZGVmaW5lZCwgdmlld0VsICkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQodmlld0VsKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbICRlbC5hdHRyKHRoaXMuc2x1cnAudmlldykgXS5lbCA9ICRlbFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgICAgIFxuICAgICAgICBvcHRpb25zLmluc2VydGlvbi4kZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaXNNb3VzZU9uRWwoIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlIClcblxuICAgICAgICBpZiggKCBldmVudC5wYWdlWCA8IGVsT2Zmc2V0LmxlZnQgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWCA+ICggZWxPZmZzZXQubGVmdCArIGVsV2lkdGggKSApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZIDwgZWxPZmZzZXQudG9wICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPiAoIGVsT2Zmc2V0LnRvcCArIGVsSGVpZ2h0ICkgKSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2Vcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGBBZG1pbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IGBcbjxkaXYgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMj5MaXN0czwvaDI+XG4gICAgPHA+T3JnYW5pemUgeW91ciBjb250ZW50IGludG8gbmVhdCBncm91cHMgd2l0aCBvdXIgbGlzdHMuPC9wPlxuICAgIDxkaXYgY2xhc3M9XCJleGFtcGxlXCIgZGF0YS12aWV3PVwibGlzdFwiPjwvZGl2PlxuICAgIDxoMj5Gb3JtczwvaDI+XG4gICAgPHA+T3VyIGZvcm1zIGFyZSBjdXN0b21pemFibGUgdG8gc3VpdCB0aGUgbmVlZHMgb2YgeW91ciBwcm9qZWN0LiBIZXJlLCBmb3IgZXhhbXBsZSwgYXJlIFxuICAgIExvZ2luIGFuZCBSZWdpc3RlciBmb3JtcywgZWFjaCB1c2luZyBkaWZmZXJlbnQgaW5wdXQgc3R5bGVzLjwvcD5cbiAgICA8ZGl2IGNsYXNzPVwiZXhhbXBsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5saW5lLXZpZXdcIj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwibG9naW5cIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtdmlld1wiPlxuICAgICAgICAgICAgPGRpdiBkYXRhLXZpZXc9XCJyZWdpc3RlclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAocCkgPT5cblxuYDxzcGFuIGNsYXNzPVwiZmVlZGJhY2tcIiBkYXRhLWpzPVwiZmllbGRFcnJvclwiPiR7IHAuZXJyb3IgfTwvc3Bhbj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChwKSA9PiB7XG4gICAgdmFyIGh0bWwgPSBgXG48Zm9ybSBkYXRhLWpzPVwiY29udGFpbmVyXCI+XG4gICAgJHsgcC5maWVsZHMubWFwKCBmaWVsZCA9PlxuICAgIGA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCAkeyAoIGZpZWxkLmhvcml6b250YWwgKSA/IGBob3Jpem9udGFsYCA6IGBgIH1cIj5cbiAgICAgICAkeyAoIGZpZWxkLmxhYmVsICkgPyBgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cIiR7IGZpZWxkLm5hbWUgfVwiPiR7IGZpZWxkLmxhYmVsIH08L2xhYmVsPmAgOiBgYCB9XG4gICAgICAgPCR7ICggZmllbGQuc2VsZWN0ICkgPyBgc2VsZWN0YCA6IGBpbnB1dGAgfSBkYXRhLWpzPVwiJHsgZmllbGQubmFtZSB9XCIgY2xhc3M9XCIkeyBmaWVsZC5jbGFzcyB9XCJcbiAgICAgICB0eXBlPVwiJHsgZmllbGQudHlwZSB9XCIgaWQ9XCIkeyBmaWVsZC5uYW1lIH1cIiAkeyAoIGZpZWxkLnBsYWNlaG9sZGVyICkgPyBgcGxhY2Vob2xkZXI9XCIkeyBmaWVsZC5wbGFjZWhvbGRlciB9XCJgIDogYGAgfT5cbiAgICAgICAgICAgICR7IChmaWVsZC5zZWxlY3QpID8gZmllbGQub3B0aW9ucy5tYXAoIG9wdGlvbiA9PlxuICAgICAgICAgICAgICAgIGA8b3B0aW9uPiR7IG9wdGlvbiB9PC9vcHRpb24+YCApLmpvaW4oJycpICsgYDwvc2VsZWN0PmAgOiBgYCB9XG4gICAgPC9kaXY+YCApLmpvaW4oJycpIH1cbjwvZm9ybT5cbmAgXG4gICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvPlxccys8L2csJz48JylcbiAgICByZXR1cm4gaHRtbFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdj5IZWFkZXI8L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2PkZ1dHVyZSBEYXlzPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdiBkYXRhLWpzPVwiaW52YWxpZExvZ2luRXJyb3JcIiBjbGFzcz1cImZlZWRiYWNrXCI+SW52YWxpZCBDcmVkZW50aWFsczwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBvcHRpb25zICkgPT4gYFxuXG48dWwgY2xhc3M9XCJsaXN0XCI+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+Zm9yPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj50aGU8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPnNha2U8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPm9mPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5mdXR1cmU8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPmRheXM8L2xpPlxuPC91bD5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuPGRpdiBjbGFzcz1cImxvZ2luXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMT5Mb2dpbjwvaDE+XG4gICAgPGRpdiBkYXRhLWpzPVwiZm9ybVwiPjwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImJ1dHRvblJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJyZWdpc3RlckJ0blwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPlJlZ2lzdGVyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImxvZ2luQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+TG9nIEluPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuPGRpdiBjbGFzcz1cInJlZ2lzdGVyXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMT5SZWdpc3RlcjwvaDE+XG4gICAgPGRpdiBkYXRhLWpzPVwiZm9ybVwiPjwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImJ1dHRvblJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwicmVnaXN0ZXJCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5SZWdpc3RlcjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gIiwibW9kdWxlLmV4cG9ydHMgPSBlcnIgPT4geyBjb25zb2xlLmxvZyggZXJyLnN0YWNrIHx8IGVyciApIH1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4vTXlFcnJvcicpLFxuXG4gICAgTW9tZW50OiByZXF1aXJlKCdtb21lbnQnKSxcblxuICAgIFA6ICggZnVuLCBhcmdzLCB0aGlzQXJnICkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gUmVmbGVjdC5hcHBseSggZnVuLCB0aGlzQXJnLCBhcmdzLmNvbmNhdCggKCBlLCAuLi5hcmdzICkgPT4gZSA/IHJlamVjdChlKSA6IHJlc29sdmUoYXJncykgKSApICksXG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7IHJldHVybiB0aGlzIH1cbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIl19
