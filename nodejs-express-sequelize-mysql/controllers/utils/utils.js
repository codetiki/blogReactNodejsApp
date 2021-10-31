
const createErrorMessage = (res, message, data) => {
    res.statusCode = 400;
    if (data)
        res.json({ status: "NOT OK", message: message, data })
    else
        res.json({ status: "NOT OK", message: message })
}

module.exports = {
    createErrorMessage

}