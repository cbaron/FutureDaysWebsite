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
                oAjaxReq.open(data.method, "/" + data.resource, true);
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
        return Object.create(this.Request, { data: { value: data } }).constructor();
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

        return this._factory;
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

        Object.keys(this.els, function (key) {
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
            resource: 'person'
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


    //undelete disabled member -- error submitted modal
    //after notification is sent to ios, message does not show up in application until they relog --
    //broadcast image messages ( only some people getting message )
    //update prod
    //update rackspace

    submit: function submit() {
        var _this3 = this;

        return this.validate().then(function (result) {
            return result === false ? Promise.resolve({ invalid: true }) : _this3.postForm();
        });
    },


    template: require('./templates/form'),

    templates: {
        fieldError: require('./templates/fieldError')
    },

    validate: function validate() {
        var _this4 = this;

        var valid = true;

        return Promise.all(this.fields.map(function (field) {
            return new Promise(function (resolve, reject) {
                var result = field.validate.call(_this4, _this4.els[field.name].val());
                if (result === false) {
                    valid = false;
                    _this4.showError(_this4.els[field.name], field.error);
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
                _this9.size();resolve();
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
        //show general error Modal
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvanMvLlRlbXBsYXRlTWFwLmpzIiwiY2xpZW50L2pzLy5WaWV3TWFwLmpzIiwiY2xpZW50L2pzL1hoci5qcyIsImNsaWVudC9qcy9mYWN0b3J5L1ZpZXcuanMiLCJjbGllbnQvanMvbWFpbi5qcyIsImNsaWVudC9qcy9tb2RlbHMvVXNlci5qcyIsImNsaWVudC9qcy9yb3V0ZXIuanMiLCJjbGllbnQvanMvdmlld3MvQWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvRGVtby5qcyIsImNsaWVudC9qcy92aWV3cy9Gb3JtLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0hlYWRlci5qcyIsImNsaWVudC9qcy92aWV3cy9Ib21lLmpzIiwiY2xpZW50L2pzL3ZpZXdzL0xpc3QuanMiLCJjbGllbnQvanMvdmlld3MvTG9naW4uanMiLCJjbGllbnQvanMvdmlld3MvTXlWaWV3LmpzIiwiY2xpZW50L2pzL3ZpZXdzL1JlZ2lzdGVyLmpzIiwiY2xpZW50L2pzL3ZpZXdzL19fcHJvdG9fXy5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvYWRtaW4uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2RlbW8uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2ZpZWxkRXJyb3IuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2Zvcm0uanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2hlYWRlci5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvaG9tZS5qcyIsImNsaWVudC9qcy92aWV3cy90ZW1wbGF0ZXMvaW52YWxpZExvZ2luRXJyb3IuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xpc3QuanMiLCJjbGllbnQvanMvdmlld3MvdGVtcGxhdGVzL2xvZ2luLmpzIiwiY2xpZW50L2pzL3ZpZXdzL3RlbXBsYXRlcy9yZWdpc3Rlci5qcyIsImxpYi9NeUVycm9yLmpzIiwibGliL015T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLHlCQUFSLENBRE87QUFFZCxPQUFNLFFBQVEsd0JBQVIsQ0FGUTtBQUdkLGFBQVksUUFBUSw4QkFBUixDQUhFO0FBSWQsT0FBTSxRQUFRLHdCQUFSLENBSlE7QUFLZCxTQUFRLFFBQVEsMEJBQVIsQ0FMTTtBQU1kLE9BQU0sUUFBUSx3QkFBUixDQU5RO0FBT2Qsb0JBQW1CLFFBQVEscUNBQVIsQ0FQTDtBQVFkLE9BQU0sUUFBUSx3QkFBUixDQVJRO0FBU2QsUUFBTyxRQUFRLHlCQUFSLENBVE87QUFVZCxXQUFVLFFBQVEsNEJBQVI7QUFWSSxDQUFmOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFlO0FBQ2QsUUFBTyxRQUFRLGVBQVIsQ0FETztBQUVkLE9BQU0sUUFBUSxjQUFSLENBRlE7QUFHZCxPQUFNLFFBQVEsY0FBUixDQUhRO0FBSWQsU0FBUSxRQUFRLGdCQUFSLENBSk07QUFLZCxPQUFNLFFBQVEsY0FBUixDQUxRO0FBTWQsT0FBTSxRQUFRLGNBQVIsQ0FOUTtBQU9kLFFBQU8sUUFBUSxlQUFSLENBUE87QUFRZCxTQUFRLFFBQVEsZ0JBQVIsQ0FSTTtBQVNkLFdBQVUsUUFBUSxrQkFBUjtBQVRJLENBQWY7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sTUFBUCxDQUFlLE9BQU8sTUFBUCxDQUFlLEVBQWYsRUFBbUIsUUFBUSxvQkFBUixDQUFuQixFQUFrRDs7QUFFOUUsYUFBUztBQUVMLG1CQUZL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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdGFkbWluOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9hZG1pbicpLFxuXHRkZW1vOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9kZW1vJyksXG5cdGZpZWxkRXJyb3I6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2ZpZWxkRXJyb3InKSxcblx0Zm9ybTogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvZm9ybScpLFxuXHRoZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvdGVtcGxhdGVzL2hlYWRlcicpLFxuXHRob21lOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9ob21lJyksXG5cdGludmFsaWRMb2dpbkVycm9yOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9pbnZhbGlkTG9naW5FcnJvcicpLFxuXHRsaXN0OiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9saXN0JyksXG5cdGxvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL3RlbXBsYXRlcy9sb2dpbicpLFxuXHRyZWdpc3RlcjogcmVxdWlyZSgnLi92aWV3cy90ZW1wbGF0ZXMvcmVnaXN0ZXInKVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0QWRtaW46IHJlcXVpcmUoJy4vdmlld3MvQWRtaW4nKSxcblx0RGVtbzogcmVxdWlyZSgnLi92aWV3cy9EZW1vJyksXG5cdEZvcm06IHJlcXVpcmUoJy4vdmlld3MvRm9ybScpLFxuXHRIZWFkZXI6IHJlcXVpcmUoJy4vdmlld3MvSGVhZGVyJyksXG5cdEhvbWU6IHJlcXVpcmUoJy4vdmlld3MvSG9tZScpLFxuXHRMaXN0OiByZXF1aXJlKCcuL3ZpZXdzL0xpc3QnKSxcblx0TG9naW46IHJlcXVpcmUoJy4vdmlld3MvTG9naW4nKSxcblx0TXlWaWV3OiByZXF1aXJlKCcuL3ZpZXdzL015VmlldycpLFxuXHRSZWdpc3RlcjogcmVxdWlyZSgnLi92aWV3cy9SZWdpc3RlcicpXG59IiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi4vLi4vbGliL015T2JqZWN0JyksIHtcblxuICAgIFJlcXVlc3Q6IHtcblxuICAgICAgICBjb25zdHJ1Y3RvciggZGF0YSApIHtcbiAgICAgICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKSxcbiAgICAgICAgICAgICAgICByZXNvbHZlclxuXG4gICAgICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHRoaXMgKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAvKiB5b3UgY2FuIGdldCB0aGUgc2VyaWFsaXplZCBkYXRhIHRocm91Z2ggdGhlIFwic3VibWl0dGVkRGF0YVwiIGN1c3RvbSBwcm9wZXJ0eTogKi9cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLnN1Ym1pdHRlZERhdGEpKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlcigpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBkYXRhLm1ldGhvZCA9PT0gXCJnZXRcIiApIHtcbiAgICAgICAgICAgICAgcmVxLm9wZW4oIGRhdGEubWV0aG9kLCBgLyR7ZGF0YS5yZXNvdXJjZX0/JHtkYXRhLnFzfWAsIHRydWUgKVxuICAgICAgICAgICAgICByZXEuc2VuZChudWxsKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLyogbWV0aG9kIGlzIFBPU1QgKi9cbiAgICAgICAgICAgICAgb0FqYXhSZXEub3BlbiggZGF0YS5tZXRob2QsIGAvJHtkYXRhLnJlc291cmNlfWAsIHRydWUpXG4gICAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgJ3RleHQvcGxhaW4nIClcbiAgICAgICAgICAgICAgICByZXEuc2VuZCggZGF0YS5kYXRhIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHJlc29sdmVyID0gcmVzb2x2ZSApXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxhaW5Fc2NhcGUoIHNUZXh0ICkge1xuICAgICAgICAgICAgLyogaG93IHNob3VsZCBJIHRyZWF0IGEgdGV4dC9wbGFpbiBmb3JtIGVuY29kaW5nPyB3aGF0IGNoYXJhY3RlcnMgYXJlIG5vdCBhbGxvd2VkPyB0aGlzIGlzIHdoYXQgSSBzdXBwb3NlLi4uOiAqL1xuICAgICAgICAgICAgLyogXCI0XFwzXFw3IC0gRWluc3RlaW4gc2FpZCBFPW1jMlwiIC0tLS0+IFwiNFxcXFwzXFxcXDdcXCAtXFwgRWluc3RlaW5cXCBzYWlkXFwgRVxcPW1jMlwiICovXG4gICAgICAgICAgICByZXR1cm4gc1RleHQucmVwbGFjZSgvW1xcc1xcPVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBfZmFjdG9yeSggZGF0YSApIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoIHRoaXMuUmVxdWVzdCwgeyBkYXRhOiB7IHZhbHVlOiBkYXRhIH0gfSApLmNvbnN0cnVjdG9yKClcbiAgICB9LFxuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgaWYoICFYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZEFzQmluYXJ5ICkge1xuICAgICAgICAgIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kQXNCaW5hcnkgPSBmdW5jdGlvbihzRGF0YSkge1xuICAgICAgICAgICAgdmFyIG5CeXRlcyA9IHNEYXRhLmxlbmd0aCwgdWk4RGF0YSA9IG5ldyBVaW50OEFycmF5KG5CeXRlcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBuSWR4ID0gMDsgbklkeCA8IG5CeXRlczsgbklkeCsrKSB7XG4gICAgICAgICAgICAgIHVpOERhdGFbbklkeF0gPSBzRGF0YS5jaGFyQ29kZUF0KG5JZHgpICYgMHhmZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VuZCh1aThEYXRhKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnlcbiAgICB9XG5cbn0gKSwgeyB9ICkuY29uc3RydWN0b3IoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKCB7XG5cbiAgICBjcmVhdGUoIG5hbWUsIG9wdHMgKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgICAgICAgICAgdGhpcy5WaWV3c1sgbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSkgXSxcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oIHsgdGVtcGxhdGU6IHsgdmFsdWU6IHRoaXMuVGVtcGxhdGVzWyBuYW1lIF0gfSwgdXNlcjogeyB2YWx1ZTogdGhpcy5Vc2VyIH0sIGZhY3Rvcnk6IHsgdmFsdWU6IHRoaXMgfSwgbmFtZTogeyB2YWx1ZTogbmFtZSB9IH0sIG9wdHMgKVxuICAgICAgICApLmNvbnN0cnVjdG9yKClcbiAgICB9LFxuXG59LCB7XG4gICAgVGVtcGxhdGVzOiB7IHZhbHVlOiByZXF1aXJlKCcuLi8uVGVtcGxhdGVNYXAnKSB9LFxuICAgIFVzZXI6IHsgdmFsdWU6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyApIH0sXG4gICAgVmlld3M6IHsgdmFsdWU6IHJlcXVpcmUoJy4uLy5WaWV3TWFwJykgfVxufSApXG4iLCJyZXF1aXJlKCdqcXVlcnknKSggKCkgPT4ge1xuICAgIHJlcXVpcmUoJy4vcm91dGVyJylcbiAgICByZXF1aXJlKCdiYWNrYm9uZScpLmhpc3Rvcnkuc3RhcnQoIHsgcHVzaFN0YXRlOiB0cnVlIH0gKVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IG5ldyAoIHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwuZXh0ZW5kKCB7XG4gICAgZGVmYXVsdHM6IHsgc3RhdGU6IHt9IH0sXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5mZXRjaGVkID0gdGhpcy5mZXRjaCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICB1cmwoKSB7IHJldHVybiBcIi91c2VyXCIgfVxufSApICkoKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBuZXcgKFxuICAgIHJlcXVpcmUoJ2JhY2tib25lJykuUm91dGVyLmV4dGVuZCgge1xuXG4gICAgICAgICQ6IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgICAgIEVycm9yOiByZXF1aXJlKCcuLi8uLi9saWIvTXlFcnJvcicpLFxuICAgICAgICBcbiAgICAgICAgVXNlcjogcmVxdWlyZSgnLi9tb2RlbHMvVXNlcicpLFxuXG4gICAgICAgIFZpZXdGYWN0b3J5OiByZXF1aXJlKCcuL2ZhY3RvcnkvVmlldycpLFxuXG4gICAgICAgIGluaXRpYWxpemUoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudENvbnRhaW5lciA9IHRoaXMuJCgnI2NvbnRlbnQnKVxuXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiggdGhpcywge1xuICAgICAgICAgICAgICAgIHZpZXdzOiB7IH0sXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggJ2hlYWRlcicsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9LFxuXG4gICAgICAgIGdvSG9tZSgpIHsgdGhpcy5uYXZpZ2F0ZSggJ2hvbWUnLCB7IHRyaWdnZXI6IHRydWUgfSApIH0sXG5cbiAgICAgICAgaGFuZGxlciggcmVzb3VyY2UgKSB7XG5cbiAgICAgICAgICAgIGlmKCAhcmVzb3VyY2UgKSByZXR1cm4gdGhpcy5nb0hvbWUoKVxuXG4gICAgICAgICAgICB0aGlzLlVzZXIuZmV0Y2hlZC5kb25lKCAoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRlci5vblVzZXIoKVxuICAgICAgICAgICAgICAgICAgICAub24oICdzaWdub3V0JywgKCkgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbCggT2JqZWN0LmtleXMoIHRoaXMudmlld3MgKS5tYXAoIG5hbWUgPT4gdGhpcy52aWV3c1sgbmFtZSBdLmRlbGV0ZSgpICkgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oIHRoaXMuZ29Ib21lKCkgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoIE9iamVjdC5rZXlzKCB0aGlzLnZpZXdzICkubWFwKCB2aWV3ID0+IHRoaXMudmlld3NbIHZpZXcgXS5oaWRlKCkgKSApXG4gICAgICAgICAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMudmlld3NbIHJlc291cmNlIF0gKSByZXR1cm4gdGhpcy52aWV3c1sgcmVzb3VyY2UgXS5zaG93KClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3c1sgcmVzb3VyY2UgXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlZpZXdGYWN0b3J5LmNyZWF0ZSggcmVzb3VyY2UsIHsgaW5zZXJ0aW9uOiB7IHZhbHVlOiB7ICRlbDogdGhpcy5jb250ZW50Q29udGFpbmVyIH0gfSB9IClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oICdyb3V0ZScsIHJvdXRlID0+IHRoaXMubmF2aWdhdGUoIHJvdXRlLCB7IHRyaWdnZXI6IHRydWUgfSApIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAuY2F0Y2goIHRoaXMuRXJyb3IgKVxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ICkuZmFpbCggdGhpcy5FcnJvciApXG4gICAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICByb3V0ZXM6IHsgJygqcmVxdWVzdCknOiAnaGFuZGxlcicgfVxuXG4gICAgfSApXG4pKClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcbiAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbigge30sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFZpZXdzOiB7XG4gICAgICAgIGxpc3Q6IHsgfSxcbiAgICAgICAgbG9naW46IHsgfSxcbiAgICAgICAgcmVnaXN0ZXI6IHsgfVxuICAgIH0sXG5cbiAgICAvKmZpZWxkczogWyB7XG4gICAgICAgIGNsYXNzOiBcImZvcm0taW5wdXRcIixcbiAgICAgICAgbmFtZTogXCJlbWFpbFwiLFxuICAgICAgICBsYWJlbDogJ0VtYWlsJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBlcnJvcjogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZW1haWxSZWdleC50ZXN0KHZhbCkgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiZm9ybS1pbnB1dFwiLFxuICAgICAgICBob3Jpem9udGFsOiB0cnVlLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGxhYmVsOiAnUGFzc3dvcmQnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICBlcnJvcjogXCJQYXNzd29yZHMgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMgbG9uZy5cIixcbiAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiB2YWwubGVuZ3RoID49IDZcbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImlucHV0LWJvcmRlcmxlc3NcIixcbiAgICAgICAgbmFtZTogXCJhZGRyZXNzXCIsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiU3RyZWV0IEFkZHJlc3NcIixcbiAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQuXCIsXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy4kLnRyaW0odmFsKSAhPT0gJycgfVxuICAgIH0sIHtcbiAgICAgICAgY2xhc3M6IFwiaW5wdXQtZmxhdFwiLFxuICAgICAgICBuYW1lOiBcImNpdHlcIixcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJDaXR5XCIsXG4gICAgICAgIGVycm9yOiBcIlJlcXVpcmVkIGZpZWxkLlwiLFxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuJC50cmltKHZhbCkgIT09ICcnIH1cbiAgICB9LCB7XG4gICAgICAgIGNsYXNzOiBcImlucHV0LWJvcmRlcmxlc3NcIixcbiAgICAgICAgc2VsZWN0OiB0cnVlLFxuICAgICAgICBuYW1lOiBcImZhdmVcIixcbiAgICAgICAgbGFiZWw6IFwiRmF2ZSBDYW4gQWxidW1cIixcbiAgICAgICAgb3B0aW9uczogWyBcIk1vbnN0ZXIgTW92aWVcIiwgXCJTb3VuZHRyYWNrc1wiLCBcIlRhZ28gTWFnb1wiLCBcIkVnZSBCYW15YXNpXCIsIFwiRnV0dXJlIERheXNcIiBdLFxuICAgICAgICBlcnJvcjogXCJQbGVhc2UgY2hvb3NlIGFuIG9wdGlvbi5cIixcbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLiQudHJpbSh2YWwpICE9PSAnJyB9XG4gICAgfSBdLCovXG5cbiAgICBGb3JtOiByZXF1aXJlKCcuL0Zvcm0nKSxcbiAgICBMaXN0OiByZXF1aXJlKCcuL0xpc3QnKSxcbiAgICBMb2dpbjogcmVxdWlyZSgnLi9Mb2dpbicpLFxuICAgIFJlZ2lzdGVyOiByZXF1aXJlKCcuL1JlZ2lzdGVyJyksXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuICAgICAgICBcbiAgICAgICAgLy90aGlzLmxpc3RJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuTGlzdCwgeyBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLmxpc3QgfSB9ICkuY29uc3RydWN0b3IoKVxuXG4gICAgICAgIC8qdGhpcy5mb3JtSW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkZvcm0sIHsgXG4gICAgICAgICAgICBmaWVsZHM6IHsgdmFsdWU6IHRoaXMuZmllbGRzIH0sIFxuICAgICAgICAgICAgY29udGFpbmVyOiB7IHZhbHVlOiB0aGlzLmVscy5mb3JtIH1cbiAgICAgICAgfSApLmNvbnN0cnVjdG9yKCkqL1xuXG4gICAgICAgIC8qdGhpcy5sb2dpbkV4YW1wbGUgPSBPYmplY3QuY3JlYXRlKCB0aGlzLkxvZ2luLCB7IFxuICAgICAgICAgICAgY29udGFpbmVyOiB7IHZhbHVlOiB0aGlzLmVscy5sb2dpbkV4YW1wbGUgfSxcbiAgICAgICAgICAgIGNsYXNzOiB7IHZhbHVlOiAnaW5wdXQtYm9yZGVybGVzcycgfVxuICAgICAgICB9ICkuY29uc3RydWN0b3IoKVxuICAgICAgICAqL1xuICAgICAgICBcbiAgICAgICAgLyp0aGlzLnJlZ2lzdGVyRXhhbXBsZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMuUmVnaXN0ZXIsIHsgXG4gICAgICAgICAgICBjb250YWluZXI6IHsgdmFsdWU6IHRoaXMuZWxzLnJlZ2lzdGVyRXhhbXBsZSB9LFxuICAgICAgICAgICAgY2xhc3M6IHsgdmFsdWU6ICdmb3JtLWlucHV0JyB9LFxuICAgICAgICAgICAgaG9yaXpvbnRhbDogeyB2YWx1ZTogdHJ1ZSB9XG4gICAgICAgIH0gKS5jb25zdHJ1Y3RvcigpXG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvZ2luRXhhbXBsZS5lbHMucmVnaXN0ZXJCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgIHRoaXMubG9naW5FeGFtcGxlLmVscy5sb2dpbkJ0bi5vZmYoJ2NsaWNrJylcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXhhbXBsZS5lbHMuY2FuY2VsQnRuLm9mZignY2xpY2snKVxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXhhbXBsZS5lbHMucmVnaXN0ZXJCdG4ub2ZmKCdjbGljaycpXG4gICAgICAgICovXG5cbiAgICAgICAgLy90aGlzLmVsc2Uuc3VibWl0QnRuLm9uKCAnY2xpY2snLCAoKSA9PiB0aGlzLmZvcm1JbnN0YW5jZS5zdWJtaXRGb3JtKCB7IHJlc291cmNlOiAnJyB9ICkgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvZGVtbycpXG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4vX19wcm90b19fJyksIHtcblxuICAgIFhocjogcmVxdWlyZSgnLi4vWGhyJyksXG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5maWVsZHMuZm9yRWFjaCggZmllbGQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFcnJvciggdGhpcy5lbHNbIGZpZWxkLm5hbWUgXSApXG4gICAgICAgICAgICB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgnJylcbiAgICAgICAgfSApXG5cbiAgICAgICAgaWYoIHRoaXMuZWxzLmVycm9yICkgeyB0aGlzLmVscy5lcnJvci5yZW1vdmUoKTsgdGhpcy5lbHNlLmVycm9yID0gdW5kZWZpbmVkIH1cbiAgICB9LFxuXG4gICAgZW1haWxSZWdleDogL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLyxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9ucygpIHsgXG4gICAgICAgIHJldHVybiB7IGZpZWxkczogdGhpcy5maWVsZHMgfVxuICAgIH0sXG5cbiAgICBnZXRGb3JtRGF0YSgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7IH1cblxuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5lbHMsIGtleSA9PiB7XG4gICAgICAgICAgICBpZiggL0lOUFVUfFRFWFRBUkVBfFNFTEVDVC8udGVzdCggdGhpcy5lbHNbIGtleSBdLnByb3AoXCJ0YWdOYW1lXCIpICkgKSBkYXRhWyBrZXkgXSA9IHRoaXMuZWxzWyBrZXkgXS52YWwoKVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gZGF0YVxuICAgIH0sXG5cbiAgICBmaWVsZHM6IFsgXSxcblxuICAgIG9uRm9ybUZhaWwoIGVycm9yICkge1xuICAgICAgICBjb25zb2xlLmxvZyggZXJyb3Iuc3RhY2sgfHwgZXJyb3IgKTtcbiAgICAgICAgLy90aGlzLnNsdXJwVGVtcGxhdGUoIHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGVzLnNlcnZlckVycm9yKCBlcnJvciApLCBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmVscy5idXR0b25Sb3csIG1ldGhvZDogJ2JlZm9yZScgfSB9IClcbiAgICB9LFxuICAgIFxuICAgIHBvc3RGb3JtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5YaHIoIHtcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB0aGlzLmdldEZvcm1EYXRhKCkgKSxcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgcmVzb3VyY2U6ICdwZXJzb24nXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBwb3N0UmVuZGVyKCkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgICAgIHRoaXMuZWxzLmNvbnRhaW5lci5maW5kKCdpbnB1dCcpXG4gICAgICAgIC5vbiggJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkZWwgPSBzZWxmLiQodGhpcyksXG4gICAgICAgICAgICAgICAgZmllbGQgPSBzZWxmLl8oIHNlbGYuZmllbGRzICkuZmluZCggZnVuY3Rpb24oIGZpZWxkICkgeyByZXR1cm4gZmllbGQubmFtZSA9PT0gJGVsLmF0dHIoJ2lkJykgfSApXG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiByZXNvbHZlKCBmaWVsZC52YWxpZGF0ZS5jYWxsKCBzZWxmLCAkZWwudmFsKCkgKSApIClcbiAgICAgICAgICAgIC50aGVuKCB2YWxpZCA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIHZhbGlkICkgeyBzZWxmLnNob3dWYWxpZCggJGVsICkgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyBzZWxmLnNob3dFcnJvciggJGVsLCBmaWVsZC5lcnJvciApIH1cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICAgICAgLm9uKCAnZm9jdXMnLCBmdW5jdGlvbigpIHsgc2VsZi5yZW1vdmVFcnJvciggc2VsZi4kKHRoaXMpICkgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXJyb3IoICRlbCApIHtcbiAgICAgICAgJGVsLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdlcnJvciB2YWxpZCcpXG4gICAgICAgICRlbC5zaWJsaW5ncygnLmZlZWRiYWNrJykucmVtb3ZlKClcbiAgICB9LFxuXG4gICAgc2hvd0Vycm9yKCAkZWwsIGVycm9yICkge1xuXG4gICAgICAgIHZhciBmb3JtR3JvdXAgPSAkZWwucGFyZW50KClcblxuICAgICAgICBpZiggZm9ybUdyb3VwLmhhc0NsYXNzKCAnZXJyb3InICkgKSByZXR1cm5cblxuICAgICAgICBmb3JtR3JvdXAucmVtb3ZlQ2xhc3MoJ3ZhbGlkJykuYWRkQ2xhc3MoJ2Vycm9yJykuYXBwZW5kKCB0aGlzLnRlbXBsYXRlcy5maWVsZEVycm9yKCB7IGVycm9yOiBlcnJvciB9ICkgKVxuICAgIH0sXG5cbiAgICBzaG93VmFsaWQoICRlbCApIHtcbiAgICAgICAgJGVsLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmFkZENsYXNzKCd2YWxpZCcpXG4gICAgICAgICRlbC5zaWJsaW5ncygnLmZlZWRiYWNrJykucmVtb3ZlKClcbiAgICB9LFxuXG4gICAgLy91bmRlbGV0ZSBkaXNhYmxlZCBtZW1iZXIgLS0gZXJyb3Igc3VibWl0dGVkIG1vZGFsXG4gICAgLy9hZnRlciBub3RpZmljYXRpb24gaXMgc2VudCB0byBpb3MsIG1lc3NhZ2UgZG9lcyBub3Qgc2hvdyB1cCBpbiBhcHBsaWNhdGlvbiB1bnRpbCB0aGV5IHJlbG9nIC0tXG4gICAgLy9icm9hZGNhc3QgaW1hZ2UgbWVzc2FnZXMgKCBvbmx5IHNvbWUgcGVvcGxlIGdldHRpbmcgbWVzc2FnZSApXG4gICAgLy91cGRhdGUgcHJvZFxuICAgIC8vdXBkYXRlIHJhY2tzcGFjZVxuXG4gICAgc3VibWl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZSgpXG4gICAgICAgIC50aGVuKCByZXN1bHQgPT4gcmVzdWx0ID09PSBmYWxzZSA/IFByb21pc2UucmVzb2x2ZSggeyBpbnZhbGlkOiB0cnVlIH0gKSA6IHRoaXMucG9zdEZvcm0oKSApXG4gICAgfSxcblxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL3RlbXBsYXRlcy9mb3JtJyksXG5cbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgZmllbGRFcnJvcjogcmVxdWlyZSgnLi90ZW1wbGF0ZXMvZmllbGRFcnJvcicpXG4gICAgfSxcblxuICAgIHZhbGlkYXRlKCkge1xuICAgICAgICB2YXIgdmFsaWQgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIHRoaXMuZmllbGRzLm1hcCggZmllbGQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmllbGQudmFsaWRhdGUuY2FsbCh0aGlzLCB0aGlzLmVsc1sgZmllbGQubmFtZSBdLnZhbCgpICkgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCByZXN1bHQgPT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKCB0aGlzLmVsc1sgZmllbGQubmFtZSBdLCBmaWVsZC5lcnJvciApICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkgKVxuICAgICAgICAudGhlbiggKCkgPT4gdmFsaWQgKVxuICAgICAgICAuY2F0Y2goIGUgPT4geyBjb25zb2xlLmxvZyggZS5zdGFjayB8fCBlICk7IHJldHVybiBmYWxzZSB9IClcbiAgICB9XG5cbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7fSwgcmVxdWlyZSgnLi9fX3Byb3RvX18nKSwge1xuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIHNpZ25vdXRCdG46IHsgbWV0aG9kOiAnc2lnbm91dCcgfVxuICAgIH0sXG5cbiAgICBvblVzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBcbiAgICBzaWdub3V0KCkge1xuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9ICdwYXRjaHdvcmtqd3Q9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UOyc7XG5cbiAgICAgICAgdGhpcy51c2VyLmNsZWFyKClcblxuICAgICAgICB0aGlzLmVtaXQoJ3NpZ25vdXQnKVxuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKCBcIi9cIiwgeyB0cmlnZ2VyOiB0cnVlIH0gKVxuICAgIH1cblxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiggeyB9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2xpc3QnKVxufSApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBWaWV3czoge1xuICAgICAgICBmb3JtOiB7XG4gICAgICAgICAgICBvcHRzOiB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBbIHsgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCB2YWwgKSB7IHJldHVybiB0aGlzLmVtYWlsUmVnZXgudGVzdCh2YWwpIH1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ1Bhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogdmFsID0+IHZhbC5sZW5ndGggPj0gNlxuICAgICAgICAgICAgICAgICAgICB9IF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgIHJlZ2lzdGVyQnRuOiAnY2xpY2snLFxuICAgICAgICBsb2dpbkJ0bjogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICBsb2dpbigpIHsgdGhpcy5mb3JtSW5zdGFuY2Uuc3VibWl0Rm9ybSggeyByZXNvdXJjZTogXCJhdXRoXCIgfSApIH0sXG5cbiAgICBvblN1Ym1pc3Npb25SZXNwb25zZSggcmVzcG9uc2UgKSB7XG4gICAgICAgIGlmKCBPYmplY3Qua2V5cyggcmVzcG9uc2UgKS5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAvL3JldHVybiB0aGlzLnNsdXJwVGVtcGxhdGUoIHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGVzLmludmFsaWRMb2dpbkVycm9yLCBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmVscy5jb250YWluZXIgfSB9IClcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXF1aXJlKCcuLi9tb2RlbHMvVXNlcicpLnNldCggcmVzcG9uc2UgKVxuICAgICAgICB0aGlzLmVtaXQoIFwibG9nZ2VkSW5cIiApXG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgfSxcblxuICAgIG9uUmVnaXN0ZXJCdG5DbGljaygpIHtcblxuICAgICAgICB0aGlzLnZpZXdzLmZvcm0uY2xlYXIoKSAgICAgICAgXG5cbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIGlmKCB0aGlzLnZpZXdzLnJlZ2lzdGVyICkgcmV0dXJuIHRoaXMudmlld3MucmVnaXN0ZXIuc2hvdygpXG4gICAgICAgICAgICB0aGlzLnZpZXdzLnJlZ2lzdGVyID1cbiAgICAgICAgICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAncmVnaXN0ZXInLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuJCgnI2NvbnRlbnQnKSB9IH0gfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnY2FuY2VsbGVkJywgKCkgPT4gdGhpcy5zaG93KCkgKVxuICAgICAgICB9IClcbiAgICAgICAgLmNhdGNoKCB0aGlzLnNvbWV0aGluZ1dlbnRXcm9uZyApXG4gICAgfVxuXG59IClcbiIsInZhciBNeVZpZXcgPSBmdW5jdGlvbiggZGF0YSApIHsgcmV0dXJuIE9iamVjdC5hc3NpZ24oIHRoaXMsIGRhdGEgKS5pbml0aWFsaXplKCkgfVxuXG5PYmplY3QuYXNzaWduKCBNeVZpZXcucHJvdG90eXBlLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBDb2xsZWN0aW9uOiByZXF1aXJlKCdiYWNrYm9uZScpLkNvbGxlY3Rpb24sXG4gICAgXG4gICAgLy9FcnJvcjogcmVxdWlyZSgnLi4vTXlFcnJvcicpLFxuXG4gICAgTW9kZWw6IHJlcXVpcmUoJ2JhY2tib25lJykuTW9kZWwsXG5cbiAgICBfOiByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cbiAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZTtcblxuICAgICAgICBpZiggISB0aGlzLmV2ZW50c1sga2V5IF0gKSByZXR1cm5cblxuICAgICAgICB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB0aGlzLmV2ZW50c1trZXldICk7XG5cbiAgICAgICAgaWYoIHR5cGUgPT09ICdbb2JqZWN0IE9iamVjdF0nICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQoIGtleSwgdGhpcy5ldmVudHNba2V5XSwgZWwgKTtcbiAgICAgICAgfSBlbHNlIGlmKCB0eXBlID09PSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNba2V5XS5mb3JFYWNoKCBzaW5nbGVFdmVudCA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBzaW5nbGVFdmVudCwgZWwgKSApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhICYmIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lciApIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVEYXRhLmNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy5lbWl0KFwicmVtb3ZlZFwiKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGZvcm1hdDoge1xuICAgICAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXI6IHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcbiAgICB9LFxuXG4gICAgZ2V0Rm9ybURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmZvcm1EYXRhID0geyB9XG5cbiAgICAgICAgdGhpcy5fLmVhY2goIHRoaXMudGVtcGxhdGVEYXRhLCAoICRlbCwgbmFtZSApID0+IHsgaWYoICRlbC5wcm9wKFwidGFnTmFtZVwiKSA9PT0gXCJJTlBVVFwiICYmICRlbC52YWwoKSApIHRoaXMuZm9ybURhdGFbbmFtZV0gPSAkZWwudmFsKCkgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybURhdGFcbiAgICB9LFxuXG4gICAgZ2V0Um91dGVyOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4uL3JvdXRlcicpIH0sXG5cbiAgICBnZXRUZW1wbGF0ZU9wdGlvbnM6ICgpID0+ICh7fSksXG5cbiAgICAvKmhpZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLlEuUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlRGF0YS5jb250YWluZXIuaGlkZSgpXG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSwqL1xuXG4gICAgaW5pdGlhbGl6ZSgpIHtcblxuICAgICAgICBpZiggISB0aGlzLmNvbnRhaW5lciApIHRoaXMuY29udGFpbmVyID0gdGhpcy4kKCcjY29udGVudCcpXG4gICAgICAgIFxuICAgICAgICB0aGlzLnJvdXRlciA9IHRoaXMuZ2V0Um91dGVyKClcblxuICAgICAgICAvL3RoaXMubW9kYWxWaWV3ID0gcmVxdWlyZSgnLi9tb2RhbCcpXG5cbiAgICAgICAgdGhpcy4kKHdpbmRvdykucmVzaXplKCB0aGlzLl8udGhyb3R0bGUoICgpID0+IHRoaXMuc2l6ZSgpLCA1MDAgKSApXG5cbiAgICAgICAgaWYoIHRoaXMucmVxdWlyZXNMb2dpbiAmJiAhIHRoaXMudXNlci5pZCApIHtcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vTG9naW4nKS5zaG93KCkub25jZSggXCJzdWNjZXNzXCIsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLmhlYWRlci5vblVzZXIoIHRoaXMudXNlciApXG5cbiAgICAgICAgICAgICAgICBpZiggdGhpcy5yZXF1aXJlc1JvbGUgJiYgKCAhIHRoaXMuXyggdGhpcy51c2VyLmdldCgncm9sZXMnKSApLmNvbnRhaW5zKCB0aGlzLnJlcXVpcmVzUm9sZSApICkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGVydCgnWW91IGRvIG5vdCBoYXZlIGFjY2VzcycpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICB9IGVsc2UgaWYoIHRoaXMudXNlci5pZCAmJiB0aGlzLnJlcXVpcmVzUm9sZSApIHtcbiAgICAgICAgICAgIGlmKCAoICEgdGhpcy5fKCB0aGlzLnVzZXIuZ2V0KCdyb2xlcycpICkuY29udGFpbnMoIHRoaXMucmVxdWlyZXNSb2xlICkgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoJ1lvdSBkbyBub3QgaGF2ZSBhY2Nlc3MnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKClcbiAgICB9LFxuXG4gICAgaXNIaWRkZW46IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgfSxcblxuICAgIFxuICAgIG1vbWVudDogcmVxdWlyZSgnbW9tZW50JyksXG5cbiAgICBwb3N0UmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJTdWJ2aWV3cygpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIC8vUTogcmVxdWlyZSgncScpLFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNsdXJwVGVtcGxhdGUoIHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlKCB0aGlzLmdldFRlbXBsYXRlT3B0aW9ucygpICksXG4gICAgICAgICAgICBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmluc2VydGlvbkVsIHx8IHRoaXMuY29udGFpbmVyLCBtZXRob2Q6IHRoaXMuaW5zZXJ0aW9uTWV0aG9kIH0gfSApXG5cbiAgICAgICAgdGhpcy5zaXplKClcblxuICAgICAgICB0aGlzLnBvc3RSZW5kZXIoKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoIHRoaXMuc3Vidmlld3MgfHwgWyBdICkuZm9yRWFjaCgga2V5ID0+IFxuICAgICAgICAgICAgdGhpcy5zdWJ2aWV3c1sga2V5IF0uZm9yRWFjaCggc3Vidmlld01ldGEgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXNbIHN1YnZpZXdNZXRhLm5hbWUgXSA9IG5ldyBzdWJ2aWV3TWV0YS52aWV3KCB7IGNvbnRhaW5lcjogdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdIH0gKSB9ICkgKVxuICAgIH0sXG5cbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGEuY29udGFpbmVyLnNob3coKVxuICAgICAgICB0aGlzLnNpemUoKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgc2x1cnBFbDogZnVuY3Rpb24oIGVsICkge1xuXG4gICAgICAgIHZhciBrZXkgPSBlbC5hdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdID0gKCB0aGlzLnRlbXBsYXRlRGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpIClcbiAgICAgICAgICAgID8gdGhpcy50ZW1wbGF0ZURhdGFbIGtleSBdLmFkZCggZWwgKVxuICAgICAgICAgICAgOiBlbDtcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKCdkYXRhLWpzJyk7XG5cbiAgICAgICAgaWYoIHRoaXMuZXZlbnRzWyBrZXkgXSApIHRoaXMuZGVsZWdhdGVFdmVudHMoIGtleSwgZWwgKVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBzbHVycFRlbXBsYXRlOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblxuICAgICAgICB2YXIgJGh0bWwgPSB0aGlzLiQoIG9wdGlvbnMudGVtcGxhdGUgKSxcbiAgICAgICAgICAgIHNlbGVjdG9yID0gJ1tkYXRhLWpzXSc7XG5cbiAgICAgICAgaWYoIHRoaXMudGVtcGxhdGVEYXRhID09PSB1bmRlZmluZWQgKSB0aGlzLnRlbXBsYXRlRGF0YSA9IHsgfTtcblxuICAgICAgICAkaHRtbC5lYWNoKCAoIGluZGV4LCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSApIHRoaXMuc2x1cnBFbCggJGVsIClcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRodG1sLmdldCgpLmZvckVhY2goICggZWwgKSA9PiB7IHRoaXMuJCggZWwgKS5maW5kKCBzZWxlY3RvciApLmVhY2goICggaSwgZWxUb0JlU2x1cnBlZCApID0+IHRoaXMuc2x1cnBFbCggdGhpcy4kKGVsVG9CZVNsdXJwZWQpICkgKSB9IClcbiAgICAgICBcbiAgICAgICAgaWYoIG9wdGlvbnMgJiYgb3B0aW9ucy5pbnNlcnRpb24gKSBvcHRpb25zLmluc2VydGlvbi4kZWxbICggb3B0aW9ucy5pbnNlcnRpb24ubWV0aG9kICkgPyBvcHRpb25zLmluc2VydGlvbi5tZXRob2QgOiAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBcbiAgICBiaW5kRXZlbnQ6IGZ1bmN0aW9uKCBlbGVtZW50S2V5LCBldmVudERhdGEsIGVsICkge1xuICAgICAgICB2YXIgZWxlbWVudHMgPSAoIGVsICkgPyBlbCA6IHRoaXMudGVtcGxhdGVEYXRhWyBlbGVtZW50S2V5IF07XG5cbiAgICAgICAgZWxlbWVudHMub24oIGV2ZW50RGF0YS5ldmVudCB8fCAnY2xpY2snLCBldmVudERhdGEuc2VsZWN0b3IsIGV2ZW50RGF0YS5tZXRhLCB0aGlzWyBldmVudERhdGEubWV0aG9kIF0uYmluZCh0aGlzKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge30sXG5cbiAgICBpc01vdXNlT25FbDogZnVuY3Rpb24oIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlICk7XG5cbiAgICAgICAgaWYoICggZXZlbnQucGFnZVggPCBlbE9mZnNldC5sZWZ0ICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVggPiAoIGVsT2Zmc2V0LmxlZnQgKyBlbFdpZHRoICkgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWSA8IGVsT2Zmc2V0LnRvcCApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZID4gKCBlbE9mZnNldC50b3AgKyBlbEhlaWdodCApICkgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICByZXF1aXJlc0xvZ2luOiBmYWxzZSxcbiAgICBcbiAgICBzaXplOiAoKSA9PiB7IHRoaXMgfSxcblxuICAgIHVzZXI6IHJlcXVpcmUoJy4uL21vZGVscy9Vc2VyJyksXG5cbiAgICB1dGlsOiByZXF1aXJlKCd1dGlsJylcblxufSApXG5cbm1vZHVsZS5leHBvcnRzID0gTXlWaWV3XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oIHt9LCByZXF1aXJlKCcuL19fcHJvdG9fXycpLCB7XG5cbiAgICBWaWV3czoge1xuICAgICAgICBmb3JtOiB7XG4gICAgICAgICAgICBvcHRzOiB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBbIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAnTmFtZSBpcyBhIHJlcXVpcmVkIGZpZWxkLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHZhbC50cmltKCkubGVuZ3RoID4gMCB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggdmFsICkgeyByZXR1cm4gdGhpcy5lbWFpbFJlZ2V4LnRlc3QodmFsKSB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ1Bhc3N3b3JkcyBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycyBsb25nLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHZhbC50cmltKCkubGVuZ3RoID4gNSB9XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnUmVwZWF0IFBhc3N3b3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdyZXBlYXRQYXNzd29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ1Bhc3N3b3JkcyBtdXN0IG1hdGNoLicsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24oIHZhbCApIHsgcmV0dXJuIHRoaXMuZWxzLnBhc3N3b3JkLnZhbCgpID09PSB2YWwgfVxuICAgICAgICAgICAgICAgICAgICB9IF1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcmVzb3VyY2U6IHsgdmFsdWU6ICdwZXJzb24nIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNhbmNlbEJ0bkNsaWNrKCkge1xuXG4gICAgICAgIHRoaXMudmlld3MuZm9ybS5jbGVhcigpXG5cbiAgICAgICAgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5lbWl0KCdjYW5jZWxsZWQnKSApXG4gICAgfSxcblxuICAgIGV2ZW50czoge1xuICAgICAgICBjYW5jZWxCdG46ICdjbGljaycsXG4gICAgICAgIHJlZ2lzdGVyQnRuOiAnY2xpY2snXG4gICAgfSxcblxuICAgIG9uU3VibWlzc2lvblJlc3BvbnNlOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cbiAgICAgICAgaWYgKCByZXNwb25zZS5zdWNjZXNzID09PSBmYWxzZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNsdXJwVGVtcGxhdGUoIHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGVzLmludmFsaWRMb2dpbkVycm9yKCByZXNwb25zZSApLCBpbnNlcnRpb246IHsgJGVsOiB0aGlzLmVscy5idXR0b25Sb3csIG1ldGhvZDogJ2JlZm9yZScgfSB9IClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlci5zZXQoIHJlc3BvbnNlLnJlc3VsdC5tZW1iZXIgKVxuXG4gICAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goIGZpZWxkID0+IHRoaXMuZWxzWyBmaWVsZC5uYW1lIF0udmFsKCcnKSApXG5cbiAgICAgICAgdGhpcy5oaWRlKCkudGhlbiggKCkgPT4gdGhpcy5sb2dpbkluc3RhbmNlLmVtaXQoIFwibG9nZ2VkSW5cIiApIClcbiAgICAgICAgXG4gICAgfSxcblxuICAgIG9uUmVnaXN0ZXJCdG5DbGljaygpIHtcbiAgICAgICAgdGhpcy52aWV3cy5mb3JtLnN1Ym1pdCgpXG4gICAgICAgIC50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiggcmVzcG9uc2UuaW52YWxpZCApIHJldHVyblxuICAgICAgICAgICAgLy9zaG93IHN0YXRpYywgXCJzdWNjZXNzXCIgbW9kYWwgdGVsbGluZyB0aGVtIHRoZXkgY2FuIGxvZ2luIG9uY2UgdGhleSBoYXZlIHZlcmlmaWVkIHRoZWlyIGVtYWlsXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR3JlYXQgSm9iJylcbiAgICAgICAgfSApXG4gICAgICAgIC5jYXRjaCggdGhpcy5zb21ldGhpbmdXZW50V3JvbmcgKVxuICAgIH1cbiAgICBcbn0gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKCB7IH0sIHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9NeU9iamVjdCcpLCByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgICBfOiByZXF1aXJlKCd1bmRlcnNjb3JlJyksXG5cbiAgICAkOiByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIENvbGxlY3Rpb246IHJlcXVpcmUoJ2JhY2tib25lJykuQ29sbGVjdGlvbixcbiAgICBcbiAgICBNb2RlbDogcmVxdWlyZSgnYmFja2JvbmUnKS5Nb2RlbCxcblxuICAgIGJpbmRFdmVudCgga2V5LCBldmVudCwgc2VsZWN0b3I9JycgKSB7XG4gICAgICAgIHRoaXMuZWxzW2tleV0ub24oICdjbGljaycsIHNlbGVjdG9yLCBlID0+IHRoaXNbIGBvbiR7dGhpcy5jYXBpdGFsaXplRmlyc3RMZXR0ZXIoa2V5KX0ke3RoaXMuY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGV2ZW50KX1gIF0oIGUgKSApXG4gICAgfSxcblxuICAgIGNhcGl0YWxpemVGaXJzdExldHRlcjogc3RyaW5nID0+IHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKSxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLiQod2luZG93KS5yZXNpemUoIHRoaXMuXy50aHJvdHRsZSggKCkgPT4gdGhpcy5zaXplKCksIDUwMCApIClcblxuICAgICAgICBpZiggdGhpcy5yZXF1aXJlc0xvZ2luICYmICF0aGlzLnVzZXIuaWQgKSByZXR1cm4gdGhpcy5oYW5kbGVMb2dpbigpXG5cbiAgICAgICAgaWYoIHRoaXMudXNlciAmJiB0aGlzLnVzZXIuaWQgJiYgdGhpcy5yZXF1aXJlc1JvbGUgJiYgIXRoaXMuaGFzUHJpdmlsZWdlcygpICkgcmV0dXJuIHRoaXMuc2hvd05vQWNjZXNzKClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKCB0aGlzLCB7IGVsczogeyB9LCBzbHVycDogeyBhdHRyOiAnZGF0YS1qcycsIHZpZXc6ICdkYXRhLXZpZXcnIH0sIHZpZXdzOiB7IH0gfSApLnJlbmRlcigpXG4gICAgfSxcblxuICAgIGRlbGVnYXRlRXZlbnRzKCBrZXksIGVsICkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiB0aGlzLmV2ZW50c1trZXldXG5cbiAgICAgICAgaWYoIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7IHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0gKSB9XG4gICAgICAgIGVsc2UgaWYoIEFycmF5LmlzQXJyYXkoIHRoaXMuZXZlbnRzW2tleV0gKSApIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzWyBrZXkgXS5mb3JFYWNoKCBldmVudE9iaiA9PiB0aGlzLmJpbmRFdmVudCgga2V5LCBldmVudE9iai5ldmVudCApIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KCBrZXksIHRoaXMuZXZlbnRzW2tleV0uZXZlbnQgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlbGV0ZSggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoIGR1cmF0aW9uIClcbiAgICAgICAgLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxzZS5jb250YWluZXIucmVtb3ZlKClcbiAgICAgICAgICAgIHRoaXMuZW1pdChcInJlbW92ZWRcIilcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZXZlbnRzOiB7fSxcblxuICAgIGdldFRlbXBsYXRlT3B0aW9uczogKCkgPT4gKHt9KSxcblxuICAgIGhhbmRsZUxvZ2luKCkge1xuICAgICAgICB0aGlzLmZhY3RvcnkuY3JlYXRlKCAnbG9naW4nLCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuJCgnI2NvbnRlbnQnKSB9IH0gfSApXG4gICAgICAgICAgICAub25jZSggXCJsb2dnZWRJblwiLCAoKSA9PiB0aGlzLm9uTG9naW4oKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaGFzUHJpdmlsZWdlKCkge1xuICAgICAgICAoIHRoaXMucmVxdWlyZXNSb2xlICYmICggdGhpcy51c2VyLmdldCgncm9sZXMnKS5maW5kKCByb2xlID0+IHJvbGUgPT09IHRoaXMucmVxdWlyZXNSb2xlICkgPT09IFwidW5kZWZpbmVkXCIgKSApID8gZmFsc2UgOiB0cnVlXG4gICAgfSxcblxuICAgIGhpZGUoIGR1cmF0aW9uICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4gdGhpcy5lbHMuY29udGFpbmVyLmhpZGUoIGR1cmF0aW9uIHx8IDEwLCByZXNvbHZlICkgKVxuICAgIH0sXG4gICAgXG4gICAgaXNIaWRkZW4oKSB7IHJldHVybiB0aGlzLmVscy5jb250YWluZXIuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJyB9LFxuXG4gICAgb25Mb2dpbigpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIuaGVhZGVyLm9uVXNlciggdGhpcy51c2VyIClcblxuICAgICAgICB0aGlzWyAoIHRoaXMuaGFzUHJpdmlsZWdlcygpICkgPyAncmVuZGVyJyA6ICdzaG93Tm9BY2Nlc3MnIF0oKVxuICAgIH0sXG5cbiAgICBzaG93Tm9BY2Nlc3MoKSB7XG4gICAgICAgIGFsZXJ0KFwiTm8gcHJpdmlsZWdlcywgc29uXCIpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcblxuICAgIHBvc3RSZW5kZXIoKSB7IHJldHVybiB0aGlzIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc2x1cnBUZW1wbGF0ZSggeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSggdGhpcy5nZXRUZW1wbGF0ZU9wdGlvbnMoKSApLCBpbnNlcnRpb246IHRoaXMuaW5zZXJ0aW9uIH0gKVxuXG4gICAgICAgIGlmKCB0aGlzLnNpemUgKSB0aGlzLnNpemUoKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1YnZpZXdzKClcbiAgICAgICAgICAgICAgICAgICAucG9zdFJlbmRlcigpXG4gICAgfSxcblxuICAgIHJlbmRlclN1YnZpZXdzKCkge1xuICAgICAgICBPYmplY3Qua2V5cyggdGhpcy5WaWV3cyB8fCBbIF0gKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgICAgICAgaWYoIHRoaXMuVmlld3NbIGtleSBdLmVsICkge1xuICAgICAgICAgICAgICAgIGxldCBvcHRzID0gdGhpcy5WaWV3c1sga2V5IF0ub3B0c1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG9wdHMgPSAoIG9wdHMgKVxuICAgICAgICAgICAgICAgICAgICA/IHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG9wdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIDogb3B0cygpXG4gICAgICAgICAgICAgICAgICAgIDoge31cblxuICAgICAgICAgICAgICAgIHRoaXMudmlld3NbIGtleSBdID0gdGhpcy5mYWN0b3J5LmNyZWF0ZSgga2V5LCBPYmplY3QuYXNzaWduKCB7IGluc2VydGlvbjogeyB2YWx1ZTogeyAkZWw6IHRoaXMuVmlld3NbIGtleSBdLmVsLCBtZXRob2Q6ICdiZWZvcmUnIH0gfSB9LCBvcHRzICkgKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbIGtleSBdLmVsLnJlbW92ZSgpXG4gICAgICAgICAgICAgICAgdGhpcy5WaWV3c1sga2V5IF0uZWwgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgc2hvdyggZHVyYXRpb24gKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB0aGlzLmVscy5jb250YWluZXIuc2hvdyggZHVyYXRpb24gfHwgMTAsICgpID0+IHsgdGhpcy5zaXplKCk7IHJlc29sdmUoKSB9ICkgKVxuICAgIH0sXG5cbiAgICBzbHVycEVsKCBlbCApIHtcbiAgICAgICAgdmFyIGtleSA9IGVsLmF0dHIoIHRoaXMuc2x1cnAuYXR0ciApIHx8ICdjb250YWluZXInXG5cbiAgICAgICAgaWYoIGtleSA9PT0gJ2NvbnRhaW5lcicgKSBlbC5hZGRDbGFzcyggdGhpcy5uYW1lIClcblxuICAgICAgICB0aGlzLmVsc1sga2V5IF0gPSB0aGlzLmVsc1sga2V5IF0gPyB0aGlzLmVsc1sga2V5IF0uYWRkKCBlbCApIDogZWxcblxuICAgICAgICBlbC5yZW1vdmVBdHRyKHRoaXMuc2x1cnAuYXR0cilcblxuICAgICAgICBpZiggdGhpcy5ldmVudHNbIGtleSBdICkgdGhpcy5kZWxlZ2F0ZUV2ZW50cygga2V5LCBlbCApXG4gICAgfSxcblxuICAgIHNsdXJwVGVtcGxhdGUoIG9wdGlvbnMgKSB7XG5cbiAgICAgICAgdmFyICRodG1sID0gdGhpcy4kKCBvcHRpb25zLnRlbXBsYXRlICksXG4gICAgICAgICAgICBzZWxlY3RvciA9IGBbJHt0aGlzLnNsdXJwLmF0dHJ9XWAsXG4gICAgICAgICAgICB2aWV3U2VsZWN0b3IgPSBgWyR7dGhpcy5zbHVycC52aWV3fV1gXG5cbiAgICAgICAgJGh0bWwuZWFjaCggKCBpLCBlbCApID0+IHtcbiAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQoZWwpO1xuICAgICAgICAgICAgaWYoICRlbC5pcyggc2VsZWN0b3IgKSB8fCBpID09PSAwICkgdGhpcy5zbHVycEVsKCAkZWwgKVxuICAgICAgICB9IClcblxuICAgICAgICAkaHRtbC5nZXQoKS5mb3JFYWNoKCAoIGVsICkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kKCBlbCApLmZpbmQoIHNlbGVjdG9yICkuZWFjaCggKCB1bmRlZmluZWQsIGVsVG9CZVNsdXJwZWQgKSA9PiB0aGlzLnNsdXJwRWwoIHRoaXMuJChlbFRvQmVTbHVycGVkKSApIClcbiAgICAgICAgICAgIHRoaXMuJCggZWwgKS5maW5kKCB2aWV3U2VsZWN0b3IgKS5lYWNoKCAoIHVuZGVmaW5lZCwgdmlld0VsICkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciAkZWwgPSB0aGlzLiQodmlld0VsKVxuICAgICAgICAgICAgICAgIHRoaXMuVmlld3NbICRlbC5hdHRyKHRoaXMuc2x1cnAudmlldykgXS5lbCA9ICRlbFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgICAgIFxuICAgICAgICBvcHRpb25zLmluc2VydGlvbi4kZWxbIG9wdGlvbnMuaW5zZXJ0aW9uLm1ldGhvZCB8fCAnYXBwZW5kJyBdKCAkaHRtbCApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgaXNNb3VzZU9uRWwoIGV2ZW50LCBlbCApIHtcblxuICAgICAgICB2YXIgZWxPZmZzZXQgPSBlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIGVsSGVpZ2h0ID0gZWwub3V0ZXJIZWlnaHQoIHRydWUgKSxcbiAgICAgICAgICAgIGVsV2lkdGggPSBlbC5vdXRlcldpZHRoKCB0cnVlIClcblxuICAgICAgICBpZiggKCBldmVudC5wYWdlWCA8IGVsT2Zmc2V0LmxlZnQgKSB8fFxuICAgICAgICAgICAgKCBldmVudC5wYWdlWCA+ICggZWxPZmZzZXQubGVmdCArIGVsV2lkdGggKSApIHx8XG4gICAgICAgICAgICAoIGV2ZW50LnBhZ2VZIDwgZWxPZmZzZXQudG9wICkgfHxcbiAgICAgICAgICAgICggZXZlbnQucGFnZVkgPiAoIGVsT2Zmc2V0LnRvcCArIGVsSGVpZ2h0ICkgKSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNMb2dpbjogZmFsc2UsXG5cbiAgICBzb21ldGhpbmdXZW50V3JvbmcoIGUgKSB7XG4gICAgICAgIC8vc2hvdyBnZW5lcmFsIGVycm9yIE1vZGFsXG4gICAgfSxcblxuICAgIC8vX190b0RvOiBodG1sLnJlcGxhY2UoLz5cXHMrPC9nLCc+PCcpXG59IClcbiIsIm1vZHVsZS5leHBvcnRzID0gcCA9PiBgQWRtaW5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChwKSA9PiBgXG48ZGl2IGRhdGEtanM9XCJjb250YWluZXJcIj5cbiAgICA8aDI+TGlzdHM8L2gyPlxuICAgIDxwPk9yZ2FuaXplIHlvdXIgY29udGVudCBpbnRvIG5lYXQgZ3JvdXBzIHdpdGggb3VyIGxpc3RzLjwvcD5cbiAgICA8ZGl2IGNsYXNzPVwiZXhhbXBsZVwiIGRhdGEtdmlldz1cImxpc3RcIj48L2Rpdj5cbiAgICA8aDI+Rm9ybXM8L2gyPlxuICAgIDxwPk91ciBmb3JtcyBhcmUgY3VzdG9taXphYmxlIHRvIHN1aXQgdGhlIG5lZWRzIG9mIHlvdXIgcHJvamVjdC4gSGVyZSwgZm9yIGV4YW1wbGUsIGFyZSBcbiAgICBMb2dpbiBhbmQgUmVnaXN0ZXIgZm9ybXMsIGVhY2ggdXNpbmcgZGlmZmVyZW50IGlucHV0IHN0eWxlcy48L3A+XG4gICAgPGRpdiBjbGFzcz1cImV4YW1wbGVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlubGluZS12aWV3XCI+XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdmlldz1cImxvZ2luXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5saW5lLXZpZXdcIj5cbiAgICAgICAgICAgIDxkaXYgZGF0YS12aWV3PVwicmVnaXN0ZXJcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKHApID0+XG5cbmA8c3BhbiBjbGFzcz1cImZlZWRiYWNrXCIgZGF0YS1qcz1cImZpZWxkRXJyb3JcIj4keyBwLmVycm9yIH08L3NwYW4+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggcCApIHsgXG4gICAgcmV0dXJuIGA8Zm9ybSBkYXRhLWpzPVwiY29udGFpbmVyXCI+XG4gICAgICAgICR7IHAuZmllbGRzLm1hcCggZmllbGQgPT5cbiAgICAgICAgYDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIiBmb3I9XCIkeyBmaWVsZC5uYW1lIH1cIj4keyBmaWVsZC5sYWJlbCB8fCB0aGlzLmNhcGl0YWxpemVGaXJzdExldHRlciggZmllbGQubmFtZSApIH08L2xhYmVsPlxuICAgICAgICAgICA8JHsgZmllbGQudGFnIHx8ICdpbnB1dCd9IGRhdGEtanM9XCIkeyBmaWVsZC5uYW1lIH1cIiBjbGFzcz1cIiR7IGZpZWxkLm5hbWUgfVwiIHR5cGU9XCIkeyBmaWVsZC50eXBlIHx8ICd0ZXh0JyB9XCIgcGxhY2Vob2xkZXI9XCIkeyBmaWVsZC5wbGFjZWhvbGRlciB8fCAnJyB9XCI+XG4gICAgICAgICAgICAgICAgJHsgKGZpZWxkLnRhZyA9PT0gJ3NlbGVjdCcpID8gZmllbGQub3B0aW9ucy5tYXAoIG9wdGlvbiA9PlxuICAgICAgICAgICAgICAgICAgICBgPG9wdGlvbj4keyBvcHRpb24gfTwvb3B0aW9uPmAgKS5qb2luKCcnKSArIGA8L3NlbGVjdD5gIDogYGAgfVxuICAgICAgICA8L2Rpdj5gICkuam9pbignJykgfVxuICAgIDwvZm9ybT5gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2PkhlYWRlcjwvZGl2PmBcbiIsIm1vZHVsZS5leHBvcnRzID0gKCBwICkgPT4gYDxkaXY+RnV0dXJlIERheXM8L2Rpdj5gXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICggcCApID0+IGA8ZGl2IGRhdGEtanM9XCJpbnZhbGlkTG9naW5FcnJvclwiIGNsYXNzPVwiZmVlZGJhY2tcIj5JbnZhbGlkIENyZWRlbnRpYWxzPC9kaXY+YFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIG9wdGlvbnMgKSA9PiBgXG5cbjx1bCBjbGFzcz1cImxpc3RcIj5cbiAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW1cIj5mb3I8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPnRoZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+c2FrZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+b2Y8L2xpPlxuICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPmZ1dHVyZTwvbGk+XG4gICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtXCI+ZGF5czwvbGk+XG48L3VsPlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoIHAgKSA9PiBgXG48ZGl2PlxuICAgIDxoMT5Mb2dpbjwvaDE+XG4gICAgPGRpdiBkYXRhLXZpZXc9XCJmb3JtXCI+PC9kaXY+XG4gICAgPGRpdiBkYXRhLWpzPVwiYnV0dG9uUm93XCI+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInJlZ2lzdGVyQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+UmVnaXN0ZXI8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwibG9naW5CdG5cIiBjbGFzcz1cImJ0bi1naG9zdFwiIHR5cGU9XCJidXR0b25cIj5Mb2cgSW48L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSBwID0+IGBcbjxkaXY+XG4gICAgPGgxPlJlZ2lzdGVyPC9oMT5cbiAgICA8ZGl2IGRhdGEtdmlldz1cImZvcm1cIj48L2Rpdj5cbiAgICA8ZGl2IGRhdGEtanM9XCJidXR0b25Sb3dcIj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLWpzPVwiY2FuY2VsQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS1qcz1cInJlZ2lzdGVyQnRuXCIgY2xhc3M9XCJidG4tZ2hvc3RcIiB0eXBlPVwiYnV0dG9uXCI+UmVnaXN0ZXI8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuIiwibW9kdWxlLmV4cG9ydHMgPSBlcnIgPT4geyBjb25zb2xlLmxvZyggZXJyLnN0YWNrIHx8IGVyciApIH1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgRXJyb3I6IHJlcXVpcmUoJy4vTXlFcnJvcicpLFxuXG4gICAgTW9tZW50OiByZXF1aXJlKCdtb21lbnQnKSxcblxuICAgIFA6ICggZnVuLCBhcmdzLCB0aGlzQXJnICkgPT5cbiAgICAgICAgbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4gUmVmbGVjdC5hcHBseSggZnVuLCB0aGlzQXJnLCBhcmdzLmNvbmNhdCggKCBlLCAuLi5hcmdzICkgPT4gZSA/IHJlamVjdChlKSA6IHJlc29sdmUoYXJncykgKSApICksXG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7IHJldHVybiB0aGlzIH1cbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIl19
