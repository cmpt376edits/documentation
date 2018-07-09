require(['gitbook'], function(gitbook) {

  var selector;
  var position;
  var fixed = false;

  anchors.options = {
    placement: 'left'
  }

  gitbook.events.bind('start', function(e, config) {
    selector = config['itoc'].selector;
    dir = config['itoc'].dir;
    fixed = config['itoc'].position;
  });

  gitbook.events.bind('page.change', function() {

    var addNavItem = function(ul, href, text) {
      var listItem = document.createElement('li'),
        anchorItem = document.createElement('a'),
        textNode = document.createTextNode(text);

      anchorItem.href = href;
      ul.appendChild(listItem);
      listItem.appendChild(anchorItem);
      anchorItem.appendChild(textNode);
    };

    var anchorLevel = function(nodeName) {
      return parseInt(nodeName.charAt(1));
    };

    var navTreeNode = function(current, moveLevels) {
      var e = current;
      if (moveLevels > 0) {
        var ul;
        for (var i = 0; i < moveLevels; i++) {
          ul = document.createElement('ul');
          e.appendChild(ul);
          e = ul;
        }
      } else {
        for (var i = 0; i > moveLevels; i--) {
          e = e.parentElement;
        }
      }
      return e;
    }

    anchors.removeAll();
    anchors.add(selector);

    if (anchors.elements.length > 1) {
      var text, href, currentLevel;
      var prevLevel = 0;
      var nav = document.createElement('nav');
      nav.className = 'page-itoc' + (fixed ? ' fixed' : '');

      if (fixed) {
        var i = document.createElement('i');
        i.className = 'fa fa-map-o'
        nav.appendChild(i)
      }

      var container = document.createElement('div');
      nav.appendChild(container)

      for (var i = 0; i < anchors.elements.length; i++) {
        text = anchors.elements[i].textContent;
        href = anchors.elements[i].querySelector('.anchorjs-link').getAttribute('href');
        currentLevel = anchorLevel(anchors.elements[i].nodeName);
        container = navTreeNode(container, currentLevel - prevLevel);
        addNavItem(container, href, text);
        prevLevel = currentLevel;
      }

      if (dir === 'top') {
        var section = document.body.querySelector('.markdown-section');
        section.insertBefore(nav, section.firstChild);
      } else {
        var first = anchors.elements[0];
        first.parentNode.insertBefore(nav, first);
      }
    }

  })

});

