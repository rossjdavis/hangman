# Project Feedback + Evaluation

| Score | Expectations |
|   --- | ---          |
|     0 | Incomplete   |
|     1 | Progressing  |
|     2 | Performing   |
|     3 | Excelling    |

## Deployment:

> Did you successfully deploy your project to github pages? Is the app's functionality the same deployed as it is locally?

Your score: 3

Great to see your project deployed to GitHub Pages!

## Technical Requirements:

> Did you deliver a project that met all the technical requirements? Given what the class has covered so far, did you build something that was reasonably complex?

Your Score: 3

Some tips:
* Next time be sure to put your `<script>` tags below the closing `<body>` tag near the bottom of your HTML document
* It's important to learn how to work with branches in Git, it looks like you only have 1 commit to master and the rest are on the gh-pages branch. Instead, you should have all your commits on master and merge those commits to gh-pages whenever you're read to push and deploy. Also, you'll want to make sure that your branches are all up to date!

## Code Quality:

> Did you follow code style guidance and best practices covered in class, such as spacing, modularity, and semantic naming? Did you comment your code?

Your Score: 3

* Your HTML is very semantic and well written!
* I want to challenge you to use fewer ID selectors in your HTML/CSS
* You have some duplication in your CSS, where properties are redeclared or overwritten further down the cascade (i.e. the styling on the header and footer and then again later down on the footer [here](https://github.com/rossjdavis/hangman/blob/gh-pages/css/style.css#L24-L35)). You're definitely on the right track here though.
* Delete commented out code before you submit it or commit it! Commented out or unused code that makes it in to production is called "Dead Code"
* You should never have to nest ID selectors, as you're doing [here](https://github.com/rossjdavis/hangman/blob/gh-pages/css/style.css#L61). This is an anti-pattern. If you are using IDs, they should be single-source selectors (so you'll only need the ID to target the element).

## Creativity/Interface:

> Is your user interface easy to use and understand? Does it make sense for the problem you're solving? Does your interface demonstrate creative design?

Your Score: 3

* Great job on refining the interface, it looks really good!
* If you have time, definitely consider making the interface responsive
* Additionally, you could consider using key input events instead of the input field as another next step

