module.exports = {

    Postgres: require('../../dal/Postgres'),

    apply( resource ) { return this[ resource.request.method ]( resource ) },

    DELETE() { return this.Postgres.query( `DELETE FROM ${resource.path[1]} WHERE id = ${resource.path[2]} RETURNING id` ) },

    GET( resource ) {
        var paramCtr = 1,
            name = resource.path[1],
            queryKeys = ( resource.path.length > 2 ) ? { id: resource.path[2] } : Object.keys( resource.query ),
            where = ( queryKeys.length ) ? 'WHERE' : ''

        queryKeys.forEach( key => where += ` ${name}.${key} = $${paramCtr++}` )

        return this.Postgres.query( `SELECT ${this._getColumns(name)} FROM ${name} ${where}`, queryKeys.map( key => this.query[key] ) )
    },

    PATCH( resource ) { 
        var paramCtr = 1,
            name = resource.path[1],
            bodyKeys = Object.keys( resource.body ),
            set = 'SET ' + bodyKeys.map( key => `${key} = $${paramCtr++}` ).join(', ')

        return this.Postgres.query(
            `UPDATE ${name} ${set} WHERE id = ${paramCtr} RETURNING ${this._getColumns(name)}`,
            bodyKeys.map( key => this.body[key] ).concat( resource.path[2] ) )
    },

    POST( resource ) {
        var bodyKeys = Object.keys( resource.body ),
            name = resource.path[1]
            
        return this.Postgres.query(
            `INSERT INTO ${name} ( ${bodyKeys.join(', ')} ) VALUES ( ${ bodyKeys.map( ( key, i ) => "$"+(i+1) ).join(', ') } ) RETURNING ${this._getColumns(name)}`,
            bodyKeys.map( key => resource.body[key] ) )
    },

    _getColumns( name ) { this.Postgres.tables[ name ].columns.map( column => `${name}.${column.name}` ).join(', ') },
}
