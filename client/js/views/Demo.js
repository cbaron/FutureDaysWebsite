module.exports = Object.assign( {}, require('./__proto__'), {

    Form: require('./demo/Form'),
    List: require('./demo/List'),

    postRender() {
        Object.create( this.List, { container: { value: this.templateData.list } } ).constructor()
        Object.create( this.Form, { container: { value: this.templateData.form } } ).constructor()
    },

	template: require('./templates/demo')

} )
