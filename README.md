# Meal Planner App :plate_with_cutlery:
[Try it here!](planmyplate.netlify.app/)

To try to member's only access, sign up or use the test account below: 
- Email: test@email.com
- PW: testing

# User Features
## Homepage
- Users can search for recipes from the home page. Filters can also be selected to specify diet exclusions, cuisine and meal type. 
- Popular recipes section highlights popular search results. 
- Random recipes section highlights random recipes from a number of popular search results.
![homepage](/public/readme/homepage.png)

## Search Results 
- Options to display as tile or list
- A maximum of 100 recipes are displayed at a time with 12 results per page using paginations due to the database size of the 3rd part API used, [Edamam](https://www.edamam.com/) which contains 2.3 million recipes. 

![Search for recipes](/public/readme/search.gif)
- Users can then click on the recipe to show recipe details. 
    - Users can cross out ingredients off the list 
    - As the API does not contain recipe method, a link is given to direct users to the original source which opens in a new tab.

### Display as tile
![tile mode](/public/readme/tile-mode.png)

### Display as list
![list mode](/public/readme/list-mode.png)


## Member's Only Access
- In order to access the "My Recipes" and "My Meal Plan" page users must sign up or log in. 
- If users try clicking on the "Add to My Recipes" button on search results or recipes details page, they will be redirected to log in or sign up. 
![Add recipes](/public/readme/add_recipe.gif)

## My Recipes Page
- Shows all of the logged in user's saved recipes. 
- Users can add recipes to meal plan from this page too. 

![my recipes page](/public/readme/my_recipes.png)

## My Meal Plans Page 
- Shows all of the logged in user's saved meal plans. 
- Users can click on an individual meal plan to show the details of the meal plan. 
    - The meal plan details page shows a planner with a column for each day of the week starting from Monday. 
    - When recipes are added to the meal plan from either the search results page, recipe details page or "My Recipes" page it is put by default into the Monday column.
    - Users can drag and drop recipes in the columns and across to different days. 

![Drag and drop recipes on the meal plans page](/public/readme/dnd.gif)

## Profile Page
- After signing up, the user will be taken to their profile page. The username is default to the username of their email. 
- Profile photo and username can be changed on this page. 

## Planning 

The vision was to create a full-stack app where users can search for recipes, save them and then create a meal planner for the week. 

For this we would require using a 3rd party JSON API ([Edamam](https://www.edamam.com/)) to fetch recipes, create a database to store users, recipes and meal plans and implement drag and drop to our meal planner board so that uses can move recipes around. 

We created a [wireframe](https://whimsical.com/seir63-meal-planner-app-NqDdWC24RS4W12V1d8fYeM) to draw out our plans. 

![](/public/readme/Wireframe.png)

We used Trello, Whimsical, Slack and Zoom as collaboration tools to ensure effective communication across the team.

# Tech Stack 
- React
- Firebase/ Firestore
- React-Bootstrap
- npm 

# Libraries Used 
- [react-router-dom](https://reactrouter.com/en/main) 
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) 
- [uuid](https://www.npmjs.com/package/uuid)
- [react-icons](https://react-icons.github.io/react-icons)

# Future Features to add 
- Options to pick more than one filter on the search page