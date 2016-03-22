function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (error, message, title) {
buf.push("<!DOCTYPE html><html><head><title>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</title><link rel=\"stylesheet\" href=\"/stylesheets/style.css\"></head><body><h1>" + (jade.escape(null == (jade_interp = message) ? "" : jade_interp)) + "</h1><h2>" + (jade.escape(null == (jade_interp = error.status) ? "" : jade_interp)) + "</h2><pre>" + (jade.escape((jade_interp = error.stack) == null ? '' : jade_interp)) + "</pre></body></html>");}.call(this,"error" in locals_for_with?locals_for_with.error:typeof error!=="undefined"?error:undefined,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return buf.join("");
}