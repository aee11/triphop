# triphop

[Preview of project](http://46.101.33.122/)

Project for Dohop's five day hackathon 2015.

## About 

For normal people:
Ever wanted to take a trip around the world? Well now it is cheaper than ever! Just tell us where you want to go and we will find the cheapest way to get you to all those places. In less than a second!\\~\\
For engineers:
We created a web application that finds the cheapest possible flight-route for a given set of user-specified destinations-duration tuples, based on the api provided by Dohop.

### Functionality

The user inputs a starting location and then a set of places he would like to go to along with the duration that he would like to stay at each place. As the user inputs information it is displayed on a large map on his display. When the user is finished inputting data into the application he presses a button and gets shown the cheapest available route that goes to his selected locations. This route is shown graphicly on the map.

### Use-cases

Find a round world trip.
- *Primary actor*: Any person that wants to go for a trip around the world.
- *Scope*: The browser.
- *Brief*: The user enters data about where he wants to go and interacts with the UI to create the cheapest available trip.

### Coolpoints

We always find the cheapest solution for the data we have!

## How to run the code

- Build project: Execute `npm install` and `bower install`
- Serve website: `grunt serve`

## Walkthrough

This is our landing page, clean and simple.
![skref1](http://i.imgur.com/w50vrig.png)

On the landing page the user specifies the starting location and the starting date.
![skref2](http://i.imgur.com/amcvYOj.png)

After specifying the starting location and pressing **Search**, the user is taken to a map where he can see his starting location.
![skref3](http://i.imgur.com/rbuKYuc.png)

Here the user can choose the locations he wants to visit and for how many days he would like to stay at each location.
![skref4](http://i.imgur.com/KV23kMl.png)

When the user is done entering in locations he presses **Create trip** and is shown the cheapest route graphicly on the screen along with the total price of the trip.
![skref5](http://i.imgur.com/yDbRkG5.png)

After creating a trip the user can click individual locations on the map to view information about that particular stop.
![skref6](http://i.imgur.com/aLbZLn1.png)

## Why is my solution cool?

What makes our solution cool is the algorithm behind it. In the first draft of this application we used a greedy algorithm that simply searched for flights to all the locations in the set we had not visited and chose the cheapest one. This algorithm often returned a decent solution but sometimes ran into trouble when some flight were not available in the API. When we swapped that algorithm for a better algoritm, based on the Traveling Salesman problem, things got really interesting. Not only did the new algorithm find cheaper solutions, but it was faster using asynchronous methods and found full solutions more often. 
