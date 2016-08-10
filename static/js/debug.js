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

},{"./views/templates/admin":18,"./views/templates/demo":19,"./views/templates/fieldError":20,"./views/templates/form":21,"./views/templates/header":22,"./views/templates/home":23,"./views/templates/invalidLoginError":24,"./views/templates/list":25,"./views/templates/login":26,"./views/templates/register":27}],2:[function(require,module,exports){
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

},{"./views/Admin":8,"./views/Demo":9,"./views/Form":10,"./views/Header":11,"./views/Home":12,"./views/List":13,"./views/Login":14,"./views/MyView":15,"./views/Register":16}],3:[function(require,module,exports){
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

},{"../../lib/MyObject":29}],4:[function(require,module,exports){
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

},{"../../lib/MyError":28,"./factory/View":4,"./models/User":6,"backbone":"backbone","jquery":"jquery"}],8:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    requiresLogin: true
});

},{"./__proto__":17}],9:[function(require,module,exports){
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

},{"./Form":10,"./List":13,"./Login":14,"./Register":16,"./__proto__":17,"./templates/demo":19}],10:[function(require,module,exports){
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

},{"../Xhr":3,"./__proto__":17,"./templates/fieldError":20,"./templates/form":21}],11:[function(require,module,exports){
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

},{"./__proto__":17}],12:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {});

},{"./__proto__":17}],13:[function(require,module,exports){
'use strict';

module.exports = Object.assign({}, require('./__proto__'), {
    template: require('./templates/list')
});

},{"./__proto__":17,"./templates/list":25}],14:[function(require,module,exports){
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

},{"../models/User":6,"./__proto__":17}],15:[function(require,module,exports){
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

},{"../models/User":6,"../router":7,"./Login":14,"backbone":"backbone","events":30,"jquery":"jquery","moment":"moment","underscore":"underscore","util":34}],16:[function(require,module,exports){
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

},{"./__proto__":17}],17:[function(require,module,exports){
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

},{"../../../lib/MyObject":29,"backbone":"backbone","events":30,"jquery":"jquery","underscore":"underscore"}],18:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "Admin";
};

},{}],19:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div data-js=\"container\">\n    <h2>Lists</h2>\n    <p>Organize your content into neat groups with our lists.</p>\n    <div class=\"example\" data-view=\"list\"></div>\n    <h2>Forms</h2>\n    <p>Our forms are customizable to suit the needs of your project. Here, for example, are \n    Login and Register forms, each using different input styles.</p>\n    <div class=\"example\">\n        <div class=\"inline-view\">\n            <div data-view=\"login\"></div>\n        </div>\n        <div class=\"inline-view\">\n            <div data-view=\"register\"></div>\n        </div>\n    </div>\n</div>\n";
};

},{}],20:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<span class=\"feedback\" data-js=\"fieldError\">" + p.error + "</span>";
};

},{}],21:[function(require,module,exports){
'use strict';

module.exports = function (p) {
    var _this = this;

    return '<form data-js="container">\n        ' + p.fields.map(function (field) {
        return '<div class="form-group">\n           <label class="form-label" for="' + field.name + '">' + (field.label || _this.capitalizeFirstLetter(field.name)) + '</label>\n           <' + (field.tag || 'input') + ' data-js="' + field.name + '" class="' + field.name + '" type="' + (field.type || 'text') + '" placeholder="' + (field.placeholder || '') + '">\n                ' + (field.tag === 'select' ? field.options.map(function (option) {
            return '<option>' + option + '</option>';
        }).join('') + '</select>' : '') + '\n        </div>';
    }).join('') + '\n    </form>';
};

},{}],22:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Header</div>";
};

},{}],23:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div>Future Days</div>";
};

},{}],24:[function(require,module,exports){
"use strict";

module.exports = function (p) {
  return "<div data-js=\"invalidLoginError\" class=\"feedback\">Invalid Credentials</div>";
};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function (options) {
    return "\n\n<ul class=\"list\">\n    <li class=\"list-item\">for</li>\n    <li class=\"list-item\">the</li>\n    <li class=\"list-item\">sake</li>\n    <li class=\"list-item\">of</li>\n    <li class=\"list-item\">future</li>\n    <li class=\"list-item\">days</li>\n</ul>\n";
};

},{}],26:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div>\n    <h1>Login</h1>\n    <div data-view=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n        <button data-js=\"loginBtn\" class=\"btn-ghost\" type=\"button\">Log In</button>\n    </div>\n</div>\n";
};

},{}],27:[function(require,module,exports){
"use strict";

module.exports = function (p) {
    return "\n<div>\n    <h1>Register</h1>\n    <div data-view=\"form\"></div>\n    <div data-js=\"buttonRow\">\n        <button data-js=\"cancelBtn\" class=\"btn-ghost\" type=\"button\">Cancel</button>\n        <button data-js=\"registerBtn\" class=\"btn-ghost\" type=\"button\">Register</button>\n    </div>\n</div>\n";
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = function (err) {
  console.log(err.stack || err);
};

},{}],29:[function(require,module,exports){
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

},{"./MyError":28,"moment":"moment"}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],34:[function(require,module,exports){
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

},{"./support/isBuffer":33,"_process":32,"inherits":31}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzL1hoci5qcyIsImNsaWVudC9qcy9mYWN0b3J5L1ZpZXcuanMiLCJjbGllbnQvanMvbWFpbi5qcyIsImNsaWVudC9qcy9tb2RlbHMvVXNlci5qcyIsImNsaWVudC9qcy9yb3V0ZXIuanMiLCJjbGllbnQvanMvdmlld3MvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvRGVtby5qcyIsImNsaWVudC9qcy92aWV3cy9Gb3JtLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0hlYWRlci5qcyIsImNsaWVudC9qcy92aWV3cy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0xpc3QuanMiLCJjbGllbnQvanMvdmlld3MvTG9naW4uanMiLCJjbGllbnQvanMvdmlld3MvTXlWaWV3LmpzIiwiY2xpZW50L2pzL3ZpZXdzL1JlZ2lzdGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL19fcHJvdG9fXy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvYWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2RlbW8uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2ZpZWxkRXJyb3IuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2Zvcm0uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2hlYWRlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvaG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvaW52YWxpZExvZ2luRXJyb3IuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xpc3QuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xvZ2luLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9yZWdpc3Rlci5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxPQUFNLFFBQVEsd0JBQVIsQ0FGUTtBQUdkLGFBQVksUUFBUSw4QkFBUixDQUhFO0FBSWQsT0FBTSxRQUFRLHdCQUFSLENBSlE7QUFLZCxTQUFRLFFBQVEsMEJBQVIsQ0FMTTtBQU1kLE9BQU0sUUFBUSx3QkFBUixDQU5RO0FBT2Qsb0JBQW1CLFFBQVEscUNBQVIsQ0FQTDtBQVFkLE9BQU0sUUFBUSx3QkFBUixDQVJRO0FBU2QsUUFBTyxRQUFRLHlCQUFSLENBVE87QUFVZCxXQUFVLFFBQVEsNEJBQVI7QUFWSSxDQUFmOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLGVBQVIsQ0FETztBQUVkLE9BQU0sUUFBUSxjQUFSLENBRlE7QUFHZCxPQUFNLFFBQVEsY0FBUixDQUhRO0FBSWQsU0FBUSxRQUFRLGdCQUFSLENBSk07QUFLZCxPQUFNLFFBQVEsY0FBUixDQUxRO0FBTWQsT0FBTSxRQUFRLGNBQVIsQ0FOUTtBQU9kLFFBQU8sUUFBUSxlQUFSLENBUE87QUFRZCxTQUFRLFFBQVEsZ0JBQVIsQ0FSTTtBQVNkLFdBQVUsUUFBUSxrQkFBUjtBQVRJLENBQWY7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBbUIsUUFBUSxvQkFBUixDQUFuQixFQUFrRDs7QUFFOUUsYUFBUztBQUVMLG1CQUZL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YixDQUREO0FBQUEsS0FOVTs7QUFTYixlQVRhLHlCQVNDO0FBQUUsZUFBTyxJQUFQO0FBQWE7QUFUaEIsQ0FBakI7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcblx0YWRtaW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2FkbWluJyksXG5cdGRlbW86IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2RlbW8nKSxcblx0ZmllbGRFcnJvcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZmllbGRFcnJvcicpLFxuXHRmb3JtOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9mb3JtJyksXG5cdGhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvaGVhZGVyJyksXG5cdGhvbWU6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2hvbWUnKSxcblx0aW52YWxpZExvZ2luRXJyb3I6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2ludmFsaWRMb2dpbkVycm9yJyksXG5cdGxpc3Q6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2xpc3QnKSxcblx0bG9naW46IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2xvZ2luJyksXG5cdHJlZ2lzdGVyOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9yZWdpc3RlcicpXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRBZG1pbjogcmVxdWlyZSgnLi92aWV3cy9BZG1pbicpLFxuXHREZW1vOiByZXF1aXJlKCcuL3ZpZXdzL0RlbW8nKSxcblx0Rm9ybTogcmVxdWlyZSgnLi92aWV3cy9Gb3JtJyksXG5cdEhlYWRlcjogcmVxdWlyZSgnLi92aWV3cy9IZWFkZXInKSxcblx0SG9tZTogcmVxdWlyZSgnLi92aWV3cy9Ib21lJyksXG5cdExpc3Q6IHJlcXVpcmUoJy4vdmlld3MvTGlzdCcpLFxuXHRMb2dpbjogcmVxdWlyZSgnLi92aWV3cy9Mb2dpbicpLFxuXHRNeVZpZXc6IHJlcXVpcmUoJy4vdmlld3MvTXlWaWV3JyksXG5cdFJlZ2lzdGVyOiByZXF1aXJlKCcuL3ZpZXdzL1JlZ2lzdGVyJylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUoIE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuLi8uLi9saWIvTXlPYmplY3QnKSwge1xuXG4gICAgUmVxdWVzdDoge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCBkYXRhICkge1xuICAgICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpLFxuICAgICAgICAgICAgICAgIHJlc29sdmVyXG5cbiAgICAgICAgICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggdGhpcyApXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8qIHlvdSBjYW4gZ2V0IHRoZSBzZXJpYWxpemVkIGRhdGEgdGhyb3VnaCB0aGUgXCJzdWJtaXR0ZWREYXRhXCIgY3VzdG9tIHByb3BlcnR5OiAqL1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuc3VibWl0dGVkRGF0YSkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmVyKClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGRhdGEubWV0aG9kID09PSBcImdldFwiICkge1xuICAgICAgICAgICAgICByZXEub3BlbiggZGF0YS5tZXRob2QsIGAvJHtkYXRhLnJlc291cmNlfT8ke2RhdGEucXN9YCwgdHJ1ZSApXG4gICAgICAgICAgICAgIHJlcS5zZW5kKG51bGwpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvKiBtZXRob2QgaXMgUE9TVCAqL1xuICAgICAgICAgICAgICByZXEub3BlbiggZGF0YS5tZXRob2QsIGAvJHtkYXRhLnJlc291cmNlfWAsIHRydWUpXG4gICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsICdhcHBsaWNhdGlvbi9qc29uJyApXG4gICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsICd0ZXh0L3BsYWluJyApXG4gICAgICAgICAgICAgIHJlcS5zZW5kKCBkYXRhLmRhdGEgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4gcmVzb2x2ZXIgPSByZXNvbHZlIClcbiAgICAgICAgfSxcblxuICAgICAgICBwbGFpbkVzY2FwZSggc1RleHQgKSB7XG4gICAgICAgICAgICAvKiBob3cgc2hvdWxkIEkgdHJlYXQgYSB0ZXh0L3BsYWluIGZvcm0gZW5jb2Rpbmc/IHdoYXQgY2hhcmFjdGVycyBhcmUgbm90IGFsbG93ZWQ/IHRoaXMgaXMgd2hhdCBJIHN1cHBvc2UuLi46ICovXG4gICAgICAgICAgICAvKiBcIjRcXDNcXDcgLSBFaW5zdGVpbiBzYWlkIEU9bWMyXCIgLS0tLT4gXCI0XFxcXDNcXFxcN1xcIC1cXCBFaW5zdGVpblxcIHNhaWRcXCBFXFw9bWMyXCIgKi9cbiAgICAgICAgICAgIHJldHVybiBzVGV4dC5yZXBsYWNlKC9bXFxzXFw9XFxcXF0vZywgXCJcXFxcJCZcIik7XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIF9mYWN0b3J5KCBkYXRhICkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSggdGhpcy5SZXF1ZXN0LCB7IH0gKS5jb25zdHJ1Y3RvciggZGF0YSApXG4gICAgfSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCAhWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmRBc0JpbmFyeSApIHtcbiAgICAgICAgICBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZEFzQmluYXJ5ID0gZnVuY3Rpb24oc0RhdGEpIHtcbiAgICAgICAgICAgIHZhciBuQnl0ZXMgPSBzRGF0YS5sZW5ndGgsIHVpOERhdGEgPSBuZXcgVWludDhBcnJheShuQnl0ZXMpO1xuICAgICAgICAgICAgZm9yICh2YXIgbklkeCA9IDA7IG5JZHggPCBuQnl0ZXM7IG5JZHgrKykge1xuICAgICAgICAgICAgICB1aThEYXRhW25JZHhdID0gc0RhdGEuY2hhckNvZGVBdChuSWR4KSAmIDB4ZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbmQodWk4RGF0YSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9mYWN0b3J5LmJpbmQodGhpcylcbiAgICB9XG5cbn0gKSwgeyB9ICkuY29uc3RydWN0b3IoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCB7XG5cbiAgICBjcmVhdGUoIG5hbWUsIG9wdHMgKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSkgXSxcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oIHsgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSwgdXNlcjogeyB2YWx1ZTogdGhpcy5Vc2VyIH0sIGZhY3Rvcnk6IHsgdmFsdWU6IHRoaXMgfSwgbmFtZTogeyB2YWx1ZTogbmFtZSB9IH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICB9LFxuXG59LCB7XG4gICAgVGVtcGxhdGVzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVGVtcGxhdGVNYXAnKSB9LFxuICAgIFVzZXI6IHsgdmFsdWU6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyApIH0sXG4gICAgVmlld3M6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5WaWV3TWFwJykgfVxufSApXG4iLCJyZXF1aXJlKCdqcXVlcnknKSggKCkgPT4ge1xuICAgIHJlcXVpcmUoJy4vcm91dGVyJylcbiAgICByZXF1aXJlKCdiYWNrYm9uZScpLmhpc3Rvcnkuc3RhcnQoIHsgcHVzaFN0YXRlOiB0cnVlIH0gKVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyAoIHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwuZXh0ZW5kKCB7XG4gICAgZGVmYXVsdHM6IHsgc3RhdGU6IHt9IH0sXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5mZXRjaGVkID0gdGhpcy5mZXRjaCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICB1cmwoKSB7IHJldHVybiBcIi91c2VyXCIgfVxufSApICkoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgKFxuICAgIHJlcXVpcmUoJ2JhY2tib25lJykuUm91dGVyLmV4dGVuZCgge1xuXG4gICAgICAgICQ6IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgICAgICBcbiAgICAgICAgVXNlcjogcmVxdWlyZSgnLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuXG4gICAgICAgIGluaXRpYWxpemUoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudENvbnRhaW5lciA9IHRoaXMuJCgnI2NvbnRlbnQnKVxuXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywge1xuICAgICAgICAgICAgICAgIHZpZXdzOiB7IH0sXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9LFxuXG4gICAgICAgIGdvSG9tZSgpIHsgdGhpcy5uYXZpZ2F0ZSggJ2hvbWUnLCB7IHRyaWdnZXI6IHRydWUgfSApIH0sXG5cbiAgICAgICAgaGFuZGxlciggcmVzb3VyY2UgKSB7XG5cbiAgICAgICAgICAgIGlmKCAhcmVzb3VyY2UgKSByZXR1cm4gdGhpcy5nb0hvbWUoKVxuXG4gICAgICAgICAgICB0aGlzLlVzZXIuZmV0Y2hlZC5kb25lKCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlci5vblVzZXIoKVxuICAgICAgICAgICAgICAgICAgICAub24oICdzaWdub3V0JywgKCkgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIG5hbWUgPT4gdGhpcy52aWV3c1sgbmFtZSBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oIHRoaXMuZ29Ib21lKCkgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCB2aWV3ID0+IHRoaXMudmlld3NbIHZpZXcgXS5oaWRlKCkgKSApXG4gICAgICAgICAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMudmlld3NbIHJlc291cmNlIF0gKSByZXR1cm4gdGhpcy52aWV3c1sgcmVzb3VyY2UgXS5zaG93KClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgcmVzb3VyY2UgXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggcmVzb3VyY2UsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oICdyb3V0ZScsIHJvdXRlID0+IHRoaXMubmF2aWdhdGUoIHJvdXRlLCB7IHRyaWdnZXI6IHRydWUgfSApIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ICkuZmFpbCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICByb3V0ZXM6IHsgJygqcmVxdWVzdCknOiAnaGFuZGxlcicgfVxuXG4gICAgfSApXG4pKClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcbiAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFZpZXdzOiB7XG4gICAgICAgIGxpc3Q6IHsgfSxcbiAgICAgICAgbG9naW46IHsgfSxcbiAgICAgICAgcmVnaXN0ZXI6IHsgfVxuICAgIH0sXG5cbiAgICAvKmZpZWxkczogWyB7XG4gICAgICAgIGNsYXNzOiBcImZvcm0taW5wdXRcIixcbiAgICAgICAgbmFtZTogXCJlbWFpbFwiLFxuICAgICAgICBsYWJlbDogJ0VtYWlsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZW1haWxSZWdleC50ZXN0KHZhbCkgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiZm9ybS1pbnB1dFwiLFxuICAgICAgICBob3Jpem9udGFsOiB0cnVlLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGxhYmVsOiAnUGFzc3dvcmQnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICBlcnJvcjogXCJQYXNzd29yZHMgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMgbG9uZy5cIixcbiAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiB2YWwubGVuZ3RoID49IDZcbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImlucHV0LWJvcmRlcmxlc3NcIixcbiAgICAgICAgbmFtZTogXCJhZGRyZXNzXCIsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiU3RyZWV0IEFkZHJlc3NcIixcbiAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtZmxhdFwiLFxuICAgICAgICBuYW1lOiBcImNpdHlcIixcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJDaXR5XCIsXG4gICAgICAgIGVycm9yOiBcIlJlcXVpcmVkIGZpZWxkLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImlucHV0LWJvcmRlcmxlc3NcIixcbiAgICAgICAgc2VsZWN0OiB0cnVlLFxuICAgICAgICBuYW1lOiBcImZhdmVcIixcbiAgICAgICAgbGFiZWw6IFwiRmF2ZSBDYW4gQWxidW1cIixcbiAgICAgICAgb3B0aW9uczogWyBcIk1vbnN0ZXIgTW92aWVcIiwgXCJTb3VuZHRyYWNrc1wiLCBcIlRhZ28gTWFnb1wiLCBcIkVnZSBCYW15YXNpXCIsIFwiRnV0dXJlIERheXNcIiBdLFxuICAgICAgICBlcnJvcjogXCJQbGVhc2UgY2hvb3NlIGFuIG9wdGlvbi5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLiQudHJpbSh2YWwpICE9PSAnJyB9XG4gICAgfSBdLCovXG5cbiAgICBGb3JtOiByZXF1aXJlKCcuL0Zvcm0nKSxcbiAgICBMaXN0OiByZXF1aXJlKCcuL0xpc3QnKSxcbiAgICBMb2dpbjogcmVxdWlyZSgnLi9Mb2dpbicpLFxuICAgIFJlZ2lzdGVyOiByZXF1aXJlKCcuL1JlZ2lzdGVyJyksXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICBcbiAgICAgICAgLy90aGlzLmxpc3RJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTGlzdCwgeyBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmxpc3QgfSB9ICkuY29uc3RydWN0b3IoKVxuXG4gICAgICAgIC8qdGhpcy5mb3JtSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkZvcm0sIHsgXG4gICAgICAgICAgICBmaWVsZHM6IHsgdmFsdWU6IHRoaXMuZmllbGRzIH0sIFxuICAgICAgICAgICAgY29udGFpbmVyOiB7IHZhbHVlOiB0aGlzLmVscy5mb3JtIH1cbiAgICAgICAgfSApLmNvbnN0cnVjdG9yKCkqL1xuXG4gICAgICAgIC8qdGhpcy5sb2dpbkV4YW1wbGUgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkxvZ2luLCB7IFxuICAgICAgICAgICAgY29udGFpbmVyOiB7IHZhbHVlOiB0aGlzLmVscy5sb2dpbkV4YW1wbGUgfSxcbiAgICAgICAgICAgIGNsYXNzOiB7IHZhbHVlOiAnaW5wdXQtYm9yZGVybGVzcycgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICAqL1xuICAgICAgICBcbiAgICAgICAgLyp0aGlzLnJlZ2lzdGVyRXhhbXBsZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuUmVnaXN0ZXIsIHsgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLnJlZ2lzdGVyRXhhbXBsZSB9LFxuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdmb3JtLWlucHV0JyB9LFxuICAgICAgICAgICAgaG9yaXpvbnRhbDogeyB2YWx1ZTogdHJ1ZSB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvZ2luRXhhbXBsZS5lbHMucmVnaXN0ZXJCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgIHRoaXMubG9naW5FeGFtcGxlLmVscy5sb2dpbkJ0bi5vZmYoJ2NsaWNrJylcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXhhbXBsZS5lbHMuY2FuY2VsQnRuLm9mZignY2xpY2snKVxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXhhbXBsZS5lbHMucmVnaXN0ZXJCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgICovXG5cbiAgICAgICAgLy90aGlzLmVsc2Uuc3VibWl0QnRuLm9uKCAnY2xpY2snLCAoKSA9PiB0aGlzLmZvcm1JbnN0YW5jZS5zdWJtaXRGb3JtKCB7IHJlc291cmNlOiAnJyB9ICkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvZGVtbycpXG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFhocjogcmVxdWlyZSgnLi4vWGhyJyksXG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5maWVsZHMuZm9yRWFjaCggZmllbGQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFcnJvciggdGhpcy5lbHNbIGZpZWxkLm5hbWUgXSApXG4gICAgICAgICAgICB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgnJylcbiAgICAgICAgfSApXG5cbiAgICAgICAgaWYoIHRoaXMuZWxzLmVycm9yICkgeyB0aGlzLmVscy5lcnJvci5yZW1vdmUoKTsgdGhpcy5lbHNlLmVycm9yID0gdW5kZWZpbmVkIH1cbiAgICB9LFxuXG4gICAgZW1haWxSZWdleDogL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLyxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHsgXG4gICAgICAgIHJldHVybiB7IGZpZWxkczogdGhpcy5maWVsZHMgfVxuICAgIH0sXG5cbiAgICBnZXRGb3JtRGF0YSgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7IH1cblxuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5lbHMgKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIC9JTlBVVHxURVhUQVJFQXxTRUxFQ1QvLnRlc3QoIHRoaXMuZWxzWyBrZXkgXS5wcm9wKFwidGFnTmFtZVwiKSApICkgZGF0YVsga2V5IF0gPSB0aGlzLmVsc1sga2V5IF0udmFsKClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICB9LFxuXG4gICAgZmllbGRzOiBbIF0sXG5cbiAgICBvbkZvcm1GYWlsKCBlcnJvciApIHtcbiAgICAgICAgY29uc29sZS5sb2coIGVycm9yLnN0YWNrIHx8IGVycm9yICk7XG4gICAgICAgIC8vdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlcy5zZXJ2ZXJFcnJvciggZXJyb3IgKSwgaW5zZXJ0aW9uOiB7ICRlbDogdGhpcy5lbHMuYnV0dG9uUm93LCBtZXRob2Q6ICdiZWZvcmUnIH0gfSApXG4gICAgfSxcbiAgICBcbiAgICBwb3N0Rm9ybSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuWGhyKCB7XG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSggdGhpcy5nZXRGb3JtRGF0YSgpICksXG4gICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgIHJlc291cmNlOiB0aGlzLnJlc291cmNlXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goIGZpZWxkID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLmVsc1sgZmllbGQubmFtZSBdXG4gICAgICAgICAgICAkZWwub24oICdibHVyJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBydiA9IGZpZWxkLnZhbGlkYXRlLmNhbGwoIHRoaXMsICRlbC52YWwoKSApXG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiBydiA9PT0gXCJib29sZWFuXCIgKSByZXR1cm4gcnYgPyB0aGlzLnNob3dWYWxpZCgkZWwpIDogdGhpcy5zaG93RXJyb3IoICRlbCwgZmllbGQuZXJyb3IgKVxuICAgICAgICAgICAgICAgIHJ2LnRoZW4oICgpID0+IHRoaXMuc2hvd1ZhbGlkKCRlbCkgKVxuICAgICAgICAgICAgICAgICAuY2F0Y2goICgpID0+IHRoaXMuc2hvd0Vycm9yKCAkZWwsIGZpZWxkLmVycm9yICkgKVxuICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgLm9uKCAnZm9jdXMnLCAoKSA9PiB0aGlzLnJlbW92ZUVycm9yKCAkZWwgKSApXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlbW92ZUVycm9yKCAkZWwgKSB7XG4gICAgICAgICRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZXJyb3IgdmFsaWQnKVxuICAgICAgICAkZWwuc2libGluZ3MoJy5mZWVkYmFjaycpLnJlbW92ZSgpXG4gICAgfSxcblxuICAgIHNob3dFcnJvciggJGVsLCBlcnJvciApIHtcblxuICAgICAgICB2YXIgZm9ybUdyb3VwID0gJGVsLnBhcmVudCgpXG5cbiAgICAgICAgaWYoIGZvcm1Hcm91cC5oYXNDbGFzcyggJ2Vycm9yJyApICkgcmV0dXJuXG5cbiAgICAgICAgZm9ybUdyb3VwLnJlbW92ZUNsYXNzKCd2YWxpZCcpLmFkZENsYXNzKCdlcnJvcicpLmFwcGVuZCggdGhpcy50ZW1wbGF0ZXMuZmllbGRFcnJvciggeyBlcnJvcjogZXJyb3IgfSApIClcbiAgICB9LFxuXG4gICAgc2hvd1ZhbGlkKCAkZWwgKSB7XG4gICAgICAgICRlbC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZXJyb3InKS5hZGRDbGFzcygndmFsaWQnKVxuICAgICAgICAkZWwuc2libGluZ3MoJy5mZWVkYmFjaycpLnJlbW92ZSgpXG4gICAgfSxcblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoKVxuICAgICAgICAudGhlbiggcmVzdWx0ID0+IHJlc3VsdCA9PT0gZmFsc2UgPyBQcm9taXNlLnJlc29sdmUoIHsgaW52YWxpZDogdHJ1ZSB9ICkgOiB0aGlzLnBvc3RGb3JtKCkgKVxuICAgICAgICAuY2F0Y2goIHRoaXMuc29tZXRoaW5nV2VudFdyb25nIClcbiAgICB9LFxuXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2Zvcm0nKSxcblxuICAgIHRlbXBsYXRlczoge1xuICAgICAgICBmaWVsZEVycm9yOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9maWVsZEVycm9yJylcbiAgICB9LFxuXG4gICAgdmFsaWRhdGUoKSB7XG4gICAgICAgIHZhciB2YWxpZCA9IHRydWUsXG4gICAgICAgICAgICBwcm9taXNlcyA9IFsgXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKCBmaWVsZCA9PiB7XG4gICAgICAgICAgICB2YXIgJGVsID0gdGhpcy5lbHNbIGZpZWxkLm5hbWUgXSxcbiAgICAgICAgICAgICAgICBydiA9IGZpZWxkLnZhbGlkYXRlLmNhbGwoIHRoaXMsICRlbC52YWwoKSApXG4gICAgICAgICAgICBpZiggdHlwZW9mIHJ2ID09PSBcImJvb2xlYW5cIiApIHtcbiAgICAgICAgICAgICAgICBpZiggcnYgKSB7IHRoaXMuc2hvd1ZhbGlkKCRlbCkgfSBlbHNlIHsgdGhpcy5zaG93RXJyb3IoICRlbCwgZmllbGQuZXJyb3IgKTsgdmFsaWQgPSBmYWxzZSB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb21pc2VzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHJ2LnRoZW4oICgpID0+IFByb21pc2UucmVzb2x2ZSggdGhpcy5zaG93VmFsaWQoJGVsKSApIClcbiAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCggKCkgPT4geyB0aGlzLnNob3dFcnJvciggJGVsLCBmaWVsZC5lcnJvciApOyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCB2YWxpZCA9IGZhbHNlICkgfSApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHByb21pc2VzICkudGhlbiggKCkgPT4gdmFsaWQgKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgc2lnbm91dEJ0bjogeyBtZXRob2Q6ICdzaWdub3V0JyB9XG4gICAgfSxcblxuICAgIG9uVXNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIFxuICAgIHNpZ25vdXQoKSB7XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gJ3BhdGNod29ya2p3dD07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7JztcblxuICAgICAgICB0aGlzLnVzZXIuY2xlYXIoKVxuXG4gICAgICAgIHRoaXMuZW1pdCgnc2lnbm91dCcpXG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoIFwiL1wiLCB7IHRyaWdnZXI6IHRydWUgfSApXG4gICAgfVxuXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvbGlzdCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFZpZXdzOiB7XG4gICAgICAgIGZvcm06IHtcbiAgICAgICAgICAgIG9wdHM6IHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFsgeyAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZW1haWxSZWdleC50ZXN0KHZhbCkgfVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnUGFzc3dvcmRzIG11c3QgYmUgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzIGxvbmcuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gdmFsLmxlbmd0aCA+PSA2XG4gICAgICAgICAgICAgICAgICAgIH0gXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBldmVudHM6IHtcbiAgICAgICAgcmVnaXN0ZXJCdG46ICdjbGljaycsXG4gICAgICAgIGxvZ2luQnRuOiAnY2xpY2snXG4gICAgfSxcblxuICAgIGxvZ2luKCkgeyB0aGlzLmZvcm1JbnN0YW5jZS5zdWJtaXRGb3JtKCB7IHJlc291cmNlOiBcImF1dGhcIiB9ICkgfSxcblxuICAgIG9uU3VibWlzc2lvblJlc3BvbnNlKCByZXNwb25zZSApIHtcbiAgICAgICAgaWYoIE9iamVjdC5rZXlzKCByZXNwb25zZSApLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZXMuaW52YWxpZExvZ2luRXJyb3IsIGluc2VydGlvbjogeyAkZWw6IHRoaXMuZWxzLmNvbnRhaW5lciB9IH0gKVxuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJykuc2V0KCByZXNwb25zZSApXG4gICAgICAgIHRoaXMuZW1pdCggXCJsb2dnZWRJblwiIClcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICB9LFxuXG4gICAgb25SZWdpc3RlckJ0bkNsaWNrKCkge1xuXG4gICAgICAgIHRoaXMudmlld3MuZm9ybS5jbGVhcigpICAgICAgICBcblxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgaWYoIHRoaXMudmlld3MucmVnaXN0ZXIgKSByZXR1cm4gdGhpcy52aWV3cy5yZWdpc3Rlci5zaG93KClcbiAgICAgICAgICAgIHRoaXMudmlld3MucmVnaXN0ZXIgPVxuICAgICAgICAgICAgICAgIHRoaXMuZmFjdG9yeS5jcmVhdGUoICdyZWdpc3RlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy4kKCcjY29udGVudCcpIH0gfSB9IClcbiAgICAgICAgICAgICAgICAub24oICdjYW5jZWxsZWQnLCAoKSA9PiB0aGlzLnNob3coKSApXG4gICAgICAgIH0gKVxuICAgICAgICAuY2F0Y2goIHRoaXMuc29tZXRoaW5nV2VudFdyb25nIClcbiAgICB9XG5cbn0gKVxuIiwidmFyIE15VmlldyA9IGZ1bmN0aW9uKCBkYXRhICkgeyByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywgZGF0YSApLmluaXRpYWxpemUoKSB9XG5cbk9iamVjdC5hc3NpZ24oIE15Vmlldy5wcm90b3R5cGUsIHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAgIENvbGxlY3Rpb246IHJlcXVpcmUoJ2JhY2tib25lJykuQ29sbGVjdGlvbixcbiAgICBcbiAgICAvL0Vycm9yOiByZXF1aXJlKCcuLi9NeUVycm9yJyksXG5cbiAgICBNb2RlbDogcmVxdWlyZSgnYmFja2JvbmUnKS5Nb2RlbCxcblxuICAgIF86IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblxuICAgICQ6IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKSB7XG4gICAgICAgIHZhciB0eXBlO1xuXG4gICAgICAgIGlmKCAhIHRoaXMuZXZlbnRzWyBrZXkgXSApIHJldHVyblxuXG4gICAgICAgIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIHRoaXMuZXZlbnRzW2tleV0gKTtcblxuICAgICAgICBpZiggdHlwZSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudCgga2V5LCB0aGlzLmV2ZW50c1trZXldLCBlbCApO1xuICAgICAgICB9IGVsc2UgaWYoIHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XScgKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldLmZvckVhY2goIHNpbmdsZUV2ZW50ID0+IHRoaXMuYmluZEV2ZW50KCBrZXksIHNpbmdsZUV2ZW50LCBlbCApIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiggdGhpcy50ZW1wbGF0ZURhdGEgJiYgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyICkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkXCIpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9ybWF0OiB7XG4gICAgICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKVxuICAgIH0sXG5cbiAgICBnZXRGb3JtRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZm9ybURhdGEgPSB7IH1cblxuICAgICAgICB0aGlzLl8uZWFjaCggdGhpcy50ZW1wbGF0ZURhdGEsICggJGVsLCBuYW1lICkgPT4geyBpZiggJGVsLnByb3AoXCJ0YWdOYW1lXCIpID09PSBcIklOUFVUXCIgJiYgJGVsLnZhbCgpICkgdGhpcy5mb3JtRGF0YVtuYW1lXSA9ICRlbC52YWwoKSB9IClcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtRGF0YVxuICAgIH0sXG5cbiAgICBnZXRSb3V0ZXI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi4vcm91dGVyJykgfSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9uczogKCkgPT4gKHt9KSxcblxuICAgIC8qaGlkZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuUS5Qcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5oaWRlKClcbiAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9IClcbiAgICB9LCovXG5cbiAgICBpbml0aWFsaXplKCkge1xuXG4gICAgICAgIGlmKCAhIHRoaXMuY29udGFpbmVyICkgdGhpcy5jb250YWluZXIgPSB0aGlzLiQoJyNjb250ZW50JylcbiAgICAgICAgXG4gICAgICAgIHRoaXMucm91dGVyID0gdGhpcy5nZXRSb3V0ZXIoKVxuXG4gICAgICAgIC8vdGhpcy5tb2RhbFZpZXcgPSByZXF1aXJlKCcuL21vZGFsJylcblxuICAgICAgICB0aGlzLiQod2luZG93KS5yZXNpemUoIHRoaXMuXy50aHJvdHRsZSggKCkgPT4gdGhpcy5zaXplKCksIDUwMCApIClcblxuICAgICAgICBpZiggdGhpcy5yZXF1aXJlc0xvZ2luICYmICEgdGhpcy51c2VyLmlkICkge1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9Mb2dpbicpLnNob3coKS5vbmNlKCBcInN1Y2Nlc3NcIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIuaGVhZGVyLm9uVXNlciggdGhpcy51c2VyIClcblxuICAgICAgICAgICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzUm9sZSAmJiAoICEgdGhpcy5fKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpICkuY29udGFpbnMoIHRoaXMucmVxdWlyZXNSb2xlICkgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KCdZb3UgZG8gbm90IGhhdmUgYWNjZXNzJylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH0gZWxzZSBpZiggdGhpcy51c2VyLmlkICYmIHRoaXMucmVxdWlyZXNSb2xlICkge1xuICAgICAgICAgICAgaWYoICggISB0aGlzLl8oIHRoaXMudXNlci5nZXQoJ3JvbGVzJykgKS5jb250YWlucyggdGhpcy5yZXF1aXJlc1JvbGUgKSApICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgnWW91IGRvIG5vdCBoYXZlIGFjY2VzcycpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKVxuICAgIH0sXG5cbiAgICBpc0hpZGRlbjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyB9LFxuXG4gICAgXG4gICAgbW9tZW50OiByZXF1aXJlKCdtb21lbnQnKSxcblxuICAgIHBvc3RSZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgLy9ROiByZXF1aXJlKCdxJyksXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSgge1xuICAgICAgICAgICAgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUoIHRoaXMuZ2V0VGVtcGxhdGVPcHRpb25zKCkgKSxcbiAgICAgICAgICAgIGluc2VydGlvbjogeyAkZWw6IHRoaXMuaW5zZXJ0aW9uRWwgfHwgdGhpcy5jb250YWluZXIsIG1ldGhvZDogdGhpcy5pbnNlcnRpb25NZXRob2QgfSB9IClcblxuICAgICAgICB0aGlzLnNpemUoKVxuXG4gICAgICAgIHRoaXMucG9zdFJlbmRlcigpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5zdWJ2aWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4gXG4gICAgICAgICAgICB0aGlzLnN1YnZpZXdzWyBrZXkgXS5mb3JFYWNoKCBzdWJ2aWV3TWV0YSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpc1sgc3Vidmlld01ldGEubmFtZSBdID0gbmV3IHN1YnZpZXdNZXRhLnZpZXcoIHsgY29udGFpbmVyOiB0aGlzLnRlbXBsYXRlRGF0YVsga2V5IF0gfSApIH0gKSApXG4gICAgfSxcblxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuc2hvdygpXG4gICAgICAgIHRoaXMuc2l6ZSgpXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzbHVycEVsOiBmdW5jdGlvbiggZWwgKSB7XG5cbiAgICAgICAgdmFyIGtleSA9IGVsLmF0dHIoJ2RhdGEtanMnKTtcblxuICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YVsga2V5IF0gPSAoIHRoaXMudGVtcGxhdGVEYXRhLmhhc093blByb3BlcnR5KGtleSkgKVxuICAgICAgICAgICAgPyB0aGlzLnRlbXBsYXRlRGF0YVsga2V5IF0uYWRkKCBlbCApXG4gICAgICAgICAgICA6IGVsO1xuXG4gICAgICAgIGVsLnJlbW92ZUF0dHIoJ2RhdGEtanMnKTtcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGU6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG4gICAgICAgIHZhciAkaHRtbCA9IHRoaXMuJCggb3B0aW9ucy50ZW1wbGF0ZSApLFxuICAgICAgICAgICAgc2VsZWN0b3IgPSAnW2RhdGEtanNdJztcblxuICAgICAgICBpZiggdGhpcy50ZW1wbGF0ZURhdGEgPT09IHVuZGVmaW5lZCApIHRoaXMudGVtcGxhdGVEYXRhID0geyB9O1xuXG4gICAgICAgICRodG1sLmVhY2goICggaW5kZXgsIGVsICkgPT4ge1xuICAgICAgICAgICAgdmFyICRlbCA9IHRoaXMuJChlbCk7XG4gICAgICAgICAgICBpZiggJGVsLmlzKCBzZWxlY3RvciApICkgdGhpcy5zbHVycEVsKCAkZWwgKVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgJGh0bWwuZ2V0KCkuZm9yRWFjaCggKCBlbCApID0+IHsgdGhpcy4kKCBlbCApLmZpbmQoIHNlbGVjdG9yICkuZWFjaCggKCBpLCBlbFRvQmVTbHVycGVkICkgPT4gdGhpcy5zbHVycEVsKCB0aGlzLiQoZWxUb0JlU2x1cnBlZCkgKSApIH0gKVxuICAgICAgIFxuICAgICAgICBpZiggb3B0aW9ucyAmJiBvcHRpb25zLmluc2VydGlvbiApIG9wdGlvbnMuaW5zZXJ0aW9uLiRlbFsgKCBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgKSA/IG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCA6ICdhcHBlbmQnIF0oICRodG1sIClcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIFxuICAgIGJpbmRFdmVudDogZnVuY3Rpb24oIGVsZW1lbnRLZXksIGV2ZW50RGF0YSwgZWwgKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9ICggZWwgKSA/IGVsIDogdGhpcy50ZW1wbGF0ZURhdGFbIGVsZW1lbnRLZXkgXTtcblxuICAgICAgICBlbGVtZW50cy5vbiggZXZlbnREYXRhLmV2ZW50IHx8ICdjbGljaycsIGV2ZW50RGF0YS5zZWxlY3RvciwgZXZlbnREYXRhLm1ldGEsIHRoaXNbIGV2ZW50RGF0YS5tZXRob2QgXS5iaW5kKHRoaXMpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7fSxcblxuICAgIGlzTW91c2VPbkVsOiBmdW5jdGlvbiggZXZlbnQsIGVsICkge1xuXG4gICAgICAgIHZhciBlbE9mZnNldCA9IGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgZWxIZWlnaHQgPSBlbC5vdXRlckhlaWdodCggdHJ1ZSApLFxuICAgICAgICAgICAgZWxXaWR0aCA9IGVsLm91dGVyV2lkdGgoIHRydWUgKTtcblxuICAgICAgICBpZiggKCBldmVudC5wYWdlWCA8IGVsT2Zmc2V0LmxlZnQgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWCA+ICggZWxPZmZzZXQubGVmdCArIGVsV2lkdGggKSApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZIDwgZWxPZmZzZXQudG9wICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPiAoIGVsT2Zmc2V0LnRvcCArIGVsSGVpZ2h0ICkgKSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuICAgIFxuICAgIHNpemU6ICgpID0+IHsgdGhpcyB9LFxuXG4gICAgdXNlcjogcmVxdWlyZSgnLi4vbW9kZWxzL1VzZXInKSxcblxuICAgIHV0aWw6IHJlcXVpcmUoJ3V0aWwnKVxuXG59IClcblxubW9kdWxlLmV4cG9ydHMgPSBNeVZpZXdcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFZpZXdzOiB7XG4gICAgICAgIGZvcm06IHtcbiAgICAgICAgICAgIG9wdHM6IHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFsge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICdOYW1lIGlzIGEgcmVxdWlyZWQgZmllbGQuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdmFsLnRyaW0oKS5sZW5ndGggPiAwIH1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVtYWlsUmVnZXgudGVzdCh2YWwpIH1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnUGFzc3dvcmRzIG11c3QgYmUgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzIGxvbmcuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdmFsLnRyaW0oKS5sZW5ndGggPiA1IH1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdSZXBlYXQgUGFzc3dvcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3JlcGVhdFBhc3N3b3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnUGFzc3dvcmRzIG11c3QgbWF0Y2guJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbHMucGFzc3dvcmQudmFsKCkgPT09IHZhbCB9XG4gICAgICAgICAgICAgICAgICAgIH0gXVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICByZXNvdXJjZTogeyB2YWx1ZTogJ3BlcnNvbicgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uQ2FuY2VsQnRuQ2xpY2soKSB7XG5cbiAgICAgICAgdGhpcy52aWV3cy5mb3JtLmNsZWFyKClcblxuICAgICAgICB0aGlzLmhpZGUoKS50aGVuKCAoKSA9PiB0aGlzLmVtaXQoJ2NhbmNlbGxlZCcpIClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIGNhbmNlbEJ0bjogJ2NsaWNrJyxcbiAgICAgICAgcmVnaXN0ZXJCdG46ICdjbGljaydcbiAgICB9LFxuXG4gICAgb25SZWdpc3RlckJ0bkNsaWNrKCkge1xuICAgICAgICB0aGlzLnZpZXdzLmZvcm0uc3VibWl0KClcbiAgICAgICAgLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmKCByZXNwb25zZS5pbnZhbGlkICkgcmV0dXJuXG4gICAgICAgICAgICAvL3Nob3cgc3RhdGljLCBcInN1Y2Nlc3NcIiBtb2RhbCB0ZWxsaW5nIHRoZW0gdGhleSBjYW4gbG9naW4gb25jZSB0aGV5IGhhdmUgdmVyaWZpZWQgdGhlaXIgZW1haWxcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHcmVhdCBKb2InKVxuICAgICAgICB9IClcbiAgICAgICAgLmNhdGNoKCB0aGlzLnNvbWV0aGluZ1dlbnRXcm9uZyApXG4gICAgfVxuICAgIFxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHsgfSwgcmVxdWlyZSgnLi4vLi4vLi4vbGliL015T2JqZWN0JyksIHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAgIF86IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKSxcblxuICAgICQ6IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgQ29sbGVjdGlvbjogcmVxdWlyZSgnYmFja2JvbmUnKS5Db2xsZWN0aW9uLFxuICAgIFxuICAgIE1vZGVsOiByZXF1aXJlKCdiYWNrYm9uZScpLk1vZGVsLFxuXG4gICAgYmluZEV2ZW50KCBrZXksIGV2ZW50LCBzZWxlY3Rvcj0nJyApIHtcbiAgICAgICAgdGhpcy5lbHNba2V5XS5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGUgPT4gdGhpc1sgYG9uJHt0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlcihrZXkpfSR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoZXZlbnQpfWAgXSggZSApIClcbiAgICB9LFxuXG4gICAgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyOiBzdHJpbmcgPT4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpLFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuJCh3aW5kb3cpLnJlc2l6ZSggdGhpcy5fLnRocm90dGxlKCAoKSA9PiB0aGlzLnNpemUoKSwgNTAwICkgKVxuXG4gICAgICAgIGlmKCB0aGlzLnJlcXVpcmVzTG9naW4gJiYgIXRoaXMudXNlci5pZCApIHJldHVybiB0aGlzLmhhbmRsZUxvZ2luKClcblxuICAgICAgICBpZiggdGhpcy51c2VyICYmIHRoaXMudXNlci5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSAmJiAhdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSByZXR1cm4gdGhpcy5zaG93Tm9BY2Nlc3MoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIHsgZWxzOiB7IH0sIHNsdXJwOiB7IGF0dHI6ICdkYXRhLWpzJywgdmlldzogJ2RhdGEtdmlldycgfSwgdmlld3M6IHsgfSB9ICkucmVuZGVyKClcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHRoaXMuZXZlbnRzW2tleV1cblxuICAgICAgICBpZiggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHsgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSApIH1cbiAgICAgICAgZWxzZSBpZiggQXJyYXkuaXNBcnJheSggdGhpcy5ldmVudHNba2V5XSApICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbIGtleSBdLmZvckVhY2goIGV2ZW50T2JqID0+IHRoaXMuYmluZEV2ZW50KCBrZXksIGV2ZW50T2JqLmV2ZW50ICkgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XS5ldmVudCApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlKCBkdXJhdGlvbiApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlkZSggZHVyYXRpb24gKVxuICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbHNlLmNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZFwiKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBldmVudHM6IHt9LFxuXG4gICAgZ2V0VGVtcGxhdGVPcHRpb25zOiAoKSA9PiAoe30pLFxuXG4gICAgaGFuZGxlTG9naW4oKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yeS5jcmVhdGUoICdsb2dpbicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy4kKCcjY29udGVudCcpIH0gfSB9IClcbiAgICAgICAgICAgIC5vbmNlKCBcImxvZ2dlZEluXCIsICgpID0+IHRoaXMub25Mb2dpbigpIClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBoYXNQcml2aWxlZ2UoKSB7XG4gICAgICAgICggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpLmZpbmQoIHJvbGUgPT4gcm9sZSA9PT0gdGhpcy5yZXF1aXJlc1JvbGUgKSA9PT0gXCJ1bmRlZmluZWRcIiApICkgPyBmYWxzZSA6IHRydWVcbiAgICB9LFxuXG4gICAgaGlkZSggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB0aGlzLmVscy5jb250YWluZXIuaGlkZSggZHVyYXRpb24gfHwgMTAsIHJlc29sdmUgKSApXG4gICAgfSxcbiAgICBcbiAgICBpc0hpZGRlbigpIHsgcmV0dXJuIHRoaXMuZWxzLmNvbnRhaW5lci5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIH0sXG5cbiAgICBvbkxvZ2luKCkge1xuICAgICAgICB0aGlzLnJvdXRlci5oZWFkZXIub25Vc2VyKCB0aGlzLnVzZXIgKVxuXG4gICAgICAgIHRoaXNbICggdGhpcy5oYXNQcml2aWxlZ2VzKCkgKSA/ICdyZW5kZXInIDogJ3Nob3dOb0FjY2VzcycgXSgpXG4gICAgfSxcblxuICAgIHNob3dOb0FjY2VzcygpIHtcbiAgICAgICAgYWxlcnQoXCJObyBwcml2aWxlZ2VzLCBzb25cIilcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcG9zdFJlbmRlcigpIHsgcmV0dXJuIHRoaXMgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5zbHVycFRlbXBsYXRlKCB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksIGluc2VydGlvbjogdGhpcy5pbnNlcnRpb24gfSApXG5cbiAgICAgICAgaWYoIHRoaXMuc2l6ZSApIHRoaXMuc2l6ZSgpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3Vidmlld3MoKVxuICAgICAgICAgICAgICAgICAgIC5wb3N0UmVuZGVyKClcbiAgICB9LFxuXG4gICAgcmVuZGVyU3Vidmlld3MoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKCB0aGlzLlZpZXdzIHx8IFsgXSApLmZvckVhY2goIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggdGhpcy5WaWV3c1sga2V5IF0uZWwgKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9wdHMgPSB0aGlzLlZpZXdzWyBrZXkgXS5vcHRzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0cyA9ICggb3B0cyApXG4gICAgICAgICAgICAgICAgICAgID8gdHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gb3B0c1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBvcHRzKClcbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3c1sga2V5IF0gPSB0aGlzLmZhY3RvcnkuY3JlYXRlKCBrZXksIE9iamVjdC5hc3NpZ24oIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5WaWV3c1sga2V5IF0uZWwsIG1ldGhvZDogJ2JlZm9yZScgfSB9IH0sIG9wdHMgKSApXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sga2V5IF0uZWwucmVtb3ZlKClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyBrZXkgXS5lbCA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBzaG93KCBkdXJhdGlvbiApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+XG4gICAgICAgICAgICB0aGlzLmVscy5jb250YWluZXIuc2hvdyhcbiAgICAgICAgICAgICAgICBkdXJhdGlvbiB8fCAxMCxcbiAgICAgICAgICAgICAgICAoKSA9PiB7IGlmKCB0aGlzLnNpemUgKSB7IHRoaXMuc2l6ZSgpOyB9IHJlc29sdmUoKSB9XG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICB9LFxuXG4gICAgc2x1cnBFbCggZWwgKSB7XG4gICAgICAgIHZhciBrZXkgPSBlbC5hdHRyKCB0aGlzLnNsdXJwLmF0dHIgKSB8fCAnY29udGFpbmVyJ1xuXG4gICAgICAgIGlmKCBrZXkgPT09ICdjb250YWluZXInICkgZWwuYWRkQ2xhc3MoIHRoaXMubmFtZSApXG5cbiAgICAgICAgdGhpcy5lbHNbIGtleSBdID0gdGhpcy5lbHNbIGtleSBdID8gdGhpcy5lbHNbIGtleSBdLmFkZCggZWwgKSA6IGVsXG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cih0aGlzLnNsdXJwLmF0dHIpXG5cbiAgICAgICAgaWYoIHRoaXMuZXZlbnRzWyBrZXkgXSApIHRoaXMuZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKVxuICAgIH0sXG5cbiAgICBzbHVycFRlbXBsYXRlKCBvcHRpb25zICkge1xuXG4gICAgICAgIHZhciAkaHRtbCA9IHRoaXMuJCggb3B0aW9ucy50ZW1wbGF0ZSApLFxuICAgICAgICAgICAgc2VsZWN0b3IgPSBgWyR7dGhpcy5zbHVycC5hdHRyfV1gLFxuICAgICAgICAgICAgdmlld1NlbGVjdG9yID0gYFske3RoaXMuc2x1cnAudmlld31dYFxuXG4gICAgICAgICRodG1sLmVhY2goICggaSwgZWwgKSA9PiB7XG4gICAgICAgICAgICB2YXIgJGVsID0gdGhpcy4kKGVsKTtcbiAgICAgICAgICAgIGlmKCAkZWwuaXMoIHNlbGVjdG9yICkgfHwgaSA9PT0gMCApIHRoaXMuc2x1cnBFbCggJGVsIClcbiAgICAgICAgfSApXG5cbiAgICAgICAgJGh0bWwuZ2V0KCkuZm9yRWFjaCggKCBlbCApID0+IHtcbiAgICAgICAgICAgIHRoaXMuJCggZWwgKS5maW5kKCBzZWxlY3RvciApLmVhY2goICggdW5kZWZpbmVkLCBlbFRvQmVTbHVycGVkICkgPT4gdGhpcy5zbHVycEVsKCB0aGlzLiQoZWxUb0JlU2x1cnBlZCkgKSApXG4gICAgICAgICAgICB0aGlzLiQoIGVsICkuZmluZCggdmlld1NlbGVjdG9yICkuZWFjaCggKCB1bmRlZmluZWQsIHZpZXdFbCApID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgJGVsID0gdGhpcy4kKHZpZXdFbClcbiAgICAgICAgICAgICAgICB0aGlzLlZpZXdzWyAkZWwuYXR0cih0aGlzLnNsdXJwLnZpZXcpIF0uZWwgPSAkZWxcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICAgICBcbiAgICAgICAgb3B0aW9ucy5pbnNlcnRpb24uJGVsWyBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgfHwgJ2FwcGVuZCcgXSggJGh0bWwgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIGlzTW91c2VPbkVsKCBldmVudCwgZWwgKSB7XG5cbiAgICAgICAgdmFyIGVsT2Zmc2V0ID0gZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBlbEhlaWdodCA9IGVsLm91dGVySGVpZ2h0KCB0cnVlICksXG4gICAgICAgICAgICBlbFdpZHRoID0gZWwub3V0ZXJXaWR0aCggdHJ1ZSApXG5cbiAgICAgICAgaWYoICggZXZlbnQucGFnZVggPCBlbE9mZnNldC5sZWZ0ICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVggPiAoIGVsT2Zmc2V0LmxlZnQgKyBlbFdpZHRoICkgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA8IGVsT2Zmc2V0LnRvcCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZID4gKCBlbE9mZnNldC50b3AgKyBlbEhlaWdodCApICkgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcblxuICAgIHJlcXVpcmVzTG9naW46IGZhbHNlLFxuXG4gICAgc29tZXRoaW5nV2VudFdyb25nKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZyggZS5zdGFjayB8fCBlIClcbiAgICB9LFxuXG4gICAgLy9fX3RvRG86IGh0bWwucmVwbGFjZSgvPlxccys8L2csJz48Jylcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGBBZG1pbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+IGBcbjxkaXYgZGF0YS1qcz1cImNvbnRhaW5lclwiPlxuICAgIDxoMj5MaXN0czwvaDI+XG4gICAgPHA+T3JnYW5pemUgeW91ciBjb250ZW50IGludG8gbmVhdCBncm91cHMgd2l0aCBvdXIgbGlzdHMuPC9wPlxuICAgIDxkaXYgY2xhc3M9XCJleGFtcGxlXCIgZGF0YS12aWV3PVwibGlzdFwiPjwvZGl2PlxuICAgIDxoMj5Gb3JtczwvaDI+XG4gICAgPHA+T3VyIGZvcm1zIGFyZSBjdXN0b21pemFibGUgdG8gc3VpdCB0aGUgbmVlZHMgb2YgeW91ciBwcm9qZWN0LiBIZXJlLCBmb3IgZXhhbXBsZSwgYXJlIFxuICAgIExvZ2luIGFuZCBSZWdpc3RlciBmb3JtcywgZWFjaCB1c2luZyBkaWZmZXJlbnQgaW5wdXQgc3R5bGVzLjwvcD5cbiAgICA8ZGl2IGNsYXNzPVwiZXhhbXBsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5saW5lLXZpZXdcIj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwibG9naW5cIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtdmlld1wiPlxuICAgICAgICAgICAgPGRpdiBkYXRhLXZpZXc9XCJyZWdpc3RlclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAocCkgPT5cblxuYDxzcGFuIGNsYXNzPVwiZmVlZGJhY2tcIiBkYXRhLWpzPVwiZmllbGRFcnJvclwiPiR7IHAuZXJyb3IgfTwvc3Bhbj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBwICkgeyBcbiAgICByZXR1cm4gYDxmb3JtIGRhdGEtanM9XCJjb250YWluZXJcIj5cbiAgICAgICAgJHsgcC5maWVsZHMubWFwKCBmaWVsZCA9PlxuICAgICAgICBgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiIGZvcj1cIiR7IGZpZWxkLm5hbWUgfVwiPiR7IGZpZWxkLmxhYmVsIHx8IHRoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKCBmaWVsZC5uYW1lICkgfTwvbGFiZWw+XG4gICAgICAgICAgIDwkeyBmaWVsZC50YWcgfHwgJ2lucHV0J30gZGF0YS1qcz1cIiR7IGZpZWxkLm5hbWUgfVwiIGNsYXNzPVwiJHsgZmllbGQubmFtZSB9XCIgdHlwZT1cIiR7IGZpZWxkLnR5cGUgfHwgJ3RleHQnIH1cIiBwbGFjZWhvbGRlcj1cIiR7IGZpZWxkLnBsYWNlaG9sZGVyIHx8ICcnIH1cIj5cbiAgICAgICAgICAgICAgICAkeyAoZmllbGQudGFnID09PSAnc2VsZWN0JykgPyBmaWVsZC5vcHRpb25zLm1hcCggb3B0aW9uID0+XG4gICAgICAgICAgICAgICAgICAgIGA8b3B0aW9uPiR7IG9wdGlvbiB9PC9vcHRpb24+YCApLmpvaW4oJycpICsgYDwvc2VsZWN0PmAgOiBgYCB9XG4gICAgICAgIDwvZGl2PmAgKS5qb2luKCcnKSB9XG4gICAgPC9mb3JtPmBcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYDxkaXY+SGVhZGVyPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgPGRpdj5GdXR1cmUgRGF5czwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYDxkaXYgZGF0YS1qcz1cImludmFsaWRMb2dpbkVycm9yXCIgY2xhc3M9XCJmZWVkYmFja1wiPkludmFsaWQgQ3JlZGVudGlhbHM8L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggb3B0aW9ucyApID0+IGBcblxuPHVsIGNsYXNzPVwibGlzdFwiPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPmZvcjwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+dGhlPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5zYWtlPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5vZjwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+ZnV0dXJlPC9saT5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5kYXlzPC9saT5cbjwvdWw+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGBcbjxkaXY+XG4gICAgPGgxPkxvZ2luPC9oMT5cbiAgICA8ZGl2IGRhdGEtdmlldz1cImZvcm1cIj48L2Rpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJidXR0b25Sb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwicmVnaXN0ZXJCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5SZWdpc3RlcjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJsb2dpbkJ0blwiIGNsYXNzPVwiYnRuLWdob3N0XCIgdHlwZT1cImJ1dHRvblwiPkxvZyBJbjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHAgPT4gYFxuPGRpdj5cbiAgICA8aDE+UmVnaXN0ZXI8L2gxPlxuICAgIDxkaXYgZGF0YS12aWV3PVwiZm9ybVwiPjwvZGl2PlxuICAgIDxkaXYgZGF0YS1qcz1cImJ1dHRvblJvd1wiPlxuICAgICAgICA8YnV0dG9uIGRhdGEtanM9XCJjYW5jZWxCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwicmVnaXN0ZXJCdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5SZWdpc3RlcjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGVyciA9PiB7IGNvbnNvbGUubG9nKCBlcnIuc3RhY2sgfHwgZXJyICkgfVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBFcnJvcjogcmVxdWlyZSgnLi9NeUVycm9yJyksXG5cbiAgICBNb21lbnQ6IHJlcXVpcmUoJ21vbWVudCcpLFxuXG4gICAgUDogKCBmdW4sIGFyZ3MsIHRoaXNBcmcgKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiBSZWZsZWN0LmFwcGx5KCBmdW4sIHRoaXNBcmcsIGFyZ3MuY29uY2F0KCAoIGUsIC4uLmFyZ3MgKSA9PiBlID8gcmVqZWN0KGUpIDogcmVzb2x2ZShhcmdzKSApICkgKSxcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHsgcmV0dXJuIHRoaXMgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iXX0=
