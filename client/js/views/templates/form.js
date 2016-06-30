module.exports = (p) => {
    var html = `
<form data-js="container">
    ${ p.fields.map( field =>
    `<div class="form-group ${ ( field.horizontal ) ? `horizontal` : `` }">
       ${ ( field.label ) ? `<label class="form-label" for="${ field.name }">${ field.label }</label>` : `` }
       <${ ( field.select ) ? `select` : `input` } data-js="${ field.name }" class="${ field.class }"
       type="${ field.type }" id="${ field.name }" ${ ( field.placeholder ) ? `placeholder="${ field.placeholder }"` : `` }>
            ${ (field.select) ? field.options.map( option =>
                `<option>${ option }</option>` ).join('') + `</select>` : `` }
    </div>` ).join('') }
</form>
` 
    html = html.replace(/>\s+</g,'><')
    return html
}
