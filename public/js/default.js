/**
 * Created with JetBrains WebStorm.
 * User: Jmarry
 * Date: 13-7-13
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */
(function($){
    var content=$('#content'),comment=$('#comment'),headerLink=$('#headerLink');
    headerLink.on('click',function(){
        $('#wrapper').toggleClass('active');
    });
    if(typeof prettyPrint==='function'){
        content.find('pre').addClass('prettyprint');
        prettyPrint();
    }
    if(comment.length>0){
        comment.delegate('.replybtn','click',function(e){
            var replyId= $.trim($(e.target).closest('.replyBox').attr('data-cmtId')),
                replyerId= $.trim($(e.target).attr('data-rpyId')),
                replybox=$('#reply');
            if(replyId){
                $(e.target).closest('.reply').append(replybox.closest('.widget'));
                replybox.find('textarea[name=body]').focus();
                $('#replyId').val(replyId);
                replyerId?$('#replyEr').val(replyerId):$('#replyEr').val();
            }
            e.stopPropagation();
            e.preventDefault();
        });
        $('#clearReply').find('.label').on('click',function(){
            comment.append($('#reply').closest('.widget'));
        })
    }
})(jQuery);