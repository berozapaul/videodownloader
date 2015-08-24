/**
 * Filename: videodownloader.js
 * Purpose : This will parse the decode the video data and will allow users to download
 * Project : Cefal School
 * Author  : beroza@cefalo.com
 * Version : 1.0
 * Copyright (c) 2015 Cefal School
 */

/**
 * Purpose : Replace all instances of input string.
 * @access : public
 * @params : inputString, stringToFind, replaceWithString
 * @return : string;
 */
function youtubeReplaceAllString(inputString, stringToFind, replaceWithString)
{
  var thisRegExp = new RegExp(stringToFind, 'g');
  return inputString.replace(thisRegExp, replaceWithString);
}

/**
 * Purpose : Loop through each video and create the downloadable link (add a block after video).
 * @access : public
 * @params : videoList
 */
function youtubeAddBlock(videoList)
{
   var title      = 'saved video';
   var videoTitle = document.getElementById('watch-headline-title');
   if(videoTitle != null){
      title = videoTitle.children[0].innerText;
   }

   var html = '<div id="download-youtube-chrome-extension" class="yt-card yt-card-has-padding">';
   html = html + '<div style="padding: 5px; border-bottom: 1px solid #CCC;">Click on the format to download the video:</div>';
   html = html + '<div style="padding: 5px; font-weight: bold;">';
   var counter = 0;

   for(i in videoList){
      var video = videoList[i];
      if(video.url != '' && video.url.indexOf('http') == 0)
      {
         if(counter != 0) html = html + ' | ';
         if(typeof video.formatObject == 'undefined')
         {
            html = html + '<span><a href="' + video.url + '&title='+youtubeReplaceAllString(title,'"','%22')+'">Unknown Format</a></span>';
         }
         else{
            html = html + '<span><a href="' + video.url + '&title='+youtubeReplaceAllString(title,'"','%22')+' [' + video.formatObject.resolution + 'p]">' + video.formatObject.resolution + 'p ' + video.formatObject.format + '</a></span>';
         }
         counter++;
      }
   }
   html = html + '</div>';
   html = html + '</div>';

   var wpDiv = document.getElementById('watch7-content');
   if(wpDiv != null){
      wpDiv.innerHTML = html + wpDiv.innerHTML;
   }
}

/**
 * Purpose : Fetch encoded youtube video data and prepare array of video object.
 * @access : public
 * @params : undefined
 * @return : array of video objects;
 */
function youtubeGetVideoList()
{
  try{
    var videoFormats = {
        5:  {   itag: 5,    resolution: 224,    format: "FLV"},
        6:  {   itag: 6,    resolution: 270,    format: "FLV"},
        13: {   itag: 13,   resolution: 144,    format: "3GP"},
        17: {   itag: 17,   resolution: 144,    format: "3GP"},
        18: {   itag: 18,   resolution: 360,    format: "MP4"},
        22: {   itag: 22,   resolution: 720,    format: "MP4"},
        34: {   itag: 34,   resolution: 360,    format: "FLV"},
        35: {   itag: 35,   resolution: 480,    format: "FLV"},
        36: {   itag: 36,   resolution: 240,    format: "3GP"},
        37: {   itag: 37,   resolution: 1080,   format: "MP4"},
        38: {   itag: 38,   resolution: 2304,   format: "MP4"},
        43: {   itag: 43,   resolution: 360,    format: "WebM"},
        44: {   itag: 44,   resolution: 480,    format: "WebM"},
        45: {   itag: 45,   resolution: 720,    format: "WebM"},
        46: {   itag: 46,   resolution: 1080,   format: "WebM"},
        82: {   itag: 82,   resolution: 360,    format: "MP4"},
        83: {   itag: 83,   resolution: 240,    format: "MP4"},
        84: {   itag: 84,   resolution: 720,    format: "MP4"},
        85: {   itag: 85,   resolution: 520,    format: "MP4"},
        100:{   itag: 100,  resolution: 360,    format: "WebM"},
        101:{   itag: 101,  resolution: 480,    format: "WebM"},
        102:{   itag: 102,  resolution: 720,    format: "WebM"}
    };

    var videoList     = new Array();
    var encodedStream = ytplayer.config.args.url_encoded_fmt_stream_map;
    var streamInfo    = encodedStream.split(',');

    for(i in streamInfo)
    {
      streamData = streamInfo[i].split('&');
      var youtubeURL  = '';
      var youtubeSIG  = '';
      var youtubeITAG = 0;

      for(y in streamData)
      {
        if(streamData[y].indexOf('itag=') == 0)
        {
           itagData    = streamData[y].split('=');
           youtubeITAG = itagData[1];
        }
        if(streamData[y].indexOf('url=') == 0)
        {
           urlData    = streamData[y].split('=');
           youtubeURL = unescape(urlData[1]);
        }
        if(streamData[y].indexOf('s=') == 0)
        {
           sigData = streamData[y].split('=');
           youtubeSIG = unescape(sigData[1]);
        }
      }

      if(youtubeURL != '' && youtubeITAG != 0)
      {
        if(youtubeURL.indexOf('signature') > 0)
        {
           var video = {formatObject: videoFormats[youtubeITAG], url: youtubeURL};
           videoList.push(video);
        }
        else
        {
           var video = {formatObject: videoFormats[youtubeITAG], url: youtubeURL+'&signature='+youtubeRetrieveSignature(youtubeSIG)};
           videoList.push(video);
        }
      }
    }
    return videoList;
  }
  catch(e){
    var videoList = new Array();
    console.log(e);
    return videoList;
  }
}

/**
 * Purpose : Retrieve youtube video signature.
 * @access : public
 * @params : signature
 * @return : decrypted signature;
 */
function youtubeRetrieveSignature(signature)
{
   a = signature.split("");
   decipherSignature.kR(a, 3);
   decipherSignature.sI(a, 44);
   decipherSignature.kR(a, 1);
   decipherSignature.nV(a, 55);
   decipherSignature.kR(a, 1);
   decipherSignature.nV(a, 34);
   decipherSignature.kR(a, 3);
   decipherSignature.nV(a, 17);
   decipherSignature.kR(a, 3);
   return a.join("")
}

var decipherSignature = {
   sI: function(a, b) {
      var c = a[0];
      a[0] = a[b % a.length];
      a[b] = c
   },
   kR: function(a, b) {
      a.splice(0, b)
   },
   nV: function(a) {
      a.reverse()
   }
};

/**
 * Purpose : Protect multiple loading.
 * @access : public
 * @params : undefined
 */
function youtubeListener(){
    var ext = document.getElementById('download-youtube-chrome-extension');
    if(typeof ytplayer != 'undefined' && typeof ytplayer.config != 'undefined' && ytplayer.config != null && typeof ytplayer.config.args != 'undefined' &&
        typeof ytplayer.config.args.url_encoded_fmt_stream_map != 'undefined' && ext == null){
        youtubeAddBlock(youtubeGetVideoList());
    }
}

if(window.history && history.pushState)
{
   setInterval("youtubeListener()", 300);
}
else
{
   youtubeAddBlock(youtubeGetVideoList());
}