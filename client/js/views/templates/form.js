module.exports = (p) => {
    var html = `
<form data-js="container">
    ${ p.fields.map( field =>
    `<div class="form-group ${ ( field.horizontal ) ? `horizontal` : `` }">

        ${ ( field.label ) ? `<label class="form-label" for="${ field.name }">${ field.label }</label>` : `` }
        <${ ( field.select ) ? `select` : 
            ( field.textarea ) ? `textarea` : `input` } data-js="${ field.name }" class="${ field.class }"
        type="${ field.type }" id="${ field.name }" ${ ( field.placeholder ) ? `placeholder="${ field.placeholder }"` : `` }
        ${ ( field.rows ) ? `rows="${ field.rows }"` : `` } ${ ( field.cols ) ? `cols="${ field.cols }"` : `` }>
            ${ ( field.select ) ? field.options.map( option =>
                `<option>${ option }</option>` ).join('') + `</select>` : `` }
            ${ ( field.textarea ) ? `</textarea>` : `` }
    </div>` ).join('') }
</form>
` 
    html = html.replace(/>\s+</g,'><')
    return html
}
