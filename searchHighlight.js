$(function(){
  'use strict';

  var brackets = ['[[[text here too]]]'];
  var glossary = ['here for', 'for they', 'for me', 'here too'];
  var misspelling = ['for', 'for them', 'here'];
  var tags = /\{\/?\d+\}/g;

  // $('.text').find('.receive')
  //   .textareaHighlighter({
  //     matches: [
  //       {'matchClass': 'tagsHighlight', 'match': tags, 'priority': 3},
  //       {'matchClass': 'matchHighlight', 'match': brackets, 'priority': 2},
  //       {'matchClass': 'fugaHighlight', 'match': glossary, 'priority': 1},
  //       {'matchClass': 'hogeHighlight', 'match': misspelling, 'priority': 0}
  //     ]
  //   });

  // // Example wit hmax character limitation
  // var $translationMax = $('.translation-max');
  // $translationMax.find('.target')
  //   .textareaHighlighter({
  //     matches: [
  //       {'matchClass': 'tagsHighlight', 'match': tags, 'priority': 3},
  //       {'matchClass': 'matchHighlight', 'match': brackets, 'priority': 2},
  //       {'matchClass': 'fugaHighlight', 'match': glossary, 'priority': 1},
  //       {'matchClass': 'hogeHighlight', 'match': misspelling, 'priority': 0}
  //     ],
  //     maxlength: 150,
  //     maxlengthWarning: 'warning',
  //     maxlengthElement: $translationMax.find('.maxlength')
  //   });
  let ye = /ye*/gi;
  let gr = 'gr';
  $('.receive').highlightWithinTextarea({
    highlight: [
      {
        highlight: 're',
        className: 'hl-red'
      },
      {
        highlight: 'bl',
        className: 'hl-blue'
      },
      {
        highlight: ye,
        className: 'hl-yellow'
      },
      {
        highlight: gr,
        className: 'hl-green'
      }
    ]
  });
  

});

