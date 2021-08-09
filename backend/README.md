# CS571 - Mobile Application Development

## Course Switch Request App - React Native

### Application Description
A mobile application to help MIU students find another student to switch their courses/sections with them. 
  
Students have to sign up for a new account (using MIU emails only), Every time they sign in, the application reads their location and only allows them to proceed if they are located within MIU campus.

### User View/Actions
1. **List of courses** Includes a requests counter, ordered by offering date. When course name clicked a list of students who posted switch-request and are currently enrolled in the course is shown.

2. **Latest posts** by date (timeline), every post contains student name, current course, and desired course(s), and an optional message.

3. **Post a new switch request**.
Users can update/remove their own post easily. The application allows one switch request per student per course. Once a request is fulfilled, students can mark it as complete and it is hidden from the courses/posts lists.
  
Any student wants to fulfill a switch request, the app will allow users to communicate via email, using Expo `MailComposer` API to send emails between students. The `recipients` and `subject`are pre-defined with default message in the email `body`.
  
The project includes the following:
* Login based system using JSON Web Token (JWT).
* React Native Elements UI Kit.
* Expo SDK APIs.
* Express/MongoDB for supportive backend API. All Express routes are protected from public access by JWT (except sign up and sign in routes). App state persisted in AsyncStorage, so users don't need to login everytime they start the app.
