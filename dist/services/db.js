"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DBService = void 0;

var _knex = _interopRequireDefault(require("knex"));

var _knexfile = _interopRequireDefault(require("../../knexfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DB = /*#__PURE__*/function () {
  function DB() {
    _classCallCheck(this, DB);

    var environment = process.env.NODE_ENV || 'development';
    console.log("SETTING ".concat(environment, " DB"));
    var options = _knexfile["default"][environment];
    this.connection = (0, _knex["default"])(options);
  }

  _createClass(DB, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.connection.schema.hasTable('messages').then(function (exists) {
        if (exists) return;
        console.log('Creamos la tabla messsages!');
        return _this.connection.schema.createTable('messages', function (messagesTable) {
          messagesTable.increments();
          messagesTable.string('email').notNullable();
          messagesTable.string('mensaje').notNullable();
          messagesTable.timestamp('createdAt').defaultTo(new Date());
        });
      });
    }
  }]);

  return DB;
}();

var DBService = new DB();
exports.DBService = DBService;