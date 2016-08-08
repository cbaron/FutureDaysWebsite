module.exports = function( p ) { 
    return `<form data-js="container">
        ${ p.fields.map( field =>
        `<div class="form-group">
           <label class="form-label" for="${ field.name }">${ field.label || this.capitalizeFirstLetter( field.name ) }</label>
           <${ field.tag || 'input'} data-js="${ field.name }" class="${ field.name }" type="${ field.type || 'text' }" placeholder="${ field.placeholder || '' }">
                ${ (field.tag === 'select') ? field.options.map( option =>
                    `<option>${ option }</option>` ).join('') + `</select>` : `` }
        </div>` ).join('') }
    </form>`
}
