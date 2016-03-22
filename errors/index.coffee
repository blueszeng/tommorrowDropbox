module.exports  =
    error404 : (req, res, next) ->
        err = new Error('Not Found')
        err.status = 404
        res.send(err)
    error505 : (req, res, next) ->
        res.status(err.status || 500)
        res.render 'error',
            message: err.message
            error: err





