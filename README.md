# Web OS Landing Page Demo

This started with me attempting to do a short and easy WebOS, following the StarDance guide. I got a bit carried away and ended up spending around 12 hours on a 5-hour project...
I ended up making a landing page that I will configure to open as the first tab when I open my browser. It currently reads the data I want it to show from data.json, which is convenient for changing the data in the future. I implemented this using D3 (v7), a Javascript library used for making diagrams, charts, and data-oriented animations. Given that this was my first project with D3, I think the learning curve was a bit steep but a lot easier once I found the documentation: https://devdocs.io/d3/ . I used mainly hierarchies for my project. I hope this is cool or interesting to someone, or at least inspires someone to look into D3, as it is a very useful and cool library!
The contribution records may be a bit odd-looking, I had to transfer ownership to this account from my old one, as I discovered it was owned by my school...
The issue is completely fixed now though!

## What this does this even do?

This is a static webpage that uses the D3 library to present my current "threads" in life and collects their resources and links. Picture it sort of like a file system for my life, but in mindmap form. It pulls the data for the map, nodes, and links from data.json, so if I want to make changes later, I only need to change that file. Maybe in the future I'll make a command-line tool or something to make that process quicker, but JSON is nice enough for me at the moment.

## Credits to external sources:

#### D3 V7 library

Official Website: https://d3js.org/
Documentation (for version 7): https://devdocs.io/d3/

#### Favicon

I used the lightbulb emoji favicon https://favicon.io/ .
This about.txt file is in the images folder of this demo, (docs/images/favicon/about.txt), but here is the text it contains:
This favicon was generated using the following graphics from Twitter Twemoji:

- Graphics Title: 1f4a1.svg
- Graphics Author: Copyright 2020 Twitter, Inc and other contributors (https://github.com/twitter/twemoji)
- Graphics Source: https://github.com/twitter/twemoji/blob/v14.0.2/assets/svg/1f4a1.svg
- Graphics License: CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)

## AI Usage

I was mostly learning how D3 worked and getting used to Javascript again (I have used exclusively Java, and Kotlin, for the past 3 years or so), so I tried to keep AI usage to a minimum so that I would learn. When I did get incredibly stuck on an issue (and had somehow not yet managed to find the documentation), I asked ChatGPT for help, sometimes copy-and-pasting my functions into the chat. I did not blindly copy its responses and made sure I understood what it was doing and learning from it. I also asked it for help when fighting with Github a bit, as the official documentation was a bit confusing at the time and I had to switch all my repositories to a new account halfway through...

## How can I try this demo?

It's currently hosted on Github pages at this url: https://sushiorange3.github.io/webOsLandingDemo/
Hope it's interesting or inspires someone to make their own landing page!
