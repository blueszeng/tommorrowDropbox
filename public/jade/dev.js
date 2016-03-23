function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (title) {
buf.push("<!DOCTYPE html><html><head><title>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</title><link rel=\"stylesheet\" href=\"/stylesheets/style.css\"></head><body><h1>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</h1><p>Welcome to " + (jade.escape((jade_interp = title) == null ? '' : jade_interp)) + " login</p><img src=\"img/test.jpg?rev=@@hash\" alt=\"\"></body></html>");}.call(this,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return buf.join("");
}