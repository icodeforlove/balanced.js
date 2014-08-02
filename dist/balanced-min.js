/**
 * balanced.js v0.0.5
 */
var balanced=function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b){function c(a){if(a=a||{},!a.right)throw new Error('Balanced: please provide a "right" property');if(!a.left)throw new Error('Balanced: please provide a "left" property');this.head=a.head||a.right,this.balance=a.balance||!1,this.exceptions=a.exceptions||!1,this.left=a.left,this.right=a.right}c.prototype={escapeRegExp:function(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},matchContentsInBetweenBrackets:function(a){for(var b,c=this.head instanceof RegExp&&this.head.ignoreCase,d=this.head instanceof RegExp?this.head:new RegExp(this.escapeRegExp(this.head)),e=this.right instanceof RegExp?this.right:new RegExp(this.escapeRegExp(this.right)),f=this.left instanceof RegExp?this.left:new RegExp(this.escapeRegExp(this.left)),g=new RegExp(d.source+"|"+e.source+"|"+f.source,"g"+(c?"i":"")),h=[],i=null,j=0,k=!0;b=g.exec(a);){if(i||!b[0].match(d)||this.balance&&(!this.balance||j)?b[0].match(e)?j++:b[0].match(f)&&j--:(i=b,j=this.balance?j+1:1),this.balance&&0>j){if(k=!1,this.exceptions)throw new Error("Balanced: expected right bracket at "+b.index);break}null!==i&&0===j&&(h.push({index:i.index,length:b.index-i.index,head:i[0],tail:b[0]}),i=null)}if(this.balance){if(this.exceptions&&(!k||0!==j))throw new Error("Balanced: expected left bracket at "+(a.length-1));return k&&0===j?h:null}return h},replaceMatchesInString:function(a,b,c){for(var d=0,e=0;e<a.length;e++){var f=a[e],g=c(b.substr(f.index+d+f.head.length,f.length-f.head.length),f.head,f.tail);b=b.substr(0,f.index+d)+g+b.substr(f.index+d+f.length+f.tail.length,b.length-(f.index+d+f.length)),d+=g.length-f.length-f.tail.length}return b},replaceMatchesInBetweenBrackets:function(a,b){var c=this.matchContentsInBetweenBrackets(a);return this.replaceMatchesInString(c,a,b)}},b.replaceMatchesInString=c.prototype.replaceMatchesInString,b.replacements=function(a){a=a||{};var b=new c({head:a.head,right:a.right,left:a.left,balance:a.balance,exceptions:a.exceptions});if(!a.source)throw new Error('Balanced: please provide a "source" property');if("function"!=typeof a.replace)throw new Error('Balanced: please provide a "replace" function');return b.replaceMatchesInBetweenBrackets(a.source,a.replace)},b.matches=function(a){var b=new c({head:a.head,right:a.right,left:a.left,balance:a.balance,exceptions:a.exceptions});if(!a.source)throw new Error('Balanced: please provide a "source" property');return b.matchContentsInBetweenBrackets(a.source)}}]);