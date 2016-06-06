var MyView = require('../MyView'),
    ListItem = function() { return MyView.apply( this, arguments ) }

Object.assign( ListItem.prototype, MyView.prototype, {

    getTemplateOptions() { return this.model.attributes },

	postRender() {
		if( this.selection ) this.templateData.container.on( 'click', () => this.emit( 'clicked', this.model ) )
	}

} )

module.exports = ListItem
