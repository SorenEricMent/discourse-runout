# Discourse-runout 

v0.1.2

## For what?

Remove all of your posts on a Discourse forum, without removing your precious account

Run!润喽!

## How to use?

### node-side.js

Filled _config_ up with your creditials.

Creditial format is given.

After you filled up them you want to exit your browser

Discourse use dynamic cookies that changes all the time, which make _forum_session easily be expired.

After you are done, run

> node node-side.js

...Of course, you need to install NodeJS.
#### Important notification

Discourse has rate limit, you might want to adjust the interval.


For CSRF Token, I'm way too lazy to write a parser, the command to get it is written in the comment, execute it in the browser(with your session, of course.)


If you still want to use Discourse when this script is doing its job, please remove(not logout) the cookie in your browser and re-login for a separate session.

### browser-side.js

Discarded, I might maintain it when I'm happy(Lots Lasagna being eaten).

## Why you make this?

To let the world know that I love **Lasagna**.
## Constraints?

Admit that **Lasagna** is delicious and wonderful.

<small>...yet i can't do anything if you don't do so.</small>
