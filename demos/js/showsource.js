$(function() {

  var $list = $("<ul></ul>");
  var itemTemplate = Handlebars.compile("<li><a href='#tabs-{{tab}}'>{{title}}</a></li>");
  var $tabs = $("<div id='sourceCode'></div>");
  var contentTemplate = Handlebars.compile("<div id='tabs-{{tab}}' style='padding:0px;'><pre style='margin:0px;' data-group='{{group}}'><code class='{{language}}'>{{text}}</code></pre></div>");
  var commentsTemplate = Handlebars.compile("<div class='comment-block' style='padding:5px;font-family: monospace;'>{{html}}</div>", { noEscape: true });

  function getCode(url, index, language) {

    $.get(
      url,
      function(code) {
        var html = contentTemplate({
          tab: index,
          language: language,
          text: code
        });
        var $tab = $(serenity.format("#tabs-{0}", index));
        var $sourceCodeCell = $tab.find(".source-code-cell");
        if ($sourceCodeCell.length > 0) {
          $sourceCodeCell.html(html);
        } else {
          $tab.html(html);
        }
        hljs.highlightBlock($tab.find("pre code")[0]);
      },
      "text");
  }

  $(".sr-source-code").each(function(index, source) {
    var $source = $(source);
    var language = $source.attr("data-type");

    if ($source.attr("type") === "text/comments") {
      var $pre = $tabs.find(serenity.format("pre[data-group='{0}']", $source.attr("data-group")));
      $pre.before("<table cellpadding='0' cellspacing='0' width='100%'><tr><td style='width:50%;vertical-align:top;background:#F0F0F0;' class='source-code-cell'></td><td style='width:50%;vertical-align:top;' class='comment-block-cell'></td></tr></table>");
      var $table = $pre.prev("table");
      $cells = $table.find("td");
      $($cells[0]).append($pre);
      $($cells[1]).html(commentsTemplate({
        html: $source.html()
      }));
    } else {
      $list.append(itemTemplate({
        tab: index,
        title: $source.attr("data-title")
      }));

      $tabs.append(contentTemplate({
        tab: index,
        language: language,
        text: $source.text(),
        group: $source.attr("data-group")
      }));
    }
  });

  $tabs.prepend($list);
  $("body").append("<h2>Source Code</h2>");
  $("body").append($tabs);

  $(".sr-source-code").each(function(index, source) {
    var $source = $(source);
    var language = $source.attr("data-type");
    
    if ($source.attr("data-url")) {
      getCode($source.attr("data-url"), index, language);
    }
  });
  
  $("#sourceCode").tabs();

  hljs.initHighlightingOnLoad();
});