---
layout: post
title: Add compass to your grunt setup
permalink: /2013/10/add-compass-to-your-grunt-setup.html

---

This blog post is kind of a "part 2" to my grunt+sass post. You can find that here: [http://filipbech.github.io/2013/10/using-grunt-to-compile-sass-on-your-mac/](http://filipbech.github.io/2013/10/using-grunt-to-compile-sass-on-your-mac/)

The main reason I prefered sass over the alternatives, when I first started preprocessing css, was Compass. It has a huge library of mixing and functions, and some great tools for generating sprites and more… (read all about it on compass-style.org)

Its made in ruby, so to add it to your grunt watcher you need a couple of things. First make sure you have ruby by opening a terminal and writing`

```js
ruby -v
```

Then you run two commands (still in terminal), that will install compass on your machine.

```js
  sudo gem update --system
  sudo gem install compass
```

Now you have compass available on your mac. Like the node.js-installation you only need to do this once! The configuration is a little different from the sass-one we made earlier: . So lets take a look at how it differs.

First of all your package.json needs to contain
  "grunt-contrib-compass": "~0.6.0"
in your devDependencies object. (you need to run npm install again to download the grunt-task appropriate).

The compass-object inside Gruntfile.js is also slightly different from the sass-one

```js
  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      compass: {
        toMarkup: {
          files: [{
            expand: true,
            sassDir: 'scss/*.scss',
            cssDir: 'css/',
            ext: '.css'
          }]
        }
      },
      watch: {
        sass: {
          files: ['scss/*.scss'],
          tasks: ['sass:toMarkup']
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('default', ['watch']);
  };
```

The last thing you need is a config.rb file. For some reason compass won't run without it. The default location is the same as your Gruntfile.js-file (so the project root if you're following along), but you can change it if you want to move it out of the way. The minimum configuration required in this file (I've found) is sass_dir = "scss"

So now you have compass working in your project. Go ahead and try out the sprite generator, or start out with a simple compass mixin (remember to @import first) like

```css
  @import "compass/css3";
  div {
    @include box-sizing(border-box);
  }
```

