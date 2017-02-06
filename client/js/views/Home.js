module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'whyBtn': { event: 'click' }
    },

    onWhyBtnClick() {
        this.emit( 'route', 'about' )
    }

} )
