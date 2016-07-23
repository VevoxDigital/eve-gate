'use strict';

describe('Directive: navLink', function () {

  var compile, scope;

  beforeEach(module('tech3App'));
  beforeEach(module('tpl'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function getCompiledElement(str) {
    var element = angular.element(str);
    element = compile(element)(scope);
    scope.$digest();
    return element;
  }

  describe('with no scope attr', function () {
    var d = '<div nav-link></div>';

    it('should have a not .droppable anchor', function () {
      var element = getCompiledElement(d), anchor = element.find('a');
      expect(anchor.length).toBe(1);
      expect(anchor.children('span').length).toBe(2);
      expect(anchor.is('.droppable')).toBe(false);
    });

    it('should not have a dropdown', function () {
      var element = getCompiledElement(d);
      expect(element.find('div.dropdown').length).toBe(0);
    });
  });

  describe('with no dropdown content', function () {
    var d = '<div nav-link nav-link-scope="lnk"></div>';
    var s = { text: 'foo', fa: 'bar' };

    it('should populate the anchor with content', function () {
      scope.lnk = s;
      var element = getCompiledElement(d), anchor = element.find('a');
      expect(anchor.find('.fa').is('.fa-bar')).toBe(true);
      expect(anchor.find('.navlink-desktop').text()).toBe('foo');
    });

    it('should not have a dropdown', function () {
      scope.lnk = s;
      var element = getCompiledElement(d);
      expect(element.find('div.dropdown').length).toBe(0);
    });
  });

  describe('with dropdown content', function () {
    var d = '<div nav-link nav-link-scope="lnk"></div>';
    var s = { text: 'foo', fa: 'bar', items: [
      { text: 'foobar', href: 'foo' },
      { },
      { text: 'barfoo', href: '@bar', beta: true }
    ] };

    // Anchor population checked in previous test.

    it('should have a dropdown', function () {
      scope.lnk = s;
      var element = getCompiledElement(d);
      expect(element.find('a .caret').length).toBe(1);
      expect(element.find('div.dropdown').length).toBe(1);
    });

    describe('dropdown', function () {
      it('should have three links', function () {
        scope.lnk = s;
        var element = getCompiledElement(d), dd = element.find('div.dropdown');
        expect(dd.children().length).toBe(3);
      });

      it('first has a relative link', function () {
        scope.lnk = s;
        var element = getCompiledElement(d), dd = element.find('div.dropdown');
        var link = angular.element(dd.children()[0]).find('a');
        expect(link.attr('href')).toBe('/foo');
        expect(link.find('.text').text()).toBe('foobar');
        expect(link.find('.badge').length).toBe(0);
      });

      it('secondly has a break', function () {
        scope.lnk = s;
        var element = getCompiledElement(d), dd = element.find('div.dropdown');
        var item = angular.element(dd.children()[1]);
        expect(item.find('a').length).toBe(0);
        expect(item.find('hr').length).toBe(1);
      });

      it('lastly has an absolute link', function () {
        scope.lnk = s;
        var element = getCompiledElement(d), dd = element.find('div.dropdown');
        var link = angular.element(dd.children()[2]).find('a');
        expect(link.attr('href')).toBe('bar');
        expect(link.find('.text').text()).toBe('barfoo');
        expect(link.find('.badge').length).toBe(1);
      });
    });

  });

});
