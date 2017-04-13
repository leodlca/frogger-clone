## Frogger Clone

This project was initiaded as a part of a Nanodegree program.

Some of its contents such as all the images belongs to Udacity.

### How to play

- P - Pause
- M - Mute

You control a boy who needs to reach the river without being hit by the bugs. 

You can move him by pressing the direction arrow keys of your keyboard, or using WASD.

At first you have 3 lives, everytime a bug hits you, you lose
a life.

The main objective is to pick up the star and get to the river as many times as you
can, if you die, don't worry, your record will be kept as long as you don't leave/refresh the page.

### How to Install/Run the Project

**NOTE**: You can also check out the app by simply clicking on this [link.](https://leodlca.github.io/portfolio)

1. Download the repository as a ZIP file, or clone it. ¹
2. Navigate to the repository folder on Terminal/DOS.
3. Run "python -m SimpleHTTPServer 8000" or "python2 -m SimpleHTTPServer 8000". ²
4. Load the page at localhost:8000.

**¹** If you don't want to run it in a local server, simply follow step one and open the index.html file at the repository folder.

**²** You must have python installed in your machine in order to run these commands. Note that python is already installed by default on Unix-based systems such as Linux and Mac OS X.

### Changelog

1. v1.0
	- Added pause function.
	- Added sounds (bg music, hit, lose and win).
	- Added delay when you hit a bug, so it's harder to lose control and hit it twice accidentaly.
	- Added mute function.
	- Added an "animation" for when the player runs out of HP.
	- Fixed font incompatibility on linux.

2. v1-beta-2.0
	- Added Star, the game has a new objective.
	- Changed main character.

### To-do List

- Add different stages to the game.
- Add a sound when the player picks up the star.
- Introduce Heart, so the player can get more lives.
