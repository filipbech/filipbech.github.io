---
layout: post
title: Using Grunt to compile sass on your mac - or how to get started with grunt and scss
permalink: /2013/10/add-compass-to-your-grunt-setup.html/
---

I assume you already know what sass/scss is, so I wont go into why I love sass and prefer it over less/stylus etc. Go read about it on [http://sass-lang.com](sass-lang.com)

At work we needed a build system that could work cross-platform (out .net developers use windows - the rest of us are on mac's), and that could compile scss-files and to the general build stuff (minification, image-optimization etc). Grunt does all off that like a boss, *but for now I'll just run through getting grunt up and running on your mac and use it to watch scss-files and compile them.*

Grunt runs on node.js so the first thing you do is go to nodejs.org and click the big install-button. That will download the current version. Double-click, continue, agree, continue etc…  

To install grunt open up your terminal (/Applications/Utilities/Terminal.app). You want to install it in your system path so you can run it from any folder on your computer. So you do 
  sudo npm install -g grunt-cli

Now you make a folder for your project. You can have it setup any way you like (and you should probably have a template for this, since you will end up with this structure everywhere - we do, but for the sake of keeping this tutorial simple, ill just use a simple setup). There are, however, two files you have to have. One is package.json, which contains information (as a json-object) about the project and the dependencies it has (what grunt-modules you need), and the other is Gruntfile.js which holds the tasks that grunt eventually runs. I could explain this further on a pseudo-level, but its way easier to just show an example (if interested, you can find more explanation on gruntjs.com.). 

Your package.json could look like this
{% highlight javascript %}
 {
  "name": "my-testproject-name",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.1",
    "grunt-contrib-watch": "~0.4.4",
    "grunt-contrib-sass": "~0.5.0"
  }
}
{% endhighlight %}

When you have this file, you can open your terminal (and "cd" to your projects location) and install the dependencies by running
  npm install

This will create a folder called node_modules that holds all the modules you need for this project. You will eventually have lots of duplicates of this folder when you have many projects, but the power of this is that they have the correct versions (According to your package.json file) so nothing will break. 

Now lets make a Gruntfile.js-file that creates a default task that runs watch on our scss-folder and that will run sass:toMarkup (made-up name, but will compile your sass-files) on the files when changed. 
{% highlight javascript %}
  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
       sass: {
          toMarkup: {
            options: {
            style: 'expanded'
          },
          files: [{
            expand: true,
            cwd: 'scss',
            src: ['*.scss'],
            dest: 'css',
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
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['watch']);
  };
{% endhighlight %}

##Now you are done!
Makeake a .scss file and put it in your scss-folder, and then open your terminal and cd to your project-root and start the watcher by running
  grunt

This will run the default task, which runs watch, which will run sass:toMarkup whenever something inside the scss-folder is changed. Try making a change to your scss-file and save it. Then go look in your css-folder to see the generated output… voila!

Enjoy!

In a later post I explain how to get compass (which is a very popular and powerful sass-extension that runs on ruby) up and running with grunt. Read that right here: [http://www.frontendfrontline.com/2013/10/add-compass-to-your-grunt-setup/](http://www.frontendfrontline.com/2013/10/add-compass-to-your-grunt-setup/)