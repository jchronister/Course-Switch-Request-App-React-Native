# CS571 - Mobile Application Development
## Final Project - MIU CSR App (Course Switch Request)
### Application specifications and requirements
You will create a mobile application to help MIU students find another student to switch their courses/sections with them. 
  
Students will have to sign up for a new account (using MIU emails only), Every time they sign in, the application will read their location and only allow them to proceed if they are located within MIU campus, your application will display 3 tabs:
1. **List of courses** with a requests counter, ordered by offering date (starting from current month forward), when they click on a course name, they see list of students who posted switch-request and currently enrolled in this course. *(Courses list is pre-defined by an admin).*
2. **Latest posts** by date (timeline), every post contains student name, current course, and desired course(s), an optional message.
3. **Post a new switch request**.
  
Users should be able to update/remove their own post easily. The application should allow one switch request per student per course. Once a request is fulfilled, students should be able to mark it as done and it will be hidden from the courses/posts lists.
  
Any student wants to fulfill a switch request, the app will allow users to communicate via email, use Expo `MailComposer` API to send emails between students. Set `recipients` and `subject`and pre-defined HTML message in the email `body`.
  
Your project must include the following:
* Implement a login based system using JSON Web Token (JWT).
* Use UI Kit.
* Use Expo SDK APIs.
* Use Express/MongoDB for supportive backend API. All Express routes should be protected from public access by JWT (except sign up and sign in routes). Persist the app state in AsyncStorage, so users don't need to login everytime they start the app.  
  
**Remember to respect the code honor submission policy. All written code must be original. Presenting something as one’s own work when it came from another source is plagiarism and is forbidden. Plagiarism is a very serious thing in all American academic institutions and is guarded against vigilantly by every professor.**.   
  
Project will be evaluated based on your code quality (not quantity). I may need to schedule meetings with some students to discuss their code-source.  

## Submission Requirements:
Please make sure you submit following requirements:  
* You are required to submit a detailed project plan for your daily performance (day/task/time) and submit it with your code.
* You are required to submit a documentation file with full details about your backend API and frontend mobile app design structure.   

**Get ready for your project presentation on Friday May 14th at 10:00 AM, Have your QR code ready.** 
  
**Good luck and happy coding!**
