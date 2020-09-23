class NotFound extends Error {
  constructor(message) {
    super(message)
  }
}

class BadRequest extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = { NotFound, BadRequest }