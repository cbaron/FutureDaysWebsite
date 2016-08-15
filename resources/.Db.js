module.exports = Object.create( {

    Postgres: require('../dal/Postgres'),

    apply( resource ) { return this[ resource.request.method ]( resource ) },

    DELETE() { return this.Postgres.query( `DELETE FROM ${resource.path[0]} WHERE id = ${resource.path[1]} RETURNING id` ) },

    GET( resource ) {
        var paramCtr = 1,
            name = resource.path[0],
            queryKeys = ( resource.path.length > 1 ) ? { id: resource.path[1] } : Object.keys( resource.query ),
            where = ( queryKeys.length ) ? 'WHERE' : ''

        queryKeys.forEach( key => where += ` ${name}.${key} = $${paramCtr++}` )

        return this.Postgres.query( `SELECT ${this._getColumns(name)} FROM ${name} ${where}`, queryKeys.map( key => this.query[key] ) )
    },

    PATCH( resource ) { 
        var paramCtr = 1,
            name = resource.path[0],
            bodyKeys = Object.keys( resource.body ),
            set = 'SET ' + bodyKeys.map( key => `${key} = $${paramCtr++}` ).join(', ')

        return this.Postgres.query(
            `UPDATE ${name} ${set} WHERE id = ${paramCtr} RETURNING ${this._getColumns(name)}`,
            bodyKeys.map( key => this.body[key] ).concat( resource.path[1] ) )
    },

    POST( resource ) {
        var bodyKeys = Object.keys( resource.body ),
            name = resource.path[0]
               
        return this.Postgres.query(
            `INSERT INTO ${name} ( ${this._wrapKeys(bodyKeys)} ) VALUES ( ${ bodyKeys.map( ( key, i ) => "$"+(i+1) ).join(', ') } ) RETURNING ${this._getColumns(name)}`,
            bodyKeys.map( key => resource.body[key] ) )
    },

    _getColumns( name ) { return this.Postgres.tables[ name ].columns.map( column => `${name}."${column.name}"` ).join(', ') },

    _wrapKeys: keys => keys.map( key => `"${key}"` ).join(', ')

}, { } )
