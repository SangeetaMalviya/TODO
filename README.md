 TV To-Do App – Proof of Concept (POC)

Objective
Demonstrate a working, TV-friendly To-Do List app for Tizen Smart TV, navigable by remote, with persistent storage and essential task management features.

Key Features
1.Remote Navigation:
Use arrow keys to move between filter bar and task list.
Enter to add/edit tasks, mark as done, or confirm actions.
Backspace/Delete to remove tasks (with confirmation).
2.Task Management:
Add, edit, and delete tasks.
Mark tasks as done/undone.
Filter tasks: All, Active, Completed.
3.TV-Optimized UI:
Full-screen, large-font, high-contrast interface.
Clear focus indicators for navigation.
Visible edit (pencil) and delete (trash) icons for each task.
4.Persistence:
Tasks are saved in localStorage and persist across app restarts.
![image](https://github.com/user-attachments/assets/ecb6da9f-631a-48cc-9f45-bbeed7d0a2c4)




Technical Stack

HTML5, CSS3, JavaScript (ES5 for compatibility)
Tizen Web App (runs in Tizen Studio emulator or on real TV)
No external dependencies


How to Run the POC
Open in Tizen Studio:
Import the project, ensure index.html, css/style.css, and main.js are present.
Deploy to Emulator/TV:
Build and run the app.
Test with Remote:
Use arrow keys, Enter, and Backspace/Delete to interact.

Filtering:
Instantly filter tasks by All, Active, or Completed using the filter bar, making it easy to focus on what matters.

storage 
Your app uses localStorage to provide fast, persistent, and reliable storage for all your to-do tasks, ensuring a seamless experience for TV users.
