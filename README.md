### Optimizations

#index.html
The original index.html received a PageSpeed score of 27/100 for mobile and 28/100 for desktop out of the repo. Here's the list of items I've tried to help the website run faster. The final score I achieved were 95/100 for mobile and 96/100 for desktop.

1. Unblock render-blocking css/js files by either adding async tag to the scripts or inline the css(no additional dl request).
* Add async to the http://www.google-analytics.com/analytics.js script
* Inline the style.css so it's not render blocking, left the media query inside the file (non-blocking)
* Add media query to print.css


2. Resized and compressed Pizzeria.jpg and profilepic.jpg.
* Resized pixel dimension of Pizzeria.jpg from 2048x1536 to 360x270(file size went from 2.4MB to 115kB), then further compressed it into webp, lowering file size from 115kB to 75kB.
* compressed profilepic.jpg to profilepic.webp, filesize went down from 14kB to 4kB.

3. converted webfont from external href into inlined css style.
* @font-face{font-family:'Open Sans';src:url(http://fonts.googleapis.com/css?family=Open+Sans:400,700)}


#pizza.html
The original pizza.html had really slow FPS performance while the site was being scrolled. After fixing most of the janky loops in the main.js and adding some styles to the style.css, the scrolling speed can now consistently go above 60FPS.

1. in updatePositions() function, I pulled out the scrollTop variable out of the for loop since it's very taxing on the browser and needs to be calculated only once.
'''
function updatePositions() {
  frame++;
  window.performance.mark("mark_start_frame");

  var items = document.querySelectorAll('.mover');
  //GIN>>I pulled scrolltop element out of the for loop because it only needs to be calculated once
  var st = document.body.scrollTop/1250;

  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin(st + (i % 5));
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  }
'''
2. in DOMContentLoaded callback function, I changed the loop from creating 200 pizza down to 48, and also changed the elem.style.width element from 73.33px to 77px to match the smaller pizza_m.png image I created, so the browser won't have to resize these smaller images.
'''
document.addEventListener('DOMContentLoaded', function() {
  var cols = 8;
  var s = 256;
  for (var i = 0; i < 48; i++) {    //used to be 200
    var elem = document.createElement('img');
    elem.className = 'mover';
    elem.src = "images/pizza_m.png";
    elem.style.height = "100px";
    elem.style.width = "77px";
    elem.basicLeft = (i % cols) * s;
    elem.style.top = (Math.floor(i / cols) * s) + 'px';
    document.querySelector("#movingPizzas1").appendChild(elem);
  }
  updatePositions();
});
'''

3. This doesn't help the 60FPS criteria while scrolling, but it helped reduce the initial setup time for loading all the random pizzas.
'''
// This for-loop actually creates and appends all of the pizzas when the page loads
//GIN>> Pulled pizzasDiv out of the for loop...
var pizzasDiv = document.getElementById("randomPizzas");
for (var i = 2; i < 100; i++) {
  pizzasDiv.appendChild(pizzaElementGenerator(i));
}
'''

4. This helps resize the pizza columns by eliminating the amount of FSL that was in the code.
'''
// Returns the size difference to change a pizza element from one size to another. Called by changePizzaSlices(size).
function determineDx (size) {

    switch(size) {
      case "1":
        return 25;
      case "2":
        return 33.3;
      case "3":
        return 50;
      default:
        console.log("bug in sizeSwitcher");
    }

}

// Iterates through pizza elements on the page and changes their widths
function changePizzaSizes(size) {
  var allContainers = document.querySelectorAll(".randomPizzaContainer");
  var dx = determineDx(size);
  for (var i = 0; i < allContainers.length; i++) {
    allContainers[i].style.width = dx + '%';
  }
}
'''

5. I added the following styles to the .mover class elements, so the background pizzas become their own layers, and it helped improve the FPS performance
'''
.mover {
  position: fixed;
  width: 256px;
  z-index: -1;
  transform: translateZ(0);
  will-change: transform;
}
'''
