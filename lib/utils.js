/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-6-18
 * Time: 上午11:17
 * To change this template use File | Settings | File Templates.
 */
var crypto=require('crypto'),
    querystring = require('querystring');
exports.errors = function (errors) {
  var errs=errors.errors&&((errors.errors.title&&errors.errors.title.type)||(errors.errors.name&&errors.errors.name.type));
  // if there is no validation error, just display a generic error
  if (!errs) {
    console.log(errors);
    return errors.message
  }
  return errs;
};
exports.FormatDateTime=function(str){
    var date=new Date(str),m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return date?{
        y:date.getFullYear(),
        m:m[date.getMonth()],
        d:this.addZore(date.getDate(),2),
        h:this.addZore(date.getHours(),2),
        min:this.addZore(date.getMinutes(),2),
        s:this.addZore(date.getSeconds(),2)
    }:{};
};
exports.DatebeforeNow=function(data){
    var now=new Date().getTime(),
        ttime=now-new Date(data).getTime(),
        leave1,leave2,leave3,hours,minutes,seconds;
    var days=Math.floor(ttime/(24*3600*1000));
    if(days){
        if(days>30){
            return this.formatTime(data);
        }
        return days+'天';
    }
    leave1=ttime%(24*3600*1000);
    hours=Math.floor(leave1/(3600*1000));
    if(hours){
        return hours +'小时';
    }
    leave2=leave1%(3600*1000);
    minutes=Math.floor(leave2/(60*1000));
    if(minutes){
        return minutes+'分钟';
    }
    leave3=leave2%(60*1000);
    seconds=Math.round(leave3/1000);
    if(seconds){
        return seconds+'秒';
    }
};
exports.formatTime=function(date){
    var change=new Date(date);
    return change.getFullYear()+'-'+this.addZore((change.getMonth()+1),2)+'-'+this.addZore(change.getDay(),2)+' '+this.addZore(change.getHours(),2)+':'+this.addZore(change.getMinutes(),2)+':'+this.addZore(change.getSeconds(),2);
};
exports.addZore=function(num,len){
    return (''+num).length<len?arguments.callee('0'+num,len):num;
};
exports.clearspace=function(str){
    return str.replace(/\r\n/ig,'');
};
exports.gravatar=function(email,opts){
    var host = 'http://www.gravatar.com/avatar/'
      , queryData = querystring.stringify(opts)
      , query = (queryData && '?' + queryData) || ''
      , email = email.toLowerCase().trim();
    return host + crypto.createHash('md5')
      .update(email).digest('hex') + query;
};
exports.arrayDeleteByIndex=function(arr,n){
    return n<0?arr:arr.slice(0,n).concat(arr.slice(n+1),arr.length);
};