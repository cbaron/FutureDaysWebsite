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
	register: require('./views/templates/register'),
	verify: require('./views/templates/verify')
};

},{"./views/templates/admin":19,"./views/templates/demo":20,"./views/templates/fieldError":21,"./views/templates/form":22,"./views/templates/header":23,"./views/templates/home":24,"./views/templates/invalidLoginError":25,"./views/templates/list":26,"./views/templates/login":27,"./views/templates/register":28,"./views/templates/verify":29}],2:[function(require,module,exports){
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
	Register: require('./views/Register'),
	Verify: require('./views/Verify')
};

},{"./views/Admin":8,"./views/Demo":9,"./views/Form":10,"./views/Header":11,"./views/Home":12,"./views/List":13,"./views/Login":14,"./views/MyView":15,"./views/Register":16,"./views/Verify":17}],3:[function(require,module,exports){
"use strict";

module.exports = Object.create(Object.assign({}, require('../../lib/MyObject'), {

    Request: {
        constructor: function constructor(data) {
            var req = new XMLHttpRequest(),
                resolver;

            req.onload = function () {
                console.log(this);
                console.log(this.responseText);
                /* you can get the serialized data through the "submittedData" custom property: */
                console.log(JSON.stringify(this.submittedData));
                resolver();
            };

            if (data.method === "get") {
                req.open(data.method, "/" + data.resource + "?" + data.qs, true);
                req.send(null);
            } else {
                /* method is POST */
                req.open(data.method, "/" + data.resource, true);
                req.setRequestHeader("Accept", 'application/json');
                req.setRequestHeader("Content-Type", 'text/plain');
                req.send(data.data);
            }

            return new Promise(function (resolve) {
                return resolver = resolve;
            });
        },
        plainEscape: function plainEscape(sText) {
            /* how should I treat a text/plain form encoding? what characters are not allowed? this is what I suppose...: */
            /* "4\3\7 - Einstein said E=mc2" ----> "4\\3\\7\ -\ Einstein\ said\ E\=mc2" */
            return sText.replace(/[\s\=\\]/g, "\\$&");
        }
    },

    _factory: function _factory(data) {
        return Object.create(this.Request, {}).constructor(data);
    },
    constructor: function constructor() {

        if (!XMLHttpRequest.prototype.sendAsBinary) {
            XMLHttpRequest.prototype.sendAsBinary = function (sData) {
                var nBytes = sData.length,
                    ui8Data = new Uint8Array(nBytes);
                for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                    ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
                }
                this.send(ui8Data);
            };
        }

        return this._factory.bind(this);
    }
}), {}).constructor();

},{"../../lib/MyObject":31}],4:[function(require,module,exports){
'use strict';

module.exports = Object.create({
    create: function create(name, opts) {
        return Object.create(this.Views[name.charAt(0).toUpperCase() + name.slice(1)], Object.assign({ template: { value: this.Templates[name] }, user: { value: this.User }, factory: { value: this }, name: { value: name } }, opts)).constructor();
    }
}, {
    Templates: { value: require('../.TemplateMap') },
    User: { value: require('../models/User') },
    Views: { value: require('../.ViewMap') }
});

},{"../.TemplateMap":1,"../.ViewMap":2,"../models/User":6}],5:[function(require,module,exports){
'use strict';

require('jquery')(function () {
    require('./router');
    require('backbone').history.start({ pushState: true });
});

},{"./router":7,"backbone":"backbone","jquery":"jquery"}],6:[function(require,module,exports){
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

},{"backbone":"backbone"}],7:[function(require,module,exports){
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

        resource = resource.split('/').shift();

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

},{"../../lib/MyError":30,"./factory/View":4,"./models/User":6,"backbone":"backbone","jquery":"jquery"}],8:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    requiresLogin: true
});

},{"./__proto__":18}],9:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    Views: {
        list: {},
        login: {},
        register: {}
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

},{"./Form":10,"./List":13,"./Login":14,"./Register":16,"./__proto__":18,"./templates/demo":20}],10:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    Xhr: require('../Xhr'),

    clear: function clear() {
        var _this = this;

        this.fields.forEach(function (field) {
            _this.removeError(_this.els[field.name]);
            _this.els[field.name].val('');
        });

        if (this.els.error) {
            this.els.error.remove();this.else.error = undefined;
        }
    },


    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    getTemplateOptions: function getTemplateOptions() {
        return { fields: this.fields };
    },
    getFormData: function getFormData() {
        var _this2 = this;

        var data = {};

        Object.keys(this.els).forEach(function (key) {
            if (/INPUT|TEXTAREA|SELECT/.test(_this2.els[key].prop("tagName"))) data[key] = _this2.els[key].val();
        });

        return data;
    },


    fields: [],

    onFormFail: function onFormFail(error) {
        console.log(error.stack || error);
        //this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.els.buttonRow, method: 'before' } } )
    },
    postForm: function postForm() {
        return this.Xhr({
            data: JSON.stringify(this.getFormData()),
            method: 'post',
            resource: this.resource
        });
    },
    postRender: function postRender() {
        var _this3 = this;

        this.fields.forEach(function (field) {
            var $el = _this3.els[field.name];
            $el.on('blur', function () {
                var rv = field.validate.call(_this3, $el.val());
                if (typeof rv === "boolean") return rv ? _this3.showValid($el) : _this3.showError($el, field.error);
                rv.then(function () {
                    return _this3.showValid($el);
                }).catch(function () {
                    return _this3.showError($el, field.error);
                });
            }).on('focus', function () {
                return _this3.removeError($el);
            });
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
    submit: function submit() {
        var _this4 = this;

        return this.validate().then(function (result) {
            return result === false ? Promise.resolve({ invalid: true }) : _this4.postForm();
        }).catch(this.somethingWentWrong);
    },


    template: require('./templates/form'),

    templates: {
        fieldError: require('./templates/fieldError')
    },

    validate: function validate() {
        var _this5 = this;

        var valid = true,
            promises = [];

        this.fields.forEach(function (field) {
            var $el = _this5.els[field.name],
                rv = field.validate.call(_this5, $el.val());
            if (typeof rv === "boolean") {
                if (rv) {
                    _this5.showValid($el);
                } else {
                    _this5.showError($el, field.error);valid = false;
                }
            } else {
                promises.push(rv.then(function () {
                    return Promise.resolve(_this5.showValid($el));
                }).catch(function () {
                    _this5.showError($el, field.error);return Promise.resolve(valid = false);
                }));
            }
        });

        return Promise.all(promises).then(function () {
            return valid;
        });
    }
});

},{"../Xhr":3,"./__proto__":18,"./templates/fieldError":21,"./templates/form":22}],11:[function(require,module,exports){
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

},{"./__proto__":18}],12:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":18}],13:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    template: require('./templates/list')
});

},{"./__proto__":18,"./templates/list":26}],14:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    Views: {
        form: {
            opts: {
                fields: {
                    value: [{
                        name: 'email',
                        type: 'text',
                        error: 'Please enter a valid email address.',
                        validate: function validate(val) {
                            return this.emailRegex.test(val);
                        }
                    }, {
                        name: 'password',
                        type: 'password',
                        error: 'Passwords must be at least 6 characters long.',
                        validate: function validate(val) {
                            return val.length >= 6;
                        }
                    }]
                }
            }
        }
    },

    events: {
        registerBtn: 'click',
        loginBtn: 'click'
    },

    login: function login() {
        this.formInstance.submitForm({ resource: "auth" });
    },
    onSubmissionResponse: function onSubmissionResponse(response) {
        if (Object.keys(response).length === 0) {
            //return this.slurpTemplate( { template: this.templates.invalidLoginError, insertion: { $el: this.els.container } } )
        }

        require('../models/User').set(response);
        this.emit("loggedIn");
        this.hide();
    },
    onRegisterBtnClick: function onRegisterBtnClick() {
        var _this = this;

        this.views.form.clear();

        this.hide().then(function () {
            if (_this.views.register) return _this.views.register.show();
            _this.views.register = _this.factory.create('register', { insertion: { value: { $el: _this.$('#content') } } }).on('cancelled', function () {
                return _this.show();
            });
        }).catch(this.somethingWentWrong);
    }
});

},{"../models/User":6,"./__proto__":18}],15:[function(require,module,exports){
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

},{"../models/User":6,"../router":7,"./Login":14,"backbone":"backbone","events":32,"jquery":"jquery","moment":"moment","underscore":"underscore","util":36}],16:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    Views: {
        form: {
            opts: {
                fields: {
                    value: [{
                        name: 'name',
                        type: 'text',
                        error: 'Name is a required field.',
                        validate: function validate(val) {
                            return val.trim().length > 0;
                        }
                    }, {
                        name: 'email',
                        type: 'text',
                        error: 'Please enter a valid email address.',
                        validate: function validate(val) {
                            return this.emailRegex.test(val);
                        }
                    }, {
                        name: 'password',
                        type: 'text',
                        error: 'Passwords must be at least 6 characters long.',
                        validate: function validate(val) {
                            return val.trim().length > 5;
                        }
                    }, {
                        label: 'Repeat Password',
                        name: 'repeatPassword',
                        type: 'text',
                        error: 'Passwords must match.',
                        validate: function validate(val) {
                            return this.els.password.val() === val;
                        }
                    }]
                },

                resource: { value: 'person' }
            }
        }
    },

    onCancelBtnClick: function onCancelBtnClick() {
        var _this = this;

        this.views.form.clear();

        this.hide().then(function () {
            return _this.emit('cancelled');
        });
    },


    events: {
        cancelBtn: 'click',
        registerBtn: 'click'
    },

    onRegisterBtnClick: function onRegisterBtnClick() {
        this.views.form.submit().then(function (response) {
            if (response.invalid) return;
            //show static, "success" modal telling them they can login once they have verified their email
            console.log('Great Job');
        }).catch(this.somethingWentWrong);
    }
});

},{"./__proto__":18}],17:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {

    Xhr: require('../Xhr'),

    postRender: function postRender() {

        this.Xhr({ method: 'GET', resource: 'verify/' + window.location.pathname.split('/').pop() }).then(function () {
            return true;
        }).catch(this.somethingWentWrong);

        return this;
    }
});

},{"../Xhr":3,"./__proto__":18}],18:[function(require,module,exports){
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

        this.factory.create('login', { insertion: { value: { $el: this.$('#content') } } }).once("loggedIn", function () {
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

        return new Promise(function (resolve) {
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
        this.slurpTemplate({ template: this.template(this.getTemplateOptions()), insertion: this.insertion });

        if (this.size) this.size();

        return this.renderSubviews().postRender();
    },
    renderSubviews: function renderSubviews() {
        var _this8 = this;

        Object.keys(this.Views || []).forEach(function (key) {
            if (_this8.Views[key].el) {
                var opts = _this8.Views[key].opts;

                opts = opts ? (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === "object" ? opts : opts() : {};

                _this8.views[key] = _this8.factory.create(key, Object.assign({ insertion: { value: { $el: _this8.Views[key].el, method: 'before' } } }, opts));
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
                if (_this9.size) {
                    _this9.size();
                }resolve();
            });
        });
    },
    slurpEl: function slurpEl(el) {
        var key = el.attr(this.slurp.attr) || 'container';

        if (key === 'container') el.addClass(this.name);

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


    requiresLogin: false,

    somethingWentWrong: function somethingWentWrong(e) {
        console.log(e.stack || e);
    }
});

},{"../../../lib/MyObject":31,"backbone":"backbone","events":32,"jquery":"jquery","underscore":"underscore"}],19:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "Admin";
};

},{}],20:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div data-js=\"container\">\n    <h2>Lists</h2>\n    <p>Organize your content into neat groups with our lists.</p>\n    <div class=\"example\" data-view=\"list\"></div>\n    <h2>Forms</h2>\n    <p>Our forms are customizable to suit the needs of your project. Here, for example, are \n    Login and Register forms, each using different input styles.</p>\n    <div class=\"example\">\n        <div class=\"inline-view\">\n            <div data-view=\"login\"></div>\n        </div>\n        <div class=\"inline-view\">\n            <div data-view=\"register\"></div>\n        </div>\n    </div>\n</div>\n";
};

},{}],21:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<span class=\"feedback\" data-js=\"fieldError\">" + p.error + "</span>";
};

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    var _this = this;

    return '<form data-js="container">\n        ' + p.fields.map(function (field) {
        return '<div class="form-group">\n           <label class="form-label" for="' + field.name + '">' + (field.label || _this.capitalizeFirstLetter(field.name)) + '</label>\n           <' + (field.tag || 'input') + ' data-js="' + field.name + '" class="' + field.name + '" type="' + (field.type || 'text') + '" placeholder="' + (field.placeholder || '') + '">\n                ' + (field.tag === 'select' ? field.options.map(function (option) {
            return '<option>' + option + '</option>';
        }).join('') + '</select>' : '') + '\n        </div>';
    }).join('') + '\n    </form>';
};

},{}],23:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Header</div>";
};

},{}],24:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Future Days</div>";
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div data-js=\"invalidLoginError\" class=\"feedback\">Invalid Credentials</div>";
};

},{}],26:[function(require,module,exports){
"use strict";

module.exports = function (options) {
    return "\n\n<ul class=\"list\">\n    <li class=\"list-item\">for</li>\n    <li class=\"list-item\">the</li>\n    <li class=\"list-item\">sake</li>\n    <li class=\"list-item\">of</li>\n    <li class=\"list-item\">future</li>\n    <li class=\"list-item\">days</li>\n</ul>\n";
};

},{}],27:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div>\n    <h1>Login</h1>\n    <div data-view=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n        <button data-js=\"loginBtn\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>\n";
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div>\n    <h1>Register</h1>\n    <div data-view=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"cancelBtn\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n    </div>\n</div>\n";
};

},{}],29:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "Verify";
};

},{}],30:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],31:[function(require,module,exports){
'use strict';

module.exports = {

    Error: require('./MyError'),

    Moment: require('moment'),

    P: function P(fun) {
        var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var thisArg = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
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

},{"./MyError":30,"moment":"moment"}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],36:[function(require,module,exports){
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

},{"./support/isBuffer":35,"_process":34,"inherits":33}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzL1hoci5qcyIsImNsaWVudC9qcy9mYWN0b3J5L1ZpZXcuanMiLCJjbGllbnQvanMvbWFpbi5qcyIsImNsaWVudC9qcy9tb2RlbHMvVXNlci5qcyIsImNsaWVudC9qcy9yb3V0ZXIuanMiLCJjbGllbnQvanMvdmlld3MvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvRGVtby5qcyIsImNsaWVudC9qcy92aWV3cy9Gb3JtLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0hlYWRlci5qcyIsImNsaWVudC9qcy92aWV3cy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0xpc3QuanMiLCJjbGllbnQvanMvdmlld3MvTG9naW4uanMiLCJjbGllbnQvanMvdmlld3MvTXlWaWV3LmpzIiwiY2xpZW50L2pzL3ZpZXdzL1JlZ2lzdGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL1ZlcmlmeS5qcyIsImNsaWVudC9qcy92aWV3cy9fX3Byb3RvX18uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2FkbWluLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9kZW1vLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9maWVsZEVycm9yLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9mb3JtLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9oZWFkZXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2hvbWUuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9saXN0LmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9sb2dpbi5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvcmVnaXN0ZXIuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL3ZlcmlmeS5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxPQUFNLFFBQVEsd0JBQVIsQ0FGUTtBQUdkLGFBQVksUUFBUSw4QkFBUixDQUhFO0FBSWQsT0FBTSxRQUFRLHdCQUFSLENBSlE7QUFLZCxTQUFRLFFBQVEsMEJBQVIsQ0FMTTtBQU1kLE9BQU0sUUFBUSx3QkFBUixDQU5RO0FBT2Qsb0JBQW1CLFFBQVEscUNBQVIsQ0FQTDtBQVFkLE9BQU0sUUFBUSx3QkFBUixDQVJRO0FBU2QsUUFBTyxRQUFRLHlCQUFSLENBVE87QUFVZCxXQUFVLFFBQVEsNEJBQVIsQ0FWSTtBQVdkLFNBQVEsUUFBUSwwQkFBUjtBQVhNLENBQWY7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWU7QUFDZCxRQUFPLFFBQVEsZUFBUixDQURPO0FBRWQsT0FBTSxRQUFRLGNBQVIsQ0FGUTtBQUdkLE9BQU0sUUFBUSxjQUFSLENBSFE7QUFJZCxTQUFRLFFBQVEsZ0JBQVIsQ0FKTTtBQUtkLE9BQU0sUUFBUSxjQUFSLENBTFE7QUFNZCxPQUFNLFFBQVEsY0FBUixDQU5RO0FBT2QsUUFBTyxRQUFRLGVBQVIsQ0FQTztBQVFkLFNBQVEsUUFBUSxnQkFBUixDQVJNO0FBU2QsV0FBVSxRQUFRLGtCQUFSLENBVEk7QUFVZCxTQUFRLFFBQVEsZ0JBQVI7QUFW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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcblx0YWRtaW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2FkbWluJyksXG5cdGRlbW86IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2RlbW8nKSxcblx0ZmllbGRFcnJvcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZmllbGRFcnJvcicpLFxuXHRmb3JtOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9mb3JtJyksXG5cdGhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvaGVhZGVyJyksXG5cdGhvbWU6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2hvbWUnKSxcblx0aW52YWxpZExvZ2luRXJyb3I6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yJyksXG5cdGxpc3Q6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2xpc3QnKSxcblx0bG9naW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2xvZ2luJyksXG5cdHJlZ2lzdGVyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9yZWdpc3RlcicpLFxuXHR2ZXJpZnk6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL3ZlcmlmeScpXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRBZG1pbjogcmVxdWlyZSgnLi92aWV3cy9BZG1pbicpLFxuXHREZW1vOiByZXF1aXJlKCcuL3ZpZXdzL0RlbW8nKSxcblx0Rm9ybTogcmVxdWlyZSgnLi92aWV3cy9Gb3JtJyksXG5cdEhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKSxcblx0SG9tZTogcmVxdWlyZSgnLi92aWV3cy9Ib21lJyksXG5cdExpc3Q6IHJlcXVpcmUoJy4vdmlld3MvTGlzdCcpLFxuXHRMb2dpbjogcmVxdWlyZSgnLi92aWV3cy9Mb2dpbicpLFxuXHRNeVZpZXc6IHJlcXVpcmUoJy4vdmlld3MvTXlWaWV3JyksXG5cdFJlZ2lzdGVyOiByZXF1aXJlKCcuL3ZpZXdzL1JlZ2lzdGVyJyksXG5cdFZlcmlmeTogcmVxdWlyZSgnLi92aWV3cy9WZXJpZnknKVxufSIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSggT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4uLy4uL2xpYi9NeU9iamVjdCcpLCB7XG5cbiAgICBSZXF1ZXN0OiB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoIGRhdGEgKSB7XG4gICAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCksXG4gICAgICAgICAgICAgICAgcmVzb2x2ZXJcblxuICAgICAgICAgICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCB0aGlzIClcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgLyogeW91IGNhbiBnZXQgdGhlIHNlcmlhbGl6ZWQgZGF0YSB0aHJvdWdoIHRoZSBcInN1Ym1pdHRlZERhdGFcIiBjdXN0b20gcHJvcGVydHk6ICovXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5zdWJtaXR0ZWREYXRhKSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZXIoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggZGF0YS5tZXRob2QgPT09IFwiZ2V0XCIgKSB7XG4gICAgICAgICAgICAgIHJlcS5vcGVuKCBkYXRhLm1ldGhvZCwgYC8ke2RhdGEucmVzb3VyY2V9PyR7ZGF0YS5xc31gLCB0cnVlIClcbiAgICAgICAgICAgICAgcmVxLnNlbmQobnVsbClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8qIG1ldGhvZCBpcyBQT1NUICovXG4gICAgICAgICAgICAgIHJlcS5vcGVuKCBkYXRhLm1ldGhvZCwgYC8ke2RhdGEucmVzb3VyY2V9YCwgdHJ1ZSlcbiAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgJ2FwcGxpY2F0aW9uL2pzb24nIClcbiAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgJ3RleHQvcGxhaW4nIClcbiAgICAgICAgICAgICAgcmVxLnNlbmQoIGRhdGEuZGF0YSApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiByZXNvbHZlciA9IHJlc29sdmUgKVxuICAgICAgICB9LFxuXG4gICAgICAgIHBsYWluRXNjYXBlKCBzVGV4dCApIHtcbiAgICAgICAgICAgIC8qIGhvdyBzaG91bGQgSSB0cmVhdCBhIHRleHQvcGxhaW4gZm9ybSBlbmNvZGluZz8gd2hhdCBjaGFyYWN0ZXJzIGFyZSBub3QgYWxsb3dlZD8gdGhpcyBpcyB3aGF0IEkgc3VwcG9zZS4uLjogKi9cbiAgICAgICAgICAgIC8qIFwiNFxcM1xcNyAtIEVpbnN0ZWluIHNhaWQgRT1tYzJcIiAtLS0tPiBcIjRcXFxcM1xcXFw3XFwgLVxcIEVpbnN0ZWluXFwgc2FpZFxcIEVcXD1tYzJcIiAqL1xuICAgICAgICAgICAgcmV0dXJuIHNUZXh0LnJlcGxhY2UoL1tcXHNcXD1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgX2ZhY3RvcnkoIGRhdGEgKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKCB0aGlzLlJlcXVlc3QsIHsgfSApLmNvbnN0cnVjdG9yKCBkYXRhIClcbiAgICB9LFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoICFYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZEFzQmluYXJ5ICkge1xuICAgICAgICAgIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kQXNCaW5hcnkgPSBmdW5jdGlvbihzRGF0YSkge1xuICAgICAgICAgICAgdmFyIG5CeXRlcyA9IHNEYXRhLmxlbmd0aCwgdWk4RGF0YSA9IG5ldyBVaW50OEFycmF5KG5CeXRlcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBuSWR4ID0gMDsgbklkeCA8IG5CeXRlczsgbklkeCsrKSB7XG4gICAgICAgICAgICAgIHVpOERhdGFbbklkeF0gPSBzRGF0YS5jaGFyQ29kZUF0KG5JZHgpICYgMHhmZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VuZCh1aThEYXRhKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnkuYmluZCh0aGlzKVxuICAgIH1cblxufSApLCB7IH0gKS5jb25zdHJ1Y3RvcigpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIHtcblxuICAgIGNyZWF0ZSggbmFtZSwgb3B0cyApIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAgICAgICAgICB0aGlzLlZpZXdzWyBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKSBdLFxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbiggeyB0ZW1wbGF0ZTogeyB2YWx1ZTogdGhpcy5UZW1wbGF0ZXNbIG5hbWUgXSB9LCB1c2VyOiB7IHZhbHVlOiB0aGlzLlVzZXIgfSwgZmFjdG9yeTogeyB2YWx1ZTogdGhpcyB9LCBuYW1lOiB7IHZhbHVlOiBuYW1lIH0gfSwgb3B0cyApXG4gICAgICAgICkuY29uc3RydWN0b3IoKVxuICAgIH0sXG5cbn0sIHtcbiAgICBUZW1wbGF0ZXM6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5UZW1wbGF0ZU1hcCcpIH0sXG4gICAgVXNlcjogeyB2YWx1ZTogcmVxdWlyZSgnLi4vbW9kZWxzL1VzZXInICkgfSxcbiAgICBWaWV3czogeyB2YWx1ZTogcmVxdWlyZSgnLi4vLlZpZXdNYXAnKSB9XG59IClcbiIsInJlcXVpcmUoJ2pxdWVyeScpKCAoKSA9PiB7XG4gICAgcmVxdWlyZSgnLi9yb3V0ZXInKVxuICAgIHJlcXVpcmUoJ2JhY2tib25lJykuaGlzdG9yeS5zdGFydCggeyBwdXNoU3RhdGU6IHRydWUgfSApXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gbmV3ICggcmVxdWlyZSgnYmFja2JvbmUnKS5Nb2RlbC5leHRlbmQoIHtcbiAgICBkZWZhdWx0czogeyBzdGF0ZToge30gfSxcbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmZldGNoZWQgPSB0aGlzLmZldGNoKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIHVybCgpIHsgcmV0dXJuIFwiL3VzZXJcIiB9XG59ICkgKSgpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyAoXG4gICAgcmVxdWlyZSgnYmFja2JvbmUnKS5Sb3V0ZXIuZXh0ZW5kKCB7XG5cbiAgICAgICAgJDogcmVxdWlyZSgnanF1ZXJ5JyksXG5cbiAgICAgICAgRXJyb3I6IHJlcXVpcmUoJy4uLy4uL2xpYi9NeUVycm9yJyksXG4gICAgICAgIFxuICAgICAgICBVc2VyOiByZXF1aXJlKCcuL21vZGVscy9Vc2VyJyksXG5cbiAgICAgICAgVmlld0ZhY3Rvcnk6IHJlcXVpcmUoJy4vZmFjdG9yeS9WaWV3JyksXG5cbiAgICAgICAgaW5pdGlhbGl6ZSgpIHtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50Q29udGFpbmVyID0gdGhpcy4kKCcjY29udGVudCcpXG5cbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB0aGlzLCB7XG4gICAgICAgICAgICAgICAgdmlld3M6IHsgfSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCAnaGVhZGVyJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgJGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIsIG1ldGhvZDogJ2JlZm9yZScgfSB9IH0gKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ29Ib21lKCkgeyB0aGlzLm5hdmlnYXRlKCAnaG9tZScsIHsgdHJpZ2dlcjogdHJ1ZSB9ICkgfSxcblxuICAgICAgICBoYW5kbGVyKCByZXNvdXJjZSApIHtcblxuICAgICAgICAgICAgaWYoICFyZXNvdXJjZSApIHJldHVybiB0aGlzLmdvSG9tZSgpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlc291cmNlID0gcmVzb3VyY2Uuc3BsaXQoJy8nKS5zaGlmdCgpXG5cbiAgICAgICAgICAgIHRoaXMuVXNlci5mZXRjaGVkLmRvbmUoICgpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyLm9uVXNlcigpXG4gICAgICAgICAgICAgICAgICAgIC5vbiggJ3NpZ25vdXQnLCAoKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKCBPYmplY3Qua2V5cyggdGhpcy52aWV3cyApLm1hcCggbmFtZSA9PiB0aGlzLnZpZXdzWyBuYW1lIF0uZGVsZXRlKCkgKSApXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbiggdGhpcy5nb0hvbWUoKSApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIHZpZXcgPT4gdGhpcy52aWV3c1sgdmlldyBdLmhpZGUoKSApIClcbiAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy52aWV3c1sgcmVzb3VyY2UgXSApIHJldHVybiB0aGlzLnZpZXdzWyByZXNvdXJjZSBdLnNob3coKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdzWyByZXNvdXJjZSBdID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVmlld0ZhY3RvcnkuY3JlYXRlKCByZXNvdXJjZSwgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgJGVsOiB0aGlzLmNvbnRlbnRDb250YWluZXIgfSB9IH0gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbiggJ3JvdXRlJywgcm91dGUgPT4gdGhpcy5uYXZpZ2F0ZSggcm91dGUsIHsgdHJpZ2dlcjogdHJ1ZSB9ICkgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgIC5jYXRjaCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gKS5mYWlsKCB0aGlzLkVycm9yIClcbiAgICAgICAgICAgIFxuICAgICAgICB9LFxuXG4gICAgICAgIHJvdXRlczogeyAnKCpyZXF1ZXN0KSc6ICdoYW5kbGVyJyB9XG5cbiAgICB9IClcbikoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIHJlcXVpcmVzTG9naW46IHRydWVcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgVmlld3M6IHtcbiAgICAgICAgbGlzdDogeyB9LFxuICAgICAgICBsb2dpbjogeyB9LFxuICAgICAgICByZWdpc3RlcjogeyB9XG4gICAgfSxcblxuICAgIC8qZmllbGRzOiBbIHtcbiAgICAgICAgY2xhc3M6IFwiZm9ybS1pbnB1dFwiLFxuICAgICAgICBuYW1lOiBcImVtYWlsXCIsXG4gICAgICAgIGxhYmVsOiAnRW1haWwnLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGVycm9yOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJmb3JtLWlucHV0XCIsXG4gICAgICAgIGhvcml6b250YWw6IHRydWUsXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbGFiZWw6ICdQYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIGVycm9yOiBcIlBhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLlwiLFxuICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPj0gNlxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtYm9yZGVybGVzc1wiLFxuICAgICAgICBuYW1lOiBcImFkZHJlc3NcIixcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJTdHJlZXQgQWRkcmVzc1wiLFxuICAgICAgICBlcnJvcjogXCJSZXF1aXJlZCBmaWVsZC5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLiQudHJpbSh2YWwpICE9PSAnJyB9XG4gICAgfSwge1xuICAgICAgICBjbGFzczogXCJpbnB1dC1mbGF0XCIsXG4gICAgICAgIG5hbWU6IFwiY2l0eVwiLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcIkNpdHlcIixcbiAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtYm9yZGVybGVzc1wiLFxuICAgICAgICBzZWxlY3Q6IHRydWUsXG4gICAgICAgIG5hbWU6IFwiZmF2ZVwiLFxuICAgICAgICBsYWJlbDogXCJGYXZlIENhbiBBbGJ1bVwiLFxuICAgICAgICBvcHRpb25zOiBbIFwiTW9uc3RlciBNb3ZpZVwiLCBcIlNvdW5kdHJhY2tzXCIsIFwiVGFnbyBNYWdvXCIsIFwiRWdlIEJhbXlhc2lcIiwgXCJGdXR1cmUgRGF5c1wiIF0sXG4gICAgICAgIGVycm9yOiBcIlBsZWFzZSBjaG9vc2UgYW4gb3B0aW9uLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9IF0sKi9cblxuICAgIEZvcm06IHJlcXVpcmUoJy4vRm9ybScpLFxuICAgIExpc3Q6IHJlcXVpcmUoJy4vTGlzdCcpLFxuICAgIExvZ2luOiByZXF1aXJlKCcuL0xvZ2luJyksXG4gICAgUmVnaXN0ZXI6IHJlcXVpcmUoJy4vUmVnaXN0ZXInKSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG4gICAgICAgIFxuICAgICAgICAvL3RoaXMubGlzdEluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5MaXN0LCB7IGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMubGlzdCB9IH0gKS5jb25zdHJ1Y3RvcigpXG5cbiAgICAgICAgLyp0aGlzLmZvcm1JbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuRm9ybSwgeyBcbiAgICAgICAgICAgIGZpZWxkczogeyB2YWx1ZTogdGhpcy5maWVsZHMgfSwgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmZvcm0gfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKSovXG5cbiAgICAgICAgLyp0aGlzLmxvZ2luRXhhbXBsZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTG9naW4sIHsgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmxvZ2luRXhhbXBsZSB9LFxuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdpbnB1dC1ib3JkZXJsZXNzJyB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgICovXG4gICAgICAgIFxuICAgICAgICAvKnRoaXMucmVnaXN0ZXJFeGFtcGxlID0gT2JqZWN0LmNyZWF0ZSggdGhpcy5SZWdpc3RlciwgeyBcbiAgICAgICAgICAgIGNvbnRhaW5lcjogeyB2YWx1ZTogdGhpcy5lbHMucmVnaXN0ZXJFeGFtcGxlIH0sXG4gICAgICAgICAgICBjbGFzczogeyB2YWx1ZTogJ2Zvcm0taW5wdXQnIH0sXG4gICAgICAgICAgICBob3Jpem9udGFsOiB7IHZhbHVlOiB0cnVlIH1cbiAgICAgICAgfSApLmNvbnN0cnVjdG9yKClcbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9naW5FeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgdGhpcy5sb2dpbkV4YW1wbGUuZWxzLmxvZ2luQnRuLm9mZignY2xpY2snKVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5jYW5jZWxCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFeGFtcGxlLmVscy5yZWdpc3RlckJ0bi5vZmYoJ2NsaWNrJylcbiAgICAgICAgKi9cblxuICAgICAgICAvL3RoaXMuZWxzZS5zdWJtaXRCdG4ub24oICdjbGljaycsICgpID0+IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6ICcnIH0gKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9kZW1vJylcblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgWGhyOiByZXF1aXJlKCcuLi9YaHInKSxcblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKCBmaWVsZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVycm9yKCB0aGlzLmVsc1sgZmllbGQubmFtZSBdIClcbiAgICAgICAgICAgIHRoaXMuZWxzWyBmaWVsZC5uYW1lIF0udmFsKCcnKVxuICAgICAgICB9IClcblxuICAgICAgICBpZiggdGhpcy5lbHMuZXJyb3IgKSB7IHRoaXMuZWxzLmVycm9yLnJlbW92ZSgpOyB0aGlzLmVsc2UuZXJyb3IgPSB1bmRlZmluZWQgfVxuICAgIH0sXG5cbiAgICBlbWFpbFJlZ2V4OiAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvLFxuXG4gICAgZ2V0VGVtcGxhdGVPcHRpb25zKCkgeyBcbiAgICAgICAgcmV0dXJuIHsgZmllbGRzOiB0aGlzLmZpZWxkcyB9XG4gICAgfSxcblxuICAgIGdldEZvcm1EYXRhKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHsgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLmVscyApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggL0lOUFVUfFRFWFRBUkVBfFNFTEVDVC8udGVzdCggdGhpcy5lbHNbIGtleSBdLnByb3AoXCJ0YWdOYW1lXCIpICkgKSBkYXRhWyBrZXkgXSA9IHRoaXMuZWxzWyBrZXkgXS52YWwoKVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gZGF0YVxuICAgIH0sXG5cbiAgICBmaWVsZHM6IFsgXSxcblxuICAgIG9uRm9ybUZhaWwoIGVycm9yICkge1xuICAgICAgICBjb25zb2xlLmxvZyggZXJyb3Iuc3RhY2sgfHwgZXJyb3IgKTtcbiAgICAgICAgLy90aGlzLnNsdXJwVGVtcGxhdGUoIHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGVzLnNlcnZlckVycm9yKCBlcnJvciApLCBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmVscy5idXR0b25Sb3csIG1ldGhvZDogJ2JlZm9yZScgfSB9IClcbiAgICB9LFxuICAgIFxuICAgIHBvc3RGb3JtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHtcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB0aGlzLmdldEZvcm1EYXRhKCkgKSxcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgcmVzb3VyY2U6IHRoaXMucmVzb3VyY2VcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7XG5cbiAgICAgICAgdGhpcy5maWVsZHMuZm9yRWFjaCggZmllbGQgPT4ge1xuICAgICAgICAgICAgdmFyICRlbCA9IHRoaXMuZWxzWyBmaWVsZC5uYW1lIF1cbiAgICAgICAgICAgICRlbC5vbiggJ2JsdXInLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJ2ID0gZmllbGQudmFsaWRhdGUuY2FsbCggdGhpcywgJGVsLnZhbCgpIClcbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHJ2ID09PSBcImJvb2xlYW5cIiApIHJldHVybiBydiA/IHRoaXMuc2hvd1ZhbGlkKCRlbCkgOiB0aGlzLnNob3dFcnJvciggJGVsLCBmaWVsZC5lcnJvciApXG4gICAgICAgICAgICAgICAgcnYudGhlbiggKCkgPT4gdGhpcy5zaG93VmFsaWQoJGVsKSApXG4gICAgICAgICAgICAgICAgIC5jYXRjaCggKCkgPT4gdGhpcy5zaG93RXJyb3IoICRlbCwgZmllbGQuZXJyb3IgKSApXG4gICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAub24oICdmb2N1cycsICgpID0+IHRoaXMucmVtb3ZlRXJyb3IoICRlbCApIClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXJyb3IoICRlbCApIHtcbiAgICAgICAgJGVsLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdlcnJvciB2YWxpZCcpXG4gICAgICAgICRlbC5zaWJsaW5ncygnLmZlZWRiYWNrJykucmVtb3ZlKClcbiAgICB9LFxuXG4gICAgc2hvd0Vycm9yKCAkZWwsIGVycm9yICkge1xuXG4gICAgICAgIHZhciBmb3JtR3JvdXAgPSAkZWwucGFyZW50KClcblxuICAgICAgICBpZiggZm9ybUdyb3VwLmhhc0NsYXNzKCAnZXJyb3InICkgKSByZXR1cm5cblxuICAgICAgICBmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ3ZhbGlkJykuYWRkQ2xhc3MoJ2Vycm9yJykuYXBwZW5kKCB0aGlzLnRlbXBsYXRlcy5maWVsZEVycm9yKCB7IGVycm9yOiBlcnJvciB9ICkgKVxuICAgIH0sXG5cbiAgICBzaG93VmFsaWQoICRlbCApIHtcbiAgICAgICAgJGVsLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmFkZENsYXNzKCd2YWxpZCcpXG4gICAgICAgICRlbC5zaWJsaW5ncygnLmZlZWRiYWNrJykucmVtb3ZlKClcbiAgICB9LFxuXG4gICAgc3VibWl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZSgpXG4gICAgICAgIC50aGVuKCByZXN1bHQgPT4gcmVzdWx0ID09PSBmYWxzZSA/IFByb21pc2UucmVzb2x2ZSggeyBpbnZhbGlkOiB0cnVlIH0gKSA6IHRoaXMucG9zdEZvcm0oKSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5zb21ldGhpbmdXZW50V3JvbmcgKVxuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvZm9ybScpLFxuXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICAgIGZpZWxkRXJyb3I6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2ZpZWxkRXJyb3InKVxuICAgIH0sXG5cbiAgICB2YWxpZGF0ZSgpIHtcbiAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZSxcbiAgICAgICAgICAgIHByb21pc2VzID0gWyBdXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goIGZpZWxkID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLmVsc1sgZmllbGQubmFtZSBdLFxuICAgICAgICAgICAgICAgIHJ2ID0gZmllbGQudmFsaWRhdGUuY2FsbCggdGhpcywgJGVsLnZhbCgpIClcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgcnYgPT09IFwiYm9vbGVhblwiICkge1xuICAgICAgICAgICAgICAgIGlmKCBydiApIHsgdGhpcy5zaG93VmFsaWQoJGVsKSB9IGVsc2UgeyB0aGlzLnNob3dFcnJvciggJGVsLCBmaWVsZC5lcnJvciApOyB2YWxpZCA9IGZhbHNlIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgcnYudGhlbiggKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCB0aGlzLnNob3dWYWxpZCgkZWwpICkgKVxuICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCAoKSA9PiB7IHRoaXMuc2hvd0Vycm9yKCAkZWwsIGZpZWxkLmVycm9yICk7IHJldHVybiBQcm9taXNlLnJlc29sdmUoIHZhbGlkID0gZmFsc2UgKSB9IClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggcHJvbWlzZXMgKS50aGVuKCAoKSA9PiB2YWxpZCApXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIGV2ZW50czoge1xuICAgICAgICBzaWdub3V0QnRuOiB7IG1ldGhvZDogJ3NpZ25vdXQnIH1cbiAgICB9LFxuXG4gICAgb25Vc2VyKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG4gICAgXG4gICAgc2lnbm91dCgpIHtcblxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSAncGF0Y2h3b3Jrand0PTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnO1xuXG4gICAgICAgIHRoaXMudXNlci5jbGVhcigpXG5cbiAgICAgICAgdGhpcy5lbWl0KCdzaWdub3V0JylcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZSggXCIvXCIsIHsgdHJpZ2dlcjogdHJ1ZSB9IClcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9saXN0Jylcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgVmlld3M6IHtcbiAgICAgICAgZm9ybToge1xuICAgICAgICAgICAgb3B0czoge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogWyB7ICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdQYXNzd29yZHMgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMgbG9uZy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiB2YWwubGVuZ3RoID49IDZcbiAgICAgICAgICAgICAgICAgICAgfSBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICByZWdpc3RlckJ0bjogJ2NsaWNrJyxcbiAgICAgICAgbG9naW5CdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgbG9naW4oKSB7IHRoaXMuZm9ybUluc3RhbmNlLnN1Ym1pdEZvcm0oIHsgcmVzb3VyY2U6IFwiYXV0aFwiIH0gKSB9LFxuXG4gICAgb25TdWJtaXNzaW9uUmVzcG9uc2UoIHJlc3BvbnNlICkge1xuICAgICAgICBpZiggT2JqZWN0LmtleXMoIHJlc3BvbnNlICkubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgLy9yZXR1cm4gdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5pbnZhbGlkTG9naW5FcnJvciwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuY29udGFpbmVyIH0gfSApXG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmVxdWlyZSgnLi4vbW9kZWxzL1VzZXInKS5zZXQoIHJlc3BvbnNlIClcbiAgICAgICAgdGhpcy5lbWl0KCBcImxvZ2dlZEluXCIgKVxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgIH0sXG5cbiAgICBvblJlZ2lzdGVyQnRuQ2xpY2soKSB7XG5cbiAgICAgICAgdGhpcy52aWV3cy5mb3JtLmNsZWFyKCkgICAgICAgIFxuXG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgIC50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy52aWV3cy5yZWdpc3RlciApIHJldHVybiB0aGlzLnZpZXdzLnJlZ2lzdGVyLnNob3coKVxuICAgICAgICAgICAgdGhpcy52aWV3cy5yZWdpc3RlciA9XG4gICAgICAgICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZSggJ3JlZ2lzdGVyJywgeyBpbnNlcnRpb246IHsgdmFsdWU6IHsgJGVsOiB0aGlzLiQoJyNjb250ZW50JykgfSB9IH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2NhbmNlbGxlZCcsICgpID0+IHRoaXMuc2hvdygpIClcbiAgICAgICAgfSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5zb21ldGhpbmdXZW50V3JvbmcgKVxuICAgIH1cblxufSApXG4iLCJ2YXIgTXlWaWV3ID0gZnVuY3Rpb24oIGRhdGEgKSB7IHJldHVybiBPYmplY3QuYXNzaWduKCB0aGlzLCBkYXRhICkuaW5pdGlhbGl6ZSgpIH1cblxuT2JqZWN0LmFzc2lnbiggTXlWaWV3LnByb3RvdHlwZSwgcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gICAgQ29sbGVjdGlvbjogcmVxdWlyZSgnYmFja2JvbmUnKS5Db2xsZWN0aW9uLFxuICAgIFxuICAgIC8vRXJyb3I6IHJlcXVpcmUoJy4uL015RXJyb3InKSxcblxuICAgIE1vZGVsOiByZXF1aXJlKCdiYWNrYm9uZScpLk1vZGVsLFxuXG4gICAgXzogcmVxdWlyZSgndW5kZXJzY29yZScpLFxuXG4gICAgJDogcmVxdWlyZSgnanF1ZXJ5JyksXG5cbiAgICBkZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApIHtcbiAgICAgICAgdmFyIHR5cGU7XG5cbiAgICAgICAgaWYoICEgdGhpcy5ldmVudHNbIGtleSBdICkgcmV0dXJuXG5cbiAgICAgICAgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggdGhpcy5ldmVudHNba2V5XSApO1xuXG4gICAgICAgIGlmKCB0eXBlID09PSAnW29iamVjdCBPYmplY3RdJyApIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0sIGVsICk7XG4gICAgICAgIH0gZWxzZSBpZiggdHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJyApIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2tleV0uZm9yRWFjaCggc2luZ2xlRXZlbnQgPT4gdGhpcy5iaW5kRXZlbnQoIGtleSwgc2luZ2xlRXZlbnQsIGVsICkgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCB0aGlzLnRlbXBsYXRlRGF0YSAmJiB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIgKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIucmVtb3ZlKClcbiAgICAgICAgICAgIHRoaXMuZW1pdChcInJlbW92ZWRcIilcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBmb3JtYXQ6IHtcbiAgICAgICAgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyOiBzdHJpbmcgPT4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpXG4gICAgfSxcblxuICAgIGdldEZvcm1EYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5mb3JtRGF0YSA9IHsgfVxuXG4gICAgICAgIHRoaXMuXy5lYWNoKCB0aGlzLnRlbXBsYXRlRGF0YSwgKCAkZWwsIG5hbWUgKSA9PiB7IGlmKCAkZWwucHJvcChcInRhZ05hbWVcIikgPT09IFwiSU5QVVRcIiAmJiAkZWwudmFsKCkgKSB0aGlzLmZvcm1EYXRhW25hbWVdID0gJGVsLnZhbCgpIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1EYXRhXG4gICAgfSxcblxuICAgIGdldFJvdXRlcjogZnVuY3Rpb24oKSB7IHJldHVybiByZXF1aXJlKCcuLi9yb3V0ZXInKSB9LFxuXG4gICAgZ2V0VGVtcGxhdGVPcHRpb25zOiAoKSA9PiAoe30pLFxuXG4gICAgLypoaWRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5RLlByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLmhpZGUoKVxuICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0gKVxuICAgIH0sKi9cblxuICAgIGluaXRpYWxpemUoKSB7XG5cbiAgICAgICAgaWYoICEgdGhpcy5jb250YWluZXIgKSB0aGlzLmNvbnRhaW5lciA9IHRoaXMuJCgnI2NvbnRlbnQnKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmdldFJvdXRlcigpXG5cbiAgICAgICAgLy90aGlzLm1vZGFsVmlldyA9IHJlcXVpcmUoJy4vbW9kYWwnKVxuXG4gICAgICAgIHRoaXMuJCh3aW5kb3cpLnJlc2l6ZSggdGhpcy5fLnRocm90dGxlKCAoKSA9PiB0aGlzLnNpemUoKSwgNTAwICkgKVxuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgISB0aGlzLnVzZXIuaWQgKSB7XG4gICAgICAgICAgICByZXF1aXJlKCcuL0xvZ2luJykuc2hvdygpLm9uY2UoIFwic3VjY2Vzc1wiLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5oZWFkZXIub25Vc2VyKCB0aGlzLnVzZXIgKVxuXG4gICAgICAgICAgICAgICAgaWYoIHRoaXMucmVxdWlyZXNSb2xlICYmICggISB0aGlzLl8oIHRoaXMudXNlci5nZXQoJ3JvbGVzJykgKS5jb250YWlucyggdGhpcy5yZXF1aXJlc1JvbGUgKSApICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoJ1lvdSBkbyBub3QgaGF2ZSBhY2Nlc3MnKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfSBlbHNlIGlmKCB0aGlzLnVzZXIuaWQgJiYgdGhpcy5yZXF1aXJlc1JvbGUgKSB7XG4gICAgICAgICAgICBpZiggKCAhIHRoaXMuXyggdGhpcy51c2VyLmdldCgncm9sZXMnKSApLmNvbnRhaW5zKCB0aGlzLnJlcXVpcmVzUm9sZSApICkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KCdZb3UgZG8gbm90IGhhdmUgYWNjZXNzJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcigpXG4gICAgfSxcblxuICAgIGlzSGlkZGVuOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIH0sXG5cbiAgICBcbiAgICBtb21lbnQ6IHJlcXVpcmUoJ21vbWVudCcpLFxuXG4gICAgcG9zdFJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICAvL1E6IHJlcXVpcmUoJ3EnKSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSggdGhpcy5nZXRUZW1wbGF0ZU9wdGlvbnMoKSApLFxuICAgICAgICAgICAgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5pbnNlcnRpb25FbCB8fCB0aGlzLmNvbnRhaW5lciwgbWV0aG9kOiB0aGlzLmluc2VydGlvbk1ldGhvZCB9IH0gKVxuXG4gICAgICAgIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgdGhpcy5wb3N0UmVuZGVyKClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICByZW5kZXJTdWJ2aWV3czogZnVuY3Rpb24oKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLnN1YnZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiBcbiAgICAgICAgICAgIHRoaXMuc3Vidmlld3NbIGtleSBdLmZvckVhY2goIHN1YnZpZXdNZXRhID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzWyBzdWJ2aWV3TWV0YS5uYW1lIF0gPSBuZXcgc3Vidmlld01ldGEudmlldyggeyBjb250YWluZXI6IHRoaXMudGVtcGxhdGVEYXRhWyBrZXkgXSB9ICkgfSApIClcbiAgICB9LFxuXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5zaG93KClcbiAgICAgICAgdGhpcy5zaXplKClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNsdXJwRWw6IGZ1bmN0aW9uKCBlbCApIHtcblxuICAgICAgICB2YXIga2V5ID0gZWwuYXR0cignZGF0YS1qcycpO1xuXG4gICAgICAgIHRoaXMudGVtcGxhdGVEYXRhWyBrZXkgXSA9ICggdGhpcy50ZW1wbGF0ZURhdGEuaGFzT3duUHJvcGVydHkoa2V5KSApXG4gICAgICAgICAgICA/IHRoaXMudGVtcGxhdGVEYXRhWyBrZXkgXS5hZGQoIGVsIClcbiAgICAgICAgICAgIDogZWw7XG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cignZGF0YS1qcycpO1xuXG4gICAgICAgIGlmKCB0aGlzLmV2ZW50c1sga2V5IF0gKSB0aGlzLmRlbGVnYXRlRXZlbnRzKCBrZXksIGVsIClcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2x1cnBUZW1wbGF0ZTogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cbiAgICAgICAgdmFyICRodG1sID0gdGhpcy4kKCBvcHRpb25zLnRlbXBsYXRlICksXG4gICAgICAgICAgICBzZWxlY3RvciA9ICdbZGF0YS1qc10nO1xuXG4gICAgICAgIGlmKCB0aGlzLnRlbXBsYXRlRGF0YSA9PT0gdW5kZWZpbmVkICkgdGhpcy50ZW1wbGF0ZURhdGEgPSB7IH07XG5cbiAgICAgICAgJGh0bWwuZWFjaCggKCBpbmRleCwgZWwgKSA9PiB7XG4gICAgICAgICAgICB2YXIgJGVsID0gdGhpcy4kKGVsKTtcbiAgICAgICAgICAgIGlmKCAkZWwuaXMoIHNlbGVjdG9yICkgKSB0aGlzLnNsdXJwRWwoICRlbCApXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkaHRtbC5nZXQoKS5mb3JFYWNoKCAoIGVsICkgPT4geyB0aGlzLiQoIGVsICkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCAoIGksIGVsVG9CZVNsdXJwZWQgKSA9PiB0aGlzLnNsdXJwRWwoIHRoaXMuJChlbFRvQmVTbHVycGVkKSApICkgfSApXG4gICAgICAgXG4gICAgICAgIGlmKCBvcHRpb25zICYmIG9wdGlvbnMuaW5zZXJ0aW9uICkgb3B0aW9ucy5pbnNlcnRpb24uJGVsWyAoIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCApID8gb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kIDogJ2FwcGVuZCcgXSggJGh0bWwgKVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgXG4gICAgYmluZEV2ZW50OiBmdW5jdGlvbiggZWxlbWVudEtleSwgZXZlbnREYXRhLCBlbCApIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gKCBlbCApID8gZWwgOiB0aGlzLnRlbXBsYXRlRGF0YVsgZWxlbWVudEtleSBdO1xuXG4gICAgICAgIGVsZW1lbnRzLm9uKCBldmVudERhdGEuZXZlbnQgfHwgJ2NsaWNrJywgZXZlbnREYXRhLnNlbGVjdG9yLCBldmVudERhdGEubWV0YSwgdGhpc1sgZXZlbnREYXRhLm1ldGhvZCBdLmJpbmQodGhpcykgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHt9LFxuXG4gICAgaXNNb3VzZU9uRWw6IGZ1bmN0aW9uKCBldmVudCwgZWwgKSB7XG5cbiAgICAgICAgdmFyIGVsT2Zmc2V0ID0gZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBlbEhlaWdodCA9IGVsLm91dGVySGVpZ2h0KCB0cnVlICksXG4gICAgICAgICAgICBlbFdpZHRoID0gZWwub3V0ZXJXaWR0aCggdHJ1ZSApO1xuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG4gICAgXG4gICAgc2l6ZTogKCkgPT4geyB0aGlzIH0sXG5cbiAgICB1c2VyOiByZXF1aXJlKCcuLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgdXRpbDogcmVxdWlyZSgndXRpbCcpXG5cbn0gKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE15Vmlld1xuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgVmlld3M6IHtcbiAgICAgICAgZm9ybToge1xuICAgICAgICAgICAgb3B0czoge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogWyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ05hbWUgaXMgYSByZXF1aXJlZCBmaWVsZC4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB2YWwudHJpbSgpLmxlbmd0aCA+IDAgfVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZW1haWxSZWdleC50ZXN0KHZhbCkgfVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdQYXNzd29yZHMgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMgbG9uZy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB2YWwudHJpbSgpLmxlbmd0aCA+IDUgfVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1JlcGVhdCBQYXNzd29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAncmVwZWF0UGFzc3dvcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdQYXNzd29yZHMgbXVzdCBtYXRjaC4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVscy5wYXNzd29yZC52YWwoKSA9PT0gdmFsIH1cbiAgICAgICAgICAgICAgICAgICAgfSBdXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHJlc291cmNlOiB7IHZhbHVlOiAncGVyc29uJyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25DYW5jZWxCdG5DbGljaygpIHtcblxuICAgICAgICB0aGlzLnZpZXdzLmZvcm0uY2xlYXIoKVxuXG4gICAgICAgIHRoaXMuaGlkZSgpLnRoZW4oICgpID0+IHRoaXMuZW1pdCgnY2FuY2VsbGVkJykgKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgY2FuY2VsQnRuOiAnY2xpY2snLFxuICAgICAgICByZWdpc3RlckJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBvblJlZ2lzdGVyQnRuQ2xpY2soKSB7XG4gICAgICAgIHRoaXMudmlld3MuZm9ybS5zdWJtaXQoKVxuICAgICAgICAudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYoIHJlc3BvbnNlLmludmFsaWQgKSByZXR1cm5cbiAgICAgICAgICAgIC8vc2hvdyBzdGF0aWMsIFwic3VjY2Vzc1wiIG1vZGFsIHRlbGxpbmcgdGhlbSB0aGV5IGNhbiBsb2dpbiBvbmNlIHRoZXkgaGF2ZSB2ZXJpZmllZCB0aGVpciBlbWFpbFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dyZWF0IEpvYicpXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuc29tZXRoaW5nV2VudFdyb25nIClcbiAgICB9XG4gICAgXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFhocjogcmVxdWlyZSgnLi4vWGhyJyksXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIHRoaXMuWGhyKCB7IG1ldGhvZDogJ0dFVCcsIHJlc291cmNlOiBgdmVyaWZ5LyR7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJykucG9wKCl9YCB9IClcbiAgICAgICAgLnRoZW4oICgpID0+IHRydWUgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuc29tZXRoaW5nV2VudFdyb25nIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBfOiByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cbiAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIENvbGxlY3Rpb246IHJlcXVpcmUoJ2JhY2tib25lJykuQ29sbGVjdGlvbixcbiAgICBcbiAgICBNb2RlbDogcmVxdWlyZSgnYmFja2JvbmUnKS5Nb2RlbCxcblxuICAgIGJpbmRFdmVudCgga2V5LCBldmVudCwgc2VsZWN0b3I9JycgKSB7XG4gICAgICAgIHRoaXMuZWxzW2tleV0ub24oICdjbGljaycsIHNlbGVjdG9yLCBlID0+IHRoaXNbIGBvbiR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoa2V5KX0ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGV2ZW50KX1gIF0oIGUgKSApXG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLiQod2luZG93KS5yZXNpemUoIHRoaXMuXy50aHJvdHRsZSggKCkgPT4gdGhpcy5zaXplKCksIDUwMCApIClcblxuICAgICAgICBpZiggdGhpcy5yZXF1aXJlc0xvZ2luICYmICF0aGlzLnVzZXIuaWQgKSByZXR1cm4gdGhpcy5oYW5kbGVMb2dpbigpXG5cbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuaWQgJiYgdGhpcy5yZXF1aXJlc1JvbGUgJiYgIXRoaXMuaGFzUHJpdmlsZWdlcygpICkgcmV0dXJuIHRoaXMuc2hvd05vQWNjZXNzKClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiB0aGlzLmV2ZW50c1trZXldXG5cbiAgICAgICAgaWYoIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7IHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0gKSB9XG4gICAgICAgIGVsc2UgaWYoIEFycmF5LmlzQXJyYXkoIHRoaXMuZXZlbnRzW2tleV0gKSApIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWyBrZXkgXS5mb3JFYWNoKCBldmVudE9iaiA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBldmVudE9iai5ldmVudCApIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0uZXZlbnQgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlbGV0ZSggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoIGR1cmF0aW9uIClcbiAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxzZS5jb250YWluZXIucmVtb3ZlKClcbiAgICAgICAgICAgIHRoaXMuZW1pdChcInJlbW92ZWRcIilcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7fSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9uczogKCkgPT4gKHt9KSxcblxuICAgIGhhbmRsZUxvZ2luKCkge1xuICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnbG9naW4nLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuJCgnI2NvbnRlbnQnKSB9IH0gfSApXG4gICAgICAgICAgICAub25jZSggXCJsb2dnZWRJblwiLCAoKSA9PiB0aGlzLm9uTG9naW4oKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaGFzUHJpdmlsZWdlKCkge1xuICAgICAgICAoIHRoaXMucmVxdWlyZXNSb2xlICYmICggdGhpcy51c2VyLmdldCgncm9sZXMnKS5maW5kKCByb2xlID0+IHJvbGUgPT09IHRoaXMucmVxdWlyZXNSb2xlICkgPT09IFwidW5kZWZpbmVkXCIgKSApID8gZmFsc2UgOiB0cnVlXG4gICAgfSxcblxuICAgIGhpZGUoIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4gdGhpcy5lbHMuY29udGFpbmVyLmhpZGUoIGR1cmF0aW9uIHx8IDEwLCByZXNvbHZlICkgKVxuICAgIH0sXG4gICAgXG4gICAgaXNIaWRkZW4oKSB7IHJldHVybiB0aGlzLmVscy5jb250YWluZXIuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyB9LFxuXG4gICAgb25Mb2dpbigpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIuaGVhZGVyLm9uVXNlciggdGhpcy51c2VyIClcblxuICAgICAgICB0aGlzWyAoIHRoaXMuaGFzUHJpdmlsZWdlcygpICkgPyAncmVuZGVyJyA6ICdzaG93Tm9BY2Nlc3MnIF0oKVxuICAgIH0sXG5cbiAgICBzaG93Tm9BY2Nlc3MoKSB7XG4gICAgICAgIGFsZXJ0KFwiTm8gcHJpdmlsZWdlcywgc29uXCIpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7IHJldHVybiB0aGlzIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSggdGhpcy5nZXRUZW1wbGF0ZU9wdGlvbnMoKSApLCBpbnNlcnRpb246IHRoaXMuaW5zZXJ0aW9uIH0gKVxuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgICAgICAgICAgICAucG9zdFJlbmRlcigpXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5WaWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIHRoaXMuVmlld3NbIGtleSBdLmVsICkge1xuICAgICAgICAgICAgICAgIGxldCBvcHRzID0gdGhpcy5WaWV3c1sga2V5IF0ub3B0c1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG9wdHMgPSAoIG9wdHMgKVxuICAgICAgICAgICAgICAgICAgICA/IHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG9wdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIDogb3B0cygpXG4gICAgICAgICAgICAgICAgICAgIDoge31cblxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGtleSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSgga2V5LCBPYmplY3QuYXNzaWduKCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuVmlld3NbIGtleSBdLmVsLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9LCBvcHRzICkgKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsLnJlbW92ZSgpXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sga2V5IF0uZWwgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgc2hvdyggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PlxuICAgICAgICAgICAgdGhpcy5lbHMuY29udGFpbmVyLnNob3coXG4gICAgICAgICAgICAgICAgZHVyYXRpb24gfHwgMTAsXG4gICAgICAgICAgICAgICAgKCkgPT4geyBpZiggdGhpcy5zaXplICkgeyB0aGlzLnNpemUoKTsgfSByZXNvbHZlKCkgfVxuICAgICAgICAgICAgKVxuICAgICAgICApXG4gICAgfSxcblxuICAgIHNsdXJwRWwoIGVsICkge1xuICAgICAgICB2YXIga2V5ID0gZWwuYXR0ciggdGhpcy5zbHVycC5hdHRyICkgfHwgJ2NvbnRhaW5lcidcblxuICAgICAgICBpZigga2V5ID09PSAnY29udGFpbmVyJyApIGVsLmFkZENsYXNzKCB0aGlzLm5hbWUgKVxuXG4gICAgICAgIHRoaXMuZWxzWyBrZXkgXSA9IHRoaXMuZWxzWyBrZXkgXSA/IHRoaXMuZWxzWyBrZXkgXS5hZGQoIGVsICkgOiBlbFxuXG4gICAgICAgIGVsLnJlbW92ZUF0dHIodGhpcy5zbHVycC5hdHRyKVxuXG4gICAgICAgIGlmKCB0aGlzLmV2ZW50c1sga2V5IF0gKSB0aGlzLmRlbGVnYXRlRXZlbnRzKCBrZXksIGVsIClcbiAgICB9LFxuXG4gICAgc2x1cnBUZW1wbGF0ZSggb3B0aW9ucyApIHtcblxuICAgICAgICB2YXIgJGh0bWwgPSB0aGlzLiQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gYFske3RoaXMuc2x1cnAuYXR0cn1dYCxcbiAgICAgICAgICAgIHZpZXdTZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLnZpZXd9XWBcblxuICAgICAgICAkaHRtbC5lYWNoKCAoIGksIGVsICkgPT4ge1xuICAgICAgICAgICAgdmFyICRlbCA9IHRoaXMuJChlbCk7XG4gICAgICAgICAgICBpZiggJGVsLmlzKCBzZWxlY3RvciApIHx8IGkgPT09IDAgKSB0aGlzLnNsdXJwRWwoICRlbCApXG4gICAgICAgIH0gKVxuXG4gICAgICAgICRodG1sLmdldCgpLmZvckVhY2goICggZWwgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiQoIGVsICkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCAoIHVuZGVmaW5lZCwgZWxUb0JlU2x1cnBlZCApID0+IHRoaXMuc2x1cnBFbCggdGhpcy4kKGVsVG9CZVNsdXJwZWQpICkgKVxuICAgICAgICAgICAgdGhpcy4kKCBlbCApLmZpbmQoIHZpZXdTZWxlY3RvciApLmVhY2goICggdW5kZWZpbmVkLCB2aWV3RWwgKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyICRlbCA9IHRoaXMuJCh2aWV3RWwpXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sgJGVsLmF0dHIodGhpcy5zbHVycC52aWV3KSBdLmVsID0gJGVsXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgICAgXG4gICAgICAgIG9wdGlvbnMuaW5zZXJ0aW9uLiRlbFsgb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kIHx8ICdhcHBlbmQnIF0oICRodG1sIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBpc01vdXNlT25FbCggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKVxuXG4gICAgICAgIGlmKCAoIGV2ZW50LnBhZ2VYIDwgZWxPZmZzZXQubGVmdCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VYID4gKCBlbE9mZnNldC5sZWZ0ICsgZWxXaWR0aCApICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPCBlbE9mZnNldC50b3AgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA+ICggZWxPZmZzZXQudG9wICsgZWxIZWlnaHQgKSApICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcblxuICAgIHNvbWV0aGluZ1dlbnRXcm9uZyggZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coIGUuc3RhY2sgfHwgZSApXG4gICAgfSxcblxuICAgIC8vX190b0RvOiBodG1sLnJlcGxhY2UoLz5cXHMrPC9nLCc+PCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgQWRtaW5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChwKSA9PiBgXG48ZGl2IGRhdGEtanM9XCJjb250YWluZXJcIj5cbiAgICA8aDI+TGlzdHM8L2gyPlxuICAgIDxwPk9yZ2FuaXplIHlvdXIgY29udGVudCBpbnRvIG5lYXQgZ3JvdXBzIHdpdGggb3VyIGxpc3RzLjwvcD5cbiAgICA8ZGl2IGNsYXNzPVwiZXhhbXBsZVwiIGRhdGEtdmlldz1cImxpc3RcIj48L2Rpdj5cbiAgICA8aDI+Rm9ybXM8L2gyPlxuICAgIDxwPk91ciBmb3JtcyBhcmUgY3VzdG9taXphYmxlIHRvIHN1aXQgdGhlIG5lZWRzIG9mIHlvdXIgcHJvamVjdC4gSGVyZSwgZm9yIGV4YW1wbGUsIGFyZSBcbiAgICBMb2dpbiBhbmQgUmVnaXN0ZXIgZm9ybXMsIGVhY2ggdXNpbmcgZGlmZmVyZW50IGlucHV0IHN0eWxlcy48L3A+XG4gICAgPGRpdiBjbGFzcz1cImV4YW1wbGVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlubGluZS12aWV3XCI+XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdmlldz1cImxvZ2luXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5saW5lLXZpZXdcIj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwicmVnaXN0ZXJcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+XG5cbmA8c3BhbiBjbGFzcz1cImZlZWRiYWNrXCIgZGF0YS1qcz1cImZpZWxkRXJyb3JcIj4keyBwLmVycm9yIH08L3NwYW4+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggcCApIHsgXG4gICAgcmV0dXJuIGA8Zm9ybSBkYXRhLWpzPVwiY29udGFpbmVyXCI+XG4gICAgICAgICR7IHAuZmllbGRzLm1hcCggZmllbGQgPT5cbiAgICAgICAgYDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCIkeyBmaWVsZC5uYW1lIH1cIj4keyBmaWVsZC5sYWJlbCB8fCB0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggZmllbGQubmFtZSApIH08L2xhYmVsPlxuICAgICAgICAgICA8JHsgZmllbGQudGFnIHx8ICdpbnB1dCd9IGRhdGEtanM9XCIkeyBmaWVsZC5uYW1lIH1cIiBjbGFzcz1cIiR7IGZpZWxkLm5hbWUgfVwiIHR5cGU9XCIkeyBmaWVsZC50eXBlIHx8ICd0ZXh0JyB9XCIgcGxhY2Vob2xkZXI9XCIkeyBmaWVsZC5wbGFjZWhvbGRlciB8fCAnJyB9XCI+XG4gICAgICAgICAgICAgICAgJHsgKGZpZWxkLnRhZyA9PT0gJ3NlbGVjdCcpID8gZmllbGQub3B0aW9ucy5tYXAoIG9wdGlvbiA9PlxuICAgICAgICAgICAgICAgICAgICBgPG9wdGlvbj4keyBvcHRpb24gfTwvb3B0aW9uPmAgKS5qb2luKCcnKSArIGA8L3NlbGVjdD5gIDogYGAgfVxuICAgICAgICA8L2Rpdj5gICkuam9pbignJykgfVxuICAgIDwvZm9ybT5gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2PkhlYWRlcjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYDxkaXY+RnV0dXJlIERheXM8L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2IGRhdGEtanM9XCJpbnZhbGlkTG9naW5FcnJvclwiIGNsYXNzPVwiZmVlZGJhY2tcIj5JbnZhbGlkIENyZWRlbnRpYWxzPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIG9wdGlvbnMgKSA9PiBgXG5cbjx1bCBjbGFzcz1cImxpc3RcIj5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5mb3I8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPnRoZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+c2FrZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+b2Y8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPmZ1dHVyZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+ZGF5czwvbGk+XG48L3VsPlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG48ZGl2PlxuICAgIDxoMT5Mb2dpbjwvaDE+XG4gICAgPGRpdiBkYXRhLXZpZXc9XCJmb3JtXCI+PC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwiYnV0dG9uUm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInJlZ2lzdGVyQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+UmVnaXN0ZXI8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwibG9naW5CdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5Mb2cgSW48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGBcbjxkaXY+XG4gICAgPGgxPlJlZ2lzdGVyPC9oMT5cbiAgICA8ZGl2IGRhdGEtdmlldz1cImZvcm1cIj48L2Rpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJidXR0b25Sb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY2FuY2VsQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInJlZ2lzdGVyQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+UmVnaXN0ZXI8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGBWZXJpZnlgXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGVyciA9PiB7IGNvbnNvbGUubG9nKCBlcnIuc3RhY2sgfHwgZXJyICkgfVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBFcnJvcjogcmVxdWlyZSgnLi9NeUVycm9yJyksXG5cbiAgICBNb21lbnQ6IHJlcXVpcmUoJ21vbWVudCcpLFxuXG4gICAgUDogKCBmdW4sIGFyZ3M9WyBdLCB0aGlzQXJnPXRoaXMgKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiBSZWZsZWN0LmFwcGx5KCBmdW4sIHRoaXNBcmcsIGFyZ3MuY29uY2F0KCAoIGUsIC4uLmFyZ3MgKSA9PiBlID8gcmVqZWN0KGUpIDogcmVzb2x2ZShhcmdzKSApICkgKSxcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHsgcmV0dXJuIHRoaXMgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iXX0=
