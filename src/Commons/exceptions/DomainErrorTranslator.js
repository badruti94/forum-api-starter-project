const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
  'THREAD_REPOSITORY.NOT_FOUND': new NotFoundError('tidak dapat membuat comment baru karena thread tidak ditemukan'),
  'COMMENT.USER_DOES_NOT_MATCH': new AuthorizationError('comment ini bukan milik anda'),
  'COMMENT_REPOSITORY.NOT_FOUND': new NotFoundError('comment tidak ditemukan'),
  'DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY' : new InvariantError('tidak dapat membuat detail thread comment baru karena properti yang dibutuhkan tidak ada'),
  'DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('tidak dapat membuat detail thread comment baru karena tipe data tidak sesuai'),
  'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY' : new InvariantError('tidak dapat membuat detail thread karena properti yang dibutuhkan tidak ada'),
  'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION' : new InvariantError('tidak dapat membuat detail thread karena tipe data tidak sesuai'),
};

module.exports = DomainErrorTranslator;
