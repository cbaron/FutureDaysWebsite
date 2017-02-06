(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
	about: require('./views/templates/about'),
	admin: require('./views/templates/admin'),
	contact: require('./views/templates/contact'),
	demo: require('./views/templates/demo'),
	fieldError: require('./views/templates/fieldError'),
	footer: require('./views/templates/footer'),
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

},{"./views/templates/about":23,"./views/templates/admin":24,"./views/templates/contact":25,"./views/templates/demo":26,"./views/templates/fieldError":27,"./views/templates/footer":28,"./views/templates/form":29,"./views/templates/header":30,"./views/templates/home":31,"./views/templates/invalidLoginError":32,"./views/templates/list":33,"./views/templates/login":34,"./views/templates/register":35,"./views/templates/services":36,"./views/templates/sidebar":37,"./views/templates/staff":38}],2:[function(require,module,exports){
'use strict';

module.exports = {
	About: require('./views/About'),
	Admin: require('./views/Admin'),
	Contact: require('./views/Contact'),
	Demo: require('./views/Demo'),
	Footer: require('./views/Footer'),
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

},{"./views/About":7,"./views/Admin":8,"./views/Contact":9,"./views/Demo":10,"./views/Footer":11,"./views/Form":12,"./views/Header":13,"./views/Home":14,"./views/List":15,"./views/Login":16,"./views/MyView":17,"./views/Register":18,"./views/Services":19,"./views/Sidebar":20,"./views/Staff":21}],3:[function(require,module,exports){
'use strict';

module.exports = Object.create({
    create: function create(name, opts) {
        return Object.create(this.Views[name.charAt(0).toUpperCase() + name.slice(1)], Object.assign({
            template: { value: this.Templates[name] },
            user: { value: this.User },
            factory: { value: this }
        }, opts)).constructor();
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
            }),
            footer: this.ViewFactory.create('footer', { insertion: { value: { $el: this.contentContainer, method: 'after' } } })
        });
    },
    goHome: function goHome() {
        this.navigate('home', { trigger: true });
    },
    handler: function handler(resource) {
        var _this2 = this;

        if (!resource) return this.goHome();

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

},{"../../lib/MyError":39,"./factory/View":3,"./models/User":5,"backbone":"backbone","jquery":"jquery"}],7:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":22}],8:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    requiresLogin: true
});

},{"./__proto__":22}],9:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    fields: [{
        name: 'from',
        type: 'email',
        placeholder: 'From',
        error: 'Please enter a valid email address.',
        validate: function validate(val) {
            return this.emailRegex.test(val);
        }
    }, {
        name: 'subject',
        type: 'text',
        placeholder: 'Subject',
        error: 'Please enter a subject.',
        validate: function validate(val) {
            return val.length > 0;
        }
    }, {
        name: 'message',
        textarea: true,
        placeholder: "Message",
        rows: '10',
        error: "Please type out your message.",
        validate: function validate(val) {
            return val.length > 0;
        }
    }],

    Form: require('./Form'),

    onSubmissionResponse: function onSubmissionResponse() {
        return;
    },
    postRender: function postRender() {
        this.formInstance = Object.create(this.Form, {
            class: { value: 'input-borderless' },
            fields: { value: this.fields },
            insertion: { value: { $el: this.els.form } },
            onSubmissionResponse: { value: this.onSubmissionResponse }
        }).constructor();

        return this;
    }
});

},{"./Form":12,"./__proto__":22}],10:[function(require,module,exports){
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

},{"./List":15,"./Login":16,"./Register":18,"./Sidebar":20,"./__proto__":22,"./templates/list":33,"./templates/login":34,"./templates/register":35,"./templates/sidebar":37}],11:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":22}],12:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    getTemplateOptions: function getTemplateOptions() {
        var _this = this;

        this.fields.forEach(function (field) {
            var name = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            field['class'] = _this.class;
            if (_this.horizontal) field['horizontal'] = true;
            if (field.textarea) field['textarea'] = true;
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

        this.els.container.find('input, textarea').on('blur', function () {
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

},{"./__proto__":22,"./templates/fieldError":27,"./templates/form":29}],13:[function(require,module,exports){
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

},{"./__proto__":22}],14:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    events: {
        'whyBtn': { event: 'click' }
    },

    onWhyBtnClick: function onWhyBtnClick() {
        this.emit('route', 'about');
    }
});

},{"./__proto__":22}],15:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":22}],16:[function(require,module,exports){
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

},{"../models/User":5,"./Form":12,"./Register":18,"./__proto__":22,"./templates/invalidLoginError":32,"./templates/login":34}],17:[function(require,module,exports){
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

},{"../models/User":5,"../router":6,"./Login":16,"backbone":"backbone","events":41,"jquery":"jquery","moment":"moment","underscore":"underscore","util":45}],18:[function(require,module,exports){
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

},{"./Form":12,"./__proto__":22,"./templates/invalidLoginError":32,"./templates/register":35}],19:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    template: require('./templates/demo')

});

},{"./__proto__":22,"./templates/demo":26}],20:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    template: require('./templates/sidebar')

});

},{"./__proto__":22,"./templates/sidebar":37}],21:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":22}],22:[function(require,module,exports){
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

},{"../../../lib/MyObject":40,"./Login":16,"backbone":"backbone","events":41,"jquery":"jquery","underscore":"underscore"}],23:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n\n<div class=\"about\">\n    <h1 class=\"header\">Why should you choose us to develop your software?</h1>\n    <div class=\"quote-container\">\n        <blockquote class=\"client-quote\">\n            \"Future Days did a bomb-ass job on our website. They were professional and easy to work with,\n            and we are completely satisfied with our website. It has been stable and bug-free. I highly\n            recommend them to anyone. \"\n            <cite>-- George the Patchwork dude</cite>\n        </blockquote>\n    </div>\n    <div class=\"selling-points\">\n        <div class=\"selling-point\">\n            <h3>Experience</h3>\n            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n            sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n        </div>\n        <div class=\"selling-point\">\n            <h3>Competitive Pricing</h3>\n            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n            sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n        </div>\n        <div class=\"selling-point\">\n            <h3>Customization</h3>\n            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n            sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n        </div>\n        <div class=\"selling-point\">\n            <h3>Free Maintenance</h3>\n            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n            sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n        </div>\n    </div>\n</div>";
};

},{}],24:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "Admin";
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <div data-js=\"container\" class=\"contact\">\n        <div class=\"fd-info\">\n            <div class=\"info-box\">\n                <h2>Let's Get In Touch</h2>\n                <p>Feel free to contact us by phone or email with any project ideas or questions,\n                or send us a quick message.</p>\n                <div class=\"contact-details\">\n                    <dl>\n                        <dt>Email</dt>\n                        <dd><a href=\"topher.baron@gmail.com\">topher.baron@gmail.com</a></dd>\n                        <dt>Phone</dt>\n                        <dd>123-456-7890</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"contact-form\">\n            <div data-js=\"form\"></div>\n            <button data-js=\"sendBtn\" class=\"btn-ghost\">Send</button>\n        </div>\n\n    </div>";
};

},{}],26:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"demo\" data-js=\"container\">\n    <aside class=\"sidebar\">\n        <div data-view=\"sidebar\"></div>\n    </aside>\n    <div class=\"demo-content\">\n        <h2>Lists</h2>\n        <p>Organize your content into neat groups with our lists.</p>\n        <div class=\"example\">\n            <div class=\"inline-view\">\n                <div data-view=\"list\"></div>\n            </div>\n        </div>\n        <h2>Forms</h2>\n        <p>Our forms are customizable to suit the needs of your project. Here, for example, are \n        Login and Register forms, each using different input styles.</p>\n        <div class=\"example\">\n            <div class=\"inline-view\">\n                <div data-view=\"login\"></div>\n            </div>\n            <div class=\"inline-view\">\n                <div data-view=\"register\"></div>\n            </div>\n        </div>\n    </div>\n</div>\n";
};

},{}],27:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<span class=\"feedback\" data-js=\"fieldError\">" + p.error + "</span>";
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n\n<div class=\"footer\">\n    <div class=\"trademark\">&copy; " + new Date().getFullYear() + " FutureDays Software LLC</div>\n</div>\n";
};

},{}],29:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    var html = '\n<form data-js="container">\n    ' + p.fields.map(function (field) {
        return '<div class="form-group ' + (field.horizontal ? 'horizontal' : '') + '">\n\n        ' + (field.label ? '<label class="form-label" for="' + field.name + '">' + field.label + '</label>' : '') + '\n        <' + (field.select ? 'select' : field.textarea ? 'textarea' : 'input') + ' data-js="' + field.name + '" class="' + field.class + '"\n        type="' + field.type + '" id="' + field.name + '" ' + (field.placeholder ? 'placeholder="' + field.placeholder + '"' : '') + '\n        ' + (field.rows ? 'rows="' + field.rows + '"' : '') + ' ' + (field.cols ? 'cols="' + field.cols + '"' : '') + '>\n            ' + (field.select ? field.options.map(function (option) {
            return '<option>' + option + '</option>';
        }).join('') + '</select>' : '') + '\n            ' + (field.textarea ? '</textarea>' : '') + '\n    </div>';
    }).join('') + '\n</form>\n';
    html = html.replace(/>\s+</g, '><');
    return html;
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n\n<header class=\"site-header\">\n    <div data-js=\"logo\" class=\"logo\">Future Days</div>\n    <nav>\n        <ul data-js=\"navLinks\" class=\"nav-links\">\n            <li data-id=\"about\">Why Us</li>\n            <li data-id=\"staff\">Staff</li>\n            <li data-id=\"blog\">Blog</li>\n            <li data-id=\"contact\">Contact Us</li>\n        </ul>\n    </nav>\n</header>\n";
};

},{}],31:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n\n<div class=\"home-page\">\n    <div class=\"cover-image\">\n        <h1 class=\"cover-text\">Elegant, Fully Customizable Software</h1>\n    </div>\n    <div class=\"intro\">\n        <div class=\"intro-text\">\n            <p>Future Days is a small, versatile software team dedicated to producing unique\n            solutions. If you can think it, we can make it. And if you need help thinking it, we'd love to\n            add our minds to yours.</p>\n        </div>\n    </div>\n    <div class=\"services\">\n        <div class=\"service\">\n            <h3>Websites and Web Apps</h3>\n            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n            sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n        </div>\n        <div class=\"service\">\n            <h3>Digital Strategy</h3>\n            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n            sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n        </div>\n        <div class=\"service\">\n            <h3>You Name It</h3>\n            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n            velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n            sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n        </div>\n    </div>\n    <div class=\"learn-more\">\n        <p>Interested? Learn more about our strengths.</p>\n        <button data-js=\"whyBtn\" class=\"btn-ghost\">Why Choose Us</button>\n    </div>\n</div>\n\n";
};

},{}],32:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div data-js=\"invalidLoginError\" class=\"feedback\">Invalid Credentials</div>";
};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n\n<ul class=\"list\">\n    <li class=\"list-item\">for</li>\n    <li class=\"list-item\">the</li>\n    <li class=\"list-item\">sake</li>\n    <li class=\"list-item\">of</li>\n    <li class=\"list-item\">future</li>\n    <li class=\"list-item\">days</li>\n</ul>\n";
};

},{}],34:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"login\" data-js=\"container\">\n    <h1>Login</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n        <button data-js=\"loginBtn\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>\n";
};

},{}],35:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div class=\"register\" data-js=\"container\">\n    <h1>Register</h1>\n    <div data-js=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"cancelBtn\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n    </div>\n</div>\n";
};

},{}],36:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <div class=\"services\">\n        <h2>Our Services</h2>\n        <p>We offer a full range of services, including but not limited to:\n        <ul class=\"services-list\">\n            <li>Website and web app development</li>\n            <li>Custom software</li>\n            <li>Hosting</li>\n            <li>Digital Strategy</li>\n        </ul>\n        <h2>Why Choose Us?</h2>\n        <p>As the tech industry has exploded, the market has been glutted with countless developers who possess little experience\n        and a very narrow set of skills, generally limited to the capabilities of their chosen platform. Most WordPress developers,\n        for example, can throw together a theme and some plugins, but if you ask them to implement custom functionality for your site,\n        they will likely be at a loss. At Future Days, we understand how the web and applications work at their deepest\n        levels. We have built our own framework from the ground up, which we continually refine and optimize. Armed with\n        this low level knowledge, we possess the capability to create just about any feature you can imagine. Customization\n        is key. As the web becomes ever more streamlined and cookie cutter, we can help you stand out from the pack.</p>\n\n        <p>Versatility is not our only advantage, however. As a small team with limited overhead, we can do the same work\n        as larger development firms for less money. And we only charge for new work:  no maintenance fees, and if a bug comes up, we fix\n        it without charge, no questions asked. We take full responsibility for the quality of our work.</p>\n    </div>";
};

},{}],37:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <nav>\n        <ul class=\"sidebar-links\">\n            <li>Lists</li>\n            <li>Forms</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n            <li>Dummy Text</li>\n        </ul>\n    </nav>\n";
};

},{}],38:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n    <div class=\"staff\">\n        <div class=\"staff-intro\">\n            <h1>Our Team</h1>\n            <p>Small but nimble.</p>\n        </div>\n        <div class=\"staff-block\">\n            <img class=\"staff-photo\" src=\"/static/img/hollywood.jpg\">\n            <div class=\"bio\">\n                <h3>Chris Baron</h3>\n                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n                sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n            </div>\n        </div>\n        <div class=\"staff-block\">\n            <img class=\"staff-photo\" src=\"/static/img/eno.jpg\">\n            <div class=\"bio\">\n                <h3>Scott Parton</h3>\n                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt\n                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\n                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,\n                sunt in culpa qui officia deserunt mollit anim id est laborum</p>\n            </div>\n        </div>\n    </div>";
};

},{}],39:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],40:[function(require,module,exports){
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

},{"./MyError":39,"moment":"moment"}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],45:[function(require,module,exports){
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

},{"./support/isBuffer":44,"_process":43,"inherits":42}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzL2ZhY3RvcnkvVmlldy5qcyIsImNsaWVudC9qcy9tYWluLmpzIiwiY2xpZW50L2pzL21vZGVscy9Vc2VyLmpzIiwiY2xpZW50L2pzL3JvdXRlci5qcyIsImNsaWVudC9qcy92aWV3cy9BYm91dC5qcyIsImNsaWVudC9qcy92aWV3cy9BZG1pbi5qcyIsImNsaWVudC9qcy92aWV3cy9Db250YWN0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL0RlbW8uanMiLCJjbGllbnQvanMvdmlld3MvRm9vdGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0Zvcm0uanMiLCJjbGllbnQvanMvdmlld3MvSGVhZGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0hvbWUuanMiLCJjbGllbnQvanMvdmlld3MvTGlzdC5qcyIsImNsaWVudC9qcy92aWV3cy9Mb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy9NeVZpZXcuanMiLCJjbGllbnQvanMvdmlld3MvUmVnaXN0ZXIuanMiLCJjbGllbnQvanMvdmlld3MvU2VydmljZXMuanMiLCJjbGllbnQvanMvdmlld3MvU2lkZWJhci5qcyIsImNsaWVudC9qcy92aWV3cy9TdGFmZi5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2Fib3V0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9hZG1pbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvY29udGFjdC5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvZGVtby5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvZmllbGRFcnJvci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvZm9vdGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9mb3JtLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9oZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2hvbWUuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saXN0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9sb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvcmVnaXN0ZXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL3NlcnZpY2VzLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9zaWRlYmFyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9zdGFmZi5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxRQUFPLFFBQVEseUJBQVIsQ0FGTztBQUdkLFVBQVMsUUFBUSwyQkFBUixDQUhLO0FBSWQsT0FBTSxRQUFRLHdCQUFSLENBSlE7QUFLZCxhQUFZLFFBQVEsOEJBQVIsQ0FMRTtBQU1kLFNBQVEsUUFBUSwwQkFBUixDQU5NO0FBT2QsT0FBTSxRQUFRLHdCQUFSLENBUFE7QUFRZCxTQUFRLFFBQVEsMEJBQVIsQ0FSTTtBQVNkLE9BQU0sUUFBUSx3QkFBUixDQVRRO0FBVWQsb0JBQW1CLFFBQVEscUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRhYm91dDogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvYWJvdXQnKSxcblx0YWRtaW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2FkbWluJyksXG5cdGNvbnRhY3Q6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2NvbnRhY3QnKSxcblx0ZGVtbzogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZGVtbycpLFxuXHRmaWVsZEVycm9yOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9maWVsZEVycm9yJyksXG5cdGZvb3RlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZm9vdGVyJyksXG5cdGZvcm06IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2Zvcm0nKSxcblx0aGVhZGVyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9oZWFkZXInKSxcblx0aG9tZTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvaG9tZScpLFxuXHRpbnZhbGlkTG9naW5FcnJvcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvaW52YWxpZExvZ2luRXJyb3InKSxcblx0bGlzdDogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvbGlzdCcpLFxuXHRsb2dpbjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvbG9naW4nKSxcblx0cmVnaXN0ZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL3JlZ2lzdGVyJyksXG5cdHNlcnZpY2VzOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9zZXJ2aWNlcycpLFxuXHRzaWRlYmFyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9zaWRlYmFyJyksXG5cdHN0YWZmOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9zdGFmZicpXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRBYm91dDogcmVxdWlyZSgnLi92aWV3cy9BYm91dCcpLFxuXHRBZG1pbjogcmVxdWlyZSgnLi92aWV3cy9BZG1pbicpLFxuXHRDb250YWN0OiByZXF1aXJlKCcuL3ZpZXdzL0NvbnRhY3QnKSxcblx0RGVtbzogcmVxdWlyZSgnLi92aWV3cy9EZW1vJyksXG5cdEZvb3RlcjogcmVxdWlyZSgnLi92aWV3cy9Gb290ZXInKSxcblx0Rm9ybTogcmVxdWlyZSgnLi92aWV3cy9Gb3JtJyksXG5cdEhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKSxcblx0SG9tZTogcmVxdWlyZSgnLi92aWV3cy9Ib21lJyksXG5cdExpc3Q6IHJlcXVpcmUoJy4vdmlld3MvTGlzdCcpLFxuXHRMb2dpbjogcmVxdWlyZSgnLi92aWV3cy9Mb2dpbicpLFxuXHRNeVZpZXc6IHJlcXVpcmUoJy4vdmlld3MvTXlWaWV3JyksXG5cdFJlZ2lzdGVyOiByZXF1aXJlKCcuL3ZpZXdzL1JlZ2lzdGVyJyksXG5cdFNlcnZpY2VzOiByZXF1aXJlKCcuL3ZpZXdzL1NlcnZpY2VzJyksXG5cdFNpZGViYXI6IHJlcXVpcmUoJy4vdmlld3MvU2lkZWJhcicpLFxuXHRTdGFmZjogcmVxdWlyZSgnLi92aWV3cy9TdGFmZicpXG59IiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCB7XG5cbiAgICBjcmVhdGUoIG5hbWUsIG9wdHMgKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSkgXSxcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oIHsgXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSxcbiAgICAgICAgICAgICAgICB1c2VyOiB7IHZhbHVlOiB0aGlzLlVzZXIgfSxcbiAgICAgICAgICAgICAgICBmYWN0b3J5OiB7IHZhbHVlOiB0aGlzIH1cbiAgICAgICAgICAgIH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICB9LFxuXG59LCB7XG4gICAgVGVtcGxhdGVzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVGVtcGxhdGVNYXAnKSB9LFxuICAgIFVzZXI6IHsgdmFsdWU6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyApIH0sXG4gICAgVmlld3M6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5WaWV3TWFwJykgfVxufSApXG4iLCJyZXF1aXJlKCdqcXVlcnknKSggKCkgPT4ge1xuICAgIHJlcXVpcmUoJy4vcm91dGVyJylcbiAgICByZXF1aXJlKCdiYWNrYm9uZScpLmhpc3Rvcnkuc3RhcnQoIHsgcHVzaFN0YXRlOiB0cnVlIH0gKVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyAoIHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwuZXh0ZW5kKCB7XG4gICAgZGVmYXVsdHM6IHsgc3RhdGU6IHt9IH0sXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5mZXRjaGVkID0gdGhpcy5mZXRjaCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICB1cmwoKSB7IHJldHVybiBcIi91c2VyXCIgfVxufSApICkoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgKFxuICAgIHJlcXVpcmUoJ2JhY2tib25lJykuUm91dGVyLmV4dGVuZCgge1xuXG4gICAgICAgICQ6IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgICAgICBcbiAgICAgICAgVXNlcjogcmVxdWlyZSgnLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuXG4gICAgICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY29udGVudENvbnRhaW5lciA9IHRoaXMuJCgnI2NvbnRlbnQnKVxuXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywge1xuICAgICAgICAgICAgICAgIHZpZXdzOiB7IH0sXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAncm91dGUnLCByb3V0ZSA9PiB0aGlzLm5hdmlnYXRlKCByb3V0ZSwgeyB0cmlnZ2VyOiB0cnVlIH0gKSApLFxuICAgICAgICAgICAgICAgIGZvb3RlcjogdGhpcy5WaWV3RmFjdG9yeS5jcmVhdGUoICdmb290ZXInLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuY29udGVudENvbnRhaW5lciwgbWV0aG9kOiAnYWZ0ZXInIH0gfSB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9LFxuXG4gICAgICAgIGdvSG9tZSgpIHsgdGhpcy5uYXZpZ2F0ZSggJ2hvbWUnLCB7IHRyaWdnZXI6IHRydWUgfSApIH0sXG5cbiAgICAgICAgaGFuZGxlciggcmVzb3VyY2UgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCAhcmVzb3VyY2UgKSByZXR1cm4gdGhpcy5nb0hvbWUoKVxuXG4gICAgICAgICAgICB0aGlzLlVzZXIuZmV0Y2hlZC5kb25lKCAoKSA9PiB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlci5vblVzZXIoKVxuICAgICAgICAgICAgICAgICAgICAub24oICdzaWdub3V0JywgKCkgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIG5hbWUgPT4gdGhpcy52aWV3c1sgbmFtZSBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oIHRoaXMuZ29Ib21lKCkgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCB2aWV3ID0+IHRoaXMudmlld3NbIHZpZXcgXS5oaWRlKCkgKSApXG4gICAgICAgICAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMudmlld3NbIHJlc291cmNlIF0gKSByZXR1cm4gdGhpcy52aWV3c1sgcmVzb3VyY2UgXS5zaG93KClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgcmVzb3VyY2UgXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggcmVzb3VyY2UsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgaWYoIHJlc291cmNlID09PSAnaG9tZScgKSB0aGlzLnZpZXdzWyByZXNvdXJjZSBdXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oICdyb3V0ZScsIHJvdXRlID0+IHRoaXMubmF2aWdhdGUoIHJvdXRlLCB7IHRyaWdnZXI6IHRydWUgfSApIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ICkuZmFpbCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICByb3V0ZXM6IHsgJygqcmVxdWVzdCknOiAnaGFuZGxlcicgfVxuXG4gICAgfSApXG4pKClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuXG59ICkiLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG4gICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBmaWVsZHM6IFsge1xuICAgICAgICBuYW1lOiAnZnJvbScsXG4gICAgICAgIHR5cGU6ICdlbWFpbCcsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnRnJvbScsXG4gICAgICAgIGVycm9yOiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZW1haWxSZWdleC50ZXN0KHZhbCkgfVxuICAgIH0sIHsgICAgICAgIFxuICAgICAgICBuYW1lOiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdTdWJqZWN0JyxcbiAgICAgICAgZXJyb3I6ICdQbGVhc2UgZW50ZXIgYSBzdWJqZWN0LicsXG4gICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gdmFsLmxlbmd0aCA+IDAgICAgICAgIFxuICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ21lc3NhZ2UnLFxuICAgICAgICB0ZXh0YXJlYTogdHJ1ZSxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiTWVzc2FnZVwiLFxuICAgICAgICByb3dzOiAnMTAnLFxuICAgICAgICBlcnJvcjogXCJQbGVhc2UgdHlwZSBvdXQgeW91ciBtZXNzYWdlLlwiLFxuICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPiAwXG4gICAgfSBdLFxuXG4gICAgRm9ybTogcmVxdWlyZSgnLi9Gb3JtJyksXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZSgpIHsgcmV0dXJuIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwge1xuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9LFxuICAgICAgICAgICAgZmllbGRzOiB7IHZhbHVlOiB0aGlzLmZpZWxkcyB9LCBcbiAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuZWxzLmZvcm0gfSB9LFxuICAgICAgICAgICAgb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbn0gKSIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFZpZXdzOiB7XG4gICAgICAgIGxpc3Q6IHsgdmlldzogcmVxdWlyZSgnLi9MaXN0JyksIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9saXN0JykgIH0sXG4gICAgICAgIGxvZ2luOiB7IHZpZXc6IHJlcXVpcmUoJy4vTG9naW4nKSwgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2xvZ2luJykgIH0sXG4gICAgICAgIHJlZ2lzdGVyOiB7IHZpZXc6IHJlcXVpcmUoJy4vUmVnaXN0ZXInKSwgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3JlZ2lzdGVyJykgIH0sXG4gICAgICAgIHNpZGViYXI6IHsgdmlldzogcmVxdWlyZSgnLi9TaWRlYmFyJyksIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9zaWRlYmFyJykgIH1cbiAgICB9LFxuXG4gICAgLypmaWVsZHM6IFsge1xuICAgICAgICBjbGFzczogXCJmb3JtLWlucHV0XCIsXG4gICAgICAgIG5hbWU6IFwiZW1haWxcIixcbiAgICAgICAgbGFiZWw6ICdFbWFpbCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgZXJyb3I6IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVtYWlsUmVnZXgudGVzdCh2YWwpIH1cbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImZvcm0taW5wdXRcIixcbiAgICAgICAgaG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBsYWJlbDogJ1Bhc3N3b3JkJyxcbiAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgZXJyb3I6IFwiUGFzc3dvcmRzIG11c3QgYmUgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzIGxvbmcuXCIsXG4gICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gdmFsLmxlbmd0aCA+PSA2XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJpbnB1dC1ib3JkZXJsZXNzXCIsXG4gICAgICAgIG5hbWU6IFwiYWRkcmVzc1wiLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcIlN0cmVldCBBZGRyZXNzXCIsXG4gICAgICAgIGVycm9yOiBcIlJlcXVpcmVkIGZpZWxkLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImlucHV0LWZsYXRcIixcbiAgICAgICAgbmFtZTogXCJjaXR5XCIsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiQ2l0eVwiLFxuICAgICAgICBlcnJvcjogXCJSZXF1aXJlZCBmaWVsZC5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLiQudHJpbSh2YWwpICE9PSAnJyB9XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJpbnB1dC1ib3JkZXJsZXNzXCIsXG4gICAgICAgIHNlbGVjdDogdHJ1ZSxcbiAgICAgICAgbmFtZTogXCJmYXZlXCIsXG4gICAgICAgIGxhYmVsOiBcIkZhdmUgQ2FuIEFsYnVtXCIsXG4gICAgICAgIG9wdGlvbnM6IFsgXCJNb25zdGVyIE1vdmllXCIsIFwiU291bmR0cmFja3NcIiwgXCJUYWdvIE1hZ29cIiwgXCJFZ2UgQmFteWFzaVwiLCBcIkZ1dHVyZSBEYXlzXCIgXSxcbiAgICAgICAgZXJyb3I6IFwiUGxlYXNlIGNob29zZSBhbiBvcHRpb24uXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0gXSwqL1xuXG4gICAgcG9zdFJlbmRlcigpIHtcblxuICAgICAgICAvL3RoaXMuc2lkZWJhciA9IE9iamVjdC5jcmVhdGUoIHRoaXMuU2lkZWJhciwgeyBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMudGVtcGxhdGVEYXRhLnNpZGViYXIgfSB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgLy90aGlzLmxpc3RJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTGlzdCwgeyBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmxpc3QgfSB9ICkuY29uc3RydWN0b3IoKVxuXG4gICAgICAgIC8qdGhpcy5mb3JtSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkZvcm0sIHsgXG4gICAgICAgICAgICBmaWVsZHM6IHsgdmFsdWU6IHRoaXMuZmllbGRzIH0sIFxuICAgICAgICAgICAgY29udGFpbmVyOiB7IHZhbHVlOiB0aGlzLmVscy5mb3JtIH1cbiAgICAgICAgfSApLmNvbnN0cnVjdG9yKCkqL1xuXG4gICAgICAgIC8qdGhpcy5sb2dpbkV4YW1wbGUgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkxvZ2luLCB7IFxuICAgICAgICAgICAgY29udGFpbmVyOiB7IHZhbHVlOiB0aGlzLmVscy5sb2dpbkV4YW1wbGUgfSxcbiAgICAgICAgICAgIGNsYXNzOiB7IHZhbHVlOiAnaW5wdXQtYm9yZGVybGVzcycgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICAqL1xuICAgICAgICBcbiAgICAgICAgLyp0aGlzLnJlZ2lzdGVyRXhhbXBsZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuUmVnaXN0ZXIsIHsgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLnJlZ2lzdGVyRXhhbXBsZSB9LFxuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdmb3JtLWlucHV0JyB9LFxuICAgICAgICAgICAgaG9yaXpvbnRhbDogeyB2YWx1ZTogdHJ1ZSB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvZ2luRXhhbXBsZS5lbHMucmVnaXN0ZXJCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgIHRoaXMubG9naW5FeGFtcGxlLmVscy5sb2dpbkJ0bi5vZmYoJ2NsaWNrJylcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXhhbXBsZS5lbHMuY2FuY2VsQnRuLm9mZignY2xpY2snKVxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXhhbXBsZS5lbHMucmVnaXN0ZXJCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgICovXG5cbiAgICAgICAgLy90aGlzLmVsc2Uuc3VibWl0QnRuLm9uKCAnY2xpY2snLCAoKSA9PiB0aGlzLmZvcm1JbnN0YW5jZS5zdWJtaXRGb3JtKCB7IHJlc291cmNlOiAnJyB9ICkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuXG59ICkiLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZW1haWxSZWdleDogL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLyxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHsgXG4gICAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goIGZpZWxkID0+IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gZmllbGQubmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGZpZWxkLm5hbWUuc2xpY2UoMSlcbiAgICAgICAgICAgIGZpZWxkWyAnY2xhc3MnIF0gPSB0aGlzLmNsYXNzXG4gICAgICAgICAgICBpZiggdGhpcy5ob3Jpem9udGFsICkgZmllbGRbICdob3Jpem9udGFsJyBdID0gdHJ1ZVxuICAgICAgICAgICAgaWYoIGZpZWxkLnRleHRhcmVhICkgZmllbGRbICd0ZXh0YXJlYScgXSA9IHRydWVcbiAgICAgICAgICAgIGZpZWxkWyAoIHRoaXMuY2xhc3MgPT09ICdmb3JtLWlucHV0JyApID8gJ2xhYmVsJyA6ICdwbGFjZWhvbGRlcicgXSA9IG5hbWVcblxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4geyBmaWVsZHM6IHRoaXMuZmllbGRzIH0gfSxcblxuICAgIGdldEZvcm1EYXRhKCkge1xuXG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLmVscywga2V5ID0+IHtcbiAgICAgICAgICAgIGlmKCAvSU5QVVR8VEVYVEFSRUFELy50ZXN0KCB0aGlzLmVsc1sga2V5IF0ucHJvcChcInRhZ05hbWVcIikgKSApIHRoaXMuZm9ybURhdGFbIGtleSBdID0gdGhpcy5lbHNbIGtleSBdLnZhbCgpXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1EYXRhXG4gICAgfSxcblxuICAgIGZpZWxkczogWyBdLFxuXG4gICAgb25Gb3JtRmFpbCggZXJyb3IgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCBlcnJvci5zdGFjayB8fCBlcnJvciApO1xuICAgICAgICAvL3RoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZXMuc2VydmVyRXJyb3IoIGVycm9yICksIGluc2VydGlvbjogeyAkZWw6IHRoaXMuZWxzLmJ1dHRvblJvdywgbWV0aG9kOiAnYmVmb3JlJyB9IH0gKVxuICAgIH0sXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZSgpIHsgfSxcblxuICAgIHBvc3RGb3JtKCBkYXRhICkge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuJC5hamF4KCB7XG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoIGRhdGEudmFsdWVzICkgfHwgSlNPTi5zdHJpbmdpZnkoIHRoaXMuZ2V0Rm9ybURhdGEoKSApLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgdG9rZW46ICggdGhpcy51c2VyICkgPyB0aGlzLnVzZXIuZ2V0KCd0b2tlbicpIDogJycgfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB1cmw6IGAvJHsgZGF0YS5yZXNvdXJjZSB9YFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKVxuICAgICAgICAub24oICdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJGVsID0gc2VsZi4kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZpZWxkID0gc2VsZi5fKCBzZWxmLmZpZWxkcyApLmZpbmQoIGZ1bmN0aW9uKCBmaWVsZCApIHsgcmV0dXJuIGZpZWxkLm5hbWUgPT09ICRlbC5hdHRyKCdpZCcpIH0gKVxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gcmVzb2x2ZSggZmllbGQudmFsaWRhdGUuY2FsbCggc2VsZiwgJGVsLnZhbCgpICkgKSApXG4gICAgICAgICAgICAudGhlbiggdmFsaWQgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCB2YWxpZCApIHsgc2VsZi5zaG93VmFsaWQoICRlbCApIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgc2VsZi5zaG93RXJyb3IoICRlbCwgZmllbGQuZXJyb3IgKSB9XG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgICAgIC5vbiggJ2ZvY3VzJywgZnVuY3Rpb24oKSB7IHNlbGYucmVtb3ZlRXJyb3IoIHNlbGYuJCh0aGlzKSApIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlbW92ZUVycm9yKCAkZWwgKSB7XG4gICAgICAgICRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZXJyb3IgdmFsaWQnKVxuICAgICAgICAkZWwuc2libGluZ3MoJy5mZWVkYmFjaycpLnJlbW92ZSgpXG4gICAgfSxcblxuICAgIHNob3dFcnJvciggJGVsLCBlcnJvciApIHtcblxuICAgICAgICB2YXIgZm9ybUdyb3VwID0gJGVsLnBhcmVudCgpXG5cbiAgICAgICAgaWYoIGZvcm1Hcm91cC5oYXNDbGFzcyggJ2Vycm9yJyApICkgcmV0dXJuXG5cbiAgICAgICAgZm9ybUdyb3VwLnJlbW92ZUNsYXNzKCd2YWxpZCcpLmFkZENsYXNzKCdlcnJvcicpLmFwcGVuZCggdGhpcy50ZW1wbGF0ZXMuZmllbGRFcnJvciggeyBlcnJvcjogZXJyb3IgfSApIClcbiAgICB9LFxuXG4gICAgc2hvd1ZhbGlkKCAkZWwgKSB7XG4gICAgICAgICRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZXJyb3InKS5hZGRDbGFzcygndmFsaWQnKVxuICAgICAgICAkZWwuc2libGluZ3MoJy5mZWVkYmFjaycpLnJlbW92ZSgpXG4gICAgfSxcblxuICAgIHN1Ym1pdEZvcm0oIHJlc291cmNlICkge1xuICAgICAgICB0aGlzLnZhbGlkYXRlKCkudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGlmKCByZXN1bHQgPT09IGZhbHNlICkgcmV0dXJuXG4gICAgICAgICAgICB0aGlzLnBvc3RGb3JtKCByZXNvdXJjZSApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy5vblN1Ym1pc3Npb25SZXNwb25zZSgpIClcbiAgICAgICAgICAgIC5jYXRjaCggZSA9PiB0aGlzLm9uRm9ybUZhaWwoIGUgKSApXG4gICAgICAgIH0gKSAgICBcbiAgICB9LFxuXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2Zvcm0nKSxcblxuICAgIHRlbXBsYXRlczoge1xuICAgICAgICBmaWVsZEVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9maWVsZEVycm9yJylcbiAgICB9LFxuXG4gICAgdmFsaWRhdGUoKSB7XG4gICAgICAgIHZhciB2YWxpZCA9IHRydWVcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggdGhpcy5maWVsZHMubWFwKCBmaWVsZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmaWVsZC52YWxpZGF0ZS5jYWxsKHRoaXMsIHRoaXMuZWxzWyBmaWVsZC5uYW1lIF0udmFsKCkgKSAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoIHJlc3VsdCA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoIHRoaXMuZWxzWyBmaWVsZC5uYW1lIF0sIGZpZWxkLmVycm9yICkgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKSApXG4gICAgICAgIC50aGVuKCAoKSA9PiB2YWxpZCApXG4gICAgICAgIC5jYXRjaCggZSA9PiB7IGNvbnNvbGUubG9nKCBlLnN0YWNrIHx8IGUgKTsgcmV0dXJuIGZhbHNlIH0gKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2xvZ28nOiAnY2xpY2snLFxuICAgICAgICAnbmF2TGlua3MnOiB7IGV2ZW50OiAnY2xpY2snLCBzZWxlY3RvcjogJ2xpJyB9XG4gICAgICAgIC8vJ3NpZ25vdXRCdG4nOiB7IG1ldGhvZDogJ3NpZ25vdXQnIH1cbiAgICB9LFxuXG4gICAgb25Mb2dvQ2xpY2soKSB7IHRoaXMuZW1pdCggJ3JvdXRlJywgJ2hvbWUnICkgfSxcblxuICAgIG9uTmF2TGlua3NDbGljayggZSApIHtcbiAgICAgICAgdmFyIHJlc291cmNlID0gdGhpcy4kKCBlLmN1cnJlbnRUYXJnZXQgKS5hdHRyKCAnZGF0YS1pZCcgKSAgICAgXG4gICAgICAgIHRoaXMuZW1pdCggJ3JvdXRlJywgcmVzb3VyY2UgKVxuICAgIH0sXG5cbiAgICBvblVzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBcbiAgICAvKnNpZ25vdXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gJ3BhdGNod29ya2p3dD07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7JztcblxuICAgICAgICB0aGlzLnVzZXIuY2xlYXIoKVxuXG4gICAgICAgIHRoaXMuZW1pdCgnc2lnbm91dCcpXG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoIFwiL1wiLCB7IHRyaWdnZXI6IHRydWUgfSApXG4gICAgfSovXG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICd3aHlCdG4nOiB7IGV2ZW50OiAnY2xpY2snIH1cbiAgICB9LFxuXG4gICAgb25XaHlCdG5DbGljaygpIHtcbiAgICAgICAgdGhpcy5lbWl0KCAncm91dGUnLCAnYWJvdXQnIClcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ3JlZ2lzdGVyQnRuJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICcnLCBtZXRob2Q6ICdzaG93UmVnaXN0cmF0aW9uJyB9LFxuICAgICAgICAnbG9naW5CdG4nOiB7IGV2ZW50OiAnY2xpY2snLCBzZWxlY3RvcjogJycsIG1ldGhvZDogJ2xvZ2luJyB9XG4gICAgfSxcblxuICAgIGZpZWxkczogWyB7ICAgICAgICBcbiAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJyxcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVtYWlsUmVnZXgudGVzdCh2YWwpIH1cbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdwYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIGVycm9yOiBcIlBhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLlwiLFxuICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPj0gNlxuICAgIH0gXSxcblxuICAgIEZvcm06IHJlcXVpcmUoJy4vRm9ybScpLFxuXG4gICAgbG9naW4oKSB7IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6IFwiYXV0aFwiIH0gKSB9LFxuXG4gICAgb25TdWJtaXNzaW9uUmVzcG9uc2UoIHJlc3BvbnNlICkge1xuICAgICAgICBpZiggT2JqZWN0LmtleXMoIHJlc3BvbnNlICkubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZXMuaW52YWxpZExvZ2luRXJyb3IsIGluc2VydGlvbjogeyAkZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0gKVxuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJykuc2V0KCByZXNwb25zZSApXG4gICAgICAgIHRoaXMuZW1pdCggXCJsb2dnZWRJblwiIClcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5mb3JtSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkZvcm0sIHtcbiAgICAgICAgICAgIGNsYXNzOiB7IHZhbHVlOiB0aGlzLmNsYXNzIH0sXG4gICAgICAgICAgICAvL2hvcml6b250YWw6IHsgdmFsdWU6IHRoaXMuaG9yaXpvbnRhbCB9LFxuICAgICAgICAgICAgZmllbGRzOiB7IHZhbHVlOiB0aGlzLmZpZWxkcyB9LCBcbiAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuZWxzLmZvcm0gfSB9LFxuICAgICAgICAgICAgb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgUmVnaXN0ZXI6IHJlcXVpcmUoJy4vUmVnaXN0ZXInKSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuXG4gICAgc2hvd1JlZ2lzdHJhdGlvbigpIHsgXG5cbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmZvcm1JbnN0YW5jZSxcbiAgICAgICAgICAgIGVtYWlsID0gZm9ybS5lbHMuZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZCA9IGZvcm0uZWxzLnBhc3N3b3JkXG4gICAgICAgIFxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBlbWFpbCApXG4gICAgICAgIGVtYWlsLnZhbCgnJylcblxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBwYXNzd29yZCApXG4gICAgICAgIHBhc3N3b3JkLnZhbCgnJylcbiAgICAgICAgXG4gICAgICAgIGlmICggZm9ybS5lbHMuaW52YWxpZExvZ2luRXJyb3IgKSBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvci5yZW1vdmUoKVxuICAgICAgICBpZiAoIGZvcm0uZWxzLnNlcnZlckVycm9yICkgZm9ybS5lbHMuc2VydmVyRXJyb3IucmVtb3ZlKClcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+ICggdGhpcy5yZWdpc3Rlckluc3RhbmNlICkgPyB0aGlzLnJlZ2lzdGVySW5zdGFuY2Uuc2hvdygpXG4gICAgICAgICAgICA6IE9iamVjdC5jcmVhdGUoIHRoaXMuUmVnaXN0ZXIsIHtcbiAgICAgICAgICAgICAgICBsb2dpbkluc3RhbmNlOiB7IHZhbHVlOiB0aGlzIH0sXG4gICAgICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9IFxuICAgICAgICAgICAgfSApLmNvbnN0cnVjdG9yKCkgKVxuXG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9sb2dpbicpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpXG4gICAgfVxuXG59IClcbiIsInZhciBNeVZpZXcgPSBmdW5jdGlvbiggZGF0YSApIHsgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIGRhdGEgKS5pbml0aWFsaXplKCkgfVxuXG5PYmplY3QuYXNzaWduKCBNeVZpZXcucHJvdG90eXBlLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBDb2xsZWN0aW9uOiByZXF1aXJlKCdiYWNrYm9uZScpLkNvbGxlY3Rpb24sXG4gICAgXG4gICAgLy9FcnJvcjogcmVxdWlyZSgnLi4vTXlFcnJvcicpLFxuXG4gICAgTW9kZWw6IHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwsXG5cbiAgICBfOiByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cbiAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZTtcblxuICAgICAgICBpZiggISB0aGlzLmV2ZW50c1sga2V5IF0gKSByZXR1cm5cblxuICAgICAgICB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB0aGlzLmV2ZW50c1trZXldICk7XG5cbiAgICAgICAgaWYoIHR5cGUgPT09ICdbb2JqZWN0IE9iamVjdF0nICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSwgZWwgKTtcbiAgICAgICAgfSBlbHNlIGlmKCB0eXBlID09PSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XS5mb3JFYWNoKCBzaW5nbGVFdmVudCA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBzaW5nbGVFdmVudCwgZWwgKSApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhICYmIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lciApIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZFwiKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGZvcm1hdDoge1xuICAgICAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXI6IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbiAgICB9LFxuXG4gICAgZ2V0Rm9ybURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhID0geyB9XG5cbiAgICAgICAgdGhpcy5fLmVhY2goIHRoaXMudGVtcGxhdGVEYXRhLCAoICRlbCwgbmFtZSApID0+IHsgaWYoICRlbC5wcm9wKFwidGFnTmFtZVwiKSA9PT0gXCJJTlBVVFwiICYmICRlbC52YWwoKSApIHRoaXMuZm9ybURhdGFbbmFtZV0gPSAkZWwudmFsKCkgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURhdGFcbiAgICB9LFxuXG4gICAgZ2V0Um91dGVyOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4uL3JvdXRlcicpIH0sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnM6ICgpID0+ICh7fSksXG5cbiAgICAvKmhpZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlEuUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuaGlkZSgpXG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSwqL1xuXG4gICAgaW5pdGlhbGl6ZSgpIHtcblxuICAgICAgICBpZiggISB0aGlzLmNvbnRhaW5lciApIHRoaXMuY29udGFpbmVyID0gdGhpcy4kKCcjY29udGVudCcpXG4gICAgICAgIFxuICAgICAgICB0aGlzLnJvdXRlciA9IHRoaXMuZ2V0Um91dGVyKClcblxuICAgICAgICAvL3RoaXMubW9kYWxWaWV3ID0gcmVxdWlyZSgnLi9tb2RhbCcpXG5cbiAgICAgICAgdGhpcy4kKHdpbmRvdykucmVzaXplKCB0aGlzLl8udGhyb3R0bGUoICgpID0+IHRoaXMuc2l6ZSgpLCA1MDAgKSApXG5cbiAgICAgICAgaWYoIHRoaXMucmVxdWlyZXNMb2dpbiAmJiAhIHRoaXMudXNlci5pZCApIHtcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vTG9naW4nKS5zaG93KCkub25jZSggXCJzdWNjZXNzXCIsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLmhlYWRlci5vblVzZXIoIHRoaXMudXNlciApXG5cbiAgICAgICAgICAgICAgICBpZiggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCAhIHRoaXMuXyggdGhpcy51c2VyLmdldCgncm9sZXMnKSApLmNvbnRhaW5zKCB0aGlzLnJlcXVpcmVzUm9sZSApICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgnWW91IGRvIG5vdCBoYXZlIGFjY2VzcycpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9IGVsc2UgaWYoIHRoaXMudXNlci5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSApIHtcbiAgICAgICAgICAgIGlmKCAoICEgdGhpcy5fKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpICkuY29udGFpbnMoIHRoaXMucmVxdWlyZXNSb2xlICkgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoJ1lvdSBkbyBub3QgaGF2ZSBhY2Nlc3MnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKClcbiAgICB9LFxuXG4gICAgaXNIaWRkZW46IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgfSxcblxuICAgIFxuICAgIG1vbWVudDogcmVxdWlyZSgnbW9tZW50JyksXG5cbiAgICBwb3N0UmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJTdWJ2aWV3cygpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIC8vUTogcmVxdWlyZSgncScpLFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNsdXJwVGVtcGxhdGUoIHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksXG4gICAgICAgICAgICBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmluc2VydGlvbkVsIHx8IHRoaXMuY29udGFpbmVyLCBtZXRob2Q6IHRoaXMuaW5zZXJ0aW9uTWV0aG9kIH0gfSApXG5cbiAgICAgICAgdGhpcy5zaXplKClcblxuICAgICAgICB0aGlzLnBvc3RSZW5kZXIoKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMuc3Vidmlld3MgfHwgWyBdICkuZm9yRWFjaCgga2V5ID0+IFxuICAgICAgICAgICAgdGhpcy5zdWJ2aWV3c1sga2V5IF0uZm9yRWFjaCggc3Vidmlld01ldGEgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXNbIHN1YnZpZXdNZXRhLm5hbWUgXSA9IG5ldyBzdWJ2aWV3TWV0YS52aWV3KCB7IGNvbnRhaW5lcjogdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdIH0gKSB9ICkgKVxuICAgIH0sXG5cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLnNob3coKVxuICAgICAgICB0aGlzLnNpemUoKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2x1cnBFbDogZnVuY3Rpb24oIGVsICkge1xuXG4gICAgICAgIHZhciBrZXkgPSBlbC5hdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdID0gKCB0aGlzLnRlbXBsYXRlRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpIClcbiAgICAgICAgICAgID8gdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdLmFkZCggZWwgKVxuICAgICAgICAgICAgOiBlbDtcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgaWYoIHRoaXMuZXZlbnRzWyBrZXkgXSApIHRoaXMuZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzbHVycFRlbXBsYXRlOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblxuICAgICAgICB2YXIgJGh0bWwgPSB0aGlzLiQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gJ1tkYXRhLWpzXSc7XG5cbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhID09PSB1bmRlZmluZWQgKSB0aGlzLnRlbXBsYXRlRGF0YSA9IHsgfTtcblxuICAgICAgICAkaHRtbC5lYWNoKCAoIGluZGV4LCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSApIHRoaXMuc2x1cnBFbCggJGVsIClcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRodG1sLmdldCgpLmZvckVhY2goICggZWwgKSA9PiB7IHRoaXMuJCggZWwgKS5maW5kKCBzZWxlY3RvciApLmVhY2goICggaSwgZWxUb0JlU2x1cnBlZCApID0+IHRoaXMuc2x1cnBFbCggdGhpcy4kKGVsVG9CZVNsdXJwZWQpICkgKSB9IClcbiAgICAgICBcbiAgICAgICAgaWYoIG9wdGlvbnMgJiYgb3B0aW9ucy5pbnNlcnRpb24gKSBvcHRpb25zLmluc2VydGlvbi4kZWxbICggb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kICkgPyBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgOiAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBcbiAgICBiaW5kRXZlbnQ6IGZ1bmN0aW9uKCBlbGVtZW50S2V5LCBldmVudERhdGEsIGVsICkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSAoIGVsICkgPyBlbCA6IHRoaXMudGVtcGxhdGVEYXRhWyBlbGVtZW50S2V5IF07XG5cbiAgICAgICAgZWxlbWVudHMub24oIGV2ZW50RGF0YS5ldmVudCB8fCAnY2xpY2snLCBldmVudERhdGEuc2VsZWN0b3IsIGV2ZW50RGF0YS5tZXRhLCB0aGlzWyBldmVudERhdGEubWV0aG9kIF0uYmluZCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBpc01vdXNlT25FbDogZnVuY3Rpb24oIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlICk7XG5cbiAgICAgICAgaWYoICggZXZlbnQucGFnZVggPCBlbE9mZnNldC5sZWZ0ICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVggPiAoIGVsT2Zmc2V0LmxlZnQgKyBlbFdpZHRoICkgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA8IGVsT2Zmc2V0LnRvcCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZID4gKCBlbE9mZnNldC50b3AgKyBlbEhlaWdodCApICkgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcbiAgICBcbiAgICBzaXplOiAoKSA9PiB7IHRoaXMgfSxcblxuICAgIHVzZXI6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyksXG5cbiAgICB1dGlsOiByZXF1aXJlKCd1dGlsJylcblxufSApXG5cbm1vZHVsZS5leHBvcnRzID0gTXlWaWV3XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBmb3JtID0gdGhpcy5mb3JtSW5zdGFuY2UsXG4gICAgICAgICAgICBuYW1lID0gZm9ybS5lbHMubmFtZSxcbiAgICAgICAgICAgIGVtYWlsID0gZm9ybS5lbHMuZW1haWxcbiAgICAgICAgXG4gICAgICAgIGZvcm0ucmVtb3ZlRXJyb3IoIG5hbWUgKVxuICAgICAgICBuYW1lLnZhbCgnJylcblxuICAgICAgICBmb3JtLnJlbW92ZUVycm9yKCBlbWFpbCApXG4gICAgICAgIGVtYWlsLnZhbCgnJylcbiAgICAgICAgXG4gICAgICAgIGlmICggZm9ybS5lbHMuaW52YWxpZExvZ2luRXJyb3IgKSBmb3JtLmVscy5pbnZhbGlkTG9naW5FcnJvci5yZW1vdmUoKVxuICAgICAgICBpZiAoIGZvcm0uZWxzLnNlcnZlckVycm9yICkgZm9ybS5lbHMuc2VydmVyRXJyb3IucmVtb3ZlKClcblxuICAgICAgICB0aGlzLmxvZ2luSW5zdGFuY2VbIFwicmVnaXN0ZXJJbnN0YW5jZVwiIF0gPSB0aGlzXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubG9naW5JbnN0YW5jZS5zaG93KCkgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgJ3JlZ2lzdGVyQnRuJzogeyBldmVudDogJ2NsaWNrJywgc2VsZWN0b3I6ICcnLCBtZXRob2Q6ICdyZWdpc3RlcicgfSxcbiAgICAgICAgJ2NhbmNlbEJ0bic6IHsgZXZlbnQ6ICdjbGljaycsIHNlbGVjdG9yOiAnJywgbWV0aG9kOiAnY2FuY2VsJyB9XG4gICAgfSxcblxuICAgIGZpZWxkczogWyB7XG4gICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogJ05hbWUgaXMgYSByZXF1aXJlZCBmaWVsZC4nLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgZXJyb3I6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgfSBdLFxuXG4gICAgRm9ybTogcmVxdWlyZSgnLi9Gb3JtJyksXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZTogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXG4gICAgICAgIGlmICggcmVzcG9uc2Uuc3VjY2VzcyA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5pbnZhbGlkTG9naW5FcnJvciggcmVzcG9uc2UgKSwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuYnV0dG9uUm93LCBtZXRob2Q6ICdiZWZvcmUnIH0gfSApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXIuc2V0KCByZXNwb25zZS5yZXN1bHQubWVtYmVyIClcblxuICAgICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKCBmaWVsZCA9PiB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgnJykgKVxuXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMubG9naW5JbnN0YW5jZS5lbWl0KCBcImxvZ2dlZEluXCIgKSApXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwge1xuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6IHRoaXMuY2xhc3MgfSxcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSxcbiAgICAgICAgICAgIGhvcml6b250YWw6IHsgdmFsdWU6IHRoaXMuaG9yaXpvbnRhbCB9LCBcbiAgICAgICAgICAgIGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuZWxzLmZvcm0gfSB9LFxuICAgICAgICAgICAgb25TdWJtaXNzaW9uUmVzcG9uc2U6IHsgdmFsdWU6IHRoaXMub25TdWJtaXNzaW9uUmVzcG9uc2UgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG5cbiAgICByZWdpc3RlcigpIHsgdGhpcy5mb3JtSW5zdGFuY2Uuc3VibWl0Rm9ybSggeyByZXNvdXJjZTogXCJtZW1iZXJcIiB9ICkgfSxcbiAgICBcbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9yZWdpc3RlcicpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9kZW1vJylcblxufSApIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL3NpZGViYXInKVxuXG59ICkiLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbn0gKSIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuLi8uLi8uLi9saWIvTXlPYmplY3QnKSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgXzogcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXG4gICAgJDogcmVxdWlyZSgnanF1ZXJ5JyksXG5cbiAgICBDb2xsZWN0aW9uOiByZXF1aXJlKCdiYWNrYm9uZScpLkNvbGxlY3Rpb24sXG4gICAgXG4gICAgTW9kZWw6IHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwsXG5cbiAgICBiaW5kRXZlbnQoIGtleSwgZXZlbnQsIHNlbGVjdG9yICkge1xuICAgICAgICB0aGlzLmVsc1trZXldLm9uKCBldmVudCwgc2VsZWN0b3IsIGUgPT4gdGhpc1sgYG9uJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihrZXkpfSR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoZXZlbnQpfWAgXSggZSApIClcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyOiBzdHJpbmcgPT4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpLFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuJCh3aW5kb3cpLnJlc2l6ZSggdGhpcy5fLnRocm90dGxlKCAoKSA9PiB0aGlzLnNpemUoKSwgNTAwICkgKVxuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgIXRoaXMudXNlci5pZCApIHJldHVybiB0aGlzLmhhbmRsZUxvZ2luKClcblxuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSAmJiAhdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSByZXR1cm4gdGhpcy5zaG93Tm9BY2Nlc3MoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHsgZWxzOiB7IH0sIHNsdXJwOiB7IGF0dHI6ICdkYXRhLWpzJywgdmlldzogJ2RhdGEtdmlldycgfSwgdmlld3M6IHsgfSB9ICkucmVuZGVyKClcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHRoaXMuZXZlbnRzW2tleV1cblxuICAgICAgICBpZiggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHsgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSApIH1cbiAgICAgICAgZWxzZSBpZiggQXJyYXkuaXNBcnJheSggdGhpcy5ldmVudHNba2V5XSApICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbIGtleSBdLmZvckVhY2goIGV2ZW50T2JqID0+IHRoaXMuYmluZEV2ZW50KCBrZXksIGV2ZW50T2JqLmV2ZW50ICkgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XS5ldmVudCwgdGhpcy5ldmVudHNba2V5XS5zZWxlY3RvciApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlKCBkdXJhdGlvbiApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlkZSggZHVyYXRpb24gKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkXCIpXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnM6ICgpID0+ICh7fSksXG5cbiAgICBoYW5kbGVMb2dpbigpIHtcbiAgICAgICAgT2JqZWN0LmNyZWF0ZSggcmVxdWlyZSgnLi9Mb2dpbicpLCB7IGNsYXNzOiB7IHZhbHVlOiAnaW5wdXQtYm9yZGVybGVzcycgfSB9ICkuY29uc3RydWN0b3IoKS5vbmNlKCBcImxvZ2dlZEluXCIsICgpID0+IHRoaXMub25Mb2dpbigpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBoYXNQcml2aWxlZ2UoKSB7XG4gICAgICAgICggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpLmZpbmQoIHJvbGUgPT4gcm9sZSA9PT0gdGhpcy5yZXF1aXJlc1JvbGUgKSA9PT0gXCJ1bmRlZmluZWRcIiApICkgPyBmYWxzZSA6IHRydWVcbiAgICB9LFxuXG4gICAgaGlkZSggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB0aGlzLmVscy5jb250YWluZXIuaGlkZSggZHVyYXRpb24gfHwgMTAsIHJlc29sdmUgKSApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICB0aGlzLnJvdXRlci5oZWFkZXIub25Vc2VyKCB0aGlzLnVzZXIgKVxuXG4gICAgICAgIHRoaXNbICggdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSA/ICdyZW5kZXInIDogJ3Nob3dOb0FjY2VzcycgXSgpXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYoICF0aGlzLmluc2VydGlvbiApIHsgY29uc29sZS5sb2coIHRoaXMgKSB9XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSggdGhpcy5nZXRUZW1wbGF0ZU9wdGlvbnMoKSApLCBpbnNlcnRpb246IHRoaXMuaW5zZXJ0aW9uIH0gKVxuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgICAgICAgICAgICAucG9zdFJlbmRlcigpXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5WaWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIHRoaXMuVmlld3NbIGtleSBdLmVsICkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGtleSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSgga2V5LCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuVmlld3NbIGtleSBdLmVsLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHNob3coIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gdGhpcy5lbHMuY29udGFpbmVyLnNob3coIGR1cmF0aW9uIHx8IDEwLCAoKSA9PiB7IGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKTsgcmVzb2x2ZSgpIH0gKSApXG4gICAgfSxcblxuICAgIHNsdXJwRWwoIGVsICkge1xuICAgICAgICB2YXIga2V5ID0gZWwuYXR0ciggdGhpcy5zbHVycC5hdHRyICkgfHwgJ2NvbnRhaW5lcidcblxuICAgICAgICB0aGlzLmVsc1sga2V5IF0gPSB0aGlzLmVsc1sga2V5IF0gPyB0aGlzLmVsc1sga2V5IF0uYWRkKCBlbCApIDogZWxcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG5cbiAgICAgICAgdmFyICRodG1sID0gdGhpcy4kKCBvcHRpb25zLnRlbXBsYXRlICksXG4gICAgICAgICAgICBzZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLmF0dHJ9XWAsXG4gICAgICAgICAgICB2aWV3U2VsZWN0b3IgPSBgWyR7dGhpcy5zbHVycC52aWV3fV1gXG5cbiAgICAgICAgJGh0bWwuZWFjaCggKCBpLCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSB8fCBpID09PSAwICkgdGhpcy5zbHVycEVsKCAkZWwgKVxuICAgICAgICB9IClcblxuICAgICAgICAkaHRtbC5nZXQoKS5mb3JFYWNoKCAoIGVsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kKCBlbCApLmZpbmQoIHNlbGVjdG9yICkuZWFjaCggKCB1bmRlZmluZWQsIGVsVG9CZVNsdXJwZWQgKSA9PiB0aGlzLnNsdXJwRWwoIHRoaXMuJChlbFRvQmVTbHVycGVkKSApIClcbiAgICAgICAgICAgIHRoaXMuJCggZWwgKS5maW5kKCB2aWV3U2VsZWN0b3IgKS5lYWNoKCAoIHVuZGVmaW5lZCwgdmlld0VsICkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQodmlld0VsKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbICRlbC5hdHRyKHRoaXMuc2x1cnAudmlldykgXS5lbCA9ICRlbFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgICAgIFxuICAgICAgICBvcHRpb25zLmluc2VydGlvbi4kZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaXNNb3VzZU9uRWwoIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlIClcblxuICAgICAgICBpZiggKCBldmVudC5wYWdlWCA8IGVsT2Zmc2V0LmxlZnQgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWCA+ICggZWxPZmZzZXQubGVmdCArIGVsV2lkdGggKSApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZIDwgZWxPZmZzZXQudG9wICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPiAoIGVsT2Zmc2V0LnRvcCArIGVsSGVpZ2h0ICkgKSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2Vcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG5cbjxkaXYgY2xhc3M9XCJhYm91dFwiPlxuICAgIDxoMSBjbGFzcz1cImhlYWRlclwiPldoeSBzaG91bGQgeW91IGNob29zZSB1cyB0byBkZXZlbG9wIHlvdXIgc29mdHdhcmU/PC9oMT5cbiAgICA8ZGl2IGNsYXNzPVwicXVvdGUtY29udGFpbmVyXCI+XG4gICAgICAgIDxibG9ja3F1b3RlIGNsYXNzPVwiY2xpZW50LXF1b3RlXCI+XG4gICAgICAgICAgICBcIkZ1dHVyZSBEYXlzIGRpZCBhIGJvbWItYXNzIGpvYiBvbiBvdXIgd2Vic2l0ZS4gVGhleSB3ZXJlIHByb2Zlc3Npb25hbCBhbmQgZWFzeSB0byB3b3JrIHdpdGgsXG4gICAgICAgICAgICBhbmQgd2UgYXJlIGNvbXBsZXRlbHkgc2F0aXNmaWVkIHdpdGggb3VyIHdlYnNpdGUuIEl0IGhhcyBiZWVuIHN0YWJsZSBhbmQgYnVnLWZyZWUuIEkgaGlnaGx5XG4gICAgICAgICAgICByZWNvbW1lbmQgdGhlbSB0byBhbnlvbmUuIFwiXG4gICAgICAgICAgICA8Y2l0ZT4tLSBHZW9yZ2UgdGhlIFBhdGNod29yayBkdWRlPC9jaXRlPlxuICAgICAgICA8L2Jsb2NrcXVvdGU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlbGxpbmctcG9pbnRzXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWxsaW5nLXBvaW50XCI+XG4gICAgICAgICAgICA8aDM+RXhwZXJpZW5jZTwvaDM+XG4gICAgICAgICAgICA8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudFxuICAgICAgICAgICAgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY29cbiAgICAgICAgICAgIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGVcbiAgICAgICAgICAgIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsXG4gICAgICAgICAgICBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNlbGxpbmctcG9pbnRcIj5cbiAgICAgICAgICAgIDxoMz5Db21wZXRpdGl2ZSBQcmljaW5nPC9oMz5cbiAgICAgICAgICAgIDxwPkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50XG4gICAgICAgICAgICB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jb1xuICAgICAgICAgICAgbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZVxuICAgICAgICAgICAgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCxcbiAgICAgICAgICAgIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VsbGluZy1wb2ludFwiPlxuICAgICAgICAgICAgPGgzPkN1c3RvbWl6YXRpb248L2gzPlxuICAgICAgICAgICAgPHA+TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnRcbiAgICAgICAgICAgIHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvXG4gICAgICAgICAgICBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlXG4gICAgICAgICAgICB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLiBFeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LFxuICAgICAgICAgICAgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWxsaW5nLXBvaW50XCI+XG4gICAgICAgICAgICA8aDM+RnJlZSBNYWludGVuYW5jZTwvaDM+XG4gICAgICAgICAgICA8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudFxuICAgICAgICAgICAgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY29cbiAgICAgICAgICAgIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGVcbiAgICAgICAgICAgIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsXG4gICAgICAgICAgICBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PmAiLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gYEFkbWluYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG4gICAgPGRpdiBkYXRhLWpzPVwiY29udGFpbmVyXCIgY2xhc3M9XCJjb250YWN0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmZC1pbmZvXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mby1ib3hcIj5cbiAgICAgICAgICAgICAgICA8aDI+TGV0J3MgR2V0IEluIFRvdWNoPC9oMj5cbiAgICAgICAgICAgICAgICA8cD5GZWVsIGZyZWUgdG8gY29udGFjdCB1cyBieSBwaG9uZSBvciBlbWFpbCB3aXRoIGFueSBwcm9qZWN0IGlkZWFzIG9yIHF1ZXN0aW9ucyxcbiAgICAgICAgICAgICAgICBvciBzZW5kIHVzIGEgcXVpY2sgbWVzc2FnZS48L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtZGV0YWlsc1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+RW1haWw8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRkPjxhIGhyZWY9XCJ0b3BoZXIuYmFyb25AZ21haWwuY29tXCI+dG9waGVyLmJhcm9uQGdtYWlsLmNvbTwvYT48L2RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGR0PlBob25lPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZD4xMjMtNDU2LTc4OTA8L2RkPlxuICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1mb3JtXCI+XG4gICAgICAgICAgICA8ZGl2IGRhdGEtanM9XCJmb3JtXCI+PC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJzZW5kQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIj5TZW5kPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+YCIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IGBcbjxkaXYgY2xhc3M9XCJkZW1vXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxhc2lkZSBjbGFzcz1cInNpZGViYXJcIj5cbiAgICAgICAgPGRpdiBkYXRhLXZpZXc9XCJzaWRlYmFyXCI+PC9kaXY+XG4gICAgPC9hc2lkZT5cbiAgICA8ZGl2IGNsYXNzPVwiZGVtby1jb250ZW50XCI+XG4gICAgICAgIDxoMj5MaXN0czwvaDI+XG4gICAgICAgIDxwPk9yZ2FuaXplIHlvdXIgY29udGVudCBpbnRvIG5lYXQgZ3JvdXBzIHdpdGggb3VyIGxpc3RzLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cImV4YW1wbGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtdmlld1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwibGlzdFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aDI+Rm9ybXM8L2gyPlxuICAgICAgICA8cD5PdXIgZm9ybXMgYXJlIGN1c3RvbWl6YWJsZSB0byBzdWl0IHRoZSBuZWVkcyBvZiB5b3VyIHByb2plY3QuIEhlcmUsIGZvciBleGFtcGxlLCBhcmUgXG4gICAgICAgIExvZ2luIGFuZCBSZWdpc3RlciBmb3JtcywgZWFjaCB1c2luZyBkaWZmZXJlbnQgaW5wdXQgc3R5bGVzLjwvcD5cbiAgICAgICAgPGRpdiBjbGFzcz1cImV4YW1wbGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtdmlld1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwibG9naW5cIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlubGluZS12aWV3XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLXZpZXc9XCJyZWdpc3RlclwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChwKSA9PlxuXG5gPHNwYW4gY2xhc3M9XCJmZWVkYmFja1wiIGRhdGEtanM9XCJmaWVsZEVycm9yXCI+JHsgcC5lcnJvciB9PC9zcGFuPmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuXG48ZGl2IGNsYXNzPVwiZm9vdGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cInRyYWRlbWFya1wiPiZjb3B5OyAkeyBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgfSBGdXR1cmVEYXlzIFNvZnR3YXJlIExMQzwvZGl2PlxuPC9kaXY+XG5gIiwibW9kdWxlLmV4cG9ydHMgPSAocCkgPT4ge1xuICAgIHZhciBodG1sID0gYFxuPGZvcm0gZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgICR7IHAuZmllbGRzLm1hcCggZmllbGQgPT5cbiAgICBgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgJHsgKCBmaWVsZC5ob3Jpem9udGFsICkgPyBgaG9yaXpvbnRhbGAgOiBgYCB9XCI+XG5cbiAgICAgICAgJHsgKCBmaWVsZC5sYWJlbCApID8gYDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCIkeyBmaWVsZC5uYW1lIH1cIj4keyBmaWVsZC5sYWJlbCB9PC9sYWJlbD5gIDogYGAgfVxuICAgICAgICA8JHsgKCBmaWVsZC5zZWxlY3QgKSA/IGBzZWxlY3RgIDogXG4gICAgICAgICAgICAoIGZpZWxkLnRleHRhcmVhICkgPyBgdGV4dGFyZWFgIDogYGlucHV0YCB9IGRhdGEtanM9XCIkeyBmaWVsZC5uYW1lIH1cIiBjbGFzcz1cIiR7IGZpZWxkLmNsYXNzIH1cIlxuICAgICAgICB0eXBlPVwiJHsgZmllbGQudHlwZSB9XCIgaWQ9XCIkeyBmaWVsZC5uYW1lIH1cIiAkeyAoIGZpZWxkLnBsYWNlaG9sZGVyICkgPyBgcGxhY2Vob2xkZXI9XCIkeyBmaWVsZC5wbGFjZWhvbGRlciB9XCJgIDogYGAgfVxuICAgICAgICAkeyAoIGZpZWxkLnJvd3MgKSA/IGByb3dzPVwiJHsgZmllbGQucm93cyB9XCJgIDogYGAgfSAkeyAoIGZpZWxkLmNvbHMgKSA/IGBjb2xzPVwiJHsgZmllbGQuY29scyB9XCJgIDogYGAgfT5cbiAgICAgICAgICAgICR7ICggZmllbGQuc2VsZWN0ICkgPyBmaWVsZC5vcHRpb25zLm1hcCggb3B0aW9uID0+XG4gICAgICAgICAgICAgICAgYDxvcHRpb24+JHsgb3B0aW9uIH08L29wdGlvbj5gICkuam9pbignJykgKyBgPC9zZWxlY3Q+YCA6IGBgIH1cbiAgICAgICAgICAgICR7ICggZmllbGQudGV4dGFyZWEgKSA/IGA8L3RleHRhcmVhPmAgOiBgYCB9XG4gICAgPC9kaXY+YCApLmpvaW4oJycpIH1cbjwvZm9ybT5cbmAgXG4gICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvPlxccys8L2csJz48JylcbiAgICByZXR1cm4gaHRtbFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG5cbjxoZWFkZXIgY2xhc3M9XCJzaXRlLWhlYWRlclwiPlxuICAgIDxkaXYgZGF0YS1qcz1cImxvZ29cIiBjbGFzcz1cImxvZ29cIj5GdXR1cmUgRGF5czwvZGl2PlxuICAgIDxuYXY+XG4gICAgICAgIDx1bCBkYXRhLWpzPVwibmF2TGlua3NcIiBjbGFzcz1cIm5hdi1saW5rc1wiPlxuICAgICAgICAgICAgPGxpIGRhdGEtaWQ9XCJhYm91dFwiPldoeSBVczwvbGk+XG4gICAgICAgICAgICA8bGkgZGF0YS1pZD1cInN0YWZmXCI+U3RhZmY8L2xpPlxuICAgICAgICAgICAgPGxpIGRhdGEtaWQ9XCJibG9nXCI+QmxvZzwvbGk+XG4gICAgICAgICAgICA8bGkgZGF0YS1pZD1cImNvbnRhY3RcIj5Db250YWN0IFVzPC9saT5cbiAgICAgICAgPC91bD5cbiAgICA8L25hdj5cbjwvaGVhZGVyPlxuYCIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuXG48ZGl2IGNsYXNzPVwiaG9tZS1wYWdlXCI+XG4gICAgPGRpdiBjbGFzcz1cImNvdmVyLWltYWdlXCI+XG4gICAgICAgIDxoMSBjbGFzcz1cImNvdmVyLXRleHRcIj5FbGVnYW50LCBGdWxseSBDdXN0b21pemFibGUgU29mdHdhcmU8L2gxPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpbnRyb1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW50cm8tdGV4dFwiPlxuICAgICAgICAgICAgPHA+RnV0dXJlIERheXMgaXMgYSBzbWFsbCwgdmVyc2F0aWxlIHNvZnR3YXJlIHRlYW0gZGVkaWNhdGVkIHRvIHByb2R1Y2luZyB1bmlxdWVcbiAgICAgICAgICAgIHNvbHV0aW9ucy4gSWYgeW91IGNhbiB0aGluayBpdCwgd2UgY2FuIG1ha2UgaXQuIEFuZCBpZiB5b3UgbmVlZCBoZWxwIHRoaW5raW5nIGl0LCB3ZSdkIGxvdmUgdG9cbiAgICAgICAgICAgIGFkZCBvdXIgbWluZHMgdG8geW91cnMuPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VydmljZXNcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNlcnZpY2VcIj5cbiAgICAgICAgICAgIDxoMz5XZWJzaXRlcyBhbmQgV2ViIEFwcHM8L2gzPlxuICAgICAgICAgICAgPHA+TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnRcbiAgICAgICAgICAgIHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvXG4gICAgICAgICAgICBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlXG4gICAgICAgICAgICB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLiBFeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LFxuICAgICAgICAgICAgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZXJ2aWNlXCI+XG4gICAgICAgICAgICA8aDM+RGlnaXRhbCBTdHJhdGVneTwvaDM+XG4gICAgICAgICAgICA8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudFxuICAgICAgICAgICAgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY29cbiAgICAgICAgICAgIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGVcbiAgICAgICAgICAgIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsXG4gICAgICAgICAgICBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNlcnZpY2VcIj5cbiAgICAgICAgICAgIDxoMz5Zb3UgTmFtZSBJdDwvaDM+XG4gICAgICAgICAgICA8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudFxuICAgICAgICAgICAgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY29cbiAgICAgICAgICAgIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGVcbiAgICAgICAgICAgIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsXG4gICAgICAgICAgICBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibGVhcm4tbW9yZVwiPlxuICAgICAgICA8cD5JbnRlcmVzdGVkPyBMZWFybiBtb3JlIGFib3V0IG91ciBzdHJlbmd0aHMuPC9wPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJ3aHlCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiPldoeSBDaG9vc2UgVXM8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG5gIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdiBkYXRhLWpzPVwiaW52YWxpZExvZ2luRXJyb3JcIiBjbGFzcz1cImZlZWRiYWNrXCI+SW52YWxpZCBDcmVkZW50aWFsczwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuXG48dWwgY2xhc3M9XCJsaXN0XCI+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+Zm9yPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj50aGU8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPnNha2U8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPm9mPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5mdXR1cmU8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPmRheXM8L2xpPlxuPC91bD5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuPGRpdiBjbGFzcz1cImxvZ2luXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMT5Mb2dpbjwvaDE+XG4gICAgPGRpdiBkYXRhLWpzPVwiZm9ybVwiPjwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImJ1dHRvblJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJyZWdpc3RlckJ0blwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPlJlZ2lzdGVyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cImxvZ2luQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+TG9nIEluPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYFxuPGRpdiBjbGFzcz1cInJlZ2lzdGVyXCIgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMT5SZWdpc3RlcjwvaDE+XG4gICAgPGRpdiBkYXRhLWpzPVwiZm9ybVwiPjwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImJ1dHRvblJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwicmVnaXN0ZXJCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5SZWdpc3RlcjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG4gICAgPGRpdiBjbGFzcz1cInNlcnZpY2VzXCI+XG4gICAgICAgIDxoMj5PdXIgU2VydmljZXM8L2gyPlxuICAgICAgICA8cD5XZSBvZmZlciBhIGZ1bGwgcmFuZ2Ugb2Ygc2VydmljZXMsIGluY2x1ZGluZyBidXQgbm90IGxpbWl0ZWQgdG86XG4gICAgICAgIDx1bCBjbGFzcz1cInNlcnZpY2VzLWxpc3RcIj5cbiAgICAgICAgICAgIDxsaT5XZWJzaXRlIGFuZCB3ZWIgYXBwIGRldmVsb3BtZW50PC9saT5cbiAgICAgICAgICAgIDxsaT5DdXN0b20gc29mdHdhcmU8L2xpPlxuICAgICAgICAgICAgPGxpPkhvc3Rpbmc8L2xpPlxuICAgICAgICAgICAgPGxpPkRpZ2l0YWwgU3RyYXRlZ3k8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgICA8aDI+V2h5IENob29zZSBVcz88L2gyPlxuICAgICAgICA8cD5BcyB0aGUgdGVjaCBpbmR1c3RyeSBoYXMgZXhwbG9kZWQsIHRoZSBtYXJrZXQgaGFzIGJlZW4gZ2x1dHRlZCB3aXRoIGNvdW50bGVzcyBkZXZlbG9wZXJzIHdobyBwb3NzZXNzIGxpdHRsZSBleHBlcmllbmNlXG4gICAgICAgIGFuZCBhIHZlcnkgbmFycm93IHNldCBvZiBza2lsbHMsIGdlbmVyYWxseSBsaW1pdGVkIHRvIHRoZSBjYXBhYmlsaXRpZXMgb2YgdGhlaXIgY2hvc2VuIHBsYXRmb3JtLiBNb3N0IFdvcmRQcmVzcyBkZXZlbG9wZXJzLFxuICAgICAgICBmb3IgZXhhbXBsZSwgY2FuIHRocm93IHRvZ2V0aGVyIGEgdGhlbWUgYW5kIHNvbWUgcGx1Z2lucywgYnV0IGlmIHlvdSBhc2sgdGhlbSB0byBpbXBsZW1lbnQgY3VzdG9tIGZ1bmN0aW9uYWxpdHkgZm9yIHlvdXIgc2l0ZSxcbiAgICAgICAgdGhleSB3aWxsIGxpa2VseSBiZSBhdCBhIGxvc3MuIEF0IEZ1dHVyZSBEYXlzLCB3ZSB1bmRlcnN0YW5kIGhvdyB0aGUgd2ViIGFuZCBhcHBsaWNhdGlvbnMgd29yayBhdCB0aGVpciBkZWVwZXN0XG4gICAgICAgIGxldmVscy4gV2UgaGF2ZSBidWlsdCBvdXIgb3duIGZyYW1ld29yayBmcm9tIHRoZSBncm91bmQgdXAsIHdoaWNoIHdlIGNvbnRpbnVhbGx5IHJlZmluZSBhbmQgb3B0aW1pemUuIEFybWVkIHdpdGhcbiAgICAgICAgdGhpcyBsb3cgbGV2ZWwga25vd2xlZGdlLCB3ZSBwb3NzZXNzIHRoZSBjYXBhYmlsaXR5IHRvIGNyZWF0ZSBqdXN0IGFib3V0IGFueSBmZWF0dXJlIHlvdSBjYW4gaW1hZ2luZS4gQ3VzdG9taXphdGlvblxuICAgICAgICBpcyBrZXkuIEFzIHRoZSB3ZWIgYmVjb21lcyBldmVyIG1vcmUgc3RyZWFtbGluZWQgYW5kIGNvb2tpZSBjdXR0ZXIsIHdlIGNhbiBoZWxwIHlvdSBzdGFuZCBvdXQgZnJvbSB0aGUgcGFjay48L3A+XG5cbiAgICAgICAgPHA+VmVyc2F0aWxpdHkgaXMgbm90IG91ciBvbmx5IGFkdmFudGFnZSwgaG93ZXZlci4gQXMgYSBzbWFsbCB0ZWFtIHdpdGggbGltaXRlZCBvdmVyaGVhZCwgd2UgY2FuIGRvIHRoZSBzYW1lIHdvcmtcbiAgICAgICAgYXMgbGFyZ2VyIGRldmVsb3BtZW50IGZpcm1zIGZvciBsZXNzIG1vbmV5LiBBbmQgd2Ugb25seSBjaGFyZ2UgZm9yIG5ldyB3b3JrOiAgbm8gbWFpbnRlbmFuY2UgZmVlcywgYW5kIGlmIGEgYnVnIGNvbWVzIHVwLCB3ZSBmaXhcbiAgICAgICAgaXQgd2l0aG91dCBjaGFyZ2UsIG5vIHF1ZXN0aW9ucyBhc2tlZC4gV2UgdGFrZSBmdWxsIHJlc3BvbnNpYmlsaXR5IGZvciB0aGUgcXVhbGl0eSBvZiBvdXIgd29yay48L3A+XG4gICAgPC9kaXY+YCIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IGBcbiAgICA8bmF2PlxuICAgICAgICA8dWwgY2xhc3M9XCJzaWRlYmFyLWxpbmtzXCI+XG4gICAgICAgICAgICA8bGk+TGlzdHM8L2xpPlxuICAgICAgICAgICAgPGxpPkZvcm1zPC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgICAgIDxsaT5EdW1teSBUZXh0PC9saT5cbiAgICAgICAgPC91bD5cbiAgICA8L25hdj5cbmAiLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGBcbiAgICA8ZGl2IGNsYXNzPVwic3RhZmZcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN0YWZmLWludHJvXCI+XG4gICAgICAgICAgICA8aDE+T3VyIFRlYW08L2gxPlxuICAgICAgICAgICAgPHA+U21hbGwgYnV0IG5pbWJsZS48L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3RhZmYtYmxvY2tcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJzdGFmZi1waG90b1wiIHNyYz1cIi9zdGF0aWMvaW1nL2hvbGx5d29vZC5qcGdcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiaW9cIj5cbiAgICAgICAgICAgICAgICA8aDM+Q2hyaXMgQmFyb248L2gzPlxuICAgICAgICAgICAgICAgIDxwPkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50XG4gICAgICAgICAgICAgICAgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY29cbiAgICAgICAgICAgICAgICBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlXG4gICAgICAgICAgICAgICAgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCxcbiAgICAgICAgICAgICAgICBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3RhZmYtYmxvY2tcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJzdGFmZi1waG90b1wiIHNyYz1cIi9zdGF0aWMvaW1nL2Vuby5qcGdcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiaW9cIj5cbiAgICAgICAgICAgICAgICA8aDM+U2NvdHQgUGFydG9uPC9oMz5cbiAgICAgICAgICAgICAgICA8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudFxuICAgICAgICAgICAgICAgIHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvXG4gICAgICAgICAgICAgICAgbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZVxuICAgICAgICAgICAgICAgIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsXG4gICAgICAgICAgICAgICAgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5gIiwibW9kdWxlLmV4cG9ydHMgPSBlcnIgPT4geyBjb25zb2xlLmxvZyggZXJyLnN0YWNrIHx8IGVyciApIH1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4vTXlFcnJvcicpLFxuXG4gICAgTW9tZW50OiByZXF1aXJlKCdtb21lbnQnKSxcblxuICAgIFA6ICggZnVuLCBhcmdzLCB0aGlzQXJnICkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gUmVmbGVjdC5hcHBseSggZnVuLCB0aGlzQXJnLCBhcmdzLmNvbmNhdCggKCBlLCAuLi5hcmdzICkgPT4gZSA/IHJlamVjdChlKSA6IHJlc29sdmUoYXJncykgKSApICksXG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7IHJldHVybiB0aGlzIH1cbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIl19
